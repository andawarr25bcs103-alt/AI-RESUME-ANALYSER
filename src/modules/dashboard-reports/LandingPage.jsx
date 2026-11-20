import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  Briefcase,
  Target,
  Lightbulb,
  FileText,
  ArrowRight,
  Cpu
} from 'lucide-react';
import Button from '../../components/Button';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: UploadCloud,
      title: 'Multi-Format Resume Upload',
      description: 'Parses PDF, DOCX, and text resumes with PDF.js and Mammoth into structured clean text.'
    },
    {
      icon: Sparkles,
      title: 'Google Gemini ATS Auditing',
      description: 'Deep semantic analysis evaluating keyword density, formatting, and ATS compliance scores.'
    },
    {
      icon: Briefcase,
      title: 'Target Job Matching',
      description: 'Benchmarks candidate qualifications against live job descriptions to measure compatibility.'
    },
    {
      icon: Target,
      title: 'Skill Gap & Roadmap',
      description: 'Detects missing technical competencies and charts an actionable step-by-step learning roadmap.'
    },
    {
      icon: Lightbulb,
      title: 'Bullet Point Rewriter',
      description: 'Transforms weak bullet points into quantifiable, achievement-oriented bullet statements.'
    },
    {
      icon: FileText,
      title: 'Exportable Reports',
      description: 'Generates comprehensive career intelligence dossiers with printable summary views.'
    }
  ];

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '60px 20px 48px 20px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '48px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            marginBottom: '20px'
          }}
        >
          <Cpu size={14} /> Powered by Google Gemini & Firebase
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            maxWidth: '840px',
            margin: '0 auto 16px auto',
            lineHeight: 1.15
          }}
        >
          AI-Driven Resume Intelligence &{' '}
          <span
            style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            ATS Optimization
          </span>
        </h1>

        <p
          style={{
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6
          }}
        >
          RESUMATE AI empowers job seekers and students by auditing resumes with Google Gemini AI,
          measuring job fit, diagnosing skill gaps, and generating high-impact phrasing.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            onClick={() => navigate('/dashboard')}
          >
            Open Dashboard
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={UploadCloud}
            onClick={() => navigate('/upload-resume')}
          >
            Upload Resume
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>Seven Integrated Modules</h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
            Engineered as a modular architecture for seamless college project teamwork.
          </p>
        </div>

        <div className="grid-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="resumate-card">
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-subtle)',
                    border: '1px solid var(--color-primary-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                    marginBottom: '16px'
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', marginBottom: '8px' }}>{feat.title}</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture & Team Collaboration Banner */}
      <section
        style={{
          background: 'var(--gradient-primary)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <h3 style={{ color: '#ffffff', fontSize: 'var(--font-xl)', marginBottom: '6px' }}>
            Ready to Integrate Your Team's Work?
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 'var(--font-sm)', maxWidth: '600px' }}>
            Each module is cleanly isolated in <code>src/modules/</code> with common state managed via <code>AppContext</code>.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/upload-resume')}
          style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)', border: 'none' }}
        >
          Start Exploring
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;
