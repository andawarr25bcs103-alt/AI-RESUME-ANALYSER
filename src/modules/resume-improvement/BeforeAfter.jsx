import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  Copy,
  Check,
  FileEdit,
  XCircle,
  CheckCircle2
} from 'lucide-react';

export const BeforeAfter = ({ comparisons = [] }) => {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>
          Before & After Sentence Transformations
        </h3>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
          Side-by-side phrasing rewrites replacing passive duties with action-oriented impact.
        </p>
      </div>

      <div className="before-after-list">
        {comparisons.map((item, idx) => {
          const isCopied = copiedIdx === idx;

          return (
            <div key={idx} className="before-after-card">
              <div className="before-after-header">
                <div className="ba-section-tag">
                  <FileEdit size={14} />
                  <span>{item.section || 'Resume Bullet Point'}</span>
                </div>

                <button
                  type="button"
                  className="ri-btn ri-btn-outline ri-btn-sm"
                  onClick={() => handleCopy(item.after, idx)}
                  title="Copy improved sentence"
                >
                  {isCopied ? (
                    <>
                      <Check size={12} color="var(--color-success)" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Improved Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="ba-grid">
                {/* Before Pane */}
                <div className="ba-pane ba-pane-before">
                  <div className="ba-pane-label ba-label-before">
                    <XCircle size={13} />
                    <span>Original Resume Sentence (Weak / Passive)</span>
                  </div>
                  <p style={{ textDecoration: 'line-through', opacity: 0.85 }}>
                    "{item.before}"
                  </p>
                </div>

                {/* After Pane */}
                <div className="ba-pane ba-pane-after">
                  <div className="ba-pane-label ba-label-after">
                    <CheckCircle2 size={13} />
                    <span>Improved Sentence (Active & Quantifiable)</span>
                  </div>
                  <p style={{ fontWeight: 600 }}>
                    "{item.after}"
                  </p>
                </div>
              </div>

              {/* Explanation of the improvement */}
              <div className="ba-explanation-callout">
                <Lightbulb size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Why this improves your resume:</strong> {item.explanation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeforeAfter;
