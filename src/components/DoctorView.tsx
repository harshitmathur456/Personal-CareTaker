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
  Lock,
  Calendar,
  PhoneCall,
  Printer,
  Save,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { Patient, Dose } from '../types';

interface DoctorViewProps {
  patient: Patient;
  doses: Dose[];
}

export const DoctorView: React.FC<DoctorViewProps> = ({ patient, doses }) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [selectedDocTab, setSelectedDocTab] = useState<'summary' | 'lab'>('summary');
  const [shareToken] = useState<string>('dr_tok_99bf2a48');
  const [tokenHoursRemaining] = useState<number>(47);

  // Next Visit Prep Notes State
  const [preVisitVitals, setPreVisitVitals] = useState<{ bp: string; pulse: string; spo2: string }>({
    bp: '124/80 mmHg',
    pulse: '72 bpm',
    spo2: '98%',
  });
  const [clinicalAssessment, setClinicalAssessment] = useState<string>(
    'Patient Kamla Devi is 7 days post-PCI to LAD. Dual antiplatelet (Ecosprin + Ticagrelor/Clopidogrel equivalent) compliance verified. No episodes of resting angina or orthopnea reported at home.'
  );
  const [nextVisitPlan, setNextVisitPlan] = useState<string>(
    '1. Repeat ECG at next visit on 2026-10-20.\n2. Review renal parameters (Creatinine 0.92 mg/dL stable).\n3. Titrate Metoprolol to 50mg if resting HR remains > 80 bpm.\n4. Confirm family caregiver medication compliance.'
  );
  const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);

  const shareUrl = `https://goinghomeright.in/dr-review/${shareToken}?exp=48h`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveNextVisitNote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 3000);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const skippedCount = doses.filter((d) => d.status === 'skipped').length;
  const adherenceRate = doses.length > 0 ? Math.round((takenCount / doses.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Consulting Doctor Header Banner with Expiring Link Generator */}
      <div className="clinical-card" style={{ background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)', border: '1px solid var(--border-teal)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal-700)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Stethoscope size={15} />
              Consulting Doctor Portal · Attending Physician Review
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              Dr. Vikram Anand, MD, DM · Cardiology Review: {patient.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <span>Senior Consultant Interventional Cardiologist</span>
              <span>•</span>
              <span>Reg: <strong>DMC-61042</strong></span>
              <span>•</span>
              <span style={{ color: 'var(--teal-800)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <PhoneCall size={14} />
                Direct Hotline: 9898989898
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-outline" 
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem', background: '#ffffff' }}
              onClick={handlePrintSummary}
              title="Print Clinical Discharge Summary & Next Visit Prep"
            >
              <Printer size={15} />
              <span>Print Visit Prep</span>
            </button>

            {/* Expiring Share Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#ffffff', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-700)' }}>
                <Lock size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Expiring Secure Link
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--teal-800)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  <span>{tokenHoursRemaining}h:45m left</span>
                </div>
              </div>
              <button className="btn-outline" style={{ padding: '0.3rem 0.55rem', fontSize: '0.78rem' }} onClick={handleCopyLink}>
                {copiedLink ? <Check size={13} color="var(--emerald-600)" /> : <Copy size={13} />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen Grid: Attached Printed Document Beside Adherence Timeline */}
      <div className="split-doctor-grid">
        {/* Left Pane: Original Hospital Record Viewer with Attached Printed Paper */}
        <div className="clinical-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title-lg">
                <FileText size={18} color="var(--teal-600)" />
                <span>Original Hospital Records Vault</span>
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Attached Physical Discharge Document · Verified by Clinical Desk
              </div>
            </div>

            {/* Document Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
              <button
                style={{
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedDocTab === 'summary' ? '#ffffff' : 'transparent',
                  color: selectedDocTab === 'summary' ? 'var(--teal-800)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  boxShadow: selectedDocTab === 'summary' ? 'var(--shadow-sm)' : 'none',
                }}
                onClick={() => setSelectedDocTab('summary')}
              >
                Discharge Sheet (Attached)
              </button>

              <button
                style={{
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedDocTab === 'lab' ? '#ffffff' : 'transparent',
                  color: selectedDocTab === 'lab' ? 'var(--teal-800)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  boxShadow: selectedDocTab === 'lab' ? 'var(--shadow-sm)' : 'none',
                }}
                onClick={() => setSelectedDocTab('lab')}
              >
                Labs Panel
              </button>
            </div>
          </div>

          {/* Tab 1: Discharge Summary Styled Like an Attached Printed Paper */}
          {selectedDocTab === 'summary' && (
            <div className="doc-paper-container">
              {/* Metallic Binder Clip Clamp Attached at Top */}
              <div className="paper-clip-clamp" title="Attached Physical Hospital Document" />

              <div className="doc-sheet-paper" style={{ maxHeight: '580px', overflowY: 'auto' }}>
                {/* Hospital Printed Letterhead */}
                <div style={{ textAlign: 'center', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    ✦ Apollo Hospitals Enterprise Limited · Clinical Copy ✦
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
                    {patient.hospitalName}
                  </strong>
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700, marginTop: '0.2rem' }}>
                    DISCHARGE RECOVERY SUMMARY · IPD #AH-2026-8819
                  </div>
                </div>

                {/* Patient Information & Attending Doctor */}
                <div style={{ fontSize: '0.83rem', lineHeight: '1.75', color: '#1e293b' }}>
                  <div><strong>Patient:</strong> {patient.name} ({patient.age}Y/{patient.gender})</div>
                  <div><strong>Discharged:</strong> {patient.dischargeDate}</div>
                  <div><strong>Primary Diagnosis:</strong> {patient.admissionReason}</div>
                  <div><strong>Attending:</strong> {patient.treatingDoctor.name} ({patient.treatingDoctor.regNo}) · <strong>Ph:</strong> 9898989898</div>
                  <br />
                  <strong style={{ textDecoration: 'underline', color: '#0f172a' }}>Discharge Medications:</strong>
                  <div>1. Tab Ecosprin 75mg OD PC (Line 14)</div>
                  <div>2. Tab Metoprolol Succinate 25mg BD PC (Line 15)</div>
                  <div>3. Tab Atorvastatin 40mg HS (Line 16)</div>
                  <div>4. Tab Ramipril 2.5mg OD (Line 17)</div>
                  <div>5. Tab Sorbitrate 5mg SOS sublingual (Verified by Nurse Shalini)</div>
                  <br />
                  <strong style={{ textDecoration: 'underline', color: '#0f172a' }}>Instructions & Diet:</strong>
                  <div>- Review after {patient.nextCheckupDays} days in {patient.nextCheckupDepartment}.</div>
                  <div>- Low salt (&lt;2g/day), fluid restriction 1.5L max.</div>
                  <div>- Warning: Emergency call if severe chest pain or syncope.</div>
                </div>

                {/* Official Verification Rubber Stamp */}
                <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
                  <div className="hospital-stamp-badge">
                    ✓ Verified Hospital Record · IPD-8819
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'right', lineHeight: '1.4' }}>
                    <strong>Dr. Vikram Anand, MD, DM</strong><br />
                    Cardiology Reg: DMC-61042<br />
                    Direct Contact: 9898989898
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Lab Diagnostics Panel */}
          {selectedDocTab === 'lab' && (
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ marginBottom: '0.75rem', fontSize: '0.84rem', fontWeight: 700, color: 'var(--teal-900)' }}>
                Admission & Pre-Discharge Biochemistry Panel
              </div>
              <table style={{ width: '100%', fontSize: '0.82rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #cbd5e1' }}>
                    <th style={{ padding: '0.5rem' }}>Biomarker</th>
                    <th style={{ padding: '0.5rem' }}>Result</th>
                    <th style={{ padding: '0.5rem' }}>Ref Range</th>
                    <th style={{ padding: '0.5rem' }}>Clinical Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>Serum Creatinine</td>
                    <td style={{ padding: '0.5rem', fontWeight: 700 }}>0.92 mg/dL</td>
                    <td style={{ padding: '0.5rem', color: '#64748b' }}>0.6 - 1.2</td>
                    <td style={{ padding: '0.5rem', color: 'var(--emerald-600)', fontWeight: 700 }}>Normal</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>Serum Potassium (K+)</td>
                    <td style={{ padding: '0.5rem', fontWeight: 700 }}>4.3 mEq/L</td>
                    <td style={{ padding: '0.5rem', color: '#64748b' }}>3.5 - 5.0</td>
                    <td style={{ padding: '0.5rem', color: 'var(--emerald-600)', fontWeight: 700 }}>Normal</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>HbA1c</td>
                    <td style={{ padding: '0.5rem', fontWeight: 700 }}>6.2 %</td>
                    <td style={{ padding: '0.5rem', color: '#64748b' }}>&lt; 6.5</td>
                    <td style={{ padding: '0.5rem', color: 'var(--emerald-600)', fontWeight: 700 }}>Controlled</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>Troponin-I Peak</td>
                    <td style={{ padding: '0.5rem', fontWeight: 700 }}>3.4 ng/mL</td>
                    <td style={{ padding: '0.5rem', color: '#64748b' }}>&lt; 0.04</td>
                    <td style={{ padding: '0.5rem', color: 'var(--amber-700)', fontWeight: 700 }}>Resolving Post-PCI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Pane: Extracted Timeline & Home Recovery Adherence */}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '580px', overflowY: 'auto' }}>
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

      {/* Feature: Consulting Doctor Next Visit Preparation & Clinical Planning */}
      <div className="clinical-card" style={{ border: '1.5px solid var(--teal-200)', background: '#ffffff' }}>
        <div className="card-header-flex">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--teal-700)', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Calendar size={14} />
              Next OPD Visit Preparation & Clinical Assessment
            </div>
            <h3 className="card-title-lg" style={{ marginTop: '0.2rem' }}>
              Follow-Up Evaluation Plan for Patient's Next Visit (2026-10-20)
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Scheduled in <strong>{patient.nextCheckupDepartment}</strong> with <strong>Dr. Vikram Anand</strong> (Hotline: 9898989898)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isNoteSaved && (
              <span style={{ fontSize: '0.8rem', color: 'var(--emerald-700)', fontWeight: 700, background: '#ecfdf5', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={14} />
                Clinical Notes Saved to Chart
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSaveNextVisitNote} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Vitals Summary for Next Visit */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Blood Pressure (Target &lt; 130/80)</span>
              </label>
              <input
                type="text"
                className="modern-input"
                value={preVisitVitals.bp}
                onChange={(e) => setPreVisitVitals({ ...preVisitVitals, bp: e.target.value })}
                placeholder="120/80 mmHg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Resting Heart Rate (Target 60-75 bpm)</span>
              </label>
              <input
                type="text"
                className="modern-input"
                value={preVisitVitals.pulse}
                onChange={(e) => setPreVisitVitals({ ...preVisitVitals, pulse: e.target.value })}
                placeholder="72 bpm"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Room Air SpO2</span>
              </label>
              <input
                type="text"
                className="modern-input"
                value={preVisitVitals.spo2}
                onChange={(e) => setPreVisitVitals({ ...preVisitVitals, spo2: e.target.value })}
                placeholder="98%"
              />
            </div>
          </div>

          {/* Assessment & Clinical Observations */}
          <div className="form-group">
            <label className="form-label">
              <span>Attending Physician Clinical Notes for Next Visit</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--teal-700)' }}>Editable by Dr. Vikram Anand</span>
            </label>
            <textarea
              className="modern-input"
              rows={3}
              value={clinicalAssessment}
              onChange={(e) => setClinicalAssessment(e.target.value)}
              placeholder="Clinical status, chest pain evaluation, stent follow-up..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Clinical Action Plan for Next Visit */}
          <div className="form-group">
            <label className="form-label">
              <span>Orders & Titration Plan for Next Visit</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Instructions to be given to patient at OPD review</span>
            </label>
            <textarea
              className="modern-input"
              rows={3}
              value={nextVisitPlan}
              onChange={(e) => setNextVisitPlan(e.target.value)}
              placeholder="Titration plan, diagnostic investigations..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={handlePrintSummary}
            >
              <Printer size={15} />
              <span>Print Next Visit Handout</span>
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              <Save size={15} />
              <span>Save Next Visit Clinical Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorView;
