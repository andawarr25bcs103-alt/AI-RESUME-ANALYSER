import React, { useRef } from 'react';
import { UploadCloud, FileText, Shield, Sparkles, FolderOpen } from 'lucide-react';
import Button from '../../components/Button';

export const FileDropzone = ({
  onFileSelect,
  isProcessing = false,
  dragActive = false,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop
}) => {
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Clear input value so re-selecting the same file fires onChange
    e.target.value = '';
  };

  return (
    <div
      className="resumate-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)'
      }}
    >
      <div className="card-header">
        <h2 className="card-title">
          <UploadCloud size={20} color="var(--color-primary, #6366F1)" />
          Upload Resume Document
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-primary">PDF</span>
          <span className="badge badge-secondary">DOCX</span>
          <span className="badge badge-warning">Max 5 MB</span>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume file dropzone"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={handleContainerClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContainerClick();
          }
        }}
        style={{
          border: `2px dashed ${dragActive ? '#6366F1' : '#CBD5E1'}`,
          borderRadius: 'var(--radius-lg, 14px)',
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#EEF2FF' : '#F8FAFC',
          transition: 'all 150ms ease-in-out',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          outline: 'none',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ display: 'none' }}
          onChange={handleInputChange}
          disabled={isProcessing}
        />

        {/* Upload Icon Circle with Blue/Purple Gradient */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: dragActive
              ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
              : 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
            border: '1px solid #E0E7FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto',
            color: dragActive ? '#FFFFFF' : '#6366F1',
            boxShadow: dragActive
              ? '0 0 20px rgba(99, 102, 241, 0.35)'
              : '0 4px 10px rgba(99, 102, 241, 0.1)',
            transition: 'all 150ms ease-in-out'
          }}
        >
          <UploadCloud size={34} />
        </div>

        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#0F172A',
            marginBottom: '8px'
          }}
        >
          {dragActive ? (
            <span style={{ color: '#6366F1' }}>Drop your resume file here</span>
          ) : (
            <>
              Drag and drop your resume here, or{' '}
              <span style={{ color: '#6366F1', textDecoration: 'underline' }}>
                browse files
              </span>
            </>
          )}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748B',
            maxWidth: '460px',
            margin: '0 auto 20px auto',
            lineHeight: 1.5
          }}
        >
          Supports <strong>PDF (.pdf)</strong> and Word <strong>DOCX (.docx)</strong> documents up to <strong>5 MB</strong>.
        </p>

        {/* Action Button: Browse Files */}
        <div style={{ display: 'inline-flex', gap: '10px' }}>
          <Button
            variant="primary"
            size="md"
            icon={FolderOpen}
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              handleContainerClick();
            }}
          >
            Browse Files
          </Button>
        </div>

        {/* Security & In-Browser Privacy Note */}
        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#64748B'
          }}
        >
          <Shield size={14} color="#10B981" />
          <span>100% Client-Side Extraction &bull; Your resume stays secure and private in your browser</span>
        </div>
      </div>
    </div>
  );
};

export default FileDropzone;
