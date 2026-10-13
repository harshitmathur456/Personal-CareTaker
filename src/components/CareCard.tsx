import React, { useState } from 'react';
import { 
  PhoneCall, 
  AlertOctagon, 
  Users, 
  UserPlus, 
  Share2, 
  ShieldCheck, 
  HeartHandshake, 
  Check, 
  Copy,
  AlertTriangle
} from 'lucide-react';
import { Patient, WarningSign, FamilyMember } from '../types';

interface CareCardProps {
  patient: Patient;
  onAddFamilyMember: (newMember: FamilyMember) => void;
}

export const CareCard: React.FC<CareCardProps> = ({ patient, onAddFamilyMember }) => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteRelation, setInviteRelation] = useState<string>('Daughter');
  const [invitePhone, setInvitePhone] = useState<string>('');
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);

  const inviteCode = `CARE-${patient.id.slice(4, 9).toUpperCase()}-2026`;

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !invitePhone) return;

    onAddFamilyMember({
      id: `fam-${Date.now()}`,
      name: inviteName,
      relation: inviteRelation,
      phone: invitePhone,
      isPrimaryCaregiver: false,
      avatarBg: '#059669',
    });

    setInviteName('');
    setInvitePhone('');
    setShowInviteModal(false);
  };

  const copyInviteText = () => {
    const text = `Join ${patient.name}'s recovery care circle on Going Home Right. Access code: ${inviteCode}. Download/open: https://goinghomeright.in/join`;
    navigator.clipboard?.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* "Call The Doctor If..." Warning Card (PRD FR-7.1 & FR-7.2) */}
      <div className="emergency-call-card">
        <div className="emergency-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--rose-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-600)' }}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--rose-700)' }}>
                "Call The Doctor If..." Red-Flag Warning Signs
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Strict Rule (FR-7.2): Extracted strictly from discharge summary lines 23-26. App never adds its own.
              </div>
            </div>
          </div>

          {/* Quick Doctor / Hospital Hotline Dialers */}
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <a
              href={`tel:${patient.treatingDoctor.phone}`}
              className="btn-danger"
              style={{ textDecoration: 'none' }}
              title="Call Treating Doctor"
            >
              <PhoneCall size={16} />
              <span>Call Dr. Vikram Anand ({patient.treatingDoctor.phone})</span>
            </a>

            <a
              href={`tel:${patient.emergencyHospitalPhone}`}
              className="btn-outline"
              style={{ textDecoration: 'none', borderColor: '#fecdd3', color: 'var(--rose-700)' }}
              title="Hospital Casualty Hotline"
            >
              <PhoneCall size={16} />
              <span>Hospital Casualty (108 / {patient.emergencyHospitalPhone})</span>
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
          {patient.warningSigns.map((warning) => (
            <div key={warning.id} className="warning-item-pill">
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {warning.sign}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                  Source: Line {warning.sourceLine} of Discharge Summary
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--rose-600)', background: 'var(--rose-50)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', border: '1px solid #fecdd3' }}>
                {warning.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Family Caregiver Collaboration Roster (PRD FR-7.3 - Reduces need for paid caretaker) */}
      <div className="clinical-card">
        <div className="card-header-flex">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 className="card-title-lg">
                <Users size={18} color="var(--teal-600)" />
                <span>Family Care Circle & Shared Responsibilities</span>
              </h3>
              <span style={{ fontSize: '0.78rem', background: 'var(--teal-50)', color: 'var(--teal-700)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                {patient.familyMembers.length} Members Connected
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Enables daughters-in-law, sons, and relatives to coordinate smoothly without a paid caretaker.
            </p>
          </div>

          <button className="btn-primary" onClick={() => setShowInviteModal(true)}>
            <UserPlus size={15} />
            <span>Invite Family Member</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          {patient.familyMembers.map((member) => (
            <div
              key={member.id}
              style={{
                background: member.isPrimaryCaregiver ? '#f0fdfa' : '#f8fafc',
                border: member.isPrimaryCaregiver ? '2px solid var(--teal-500)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: member.avatarBg,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {member.name.charAt(0)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {member.name}
                  </span>
                  {member.isPrimaryCaregiver && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--teal-600)', color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-pill)' }}>
                      Primary
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {member.relation}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                  {member.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Family Member Modal */}
      {showInviteModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Add Family Member to Care Circle
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Any family member with the code can view the medicine schedule, log doses, and receive emergency alerts.
            </p>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.2rem', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Relation to Patient *</label>
                <select
                  value={inviteRelation}
                  onChange={(e) => setInviteRelation(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.2rem', fontSize: '0.88rem' }}
                >
                  <option value="Daughter-in-law">Daughter-in-law</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Grandchild">Grandchild</option>
                  <option value="Brother / Sister">Brother / Sister</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98123 45678"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.2rem', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Universal Family Access Code:</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                  <code style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--teal-700)', letterSpacing: '0.05em' }}>
                    {inviteCode}
                  </code>
                  <button type="button" className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }} onClick={copyInviteText}>
                    {copiedInvite ? <Check size={13} color="var(--emerald-600)" /> : <Copy size={13} />}
                    <span>{copiedInvite ? 'Copied' : 'Copy Invitation'}</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save to Care Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
