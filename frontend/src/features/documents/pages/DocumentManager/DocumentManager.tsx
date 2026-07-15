import React, { useState } from 'react';
import styles from './DocumentManager.module.css';
import { Dropzone, type UploadedFile } from '../../components/Dropzone/Dropzone';
import { Modal } from '../../../../shared/components/ui/Modal/Modal';
import { FileText, FileImage, FileCode, Trash2, Eye } from 'lucide-react';

export const DocumentManager: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const handleFilesAccepted = (newFiles: File[]) => {
    const newUploads = newFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      previewUrl: URL.createObjectURL(f),
      progress: Math.floor(Math.random() * 50) + 50, // simulate some progress
    }));
    
    setFiles(prev => [...prev, ...newUploads]);
    
    // Simulate finishing upload
    setTimeout(() => {
      setFiles(prev => prev.map(f => ({ ...f, progress: 100 })));
    }, 1000);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage size={24} className={styles.fileIconColor} />;
    if (type.includes('pdf')) return <FileText size={24} className={styles.fileIconPdf} />;
    return <FileCode size={24} className={styles.fileIconGeneric} />;
  };

  const isPreviewable = (type: string) => type.includes('image') || type.includes('pdf');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestão de Documentos</h1>
          <p className={styles.subtitle}>Faça upload, visualize e anexe documentos aos processos e cálculos.</p>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.uploadSection}>
          <Dropzone onFilesAccepted={handleFilesAccepted} />
        </div>

        <div className={styles.filesSection}>
          <h3 className={styles.sectionTitle}>Documentos Anexados ({files.length})</h3>
          
          {files.length === 0 ? (
            <div className={styles.emptyState}>
              Nenhum documento anexado. Use a área de upload acima.
            </div>
          ) : (
            <div className={styles.fileGrid}>
              {files.map(f => (
                <div key={f.id} className={styles.fileCard}>
                  <div className={styles.fileInfo}>
                    <div className={styles.fileIconWrapper}>
                      {getFileIcon(f.file.type)}
                    </div>
                    <div className={styles.fileMeta}>
                      <span className={styles.fileName}>{f.file.name}</span>
                      <span className={styles.fileSize}>{(f.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  
                  {f.progress < 100 && (
                    <div className={styles.progressBarWrapper}>
                      <div className={styles.progressBar} style={{ width: `${f.progress}%` }} />
                    </div>
                  )}

                  <div className={styles.fileActions}>
                    {isPreviewable(f.file.type) && (
                      <button className={styles.actionBtn} onClick={() => setPreviewFile(f)} title="Visualizar">
                        <Eye size={16} />
                      </button>
                    )}
                    <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => removeFile(f.id)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF / Image Preview Modal */}
      <Modal 
        isOpen={!!previewFile} 
        onClose={() => setPreviewFile(null)} 
        title={`Pré-visualização: ${previewFile?.file.name}`}
        size="xl"
      >
        <div className={styles.previewContainer}>
          {previewFile?.file.type.includes('image') ? (
            <img src={previewFile.previewUrl} alt="Preview" className={styles.imagePreview} />
          ) : previewFile?.file.type.includes('pdf') ? (
            <iframe src={previewFile.previewUrl} className={styles.pdfPreview} title="PDF Preview" />
          ) : (
            <div className={styles.emptyState}>Pré-visualização não suportada para este formato.</div>
          )}
        </div>
      </Modal>
    </div>
  );
};
