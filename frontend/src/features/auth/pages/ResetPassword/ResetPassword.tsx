import React, { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../../../shared/api/axios';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import styles from './ResetPassword.module.css';

const resetSchema = z.object({
  new_password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
});

type ResetFormInputs = z.infer<typeof resetSchema>;

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const uidb64 = searchParams.get('uid');

  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useRHForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormInputs) => {
    if (!token || !uidb64) {
      setServerError('Link inválido ou expirado. Solicite a recuperação novamente.');
      return;
    }

    try {
      setServerError('');
      await api.post('/auth/password-reset/confirm/', {
        token,
        uidb64,
        new_password: data.new_password
      });
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Ocorreu um erro ao redefinir a senha.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        
        {isSuccess ? (
          <div className={styles.successState}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h2>Senha Redefinida!</h2>
            <p>Sua senha foi alterada com sucesso. Você já pode fazer login no seu painel.</p>
            <Link to="/login" className={styles.backLink}>
              Fazer Login
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2>Criar Nova Senha</h2>
              <p>Digite sua nova senha abaixo para acessar sua conta.</p>
            </div>

            {serverError && <div className={styles.errorAlert}>{serverError}</div>}
            {(!token || !uidb64) && (
              <div className={styles.errorAlert}>
                Token ausente. Use o link enviado para o seu e-mail.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Input
                type="password"
                label="Nova Senha"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={errors.new_password?.message}
                {...register('new_password')}
              />

              <Input
                type="password"
                label="Confirmar Senha"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={errors.confirm_password?.message}
                {...register('confirm_password')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className={styles.submitButton}
                disabled={!token || !uidb64}
              >
                Salvar Nova Senha
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
