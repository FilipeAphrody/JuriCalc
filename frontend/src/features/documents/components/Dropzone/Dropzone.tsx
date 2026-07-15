import React, { useCallback, useState } from 'react';
import styles from './Dropzone.module.css';
import { UploadCloud } from 'lucide-react';

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
  progress: number;
}

interface DropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  maxSizeMB?: number;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesAccepted, maxSizeMB = 10 }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = filesArray.filter(f => f.size <= maxSizeMB * 1024 * 1024);
      if (validFiles.length > 0) {
        onFilesAccepted(validFiles);
      }
    }
  }, [onFilesAccepted, maxSizeMB]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(f => f.size <= maxSizeMB * 1024 * 1024);
      if (validFiles.length > 0) {
        onFilesAccepted(validFiles);
      }
    }
  };

  return (
    <div
      className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        multiple 
        onChange={handleChange} 
        className={styles.fileInput} 
        id="file-upload" 
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
      />
      <label htmlFor="file-upload" className={styles.label}>
        <div className={styles.iconWrapper}>
          <UploadCloud size={32} />
        </div>
        <p className={styles.mainText}>Arraste e solte seus documentos aqui</p>
        <p className={styles.subText}>ou clique para procurar no seu computador (Máx: {maxSizeMB}MB)</p>
      </label>
    </div>
  );
};
