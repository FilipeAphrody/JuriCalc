import React from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../../app/store/authStore';
import { api } from '../../../../shared/api/axios';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Mail, Lock } from 'lucide-react';
import styles from './Login.module.css';

const loginSchema = z.object({
  username: z.string().min(1, 'O nome de usuário é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useRHForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setServerError('');
      // In a real app, this matches the backend auth endpoint
      const response = await api.post('/auth/token/', data);
      
      // Assume API returns { access, user: { id, username, email, officeId } }
      const token = response.data.access;
      const user = response.data.user || { id: 1, username: data.username, email: '' }; // Fallback for mock
      
      login(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <h1>VadeMath</h1>
          <p>O SaaS Jurídico Definitivo</p>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2>Bem-vindo de volta</h2>
            <p>Faça login para acessar o seu escritório.</p>
          </div>

          {serverError && <div className={styles.errorAlert}>{serverError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Input
              label="Usuário"
              placeholder="Digite seu usuário"
              leftIcon={<Mail size={18} />}
              error={errors.username?.message}
              {...register('username')}
            />
            
            <div className={styles.passwordWrapper}>
              <Input
                type="password"
                label="Senha"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <Link to="/recovery" className={styles.forgotPassword}>
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className={styles.submitButton}
            >
              Entrar
            </Button>
          </form>

          <div className={styles.footer}>
            Não tem uma conta?{' '}
            <Link to="/register" className={styles.registerLink}>
              Cadastre-se agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
