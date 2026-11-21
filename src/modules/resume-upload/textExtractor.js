import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Maximum allowed file size: 5 MB (5 * 1024 * 1024 bytes)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Track worker configuration state
let isWorkerInitialized = false;

/**
 * Safely initializes the PDF.js web worker for client-side text parsing.
 * Uses official unpkg ESM worker matching the installed library version.
 */
export function initPdfWorker() {
  if (isWorkerInitialized || typeof window === 'undefined') return;

  if (pdfjsLib.GlobalWorkerOptions?.workerSrc) {
    isWorkerInitialized = true;
    return;
  }

  try {
    const libVersion = pdfjsLib.version || '6.5.438';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${libVersion}/build/pdf.worker.min.mjs`;
    isWorkerInitialized = true;
  } catch (err) {
    console.warn('PDF.js worker initialization notice:', err);
  }
}

/**
 * Formats a byte number into human-readable file size (e.g. "245.5 KB", "1.8 MB").
 *
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validates the uploaded file against permitted formats (.pdf, .docx) and 5 MB size limit.
 *
 * @param {File} file
 * @returns {{ isValid: boolean, error?: string, fileType?: 'pdf' | 'docx' }}
 */
export function validateResumeFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected. Please choose a PDF or DOCX resume.' };
  }

  // 1. Check for empty files
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The uploaded file is empty (0 bytes). Please upload a valid resume document.'
    };
  }

  // 2. Validate maximum 5 MB file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 5 MB limit (Current: ${formatFileSize(file.size)}). Please compress or choose a smaller file.`
    };
  }

  // 3. Validate supported document types
  const lowerName = (file.name || '').toLowerCase();
  const mimeType = (file.type || '').toLowerCase();

  const isPdf =
    lowerName.endsWith('.pdf') || mimeType === 'application/pdf';

  const isDocx =
    lowerName.endsWith('.docx') ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (!isPdf && !isDocx) {
    if (lowerName.endsWith('.doc')) {
      return {
        isValid: false,
        error:
          'Legacy Word (.doc) format is not supported. Please save your resume as modern Word (.docx) or PDF (.pdf) and try again.'
      };
    }
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload a PDF (.pdf) or Word (.docx) document.'
    };
  }

  return {
    isValid: true,
    fileType: isPdf ? 'pdf' : 'docx',
    error: null
  };
}

/**
 * Extracts raw textual content from a PDF document page by page using pdfjs-dist.
 * Preserves line breaks and basic structural spacing.
 * Detects scanned PDFs requiring OCR.
 *
 * @param {File} file
 * @returns {Promise<{ text: string, numPages: number, wordCount: number, characterCount: number }>}
 */
export async function extractTextFromPdf(file) {
  initPdfWorker();

  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);

  let pdf;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: typedArray,
      useSystemFonts: true,
      isEvalSupported: false
    });
    pdf = await loadingTask.promise;
  } catch (err) {
    if (err?.name === 'PasswordException' || err?.message?.toLowerCase().includes('password')) {
      throw new Error('This PDF is password-protected. Please remove password encryption and try again.');
    }
    throw new Error(
      `Failed to read PDF document: ${err.message || 'The file may be damaged or corrupted.'}`
    );
  }

  const numPages = pdf.numPages;
  if (numPages === 0) {
    throw new Error('The PDF document contains no pages.');
  }

  const pageTexts = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    let lastY = null;
    let pageString = '';

    for (const item of textContent.items) {
      if (typeof item.str === 'string') {
        const itemText = item.str;

        // Approximate line break when vertical coordinates deviate significantly
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageString += '\n';
        } else if (
          pageString.length > 0 &&
          !pageString.endsWith(' ') &&
          !pageString.endsWith('\n')
        ) {
          pageString += ' ';
        }

        pageString += itemText;
        lastY = item.transform[5];
      }
    }

    if (pageString.trim()) {
      pageTexts.push(pageString.trim());
    }
  }

  const fullText = pageTexts.join('\n\n').trim();

  // Scanned PDFs requiring OCR detection
  if (!fullText) {
    throw new Error(
      'SCANNED_PDF: No selectable text could be extracted from this PDF. This document appears to be a scanned image or photo resume requiring OCR (Optical Character Recognition). Scanned PDFs requiring OCR are outside the current project scope. Please upload a digital PDF with selectable text or a DOCX document.'
    );
  }

  const words = fullText.split(/\s+/).filter(Boolean);

  return {
    text: fullText,
    numPages,
    wordCount: words.length,
    characterCount: fullText.length
  };
}

/**
 * Extracts raw textual content from a DOCX document using mammoth.
 *
 * @param {File} file
 * @returns {Promise<{ text: string, numPages: null, wordCount: number, characterCount: number, messages: Array }>}
 */
export async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();

  const mammothLib = mammoth.extractRawText ? mammoth : (mammoth.default || mammoth);

  let result;
  try {
    result = await mammothLib.extractRawText({ arrayBuffer });
  } catch (err) {
    throw new Error(
      `Failed to parse DOCX file: ${err.message || 'The file may be corrupted or not a valid Word document.'}`
    );
  }

  const rawText = (result.value || '').trim();

  if (!rawText) {
    throw new Error(
      'No text could be extracted from this Word document. Please ensure the document is not blank and contains text content.'
    );
  }

  const words = rawText.split(/\s+/).filter(Boolean);

  return {
    text: rawText,
    numPages: null,
    wordCount: words.length,
    characterCount: rawText.length,
    messages: result.messages || []
  };
}

/**
 * Main extraction orchestrator. Validates and routes to proper extractor.
 *
 * @param {File} file
 * @returns {Promise<{
 *   text: string,
 *   fileType: 'pdf' | 'docx',
 *   numPages: number | null,
 *   wordCount: number,
 *   characterCount: number,
 *   fileName: string,
 *   fileSize: number
 * }>}
 */
export async function extractResume(file) {
  const validation = validateResumeFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  if (validation.fileType === 'pdf') {
    const res = await extractTextFromPdf(file);
    return {
      ...res,
      fileType: 'pdf',
      fileName: file.name,
      fileSize: file.size
    };
  }

  if (validation.fileType === 'docx') {
    const res = await extractTextFromDocx(file);
    return {
      ...res,
      fileType: 'docx',
      fileName: file.name,
      fileSize: file.size
    };
  }

  throw new Error('Unsupported document format.');
}
