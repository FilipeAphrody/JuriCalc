import React, { useState } from 'react';
import styles from './CalculationWizard.module.css';
import { Stepper, type Step } from '../../../../shared/components/ui/Stepper/Stepper';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Select } from '../../../../shared/components/ui/Select/Select';
import { Scale, Building2, Calculator, CheckCircle } from 'lucide-react';
import { api } from '../../../../shared/api/axios';

const STEPS: Step[] = [
  { id: 'type', label: 'Tipo de Cálculo' },
  { id: 'data', label: 'Dados Básicos' },
  { id: 'result', label: 'Resultado' },
];

export const CalculationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [calcType, setCalcType] = useState<'trabalhista' | 'civel' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    principal: '',
    start_date: '',
    end_date: '',
    index_name: 'INPC',
    interest_rate: '1.0',
    honorarium_rate: '20.0'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Submeter formulário
      setIsLoading(true);
      try {
        const response = await api.post('/civil/calculate/', {
          client_id: 1, // Fake client for MVP
          title: "Cálculo E2E",
          principal: parseFloat(formData.principal),
          start_date: formData.start_date,
          end_date: formData.end_date,
          index_name: formData.index_name,
          interest_rate: parseFloat(formData.interest_rate) / 100,
          honorarium_rate: parseFloat(formData.honorarium_rate) / 100,
        });
        setResult(response.data.result);
        setCurrentStep(2);
      } catch (err) {
        console.error("Erro ao gerar cálculo", err);
        alert("Erro ao processar o cálculo. Verifique os dados.");
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      // Exportação / Salvar fake (MVP)
      window.print();
      alert("Cálculo salvo no seu escritório virtual com sucesso!");
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Novo Cálculo Jurídico</h1>
        <p className={styles.subtitle}>Siga as etapas para gerar uma simulação precisa.</p>
      </header>

      <div className={styles.wizardCard}>
        <div className={styles.stepperWrapper}>
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        <div className={styles.stepContent}>
          {currentStep === 0 && (
            <div className={styles.typeSelection}>
              <button 
                className={`${styles.typeCard} ${calcType === 'trabalhista' ? styles.typeCardSelected : ''}`}
                onClick={() => setCalcType('trabalhista')}
              >
                <div className={styles.typeIconWrapper}><Building2 size={32} /></div>
                <h3>Cálculo Trabalhista</h3>
                <p>Verbas rescisórias, horas extras, insalubridade, férias, etc.</p>
              </button>

              <button 
                className={`${styles.typeCard} ${calcType === 'civel' ? styles.typeCardSelected : ''}`}
                onClick={() => setCalcType('civel')}
              >
                <div className={styles.typeIconWrapper}><Scale size={32} /></div>
                <h3>Cálculo Cível</h3>
                <p>Atualização monetária, juros de mora, multas, honorários, etc.</p>
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.formGrid}>
              <Input name="principal" value={formData.principal} onChange={handleChange} label="Valor Principal (R$)" placeholder="Ex: 1000.00" type="number" />
              <Input name="start_date" value={formData.start_date} onChange={handleChange} label="Data Inicial" type="date" />
              <Input name="end_date" value={formData.end_date} onChange={handleChange} label="Data Final" type="date" />
              <Select 
                name="index_name"
                value={formData.index_name}
                onChange={handleChange}
                label="Índice de Correção" 
                options={[
                  { value: 'INPC', label: 'INPC (IBGE)' },
                  { value: 'IPCA', label: 'IPCA (IBGE)' },
                  { value: 'IGPM', label: 'IGP-M (FGV)' },
                  { value: 'SELIC', label: 'Taxa SELIC' }
                ]} 
              />
              <Input name="interest_rate" value={formData.interest_rate} onChange={handleChange} label="Juros Mensais (%)" placeholder="Ex: 1.0" type="number" step="0.1" />
              <Input name="honorarium_rate" value={formData.honorarium_rate} onChange={handleChange} label="Honorários Advocatícios (%)" placeholder="Ex: 20.0" type="number" step="0.1" />
            </div>
          )}

          {currentStep === 2 && result && (
            <div className={styles.resultView}>
              <div className={styles.successBadge}>
                <CheckCircle size={48} />
              </div>
              <h2>Cálculo Gerado com Sucesso!</h2>
              <div className={styles.resultSummary}>
                <div className={styles.resultRow}>
                  <span>Valor Atualizado:</span>
                  <strong>R$ {result.summary.principal.toFixed(2)}</strong>
                </div>
                <div className={styles.resultRow}>
                  <span>Juros Acumulados:</span>
                  <strong>R$ {result.summary.interest_amount.toFixed(2)}</strong>
                </div>
                {result.summary.fees_amount !== undefined && (
                  <div className={styles.resultRow}>
                    <span>Honorários:</span>
                    <strong>R$ {result.summary.fees_amount.toFixed(2)}</strong>
                  </div>
                )}
                <div className={`${styles.resultRow} ${styles.resultTotal}`}>
                  <span>Total Devido:</span>
                  <strong>R$ {result.summary.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0 || isLoading}>
            Voltar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext} 
            isLoading={isLoading}
            disabled={currentStep === 0 && !calcType}
            leftIcon={currentStep === STEPS.length - 1 ? <Calculator size={18} /> : undefined}
          >
            {currentStep === 1 ? 'Gerar Cálculo' : (currentStep === 2 ? 'Salvar e Exportar' : 'Próxima Etapa')}
          </Button>
        </div>
      </div>
    </div>
  );
};
