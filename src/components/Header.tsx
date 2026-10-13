import React from 'react';
import { 
  HeartPulse, 
  UserCheck, 
  Stethoscope, 
  FileText, 
  ShieldAlert, 
  History, 
  LogOut,
  ShieldCheck,
  Dumbbell,
  Lock
} from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  currentRole: Role | 'scanner';
  onRoleChange: (role: Role | 'scanner') => void;
  flaggedCount: number;
  onOpenAuditLog: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  authenticatedRole?: Role;
  authenticatedUserName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  flaggedCount,
  onOpenAuditLog,
  onLogout,
  isLoggedIn = true,
  authenticatedRole = 'caregiver',
  authenticatedUserName = 'Priya Sharma (Family Caregiver)',
}) => {
  return (
    <header className="clinical-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-icon-box">
            <HeartPulse size={24} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-title">
              Personal Care Taker
            </div>
            <div className="brand-subtitle">
              Hospital Discharge to Home Care
            </div>
          </div>
        </div>

        {isLoggedIn ? (
          <>
            {/* Role-Based Secure Navigation Tabs */}
            <nav aria-label="Role navigation tabs" className="persona-switcher">
              {/* When Logged in as Caregiver: Family Recovery Portal */}
              {authenticatedRole === 'caregiver' && (
                <button
                  type="button"
                  className={`persona-btn ${currentRole === 'caregiver' ? 'active' : ''}`}
                  onClick={() => onRoleChange('caregiver')}
                  title="Family Caregiver recovery plan and schedule"
                >
                  <UserCheck size={17} />
                  <span>Family Recovery Plan</span>
                </button>
              )}

              {/* When Logged in as Nurse: Nurse Queue, Scanner Lab, Discharge Records */}
              {authenticatedRole === 'nurse' && (
                <>
                  <button
                    type="button"
                    className={`persona-btn ${currentRole === 'nurse' ? 'active' : ''}`}
                    onClick={() => onRoleChange('nurse')}
                    title="Ward nurse verification and prescription sign-off queue"
                  >
                    <ShieldAlert size={17} />
                    <span>Nurse Queue</span>
                    {flaggedCount > 0 && (
                      <span className="badge-flagged-count" title={`${flaggedCount} items require clinical review`}>
                        {flaggedCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`persona-btn ${currentRole === 'scanner' ? 'active' : ''}`}
                    onClick={() => onRoleChange('scanner')}
                    title="Discharge PDF scanner and OCR extraction pipeline"
                  >
                    <FileText size={17} />
                    <span>Scanner Lab</span>
                  </button>
                </>
              )}

              {/* When Logged in as Physio Doctor: Dedicated Rehabilitation Hub */}
              {authenticatedRole === 'physio' && (
                <button
                  type="button"
                  className={`persona-btn ${currentRole === 'physio' ? 'active' : ''}`}
                  onClick={() => onRoleChange('physio')}
                  title="Physio Doctor rehabilitation protocols & mobility sessions"
                >
                  <Dumbbell size={17} />
                  <span>Physio Doctor Hub</span>
                </button>
              )}

              {/* When Logged in as Consulting Doctor: Consulting Doctor OPD Review */}
              {(authenticatedRole === 'consulting_doctor' || authenticatedRole === 'doctor') && (
                <button
                  type="button"
                  className={`persona-btn ${currentRole === 'consulting_doctor' || currentRole === 'doctor' ? 'active' : ''}`}
                  onClick={() => onRoleChange('consulting_doctor')}
                  title="Treating physician OPD timeline & document review"
                >
                  <Stethoscope size={17} />
                  <span>Consulting Doctor Portal</span>
                </button>
              )}
            </nav>

            {/* Authenticated Identity Pill & Actions */}
            <div className="header-actions">
              {/* Authenticated Role Badge */}
              <div 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.45rem', 
                  background: '#f8fafc', 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: 'var(--radius-pill)', 
                  border: '1px solid var(--border-light)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)'
                }}
              >
                <Lock size={12} color="var(--emerald-600)" />
                <span>
                  {authenticatedRole === 'nurse' && 'Sister Shalini (Ward Nurse, RN)'}
                  {authenticatedRole === 'physio' && 'Dr. Rahul Verma (Physio Doctor)'}
                  {(authenticatedRole === 'consulting_doctor' || authenticatedRole === 'doctor') && 'Dr. Vikram Anand (Consulting Doctor)'}
                  {authenticatedRole === 'caregiver' && 'Priya Sharma (Family Caregiver)'}
                </span>
              </div>

              {/* Audit Log */}
              <button
                type="button"
                className="btn-outline"
                style={{ padding: '0.55rem 0.85rem' }}
                onClick={onOpenAuditLog}
                title="View Clinical Audit Trail"
              >
                <History size={16} />
                <span style={{ fontSize: '0.82rem' }}>Audit Log</span>
              </button>

              {/* Logout Button */}
              {onLogout && (
                <button
                  type="button"
                  className="btn-outline"
                  style={{
                    padding: '0.55rem 1rem',
                    color: 'var(--rose-700)',
                    borderColor: '#fecdd3',
                    background: '#fff1f2',
                    fontWeight: 700,
                  }}
                  onClick={onLogout}
                  title="Sign Out of Personal Care Taker"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#f0fdfa',
                color: 'var(--teal-800)',
                border: '1px solid #99f6e4',
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={16} color="var(--teal-700)" />
              <span>Secure Clinical Authentication</span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
