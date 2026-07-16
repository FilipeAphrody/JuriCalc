import React, { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { api } from '../../../../shared/api/axios';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import styles from './Recovery.module.css';

const recoverySchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
});

type RecoveryFormInputs = z.infer<typeof recoverySchema>;

export const Recovery: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useRHForm<RecoveryFormInputs>({
    resolver: zodResolver(recoverySchema),
  });

  const onSubmit = async (data: RecoveryFormInputs) => {
    try {
      setServerError('');
      await api.post('/auth/password-reset/', data);
      setIsSuccess(true);
    } catch (err: any) {
      setServerError('Ocorreu um erro ao tentar recuperar a senha. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        
        {isSuccess ? (
          <div className={styles.successState}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h2>E-mail Enviado!</h2>
            <p>Se o e-mail estiver cadastrado, você receberá um link seguro para redefinir sua senha.</p>
            <Link to="/login" className={styles.backLink}>
              <ArrowLeft size={16} /> Voltar para o Login
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2>Esqueceu a senha?</h2>
              <p>Digite seu e-mail e enviaremos instruções para criar uma nova senha.</p>
            </div>

            {serverError && <div className={styles.errorAlert}>{serverError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Input
                label="E-mail"
                placeholder="advogado@escritorio.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className={styles.submitButton}
              >
                Enviar Link de Recuperação
              </Button>
            </form>
            
            <div className={styles.footer}>
              <Link to="/login" className={styles.backLink}>
                <ArrowLeft size={16} /> Voltar para o Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
