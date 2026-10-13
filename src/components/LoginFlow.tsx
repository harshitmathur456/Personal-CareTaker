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
  Activity,
  Clock,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';
import { Role } from '../types';

interface LoginFlowProps {
  onLoginSuccess: (userRole: Role, userName: string) => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('caregiver');
  const [identifier, setIdentifier] = useState<string>('+91 98711 54321');
  const [otp, setOtp] = useState<string>('4082');

  const roleProfiles: Record<Role, { name: string; phone: string; title: string }> = {
    caregiver: {
      name: 'Priya Sharma (Family Caregiver)',
      phone: '+91 98711 54321',
      title: 'Family Primary Caregiver',
    },
    nurse: {
      name: 'Sister Shalini Kumari, RN',
      phone: '+91 98112 77889',
      title: 'Discharge Ward Nurse (Sign-off Authority)',
    },
    physio: {
      name: 'Dr. Rahul Verma, MPT (Physio Doctor)',
      phone: '+91 98223 44556',
      title: 'Physiotherapist & Cardiac Rehab Doctor',
    },
    consulting_doctor: {
      name: 'Dr. Vikram Anand, MD, DM',
      phone: '9898989898',
      title: 'Consulting Cardiologist & Attending Physician',
    },
    doctor: {
      name: 'Dr. Vikram Anand, MD, DM',
      phone: '9898989898',
      title: 'Consulting Cardiologist & Attending Physician',
    },
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setIdentifier(roleProfiles[role]?.phone || '');
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = roleProfiles[selectedRole] || roleProfiles.caregiver;
    onLoginSuccess(selectedRole, profile.name);
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
            Closing the critical gap between rapid discharge instructions and home recovery. Designed for elderly patients, family caregivers, and clinical care teams.
          </p>

          {/* Key Clinical Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  Quarantined discharge orders restricted strictly to licensed nurses with role-based security.
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
      </div>

      {/* Right Column: Modern Authentication Portal */}
      <div className="clinical-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Clinical Access Portal
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Select your clinical role to authenticate with strict Role-Based Access Control.
            </p>
          </div>

          {/* Role Segmented Picker (4 Clinical Personas) */}
          <div style={{ marginBottom: '1.35rem' }}>
            <label className="form-label" style={{ marginBottom: '0.45rem' }}>
              <span>Select Active Clinical Persona</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--teal-700)', fontWeight: 700 }}>Strict RBAC</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
              {[
                { role: 'caregiver' as Role, label: 'Family Caregiver', icon: <UserCheck size={15} /> },
                { role: 'nurse' as Role, label: 'Ward Nurse (RN)', icon: <ShieldCheck size={15} /> },
                { role: 'physio' as Role, label: 'Physio Doctor', icon: <Dumbbell size={15} /> },
                { role: 'consulting_doctor' as Role, label: 'Consulting Doctor', icon: <Stethoscope size={15} /> },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleChange(item.role)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: selectedRole === item.role ? '#ffffff' : 'transparent',
                    color: selectedRole === item.role ? 'var(--teal-800)' : 'var(--text-muted)',
                    fontWeight: selectedRole === item.role ? 800 : 600,
                    fontSize: '0.82rem',
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

          {/* Role Description Helper */}
          <div style={{ background: '#f8fafc', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <strong>Active Identity:</strong> {roleProfiles[selectedRole]?.name} · <span style={{ color: 'var(--teal-700)' }}>{roleProfiles[selectedRole]?.title}</span>
          </div>

          {/* Modern Input Form */}
          <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>
                  Mobile Phone / Clinical ID <span className="required-asterisk">*</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Registered with Hospital</span>
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
                <Phone size={16} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>
                  One-Time Passcode (OTP) <span className="required-asterisk">*</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald-600)', fontWeight: 600 }}>Auto-filled (4082)</span>
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
                <Lock size={16} className="input-icon" />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.85rem', fontSize: '0.94rem', marginTop: '0.2rem' }}>
              <span>Authenticate & Enter Secure Portal</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* 1-Click Fast Pass (All 4 Clinical Personas) */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1.5px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1-Click Fast Pass Evaluation
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--teal-700)', fontWeight: 600 }}>
              Live Testing
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-outline"
              style={{ justifyContent: 'center', padding: '0.55rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => handleQuickDemo('caregiver', 'Priya Sharma (Family Caregiver)')}
              title="Family Caregiver Recovery Hub"
            >
              <UserCheck size={14} color="var(--teal-700)" />
              <span>Caregiver (Priya)</span>
            </button>

            <button
              type="button"
              className="btn-outline"
              style={{ justifyContent: 'center', padding: '0.55rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => handleQuickDemo('nurse', 'Sister Shalini Kumari, RN')}
              title="Ward Nurse Clinical Sign-off Authority"
            >
              <ShieldCheck size={14} color="var(--amber-600)" />
              <span>Nurse (Shalini, RN)</span>
            </button>

            <button
              type="button"
              className="btn-outline"
              style={{ justifyContent: 'center', padding: '0.55rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => handleQuickDemo('physio', 'Dr. Rahul Verma, MPT (Physio Doctor)')}
              title="Physio Doctor Cardiac Rehab & Mobility"
            >
              <Dumbbell size={14} color="var(--teal-700)" />
              <span>Physio Doctor (Rahul)</span>
            </button>

            <button
              type="button"
              className="btn-outline"
              style={{ justifyContent: 'center', padding: '0.55rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => handleQuickDemo('consulting_doctor', 'Dr. Vikram Anand, MD, DM')}
              title="Consulting Doctor OPD Review & Next Visit Prep (Ph: 9898989898)"
            >
              <Stethoscope size={14} color="var(--teal-800)" />
              <span>Consulting Dr (Vikram)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFlow;
