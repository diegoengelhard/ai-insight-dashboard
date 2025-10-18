import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '../atoms/Icon';

const DropZone = ({ onFileAccepted, isLoading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) onFileAccepted(acceptedFiles[0]);
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const getBorderColor = () => {
    if (isDragReject) return 'border-red-400';
    if (isDragActive) return 'border-[rgb(var(--primary))]';
    return 'border-[rgb(var(--separator))]';
  };

  return (
    <div
      {...getRootProps()}
      style={{ borderRadius: 'var(--radius-input)' }}
      className={`relative bg-[rgb(var(--surface))] p-12 border-2 border-dashed ${getBorderColor()} text-center cursor-pointer transition-all hover:border-[rgb(var(--primary))] hover:bg-blue-50/30`}
    >
      <input {...getInputProps()} />

      {isLoading && (
        <div className="absolute inset-0 bg-[rgb(var(--surface))]/90 flex items-center justify-center rounded-[var(--radius-input)]">
          <Icon name="LoaderCircle" className="animate-spin text-[rgb(var(--primary))]" size={56} />
        </div>
      )}

      <div className="flex items-center justify-center gap-6">
        {/* Icono de archivo a la izquierda */}
        <div className="p-4 rounded-lg bg-blue-50">
          <Icon name="FileUp" size={40} className="text-[rgb(var(--primary))]" />
        </div>

        {/* Texto a la derecha */}
        <div className="text-left">
          {isDragActive ? (
            <p className="text-xl font-semibold text-[rgb(var(--primary))]">Drop your file here...</p>
          ) : (
            <>
              <p className="text-lg font-semibold text-[rgb(var(--text-default))]">
                Drag & Drop your file here
              </p>
              <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                or click to select (Formats: .xlsx, .csv)
              </p>
            </>
          )}
        </div>

        {/* Icono PDF decorativo a la derecha (opcional, como en mock) */}
        <div className="ml-auto">
          <Icon name="FileSpreadsheet" size={48} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default DropZone;