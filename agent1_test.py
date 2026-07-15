import requests
import time
import sys
import os

BASE_URL = "http://localhost:8000"
USERNAME = "agent1"
PASSWORD = "pwd_agent1"
OFFICE_ID = "1"

def run_tests():
    headers = {
        "X-Office-ID": OFFICE_ID
    }
    
    print("1. Getting JWT token...")
    token_url = f"{BASE_URL}/api/v1/auth/token/"
    # Try sending as form data first (common for OAuth2 token endpoints)
    response = requests.post(token_url, data={"username": USERNAME, "password": PASSWORD})
    if response.status_code != 200:
        # If it fails, try JSON
        response = requests.post(token_url, json={"username": USERNAME, "password": PASSWORD})
        if response.status_code != 200:
            print(f"Failed to get token: {response.status_code} {response.text}")
            sys.exit(1)
    
    token = response.json().get("access")
    if not token:
        print("No access token in response")
        sys.exit(1)
    
    headers["Authorization"] = f"Bearer {token}"
    
    print("2. Creating Client...")
    unique_doc = str(int(time.time()))
    client_data = {
        "name": "Test Client",
        "document_number": unique_doc,
        "email": f"test{unique_doc}@example.com",
        "phone": "123456789"
    }
    client_resp = requests.post(f"{BASE_URL}/api/v1/clients/", json=client_data, headers=headers)
    if client_resp.status_code not in (200, 201):
        print(f"Failed to create client: {client_resp.status_code} {client_resp.text}")
        sys.exit(1)
    client_id = client_resp.json().get("id")
    print(f"Client created with ID: {client_id}")
    
    print("3. Creating Lawsuit...")
    unique_cnj = f"0000000-00.0000.0.00.{str(int(time.time()))[-4:]}"
    lawsuit_data = {
        "cnj_number": unique_cnj,
        "client": client_id,
        "title": "Test Lawsuit"
    }
    lawsuit_resp = requests.post(f"{BASE_URL}/api/v1/lawsuits/", json=lawsuit_data, headers=headers)
    if lawsuit_resp.status_code not in (200, 201):
        print(f"Failed to create lawsuit: {lawsuit_resp.status_code} {lawsuit_resp.text}")
        sys.exit(1)
    lawsuit_id = lawsuit_resp.json().get("id")
    print(f"Lawsuit created with ID: {lawsuit_id}")
    
    # Save lawsuit ID to file
    out_dir = "c:/Users/Filipe/Desktop/workspace/calculadora juridica"
    os.makedirs(out_dir, exist_ok=True)
    with open(f"{out_dir}/qa_lawsuit_id.txt", "w") as f:
        f.write(str(lawsuit_id))
    print(f"Lawsuit ID saved to {out_dir}/qa_lawsuit_id.txt")
    
    print("4. Testing Civil Calculation...")
    calc_data = {
        "client_id": client_id,
        "lawsuit_id": lawsuit_id,
        "title": "Teste",
        "principal": "1000.00",
        "interest_rate": "0.0100",
        "index_name": "INPC",
        "start_date": "2023-01-01",
        "end_date": "2024-01-01"
    }
    calc_resp = requests.post(f"{BASE_URL}/api/v1/civil/calculate/", json=calc_data, headers=headers)
    if calc_resp.status_code not in (200, 201):
        print(f"Failed to calculate: {calc_resp.status_code} {calc_resp.text}")
        sys.exit(1)
    
    result = calc_resp.json()
    
    print("5. Verifying Math Accuracy...")
    try:
        summary = result['result']['summary']
        assert float(summary['interest_amount']) == 120.0
        assert float(summary['total']) == 1120.0
    except (AssertionError, KeyError) as e:
        print(f"Math accuracy failed. Result: {result}, Error: {e}")
        sys.exit(1)
    print("Math accuracy passed.")
    
    print("6. Testing Rate Limit Resilience...")
    rate_limited = False
    for i in range(150):
        if i % 10 == 0:
            print(f"Request {i}/150...")
        try:
            resp = requests.get(f"{BASE_URL}/api/v1/clients/", headers=headers, timeout=5)
            if resp.status_code == 429:
                print("Rate limit (429 Too Many Requests) triggered successfully.")
                rate_limited = True
                break
        except requests.exceptions.RequestException as e:
            print(f"Request failed at {i}: {e}")
            sys.exit(1)
    if not rate_limited:
        print("Rate limit not triggered after 150 requests.")
        
    print("7. Testing Authorization Validation...")
    invalid_headers = {
        "X-Office-ID": OFFICE_ID,
        "Authorization": "Bearer XXX"
    }
    auth_resp = requests.get(f"{BASE_URL}/api/v1/clients/", headers=invalid_headers)
    if auth_resp.status_code == 401:
        print("Authorization validation passed (401 Unauthorized received).")
    else:
        print(f"Authorization validation failed. Expected 401, got {auth_resp.status_code}")
        sys.exit(1)

    print("All tests passed successfully.")

if __name__ == "__main__":
    run_tests()
