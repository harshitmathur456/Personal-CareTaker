import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  FileText, 
  AlertTriangle, 
  Stamp, 
  Check, 
  UserCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Patient, PlanItem, Slot, Role } from '../types';
import { medicalAudio } from '../services/audioService';

interface NurseSignoffQueueProps {
  patient: Patient;
  currentUserRole?: Role;
  onApproveItem: (
    itemId: string,
    updatedData: {
      name: string;
      strength: string;
      form: string;
      frequencyCode: string;
      frequencyDecoded: string;
      slots: Slot[];
      timingNotes: string;
      nurseName: string;
      clinicalNote: string;
    }
  ) => void;
  onRemoveItem: (itemId: string) => void;
  onGoToFamilyPlan: () => void;
}

export const NurseSignoffQueue: React.FC<NurseSignoffQueueProps> = ({
  patient,
  currentUserRole = 'nurse',
  onApproveItem,
  onRemoveItem,
  onGoToFamilyPlan,
}) => {
  // Strict Security Check: Only Ward Nurse has sign-off authority
  if (currentUserRole && currentUserRole !== 'nurse') {
    return (
      <div className="access-denied-card">
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--rose-600)' }}>
          <Lock size={32} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem' }}>
          Access Restricted · Ward Nurse Security Gate
        </h3>
        <p style={{ fontSize: '0.92rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
          Quarantined medication sign-off and clinical safety approvals are strictly restricted to licensed nursing staff (RN). Access is blocked for Family Caregivers and Physio Doctors.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <ShieldAlert size={15} color="var(--amber-600)" />
          <span>Active Role: <strong>{currentUserRole}</strong> (Unauthorized for clinical prescription release)</span>
        </div>
      </div>
    );
  }

  const flaggedItems = patient.planItems.filter((i) => i.status === 'flagged');

  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    flaggedItems[0]?.id || null
  );

  // Form edit states
  const [editedName, setEditedName] = useState<string>('Tab Sorbitrate (Isosorbide Dinitrate)');
  const [editedStrength, setEditedStrength] = useState<string>('5 mg');
  const [editedForm, setEditedForm] = useState<string>('Sublingual Tablet');
  const [editedFrequencyCode, setEditedFrequencyCode] = useState<string>('SOS');
  const [editedTimingNotes, setEditedTimingNotes] = useState<string>('Dissolve 1 tablet under tongue SOS if acute chest tightness or breathlessness occurs. Max 2 tabs/24h. Call hospital if not relieved within 10 mins.');
  const [nurseName, setNurseName] = useState<string>('Sister Shalini Kumari, RN (Reg #RN-8924)');
  const [clinicalNote, setClinicalNote] = useState<string>('Verified with Attending Cardiologist Dr. Vikram Anand (Ph: 9898989898). Clarified as sublingual Sorbitrate 5mg for acute cardiac angina/dyspnea.');

  const activeItem = patient.planItems.find((i) => i.id === selectedItemId);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;

    medicalAudio.playDoseSuccessPing();

    onApproveItem(selectedItemId, {
      name: editedName,
      strength: editedStrength,
      form: editedForm,
      frequencyCode: editedFrequencyCode,
      frequencyDecoded: 'As needed (SOS)',
      slots: ['SOS'],
      timingNotes: editedTimingNotes,
      nurseName,
      clinicalNote,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Clinical Nurse Verification Banner */}
      <div className="clinical-card" style={{ background: 'linear-gradient(135deg, #fffbeb, #ffffff)', border: '1px solid #fde68a' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-700)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <ShieldAlert size={15} />
              Feature F5 · Ward & Discharge-Desk Nurse Sign-off Queue
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              Clinical Verification & Ambiguity Resolution
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.25rem' }}>
              <strong>Safety Core (PRD FR-5.3):</strong> A recovery plan cannot go live to the family until all flagged or ambiguous items are clinically verified and digitally signed by a nurse.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: flaggedItems.length === 0 ? 'var(--emerald-600)' : 'var(--amber-700)', background: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)' }}>
              {flaggedItems.length === 0 ? '✅ 0 Items Pending (Plan Live)' : `⚠️ ${flaggedItems.length} Flagged Item Requires Review`}
            </span>
          </div>
        </div>
      </div>

      {flaggedItems.length === 0 ? (
        <div className="clinical-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--emerald-50)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            All Ambiguous Items Have Been Resolved!
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0.5rem auto 1.5rem auto' }}>
            The discharge recovery plan has passed clinical verification and is now active and live for <strong>{patient.name}</strong> and family caregiver <strong>Priya Sharma</strong>.
          </p>
          <button className="btn-primary" onClick={onGoToFamilyPlan}>
            <span>View Active Family Schedule</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.4fr)', gap: '1.5rem' }}>
          {/* Flagged Items Queue List */}
          <div className="clinical-card">
            <h3 className="card-title-lg" style={{ marginBottom: '1rem' }}>
              <AlertTriangle size={18} color="var(--amber-600)" />
              <span>Pending Ambiguity Queue ({flaggedItems.length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {flaggedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedItemId === item.id ? '2px solid var(--teal-600)' : '1px solid var(--border-light)',
                    background: selectedItemId === item.id ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      "{item.sourceText}"
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber-700)', background: '#fef3c7', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-pill)' }}>
                      Conf: {item.confidence}%
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--rose-600)', marginTop: '0.35rem', fontWeight: 500 }}>
                    ⚠️ {item.flagReason}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                    Source: Line {item.sourceLineNumber} of Discharge Summary
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Clarification & Sign-off Form */}
          {activeItem && (
            <div className="clinical-card">
              <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--teal-700)', fontWeight: 700 }}>
                  Clinical Resolution Terminal
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  Resolve "{activeItem.sourceText}"
                </h3>
              </div>

              <form onSubmit={handleApprove} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Clarified Medication Name *
                    </label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.25rem', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Strength / Dose *
                    </label>
                    <input
                      type="text"
                      value={editedStrength}
                      onChange={(e) => setEditedStrength(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.25rem', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Drug Form *
                    </label>
                    <input
                      type="text"
                      value={editedForm}
                      onChange={(e) => setEditedForm(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.25rem', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Frequency *
                    </label>
                    <input
                      type="text"
                      value={editedFrequencyCode}
                      onChange={(e) => setEditedFrequencyCode(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.25rem', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Plain-Language Family Instructions & Safeguards *
                  </label>
                  <textarea
                    rows={3}
                    value={editedTimingNotes}
                    onChange={(e) => setEditedTimingNotes(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Stamp size={16} color="var(--teal-600)" />
                    <span>Nurse Digital Signature & Audit Registration (FR-5.3)</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={nurseName}
                      onChange={(e) => setNurseName(e.target.value)}
                      placeholder="Nurse Name & Reg Number"
                      required
                      style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}
                    />
                    <input
                      type="text"
                      value={clinicalNote}
                      onChange={(e) => setClinicalNote(e.target.value)}
                      placeholder="Doctor consultation confirmation note"
                      required
                      style={{ width: '100%', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ color: 'var(--rose-600)' }}
                    onClick={() => onRemoveItem(activeItem.id)}
                    title="Reject and discard unverified instruction"
                  >
                    <Trash2 size={15} />
                    <span>Discard Item</span>
                  </button>

                  <button type="submit" className="btn-success" style={{ padding: '0.65rem 1.4rem' }}>
                    <Check size={16} />
                    <span>Digitally Sign & Publish to Family Plan</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
