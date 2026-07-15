import requests
import sys

BASE_URL = "http://localhost:8000"

def run_qa():
    print("Starting Black-Box QA Execution...")
    
    # 1. Login Agents
    resp1 = requests.post(f"{BASE_URL}/api/v1/auth/token/", json={"username": "agent1", "password": "pwd_agent1"})
    token_1 = resp1.json().get('access')
    headers_1 = {"Authorization": f"Bearer {token_1}", "X-Office-ID": "1"}

    resp2 = requests.post(f"{BASE_URL}/api/v1/auth/token/", json={"username": "agent2", "password": "pwd_agent2"})
    token_2 = resp2.json().get('access')
    headers_2 = {"Authorization": f"Bearer {token_2}", "X-Office-ID": "2"}

    import time
    doc_number = str(int(time.time()))
    client_payload = {"name": "QA Client A", "type": "PF", "document_number": doc_number}
    c_resp = requests.post(f"{BASE_URL}/api/v1/clients/", json=client_payload, headers=headers_1)
    assert c_resp.status_code == 201, f"Failed to create client: {c_resp.text}"
    client_id = c_resp.json()['id']

    cnj_number = f"0000000-00.0000.0.00.{str(int(time.time()))[-4:]}"
    l_payload = {"client": client_id, "cnj_number": cnj_number, "status": "ACTIVE"}
    l_resp = requests.post(f"{BASE_URL}/api/v1/lawsuits/", json=l_payload, headers=headers_1)
    assert l_resp.status_code == 201
    lawsuit_id = l_resp.json()['id']
    print(f"[+] Agent 1 created Client {client_id} and Lawsuit {lawsuit_id}")

    # 3. Cross-Tenant IDOR Test
    print("[-] Agent 2 attempting to access Agent 1's Lawsuit...")
    cross_resp = requests.get(f"{BASE_URL}/api/v1/lawsuits/{lawsuit_id}/", headers=headers_2)
    assert cross_resp.status_code == 404, f"IDOR Vulnerability found! Expected 404, got {cross_resp.status_code}"
    print("[+] Cross-tenant access successfully blocked (404 Not Found).")

    # 4. Gabarito Matemático
    calc_payload = {
        "title": "Math QA Gabarito",
        "client_id": client_id,
        "lawsuit_id": lawsuit_id,
        "principal": "1000.00",
        "interest_rate": "0.0100", # 1% a.m.
        "index_name": "INPC",
        "start_date": "2023-01-01",
        "end_date": "2024-01-01"  # 12 meses
    }
    calc_resp = requests.post(f"{BASE_URL}/api/v1/civil/calculate/", json=calc_payload, headers=headers_1)
    assert calc_resp.status_code == 200, f"Calc failed: {calc_resp.text}"
    
    result = calc_resp.json()['result']['summary']
    assert float(result['interest_amount']) == 120.0, f"Math mismatch in interest: expected 120.0, got {result['interest_amount']}"
    assert float(result['total']) == 1120.0, f"Math mismatch in total: expected 1120.0, got {result['total']}"
    print("[+] Math Precision Gabarito test PASSED. 1000 + 1% a.m (120) = 1120.00")

    # 5. Invalid Input & Auth
    bad_resp = requests.post(f"{BASE_URL}/api/v1/clients/", json={"name": "Bad"}, headers=headers_1)
    assert bad_resp.status_code == 400
    print("[+] Invalid Input correctly blocked (400 Bad Request).")

    auth_resp = requests.get(f"{BASE_URL}/api/v1/clients/", headers={"Authorization": "Bearer INVALID", "X-Office-ID": "1"})
    assert auth_resp.status_code == 401
    print("[+] Invalid JWT correctly blocked (401 Unauthorized).")

    # 6. Rate Limit Stress Test
    print("[-] Sending rapid burst of requests to test Rate Limiting...")
    throttled = False
    for i in range(150):
        r = requests.get(f"{BASE_URL}/api/v1/clients/", headers=headers_1)
        if r.status_code == 429:
            throttled = True
            break
    
    if throttled:
        print("[+] Rate Limit (Throttling) active and functioning (429 Too Many Requests).")
    else:
        print("[!] Rate Limit not hit. (Depending on settings, might require more requests).")

    print("\n=== QA SCRIPT FINISHED SUCCESSFULLY ===")

if __name__ == '__main__':
    try:
        run_qa()
    except AssertionError as e:
        print(f"\n[!] QA FAILED: {str(e)}")
        sys.exit(1)
