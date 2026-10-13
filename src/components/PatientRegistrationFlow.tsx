import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Phone, 
  Hash, 
  Stethoscope, 
  ArrowRight, 
  Sparkles,
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Patient } from '../types';

interface PatientRegistrationFlowProps {
  initialPatient: Patient;
  onSavePatientAndContinue: (patientData: Patient) => void;
  onBackToLogin: () => void;
}

export const PatientRegistrationFlow: React.FC<PatientRegistrationFlowProps> = ({
  initialPatient,
  onSavePatientAndContinue,
  onBackToLogin,
}) => {
  const [name, setName] = useState<string>(initialPatient.name);
  const [patientId, setPatientId] = useState<string>('AH-2026-8819');
  const [phone, setPhone] = useState<string>('+91 98102 33445');
  const [hospitalName, setHospitalName] = useState<string>(initialPatient.hospitalName);
  const [age, setAge] = useState<number>(initialPatient.age);
  const [gender, setGender] = useState<string>(initialPatient.gender);
  const [admissionReason, setAdmissionReason] = useState<string>(initialPatient.admissionReason);
  const [doctorName, setDoctorName] = useState<string>(initialPatient.treatingDoctor.name);
  const [doctorPhone, setDoctorPhone] = useState<string>(initialPatient.treatingDoctor.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Patient = {
      ...initialPatient,
      name: name.trim() || 'Kamla Devi',
      age: Number(age) || 68,
      gender,
      admissionReason: admissionReason.trim() || 'Post-PCI Stenting Recovery',
      hospitalName: hospitalName.trim() || 'Apollo Hospital & Heart Institute',
      treatingDoctor: {
        ...initialPatient.treatingDoctor,
        name: doctorName.trim() || 'Dr. Vikram Anand, MD',
        phone: doctorPhone.trim() || '9898989898',
      },
      documentTitle: `${hospitalName} Discharge Summary · IPD #${patientId}`,
    };
    onSavePatientAndContinue(updated);
  };

  const handlePreFillKamla = () => {
    setName('Kamla Devi');
    setPatientId('AH-2026-8819');
    setPhone('+91 98102 33445');
    setHospitalName('Apollo Hospital & Heart Institute, New Delhi');
    setAge(68);
    setGender('Female');
    setAdmissionReason('Acute Coronary Syndrome (NSTEMI) · Post-PCI Stenting to LAD');
    setDoctorName('Dr. Vikram Anand, MD, DM');
    setDoctorPhone('9898989898');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {/* Page Title & Intro */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            Patient Hospital Profile Registration
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Enter patient identity and hospital contact details to link with incoming discharge documents.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={handlePreFillKamla}
          style={{ padding: '0.6rem 1.15rem' }}
          title="Auto-fill patient scenario from PRD problem statement"
        >
          <Sparkles size={16} color="var(--teal-600)" />
          <span>Pre-fill Kamla Devi Profile</span>
        </button>
      </div>

      {/* Spacious 2-Column Responsive Grid Layout */}
      <div className="registration-grid">
        {/* Left Column (2/3 width on desktop): Modern Form Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Demographics & Identity */}
          <div className="clinical-card">
            <div className="card-header-flex">
              <div>
                <h3 className="card-title-lg">
                  <User size={20} color="var(--teal-600)" />
                  <span>Patient Identity & Demographics</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Legal medical records identification
                </p>
              </div>
              <span style={{ fontSize: '0.74rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                Section 1
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>
                    Patient Full Name <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g. Kamla Devi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="modern-input"
                  />
                  <User size={16} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>
                    Hospital IPD / MRN Number <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g. AH-2026-8819"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="modern-input"
                  />
                  <Hash size={16} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>
                    Age (Years) <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                    className="modern-input no-icon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>
                    Gender <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="modern-select no-icon"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hospital & Medical Care Team */}
          <div className="clinical-card">
            <div className="card-header-flex">
              <div>
                <h3 className="card-title-lg">
                  <Building2 size={20} color="var(--teal-600)" />
                  <span>Hospital Facility & Medical Contacts</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Discharge hospital and emergency physician hotlines
                </p>
              </div>
              <span style={{ fontSize: '0.74rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                Section 2
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>
                    Admitted Hospital Facility <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g. Apollo Hospital & Heart Institute, New Delhi"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                    className="modern-input"
                  />
                  <Building2 size={16} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>
                    Family Caregiver Phone <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="+91 98102 33445"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="modern-input"
                  />
                  <Phone size={16} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>
                    Treating Attending Physician <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g. Dr. Vikram Anand, MD, DM"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                    className="modern-input"
                  />
                  <Stethoscope size={16} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>
                    Doctor 24/7 Hotline Number <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="+91 98100 12345"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    required
                    className="modern-input"
                  />
                  <Phone size={16} className="input-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Diagnosis */}
          <div className="clinical-card">
            <div className="card-header-flex">
              <div>
                <h3 className="card-title-lg">
                  <HeartPulse size={20} color="var(--teal-600)" />
                  <span>Clinical Admission & Diagnosis Summary</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Primary condition treated during hospitalization
                </p>
              </div>
              <span style={{ fontSize: '0.74rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                Section 3
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>
                  Primary Diagnosis / Reason for Hospitalization <span className="required-asterisk">*</span>
                </span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Acute Coronary Syndrome (NSTEMI) · Post-PCI Stenting to LAD · Essential Hypertension"
                value={admissionReason}
                onChange={(e) => setAdmissionReason(e.target.value)}
                required
                className="modern-textarea no-icon"
              />
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on desktop): Live Real-Time Clinical Profile Preview Card */}
        <div style={{ position: 'sticky', top: '5.5rem' }}>
          <div className="clinical-card" style={{ border: '2px solid var(--teal-200)', background: 'linear-gradient(180deg, #ffffff, #f0fdfa)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--teal-800)' }}>
                Live Digital Patient Badge
              </span>
              <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                Verified Format
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--teal-700), var(--teal-600))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
                  flexShrink: 0,
                }}
              >
                {name ? name.charAt(0).toUpperCase() : 'P'}
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {name || 'Patient Name'}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {age} Y / {gender} · IPD #{patientId || 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Hospital Facility
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {hospitalName || 'Hospital Name'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Primary Diagnosis
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--teal-900)', fontWeight: 600, marginTop: '0.1rem' }}>
                  {admissionReason || 'Diagnosis not entered yet'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Attending Doctor</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {doctorName || 'Dr. Assigned'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Emergency Hotline</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--teal-700)' }}>
                    {doctorPhone || 'Hotline Phone'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={20} color="var(--emerald-600)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Ready to link with discharge summaries via <strong>Groq AI OCR Pipeline</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar with Micro-interactions */}
      <div className="sticky-action-footer">
        <button
          type="button"
          className="btn-outline"
          onClick={onBackToLogin}
        >
          Back to Login
        </button>

        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '0.8rem 1.85rem', fontSize: '0.94rem' }}
        >
          <span>Insert Discharge Documents</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
};
