import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Check, 
  Clock, 
  Volume2, 
  AlertTriangle, 
  Pill, 
  X,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { Patient, Dose } from '../types';
import { medicalAudio } from '../services/audioService';

interface DoseReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePatient: Patient;
  activeDose?: Dose;
  onConfirmDose: (doseId: string) => void;
}

export const DoseReminderModal: React.FC<DoseReminderModalProps> = ({
  isOpen,
  onClose,
  activePatient,
  activeDose,
  onConfirmDose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60); // 30 min grace window
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);

  // Play audio chime when modal opens
  useEffect(() => {
    if (isOpen) {
      medicalAudio.playReminderChime();
      const interval = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayDose = activeDose || {
    id: 'demo-dose-1',
    planItemId: 'med-metoprolol',
    medicineName: 'Tab Metoprolol Succinate',
    strength: '25 mg',
    form: 'Tablet',
    slot: 'Night',
    scheduledTime: '08:30 PM',
    instructions: 'After dinner (PC) · Check resting pulse is >60 bpm',
    status: 'pending' as const,
    dateStr: '2026-10-13',
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const handleTakeDose = () => {
    medicalAudio.playDoseSuccessPing();
    onConfirmDose(displayDose.id);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" style={{ border: '2px solid var(--teal-500)', boxShadow: '0 10px 40px rgba(6, 182, 212, 0.25)' }}>
        {/* Header with pulsing alert badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--teal-50)', border: '2px solid var(--teal-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-700)', animation: 'pulse-badge 1.5s infinite' }}>
              <BellRing size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Dose Reminder Alert
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Feature F3 · Real-time Scheduled Bedside Alarm
              </div>
            </div>
          </div>

          <button className="btn-outline" style={{ border: 'none', padding: '0.3rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Patient & Medicine Card */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Patient: <strong style={{ color: 'var(--text-primary)' }}>{activePatient.name}</strong> ({activePatient.age}y, Room Recovery)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: '#ffffff', border: '2px solid var(--teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-700)' }}>
              <Pill size={28} />
            </div>

            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {displayDose.medicineName}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', background: 'var(--teal-600)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)' }}>
                  {displayDose.strength}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {displayDose.instructions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grace Window Escalation Warning (FR-3.2) */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={20} color="var(--amber-600)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', color: '#92400e' }}>
            <strong>Grace Window Countdown:</strong>{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <br />
            If unconfirmed within 30 minutes, secondary escalation alert fires to Primary Caregiver <strong>Priya Sharma</strong> (+91 98711 54321).
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            className="btn-outline"
            onClick={() => {
              medicalAudio.playReminderChime();
            }}
            title="Replay hospital chime"
          >
            <Volume2 size={16} />
            <span>Replay Chime</span>
          </button>

          <button className="btn-outline" onClick={onClose}>
            Snooze 10 Mins
          </button>

          <button className="btn-success" style={{ padding: '0.65rem 1.25rem', fontSize: '0.92rem' }} onClick={handleTakeDose}>
            <Check size={18} />
            <span>Confirm Dose Taken</span>
          </button>
        </div>
      </div>
    </div>
  );
};
