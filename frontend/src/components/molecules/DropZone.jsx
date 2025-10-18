import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '../atoms/Icon';

/**
 * A molecule component for handling file drag-and-drop and selection.
 * @param {{
 * onFileAccepted: (file: File) => void,
 * isLoading: boolean
 * }} props
 */
const DropZone = ({ onFileAccepted, isLoading }) => {
  // Callback function to handle the dropped file.
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  // Configure the dropzone hook.
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  // Determine border color based on the dropzone state.
  const getBorderColor = () => {
    if (isDragReject) return 'border-red-500';
    if (isDragActive) return 'border-[rgb(var(--secondary))]';
    return 'border-[rgb(var(--separator))]';
  };

  return (
    <div
      {...getRootProps()}
      style={{ borderRadius: 'var(--radius-input)' }}
      className={`bg-[rgb(var(--surface))] p-8 border-2 border-dashed ${getBorderColor()} text-center cursor-pointer transition-colors duration-300 ease-in-out relative`}
    >
      <input {...getInputProps()} />

      {/* Show an overlay when loading. */}
      {isLoading && (
        <div className="absolute inset-0 bg-[rgb(var(--surface))]/80 flex items-center justify-center rounded-[var(--radius-input)]">
          <Icon name="LoaderCircle" className="animate-spin text-[rgb(var(--secondary))]" size={48} />
        </div>
      )}

      {/* Dropzone content. */}
      <div className="flex flex-col items-center gap-4">
        <Icon name="UploadCloud" size={48} className="text-[rgb(var(--secondary))]" />
        {isDragActive ? (
          <p className="text-lg font-semibold text-[rgb(var(--secondary))]">Drop the file here...</p>
        ) : (
          <div>
            <p className="text-lg font-semibold text-[rgb(var(--text-default))]">
              Drag and drop your file here
            </p>
            <p className="text-sm text-[rgb(var(--text-muted))]">or click to select (Formats: .xlsx, .csv)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;
