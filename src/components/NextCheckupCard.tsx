import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileCheck, 
  Download, 
  CheckSquare, 
  Square,
  AlertCircle
} from 'lucide-react';
import { Patient } from '../types';
import { calculateFollowUpDate } from '../services/rulesEngine';

interface NextCheckupCardProps {
  patient: Patient;
}

export const NextCheckupCard: React.FC<NextCheckupCardProps> = ({ patient }) => {
  const { targetDate, daysRemaining } = calculateFollowUpDate(
    patient.dischargeDate,
    patient.nextCheckupDays
  );

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    summary: true,
    ecg: false,
    bpDiary: true,
    medicineStrips: true,
    fastingBloods: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadCalendarFile = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Going Home Right//Personal CareTaker//EN
BEGIN:VEVENT
SUMMARY:Cardiology Follow-Up: ${patient.name}
DESCRIPTION:Discharge review with ${patient.treatingDoctor.name} at ${patient.hospitalName}. Carry ECG and medicine strip.
DTSTART:20261020T100000Z
DTEND:20261020T110000Z
LOCATION:${patient.nextCheckupDepartment}, ${patient.hospitalName}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FollowUp_${patient.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="clinical-card">
      <div className="card-header-flex">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 className="card-title-lg">
              <Calendar size={18} color="var(--teal-600)" />
              <span>Next Doctor Check-Up</span>
            </h3>
            <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: 'var(--emerald-700)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, border: '1px solid #a7f3d0' }}>
              In {patient.nextCheckupDays} Days
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Feature F4 · Converted from "Review after {patient.nextCheckupDays} days" (Discharge Sheet Line 22)
          </div>
        </div>

        <button className="btn-outline" onClick={downloadCalendarFile} title="Download .ics calendar appointment">
          <Download size={14} />
          <span>Add to Phone Calendar</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(300px, 1.2fr)', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* Date Box */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)', border: '1px solid var(--border-teal)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--teal-700)' }}>
              Appointment Date
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {targetDate}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} color="var(--teal-600)" />
              <span>Recommended Slot: 10:00 AM - 12:30 PM OPD</span>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-teal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <User size={14} color="var(--teal-600)" />
              <span>{patient.treatingDoctor.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <MapPin size={14} color="var(--teal-600)" />
              <span>{patient.nextCheckupDepartment}</span>
            </div>
          </div>
        </div>

        {/* Doctor Visit Prep Checklist */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileCheck size={16} color="var(--teal-600)" />
            <span>Doctor Visit Prep Checklist</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {[
              { key: 'summary', text: 'Carry original Apollo Discharge Summary file' },
              { key: 'ecg', text: 'Fresh Resting 12-lead ECG before OPD consultation' },
              { key: 'bpDiary', text: '7-day home Blood Pressure & Pulse log' },
              { key: 'medicineStrips', text: 'Bring current medicine foils/strips to show doctor' },
              { key: 'fastingBloods', text: 'Fasting Serum Creatinine & Potassium panel' },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.82rem',
                  color: checklist[item.key] ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: checklist[item.key] ? 'none' : 'none',
                  cursor: 'pointer',
                  padding: '0.35rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: checklist[item.key] ? '#ffffff' : 'transparent',
                  border: checklist[item.key] ? '1px solid var(--border-light)' : '1px solid transparent',
                }}
              >
                {checklist[item.key] ? (
                  <CheckSquare size={16} color="var(--teal-600)" />
                ) : (
                  <Square size={16} color="#94a3b8" />
                )}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
