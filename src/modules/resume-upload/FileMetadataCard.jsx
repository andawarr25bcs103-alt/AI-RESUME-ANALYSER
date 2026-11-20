import React from 'react';
import {
  FileText,
  FileCheck2,
  Trash2,
  Upload,
  Layers,
  Sparkles,
  CheckCircle,
  FileCode,
  Clock,
  Activity
} from 'lucide-react';
import Button from '../../components/Button';
import { formatFileSize } from './textExtractor';

export const FileMetadataCard = ({
  fileData,
  onRemove,
  onReplace,
  onContinue
}) => {
  if (!fileData) return null;

  const isPdf =
    fileData.fileType === 'pdf' ||
    fileData.name?.toLowerCase().endsWith('.pdf') ||
    fileData.type?.includes('pdf');

  const fileTypeLabel = isPdf ? 'PDF Document (.pdf)' : 'Word Document (.docx)';
  const formattedSize = formatFileSize(fileData.size);

  return (
    <div className="resumate-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with Title and Status */}
      <div className="card-header" style={{ marginBottom: 0, paddingBottom: '12px' }}>
        <h2 className="card-title">
          <FileCheck2 size={20} color="var(--color-success, #10B981)" />
          Active Resume File
        </h2>
        <span className="badge badge-success">
          <CheckCircle size={12} /> Extracted Successfully
        </span>
      </div>

      {/* Main File Details Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          backgroundColor: 'var(--color-bg, #F8FAFC)',
          borderRadius: 'var(--radius-md, 10px)',
          border: '1px solid var(--color-border, #E2E8F0)'
        }}
      >
        {/* Document Icon Box */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md, 10px)',
            backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
            border: `1px solid ${isPdf ? 'rgba(239, 68, 68, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isPdf ? '#DC2626' : '#6366F1',
            flexShrink: 0
          }}
        >
          <FileText size={28} />
        </div>

        {/* File Name & Attributes */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-main, #0F172A)',
              wordBreak: 'break-word',
              marginBottom: '4px'
            }}
          >
            {fileData.name}
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary, #64748B)'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary, #6366F1)'
                }}
              />
              <strong>Type:</strong> {fileTypeLabel}
            </span>
            <span>&bull;</span>
            <span>
              <strong>Size:</strong> {formattedSize}
            </span>
            {fileData.numPages && (
              <>
                <span>&bull;</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={12} />
                  {fileData.numPages} Page{fileData.numPages > 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Resume Statistics Grid: Word Count, Character Count, Extraction Status */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted, #94A3B8)',
            marginBottom: '8px'
          }}
        >
          Resume Statistics
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}
        >
          {/* Word Count */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface, #FFFFFF)',
              border: '1px solid var(--color-border, #E2E8F0)',
              borderRadius: 'var(--radius-md, 10px)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #94A3B8)' }}>
              Word Count
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-primary, #6366F1)',
                marginTop: '4px'
              }}
            >
              {fileData.wordCount?.toLocaleString() || 0}
            </div>
          </div>

          {/* Character Count */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface, #FFFFFF)',
              border: '1px solid var(--color-border, #E2E8F0)',
              borderRadius: 'var(--radius-md, 10px)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #94A3B8)' }}>
              Characters
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-secondary, #8B5CF6)',
                marginTop: '4px'
              }}
            >
              {fileData.characterCount?.toLocaleString() || 0}
            </div>
          </div>

          {/* Extraction Status */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface, #FFFFFF)',
              border: '1px solid var(--color-border, #E2E8F0)',
              borderRadius: 'var(--radius-md, 10px)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #94A3B8)' }}>
              Extraction Status
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--color-success, #10B981)',
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Activity size={14} /> Ready
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Remove File, Replace File, Continue to AI Analysis */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingTop: '8px',
          borderTop: '1px solid var(--color-divider, #EDF2F7)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Requirement: Remove File button */}
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            onClick={onRemove}
            style={{ color: '#EF4444', borderColor: '#FECACA' }}
          >
            Remove File
          </Button>

          {/* Requirement: Replace File button */}
          {onReplace && (
            <Button variant="ghost" size="sm" icon={Upload} onClick={onReplace}>
              Replace File
            </Button>
          )}
        </div>

        {/* Requirement: Continue to AI Analysis button */}
        {onContinue && (
          <Button variant="primary" size="sm" icon={Sparkles} onClick={onContinue}>
            Continue to AI Analysis
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileMetadataCard;
