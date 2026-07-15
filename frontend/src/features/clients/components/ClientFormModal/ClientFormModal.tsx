import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../../shared/components/ui/Modal/Modal';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Select } from '../../../../shared/components/ui/Select/Select';
import { Button } from '../../../../shared/components/ui/Button/Button';
import styles from './ClientFormModal.module.css';

const clientSchema = z.object({
  type: z.enum(['FISICA', 'JURIDICA']),
  name: z.string().min(3, 'Nome obrigatório'),
  document_number: z.string().min(11, 'Documento inválido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

type ClientFormInputs = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any; // To be typed later
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, client }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientFormInputs>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {
      type: 'FISICA',
      name: '',
      document_number: '',
      email: '',
      phone: '',
    },
  });

  const clientType = watch('type');

  const onSubmit = async (data: ClientFormInputs) => {
    try {
      // Simulate API Call
      await new Promise(res => setTimeout(res, 1000));
      console.log('Saved Client:', data);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
      <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
        {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={client ? 'Editar Cliente' : 'Novo Cliente'} 
      size="md"
      footer={footer}
    >
      <form id="client-form" className={styles.form}>
        <div className={styles.row}>
          <Select
            label="Tipo de Pessoa"
            options={[
              { label: 'Pessoa Física', value: 'FISICA' },
              { label: 'Pessoa Jurídica', value: 'JURIDICA' }
            ]}
            error={errors.type?.message}
            {...register('type')}
          />
        </div>
        
        <div className={styles.row}>
          <Input
            label={clientType === 'FISICA' ? 'Nome Completo' : 'Razão Social'}
            placeholder="Ex: João da Silva"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div className={styles.row}>
          <Input
            label={clientType === 'FISICA' ? 'CPF' : 'CNPJ'}
            placeholder={clientType === 'FISICA' ? '000.000.000-00' : '00.000.000/0001-00'}
            error={errors.document_number?.message}
            {...register('document_number')}
          />
        </div>

        <div className={styles.gridRow}>
          <Input
            label="E-mail"
            type="email"
            placeholder="joao@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telefone"
            placeholder="(11) 99999-9999"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </form>
    </Modal>
  );
};
