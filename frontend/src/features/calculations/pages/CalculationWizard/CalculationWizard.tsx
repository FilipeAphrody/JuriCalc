import React, { useState } from 'react';
import styles from './CalculationWizard.module.css';
import { Stepper, type Step } from '../../../../shared/components/ui/Stepper/Stepper';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Select } from '../../../../shared/components/ui/Select/Select';
import { Scale, Building2, Calculator, CheckCircle } from 'lucide-react';

const STEPS: Step[] = [
  { id: 'type', label: 'Tipo de Cálculo' },
  { id: 'data', label: 'Dados Básicos' },
  { id: 'result', label: 'Resultado' },
];

export const CalculationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [calcType, setCalcType] = useState<'trabalhista' | 'civel' | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
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
              <Input label="Valor Principal (R$)" placeholder="Ex: 1000.00" />
              <Input label="Data Inicial" type="date" />
              <Input label="Data Final" type="date" />
              <Select 
                label="Índice de Correção" 
                options={[
                  { value: 'INPC', label: 'INPC (IBGE)' },
                  { value: 'IPCA', label: 'IPCA (IBGE)' },
                  { value: 'IGPM', label: 'IGP-M (FGV)' },
                  { value: 'SELIC', label: 'Taxa SELIC' }
                ]} 
              />
              <Input label="Juros Mensais (%)" placeholder="Ex: 1.0" />
              <Input label="Honorários Advocatícios (%)" placeholder="Ex: 20.0" />
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.resultView}>
              <div className={styles.successBadge}>
                <CheckCircle size={48} />
              </div>
              <h2>Cálculo Gerado com Sucesso!</h2>
              <div className={styles.resultSummary}>
                <div className={styles.resultRow}>
                  <span>Valor Atualizado:</span>
                  <strong>R$ 1.150,00</strong>
                </div>
                <div className={styles.resultRow}>
                  <span>Juros Acumulados:</span>
                  <strong>R$ 120,50</strong>
                </div>
                <div className={styles.resultRow}>
                  <span>Honorários:</span>
                  <strong>R$ 254,10</strong>
                </div>
                <div className={`${styles.resultRow} ${styles.resultTotal}`}>
                  <span>Total Devido:</span>
                  <strong>R$ 1.524,60</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
            Voltar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext} 
            disabled={currentStep === 0 && !calcType}
            leftIcon={currentStep === STEPS.length - 1 ? <Calculator size={18} /> : undefined}
          >
            {currentStep === STEPS.length - 1 ? 'Salvar e Exportar' : 'Próxima Etapa'}
          </Button>
        </div>
      </div>
    </div>
  );
};
