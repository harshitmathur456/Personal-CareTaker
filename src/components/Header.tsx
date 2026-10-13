import React from 'react';
import { 
  HeartPulse, 
  UserCheck, 
  Stethoscope, 
  FileText, 
  ShieldAlert, 
  History, 
  LogOut
} from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  currentRole: Role | 'scanner';
  onRoleChange: (role: Role | 'scanner') => void;
  flaggedCount: number;
  onOpenAuditLog: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  flaggedCount,
  onOpenAuditLog,
  onLogout,
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

        {/* Tab-Type Architecture Navigation for Roles */}
        <nav aria-label="Role navigation tabs" className="persona-switcher">
          <button
            type="button"
            className={`persona-btn ${currentRole === 'caregiver' ? 'active' : ''}`}
            onClick={() => onRoleChange('caregiver')}
            title="Family Caregiver recovery plan and schedule"
          >
            <UserCheck size={17} />
            <span>Family Caregiver</span>
          </button>

          <button
            type="button"
            className={`persona-btn ${currentRole === 'nurse' ? 'active' : ''}`}
            onClick={() => onRoleChange('nurse')}
            title="Ward and discharge desk nurse sign-off queue"
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
            className={`persona-btn ${currentRole === 'doctor' ? 'active' : ''}`}
            onClick={() => onRoleChange('doctor')}
            title="Treating physician OPD timeline & document review"
          >
            <Stethoscope size={17} />
            <span>Doctor View</span>
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
        </nav>

        {/* Right Actions: Audit Log & Logout (Clean, spacious, uncrowded) */}
        <div className="header-actions">
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
      </div>
    </header>
  );
};
