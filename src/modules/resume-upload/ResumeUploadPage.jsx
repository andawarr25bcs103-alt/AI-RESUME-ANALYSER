import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Code2,
  Trash2,
  Sparkles,
  Info,
  ShieldCheck,
  FileWarning
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import FileDropzone from './FileDropzone';
import FileMetadataCard from './FileMetadataCard';
import TextPreviewCard from './TextPreviewCard';
import {
  extractResume,
  validateResumeFile,
  formatFileSize,
  MAX_FILE_SIZE_BYTES
} from './textExtractor';

export const ResumeUploadPage = () => {
  const {
    resumeText,
    resumeFile,
    setResumeText,
    setResumeFile,
    setNewResume,
    resetAnalysis
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Extracting resume content...');
  const [uploadError, setUploadError] = useState('');
  const [isScannedPdfError, setIsScannedPdfError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const hiddenReplaceInputRef = useRef(null);
  const navigate = useNavigate();

  // Drag and drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await handleProcessFile(file);
    }
  };

  // Main file processing & client-side extraction pipeline
  const handleProcessFile = async (file) => {
    setUploadError('');
    setIsScannedPdfError(false);
    setSuccessMessage('');

    // Pre-validation: Type and Size (Max 5 MB)
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error);
      return;
    }

    setIsProcessing(true);
    const isPdf = validation.fileType === 'pdf';
    setProcessingMessage(
      isPdf
        ? 'Extracting selectable text from PDF using PDF.js...'
        : 'Parsing Word document structure using Mammoth...'
    );

    try {
      // Execute client-side extraction using pdfjs-dist or mammoth
      const extraction = await extractResume(file);

      const fileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type || (isPdf ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        fileType: extraction.fileType,
        lastModified: file.lastModified,
        extractedAt: new Date().toISOString(),
        numPages: extraction.numPages || null,
        wordCount: extraction.wordCount,
        characterCount: extraction.characterCount
      };

      // Save extracted text & file metadata using shared AppContext setters
      setResumeFile(fileMetadata);
      setResumeText(extraction.text);

      // Also invoke setNewResume to flush any stale analysis results in AppContext
      setNewResume(fileMetadata, extraction.text);

      setSuccessMessage(
        `Resume successfully parsed! Extracted ${extraction.wordCount.toLocaleString()} words across ${extraction.numPages ? `${extraction.numPages} page(s)` : 'the document'
        }.`
      );
    } catch (err) {
      const errMsg = err.message || 'An unexpected error occurred while parsing the resume.';

      // Check if error is due to scanned PDF requiring OCR
      if (errMsg.includes('SCANNED_PDF')) {
        setIsScannedPdfError(true);
        setUploadError(errMsg.replace('SCANNED_PDF: ', ''));
      } else {
        setUploadError(errMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove File handler (Clears active file and text in state and AppContext)
  const handleRemoveFile = () => {
    resetAnalysis();
    setResumeFile(null);
    setResumeText('');
    setUploadError('');
    setIsScannedPdfError(false);
    setSuccessMessage('');
  };

  // Clear Text handler (Clears extracted text while keeping file metadata)
  const handleClearText = () => {
    setResumeText('');
    if (resumeFile) {
      setResumeFile({
        ...resumeFile,
        wordCount: 0,
        characterCount: 0
      });
    }
  };

  // Handle user edits in text preview
  const handleSaveEditedText = (editedText) => {
    if (!editedText.trim()) {
      setUploadError('Resume text cannot be completely empty.');
      return;
    }

    const words = editedText.trim().split(/\s+/).filter(Boolean).length;
    const chars = editedText.length;

    setResumeText(editedText);

    // Update word count in file metadata if file is loaded
    if (resumeFile) {
      const updatedFile = {
        ...resumeFile,
        wordCount: words,
        characterCount: chars
      };
      setResumeFile(updatedFile);
    }
  };

  // Navigate to AI Analysis
  const handleContinueToAnalysis = () => {
    navigate('/ai-analysis');
  };

  // Trigger replacement file dialog
  const handleTriggerReplace = () => {
    if (hiddenReplaceInputRef.current) {
      hiddenReplaceInputRef.current.click();
    }
  };

  return (
    <div>
      {/* Hidden file input for Replace action */}
      <input
        ref={hiddenReplaceInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleProcessFile(file);
          }
          e.target.value = '';
        }}
      />

      {/* Page Header */}
      <PageHeader
        title="Resume Upload & Text Extraction"
        description="Upload your resume and extract its contents."
        badge="Module 2"
        icon={UploadCloud}
        actions={
          resumeText ? (
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={handleContinueToAnalysis}
            >
              Continue to AI Analysis
            </Button>
          ) : null
        }
      />

      {/* Success Notification Banner */}
      {successMessage && (
        <div
          className="alert alert-success"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ECFDF5',
            borderColor: '#A7F3D0',
            color: '#065F46'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} color="#059669" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#059669',
              fontWeight: 700,
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Scanned PDF Warning Banner (OCR Out of Scope) */}
      {isScannedPdfError && (
        <div
          className="alert alert-warning"
          style={{
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: '#FFFBEB',
            borderColor: '#FDE68A',
            color: '#92400E'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
            <FileWarning size={20} color="#D97706" />
            <span>Scanned PDF Detected (OCR Required)</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', lineHeight: '1.6' }}>
            {uploadError}
          </p>
          <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#B45309' }}>
            <strong>Recommendation:</strong> If your resume was created in Google Docs, Microsoft Word, Canva, or LinkedIn, export it as a standard digital PDF with selectable text, or upload the original DOCX file.
          </div>
        </div>
      )}

      {/* Generic Error Banner */}
      {uploadError && !isScannedPdfError && (
        <div
          className="alert alert-danger"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FEF2F2',
            borderColor: '#FECACA',
            color: '#991B1B'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#DC2626" />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#DC2626',
              fontWeight: 700,
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading State Spinner */}
      {isProcessing && (
        <div style={{ margin: '24px 0' }}>
          <Loader size="lg" message={processingMessage} />
        </div>
      )}

      {/* Main Content Area */}
      {!resumeFile && !resumeText ? (
        /* Empty State: File Dropzone */
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <FileDropzone
            onFileSelect={handleProcessFile}
            isProcessing={isProcessing}
            dragActive={dragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />

          {/* Quick Informational Highlights */}
          <div
            className="grid-3"
            style={{ marginTop: '28px' }}
          >
            <div className="resumate-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-primary">PDF Extraction</span>
              </div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Powered by PDF.js</h4>
              <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--color-text-secondary, #64748B)' }}>
                Parses vector text page by page with structural vertical spacing and glyph mapping.
              </p>
            </div>

            <div className="resumate-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-secondary">DOCX Extraction</span>
              </div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Powered by Mammoth</h4>
              <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--color-text-secondary, #64748B)' }}>
                Extracts clean text, paragraphs, and list items from Word OpenXML documents.
              </p>
            </div>

            <div className="resumate-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-success">Zero Cloud Storage</span>
              </div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '4px' }}>100% Private</h4>
              <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--color-text-secondary, #64748B)' }}>
                No server uploads and zero localStorage retention. Extracted text remains in memory.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Active Resume State: Metadata & Preview Grid */
        <div className="grid-2">
          {/* Left Column: Metadata & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FileMetadataCard
              fileData={resumeFile}
              onRemove={handleRemoveFile}
              onReplace={handleTriggerReplace}
              onContinue={handleContinueToAnalysis}
            />

            {/* Privacy & Session Card */}
            <div
              className="resumate-card"
              style={{
                backgroundColor: 'var(--color-bg, #F8FAFC)',
                border: '1px solid var(--color-border, #E2E8F0)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="var(--color-success, #10B981)" />
                <h4 style={{ fontSize: '0.875rem', margin: 0 }}>Privacy &amp; In-Memory State</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #64748B)', lineHeight: '1.6', margin: 0 }}>
                The extracted text and file details are held securely in memory within <code>AppContext</code>.
                When you refresh or close the tab, the in-memory state is cleared. You can proceed to AI Analysis or replace this resume anytime.
              </p>
            </div>
          </div>

          {/* Right Column: Extracted Text Preview */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextPreviewCard
              text={resumeText}
              onSaveText={handleSaveEditedText}
              onClearText={handleClearText}
              onContinue={handleContinueToAnalysis}
            />
          </div>
        </div>
      )}

      {/* Developer & Team Integration Guidance Card */}
      <div className="dev-guidance-card" style={{ marginTop: '36px' }}>
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <Code2 size={16} /> Module 2 Integration Contract
          </span>
          <span className="badge badge-primary">Owner: Resume Upload Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li>
            <strong>Role:</strong> Client-side text extraction using <code>pdfjs-dist</code> for PDFs and <code>mammoth</code> for DOCX files. Max file size: 5 MB.
          </li>
          <li>
            <strong>Shared State Output:</strong> Sets <code>resumeText</code> and <code>resumeFile</code> in <code>AppContext</code> via <code>setNewResume</code>.
          </li>
          <li>
            <strong>Downstream Integration:</strong> Module 3 (AI Analysis) and Module 4 (Job Matching) read directly from <code>AppContext.resumeText</code>.
          </li>
          <li>
            <strong>Security:</strong> Zero server upload and zero localStorage storage. OCR for scanned images is documented out of scope.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
