import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  ArrowRight, 
  Lock, 
  Phone,
  CheckCircle2,
  Sparkles,
  Activity,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Role } from '../types';

interface LoginFlowProps {
  onLoginSuccess: (userRole: Role, userName: string) => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('caregiver');
  const [identifier, setIdentifier] = useState<string>('+91 98711 54321');
  const [otp, setOtp] = useState<string>('4082');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultName =
      selectedRole === 'caregiver'
        ? 'Priya Sharma (Family Caregiver)'
        : selectedRole === 'nurse'
        ? 'Sister Shalini Kumari, RN'
        : 'Dr. Vikram Anand, MD';
    onLoginSuccess(selectedRole, defaultName);
  };

  const handleQuickDemo = (role: Role, name: string) => {
    onLoginSuccess(role, name);
  };

  return (
    <div className="auth-split-grid">
      {/* Left Column: Clinical Hero & Trust Canvas */}
      <div className="auth-hero-card">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <Activity size={15} />
            <span>Hospital-to-Home Recovery Companion</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            Personal Care Taker
          </h1>

          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#ccfbf1', maxWidth: '480px', marginBottom: '2rem' }}>
            Closing the critical gap between rapid discharge instructions and home recovery. Designed for elderly patients, family caregivers, and clinical teams.
          </p>

          {/* Key Clinical Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.35rem', borderRadius: '8px', marginTop: '0.1rem' }}>
                <CheckCircle2 size={18} color="#ffffff" />
              </div>
              <div>
                <strong style={{ fontSize: '0.94rem' }}>Zero Clinical Hallucinations</strong>
                <p style={{ fontSize: '0.82rem', color: '#99f6e4', marginTop: '0.1rem' }}>
                  Prescription shorthand decoded by strict deterministic rules, never guessed by AI.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.35rem', borderRadius: '8px', marginTop: '0.1rem' }}>
                <ShieldAlert size={18} color="#ffffff" />
              </div>
              <div>
                <strong style={{ fontSize: '0.94rem' }}>Nurse Verification Safety Gate</strong>
                <p style={{ fontSize: '0.82rem', color: '#99f6e4', marginTop: '0.1rem' }}>
                  Ambiguous or incomplete orders are quarantined until digitally signed by a nurse.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.35rem', borderRadius: '8px', marginTop: '0.1rem' }}>
                <Clock size={18} color="#ffffff" />
              </div>
              <div>
                <strong style={{ fontSize: '0.94rem' }}>Audible Bedside Alerts & Grace Window</strong>
                <p style={{ fontSize: '0.82rem', color: '#99f6e4', marginTop: '0.1rem' }}>
                  Gentle clinical chimes with automated caregiver escalation if a dose is delayed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Trust Banner */}
        <div style={{ background: 'rgba(0, 0, 0, 0.15)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>96.8%</div>
            <div style={{ fontSize: '0.74rem', color: '#ccfbf1' }}>On-Time Dose Adherence</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>100%</div>
            <div style={{ fontSize: '0.74rem', color: '#ccfbf1' }}>Source Traceability</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>0</div>
            <div style={{ fontSize: '0.74rem', color: '#ccfbf1' }}>Unverified Doses Released</div>
          </div>
        </div>
      </div>

      {/* Right Column: Modern Authentication Portal */}
      <div className="clinical-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Welcome to Care Portal
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Sign in with your verified credentials or select a test role below.
            </p>
          </div>

          {/* Role Segmented Picker */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              <span>Select Active Clinical Persona</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--teal-700)', fontWeight: 600 }}>Role-Based Access</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
              {[
                { role: 'caregiver' as Role, label: 'Caregiver', icon: <UserCheck size={16} /> },
                { role: 'nurse' as Role, label: 'Ward Nurse', icon: <ShieldCheck size={16} /> },
                { role: 'doctor' as Role, label: 'Physician', icon: <Stethoscope size={16} /> },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedRole(item.role)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: selectedRole === item.role ? '#ffffff' : 'transparent',
                    color: selectedRole === item.role ? 'var(--teal-800)' : 'var(--text-muted)',
                    fontWeight: selectedRole === item.role ? 800 : 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: selectedRole === item.role ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modern Input Form */}
          <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>
                  Mobile Phone / Hospital ID <span className="required-asterisk">*</span>
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Registered with discharge</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="+91 98711 54321"
                  className="modern-input"
                />
                <Phone size={17} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>
                  One-Time Passcode (OTP) <span className="required-asterisk">*</span>
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--emerald-600)', fontWeight: 600 }}>Auto-filled (4082)</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="••••"
                  className="modern-input"
                  style={{ letterSpacing: '0.3em' }}
                />
                <Lock size={17} className="input-icon" />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.85rem', fontSize: '0.96rem', marginTop: '0.25rem' }}>
              <span>Authenticate & Open Patient Record</span>
              <ArrowRight size={17} />
            </button>
          </form>
        </div>

        {/* 1-Click Fast Track Testing Access */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1.5px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1-Click Fast Pass
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-700)', fontWeight: 600 }}>
              Live Evaluation
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn-outline"
              style={{ justifyContent: 'center', padding: '0.65rem 0.75rem', fontSize: '0.82rem' }}
              onClick={() => handleQuickDemo('caregiver', 'Priya Sharma (Family Caregiver)')}
            >
              <UserCheck size={15} color="var(--teal-700)" />
              <span>Priya Sharma (Caregiver)</span>
            </button>

            <button
              type="button"
              className="btn-outline"
              style={{ justifyContent: 'center', padding: '0.65rem 0.75rem', fontSize: '0.82rem' }}
              onClick={() => handleQuickDemo('nurse', 'Sister Shalini Kumari, RN')}
            >
              <ShieldCheck size={15} color="var(--amber-600)" />
              <span>Sister Shalini (Nurse)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
