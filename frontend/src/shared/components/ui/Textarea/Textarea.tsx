import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className={`${styles.container} ${className || ''}`}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        
        <div className={`${styles.textareaWrapper} ${error ? styles.hasError : ''} ${disabled ? styles.isDisabled : ''}`}>
          <textarea
            id={textareaId}
            ref={ref}
            disabled={disabled}
            className={styles.textarea}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <span className={`${styles.hint} ${error ? styles.errorText : styles.helperText}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
