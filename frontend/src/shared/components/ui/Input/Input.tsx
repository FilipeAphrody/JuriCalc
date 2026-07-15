import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`${styles.container} ${className || ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        
        <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''} ${disabled ? styles.isDisabled : ''}`}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`${styles.input} ${leftIcon ? styles.withLeftIcon : ''} ${rightIcon ? styles.withRightIcon : ''}`}
            {...props}
          />
          
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
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

Input.displayName = 'Input';
