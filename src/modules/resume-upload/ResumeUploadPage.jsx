import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Code2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';

export const ResumeUploadPage = () => {
  const { resumeText, resumeFile, setNewResume, resetAnalysis } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [manualText, setManualText] = useState(resumeText || '');
  const [uploadError, setUploadError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Handle Drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle File Input Selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  /**
   * File Parser Placeholder for Module 2 Team Member
   * Note for Module 2: Implement PDF.js for .pdf and Mammoth for .docx extraction here!
   */
  const processSelectedFile = async (file) => {
    setUploadError('');
    setIsProcessing(true);

    try {
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      };

      if (file.type === 'text/plain') {
        const text = await file.text();
        setNewResume(fileInfo, text);
        setManualText(text);
      } else {
        // Module 2 foundation placeholder:
        // Reads file as text or placeholder extraction until PDF.js / Mammoth parser is hooked up
        const simulatedExtractedText = `RESUME: ${file.name}\n\nCandidate details and extracted text from ${file.name} will appear here after PDF.js / Mammoth parses the binary stream.`;
        setNewResume(fileInfo, simulatedExtractedText);
        setManualText(simulatedExtractedText);
      }
    } catch (err) {
      setUploadError(`Failed to process file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSave = () => {
    if (!manualText.trim()) {
      setUploadError('Please provide resume text or upload a document.');
      return;
    }
    setNewResume(
      { name: 'Manual_Resume_Input.txt', size: manualText.length, type: 'text/plain' },
      manualText
    );
    setUploadError('');
  };

  const handleClear = () => {
    resetAnalysis();
    setManualText('');
    setUploadError('');
  };

  return (
    <div>
      <PageHeader
        title="Resume Upload & Parser"
        description="Upload candidate resume in PDF, DOCX, or TXT format. Extracted text will power all downstream AI modules."
        badge="Module 2"
        icon={UploadCloud}
        actions={
          resumeText ? (
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={() => navigate('/ai-analysis')}
            >
              Proceed to AI Analysis
            </Button>
          ) : null
        }
      />

      {uploadError && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{uploadError}</span>
        </div>
      )}

      {isProcessing && (
        <Loader size="md" message="Reading and parsing resume document stream..." />
      )}

      <div className="grid-2">
        {/* Upload Dropzone */}
        <div className="resumate-card">
          <div className="card-header">
            <h2 className="card-title">
              <UploadCloud size={20} color="var(--color-primary)" />
              Document Upload
            </h2>
            <span className="badge badge-primary">PDF / DOCX / TXT</span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: dragActive ? 'var(--color-primary-light)' : 'var(--color-bg)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('resume-file-input').click()}
          >
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--gradient-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--color-primary)'
              }}
            >
              <UploadCloud size={28} />
            </div>

            <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>
              Drag & Drop your resume here, or <span style={{ color: 'var(--color-primary)' }}>Browse</span>
            </p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
              Supports PDF, DOCX, and TXT up to 10MB
            </p>
          </div>

          {resumeFile && (
            <div
              style={{
                marginTop: '18px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-success-bg)',
                border: '1px solid var(--color-success-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} color="var(--color-success)" />
                <div>
                  <strong style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-main)' }}>
                    {resumeFile.name}
                  </strong>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                    {(resumeFile.size / 1024).toFixed(1)} KB • Loaded
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm" icon={Trash2} onClick={handleClear}>
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Text Area & Preview */}
        <div className="resumate-card">
          <div className="card-header">
            <h2 className="card-title">
              <FileText size={20} color="var(--color-primary)" />
              Extracted Text Preview
            </h2>
            <span className="badge badge-secondary">
              {resumeText ? `${resumeText.trim().split(/\s+/).length} Words` : 'Empty'}
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" htmlFor="manual-resume-text">
              Parsed Resume Content (Editable)
            </label>
            <textarea
              id="manual-resume-text"
              rows={11}
              className="form-textarea"
              placeholder="Paste or review parsed resume text here..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              style={{ resize: 'vertical', fontSize: 'var(--font-xs)', lineHeight: '1.6' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="outline" size="sm" onClick={handleClear} disabled={!manualText}>
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={handleManualSave} disabled={!manualText}>
              Save to Shared State
            </Button>
          </div>
        </div>
      </div>

      {/* Developer & Team Integration Guidance Card */}
      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <Code2 size={16} /> Module 2 Integration Contract
          </span>
          <span className="badge badge-primary">Owner: Resume Upload Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li><strong>Role:</strong> Extract raw text from uploaded files using <code>pdfjs-dist</code> for PDFs and <code>mammoth</code> for DOCX files.</li>
          <li><strong>Shared State Output:</strong> Calls <code>setNewResume(fileInfo, extractedText)</code> which automatically clears stale analysis via <code>resetAnalysis()</code>.</li>
          <li><strong>Libraries:</strong> <code>pdfjs-dist</code>, <code>mammoth</code> are already installed in <code>package.json</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
