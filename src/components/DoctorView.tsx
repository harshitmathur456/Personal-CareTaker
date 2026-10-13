import React, { useState } from 'react';
import { 
  Stethoscope, 
  Share2, 
  QrCode, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  History,
  Lock
} from 'lucide-react';
import { Patient, Dose } from '../types';

interface DoctorViewProps {
  patient: Patient;
  doses: Dose[];
}

export const DoctorView: React.FC<DoctorViewProps> = ({ patient, doses }) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [selectedDocTab, setSelectedDocTab] = useState<'summary' | 'ecg' | 'lab'>('summary');
  const [shareToken, setShareToken] = useState<string>('dr_tok_99bf2a48');
  const [tokenHoursRemaining, setTokenHoursRemaining] = useState<number>(47);

  const shareUrl = `https://goinghomeright.in/dr-review/${shareToken}?exp=48h`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const skippedCount = doses.filter((d) => d.status === 'skipped').length;
  const adherenceRate = doses.length > 0 ? Math.round((takenCount / doses.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Doctor Header Banner with Expiring Link Generator (FR-6.2) */}
      <div className="clinical-card" style={{ background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)', border: '1px solid var(--border-teal)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal-700)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Stethoscope size={15} />
              Feature F6 · Reports Keeper & Doctor OPD Split-Viewer
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              Treating Physician Review Portal: {patient.name}
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.25rem' }}>
              Designed for OPD follow-up visits. The doctor views the original hospital discharge record side-by-side with the digital timeline and real-world medicine adherence log.
            </p>
          </div>

          {/* Expiring Share Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ffffff', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-700)' }}>
              <Lock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Expiring Link Active
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--teal-800)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} />
                <span>Expires in {tokenHoursRemaining}h:45m</span>
              </div>
            </div>
            <button className="btn-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={handleCopyLink}>
              {copiedLink ? <Check size={14} color="var(--emerald-600)" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Screen Grid (FR-6.3: Original Document Beside Digital Timeline) */}
      <div className="split-doctor-grid">
        {/* Left Pane: Original Hospital Record Viewer */}
        <div className="clinical-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title-lg">
                <FileText size={18} color="var(--teal-600)" />
                <span>Original Hospital Records Vault</span>
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Immutable archive of hospital uploads
              </div>
            </div>

            {/* Document Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
              <button
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedDocTab === 'summary' ? '#ffffff' : 'transparent',
                  color: selectedDocTab === 'summary' ? 'var(--teal-700)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedDocTab('summary')}
              >
                Discharge Sheet
              </button>
              <button
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedDocTab === 'ecg' ? '#ffffff' : 'transparent',
                  color: selectedDocTab === 'ecg' ? 'var(--teal-700)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedDocTab('ecg')}
              >
                ECG Strip
              </button>
              <button
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedDocTab === 'lab' ? '#ffffff' : 'transparent',
                  color: selectedDocTab === 'lab' ? 'var(--teal-700)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedDocTab('lab')}
              >
                Labs Panel
              </button>
            </div>
          </div>

          {selectedDocTab === 'summary' && (
            <div className="doc-sheet-paper" style={{ maxHeight: '560px', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{patient.hospitalName}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DISCHARGE RECOVERY SUMMARY · IPD #AH-2026-8819</div>
              </div>
              <div style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                <strong>Patient:</strong> {patient.name} ({patient.age}Y/{patient.gender}) <br />
                <strong>Discharged:</strong> {patient.dischargeDate} <br />
                <strong>Primary Diagnosis:</strong> {patient.admissionReason} <br />
                <strong>Attending:</strong> {patient.treatingDoctor.name} ({patient.treatingDoctor.regNo}) <br />
                <br />
                <strong>Discharge Medications:</strong> <br />
                1. Tab Ecosprin 75mg OD PC (Line 14) <br />
                2. Tab Metoprolol Succinate 25mg BD PC (Line 15) <br />
                3. Tab Atorvastatin 40mg HS (Line 16) <br />
                4. Tab Ramipril 2.5mg OD (Line 17) <br />
                5. Tab Sorbitrate 5mg SOS sublingual (Verified by Nurse Shalini) <br />
                <br />
                <strong>Instructions & Diet:</strong> <br />
                - Review after {patient.nextCheckupDays} days in {patient.nextCheckupDepartment}. <br />
                - Low salt (&lt;2g/day), fluid restriction 1.5L max. <br />
                - Warning: Emergency call if severe chest pain or syncope.
              </div>
            </div>
          )}

          {selectedDocTab === 'ecg' && (
            <div style={{ background: '#f8fafc', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--teal-800)', fontWeight: 600 }}>
                [Digital 12-Lead ECG Vector Strip Attached]
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Sinus rhythm @ 72 bpm · Normalized ST segments post-LAD PCI · No fresh ischemia
              </p>
            </div>
          )}

          {selectedDocTab === 'lab' && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <table style={{ width: '100%', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.4rem' }}>Biomarker</th>
                    <th style={{ padding: '0.4rem' }}>Result</th>
                    <th style={{ padding: '0.4rem' }}>Ref Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.4rem' }}>Serum Creatinine</td>
                    <td style={{ padding: '0.4rem', fontWeight: 700 }}>0.92 mg/dL</td>
                    <td style={{ padding: '0.4rem', color: '#64748b' }}>0.6 - 1.2</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.4rem' }}>Serum Potassium</td>
                    <td style={{ padding: '0.4rem', fontWeight: 700 }}>4.3 mEq/L</td>
                    <td style={{ padding: '0.4rem', color: '#64748b' }}>3.5 - 5.0</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.4rem' }}>HbA1c</td>
                    <td style={{ padding: '0.4rem', fontWeight: 700 }}>6.2 %</td>
                    <td style={{ padding: '0.4rem', color: '#64748b' }}>&lt; 6.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Pane: Extracted Medicine Timeline & Home Recovery Adherence */}
        <div className="clinical-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title-lg">
                <History size={18} color="var(--emerald-600)" />
                <span>Extracted Timeline & Home Adherence</span>
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Real-world patient compliance since discharge
              </div>
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--emerald-700)', background: '#ecfdf5', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid #a7f3d0' }}>
              {adherenceRate}% Adherence
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '560px', overflowY: 'auto' }}>
            {doses.map((dose) => (
              <div
                key={dose.id}
                style={{
                  background: dose.status === 'taken' ? '#f0fdf4' : '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {dose.medicineName}
                    </span>
                    <span style={{ fontSize: '0.78rem', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                      {dose.strength}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Slot: {dose.slot} ({dose.scheduledTime}) · {dose.instructions}
                  </div>
                </div>

                <div>
                  {dose.status === 'taken' ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--emerald-700)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={14} />
                      Taken ({dose.confirmedAt})
                    </span>
                  ) : dose.status === 'skipped' ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--rose-700)', fontWeight: 700 }}>
                      Skipped ({dose.skipReason})
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--amber-700)', fontWeight: 600 }}>
                      Scheduled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
