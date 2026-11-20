import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  Trash2,
  XCircle
} from 'lucide-react';
import Button from '../../components/Button';

export const TextPreviewCard = ({
  text = '',
  onSaveText,
  onClearText,
  onContinue,
  readOnly = false
}) => {
  const [currentText, setCurrentText] = useState(text);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Sync internal state when external text updates
  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  // Copy text to clipboard
  const handleCopy = async () => {
    if (!currentText) return;
    try {
      await navigator.clipboard.writeText(currentText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = currentText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Clear text handler
  const handleClear = () => {
    setCurrentText('');
    setIsEditing(false);
    if (onClearText) {
      onClearText();
    }
  };

  const handleSave = () => {
    if (onSaveText) {
      onSaveText(currentText);
    }
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
    setIsEditing(false);
  };

  const handleReset = () => {
    setCurrentText(text);
    setIsEditing(false);
  };

  const words = currentText ? currentText.trim().split(/\s+/).filter(Boolean).length : 0;
  const characters = currentText ? currentText.length : 0;
  const lines = currentText ? currentText.split(/\r\n|\r|\n/).length : 0;
  const isDirty = currentText !== text;

  return (
    <div className="resumate-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Card Header with Badges */}
      <div className="card-header">
        <h2 className="card-title">
          <FileText size={20} color="var(--color-primary, #6366F1)" />
          Extracted Resume Text Preview
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{words} Words</span>
          <span className="badge badge-secondary">{characters} Chars</span>
          <span className="badge badge-warning">{lines} Lines</span>
        </div>
      </div>

      {/* Toolbar: Instructions & Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #64748B)' }}>
          {isEditing
            ? 'Editing mode enabled: modify text and save to update shared state.'
            : 'Preview extracted text below. Downstream AI modules will parse this content.'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Copy Text Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={isCopied ? Check : Copy}
            onClick={handleCopy}
            disabled={!currentText}
            title="Copy extracted text to clipboard"
          >
            {isCopied ? 'Copied!' : 'Copy Text'}
          </Button>

          {/* Clear Text Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={XCircle}
            onClick={handleClear}
            disabled={!currentText}
            title="Clear extracted text"
            style={{ color: '#EF4444' }}
          >
            Clear Text
          </Button>

          {/* Toggle Edit Button */}
          {!readOnly && (
            <Button
              variant={isEditing ? 'secondary' : 'ghost'}
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditing(!isEditing)}
              disabled={!currentText}
              title="Toggle edit mode"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Text'}
            </Button>
          )}
        </div>
      </div>

      {/* Text Area Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '14px' }}>
        <textarea
          id="resume-extracted-text"
          name="resumeExtractedText"
          rows={14}
          readOnly={!isEditing}
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="No resume text available. Upload a PDF or DOCX file to extract text."
          className="form-textarea"
          style={{
            flex: 1,
            width: '100%',
            minHeight: '280px',
            fontFamily: 'var(--font-family-mono, monospace)',
            fontSize: '0.8125rem',
            lineHeight: '1.65',
            backgroundColor: isEditing ? '#FFFFFF' : 'var(--color-bg, #F8FAFC)',
            borderColor: isEditing ? 'var(--color-primary, #6366F1)' : 'var(--color-border, #E2E8F0)',
            cursor: isEditing ? 'text' : 'default',
            resize: 'vertical',
            padding: '14px',
            borderRadius: 'var(--radius-md, 10px)'
          }}
        />
      </div>

      {/* Bottom Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-divider, #EDF2F7)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saveFeedback && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-success, #10B981)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={14} /> Changes saved to shared state!
            </span>
          )}

          {isEditing && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={Save}
                onClick={handleSave}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={handleReset}
                disabled={!isDirty}
              >
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Continue to AI Analysis Button */}
        {onContinue && currentText && (
          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            onClick={onContinue}
            title="Proceed to AI Resume Analysis"
          >
            Continue to AI Analysis
          </Button>
        )}
      </div>
    </div>
  );
};

export default TextPreviewCard;
