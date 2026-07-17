import React from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../../../shared/api/axios';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import styles from './Register.module.css';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome completo é obrigatório'),
  email: z.string().email('Email inválido'),
  company: z.string().min(2, 'O nome do escritório/empresa é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  acceptLgpd: z.boolean().refine(val => val === true, "Você deve aceitar os termos"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useRHForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setServerError('');
      await api.post('/auth/register/', {
        name: data.name,
        email: data.email,
        company: data.company,
        password: data.password
      });
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setServerError(err.response.data.error);
      } else if (err.response?.data?.email) {
        setServerError('Este e-mail já está em uso.');
      } else {
        const rawError = err.response ? `Status ${err.response.status}: ${JSON.stringify(err.response.data).substring(0, 50)}` : err.message;
        setServerError(`Falha Crítica (Envie para o Dev): ${rawError}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Crie sua conta</h2>
          <p>Cadastre seu escritório e revolucione sua gestão.</p>
          <span style={{ fontSize: '10px', color: 'gray' }}>API Target: {api.defaults.baseURL}</span>
        </div>

        {serverError && <div className={styles.errorAlert}>{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Nome Completo"
            placeholder="Dr. João Silva"
            leftIcon={<User size={18} />}
            error={errors.name?.message}
            {...register('name')}
          />
          
          <Input
            label="E-mail Profissional"
            placeholder="contato@escritorio.com"
            type="email"
            leftIcon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Escritório / Empresa"
            placeholder="Silva & Advogados Associados"
            leftIcon={<Briefcase size={18} />}
            error={errors.company?.message}
            {...register('company')}
          />
          
          <Input
            type="password"
            label="Senha Segura"
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" {...register('acceptLgpd')} className={styles.checkbox} />
              <span>Li e aceito os Termos de Uso e Política de Privacidade (LGPD).</span>
            </label>
            {errors.acceptLgpd && <span className={styles.errorText}>{errors.acceptLgpd.message}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className={styles.submitButton}
          >
            Criar Minha Conta
          </Button>
        </form>

        <div className={styles.footer}>
          Já tem uma conta?{' '}
          <Link to="/login" className={styles.loginLink}>
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
};
