import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  X, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Pill, 
  Sparkles,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { Dose, Slot, Patient } from '../types';
import { medicalAudio } from '../services/audioService';

interface MedicineCalendarProps {
  doses: Dose[];
  onUpdateDoseStatus: (doseId: string, status: 'taken' | 'skipped', skipReason?: string) => void;
  activePatient: Patient;
  onOpenTestReminder: () => void;
}

export const MedicineCalendar: React.FC<MedicineCalendarProps> = ({
  doses,
  onUpdateDoseStatus,
  activePatient,
  onOpenTestReminder,
}) => {
  const [activeView, setActiveView] = useState<'day' | 'week'>('day');
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [skipModalDoseId, setSkipModalDoseId] = useState<string | null>(null);
  const [skipReasonText, setSkipReasonText] = useState<string>('Patient felt nauseous');

  const slotIcons: Record<Slot, React.ReactNode> = {
    Morning: <Sun size={18} color="#d97706" />,
    Afternoon: <Sun size={18} color="#ea580c" />,
    Night: <Sunset size={18} color="#4f46e5" />,
    Bedtime: <Moon size={18} color="#1e1b4b" />,
    SOS: <AlertCircle size={18} color="#dc2626" />,
  };

  const slotTimes: Record<Slot, string> = {
    Morning: '08:00 AM (Post-Breakfast)',
    Afternoon: '01:00 PM (Post-Lunch)',
    Night: '08:30 PM (Post-Dinner)',
    Bedtime: '10:00 PM (Before Sleep)',
    SOS: 'Only if needed (As required)',
  };

  const slotsOrder: Slot[] = ['Morning', 'Afternoon', 'Night', 'Bedtime', 'SOS'];

  // Week days
  const weekDays = [
    { label: 'Tue, Oct 13 (Today)', offset: 0, date: '13 Oct' },
    { label: 'Wed, Oct 14', offset: 1, date: '14 Oct' },
    { label: 'Thu, Oct 15', offset: 2, date: '15 Oct' },
    { label: 'Fri, Oct 16', offset: 3, date: '16 Oct' },
    { label: 'Sat, Oct 17', offset: 4, date: '17 Oct' },
    { label: 'Sun, Oct 18', offset: 5, date: '18 Oct' },
    { label: 'Mon, Oct 19', offset: 6, date: '19 Oct' },
  ];

  // Future dates (offset 1 to 6 = Oct 14 to Oct 19) state:
  const [futureDayDoses, setFutureDayDoses] = useState<Record<number, Record<string, { status: 'taken' | 'skipped'; confirmedAt?: string; skipReason?: string }>>>({});

  // Active doses: Oct 13 shows live today status, Oct 14-19 are strictly UNTAKEN by default
  const activeDoses = doses.map((d) => {
    if (selectedDayOffset === 0) {
      return d; // Today (Oct 13): live doses
    }

    const override = futureDayDoses[selectedDayOffset]?.[d.id];
    if (override) {
      return {
        ...d,
        status: override.status,
        confirmedAt: override.confirmedAt,
        skipReason: override.skipReason,
      };
    }

    // Oct 14-19: strictly UNTAKEN
    return {
      ...d,
      status: 'pending' as const,
      confirmedAt: undefined,
      skipReason: undefined,
    };
  });

  // Calculate adherence statistics for the active selected day
  const totalDoses = activeDoses.length;
  const takenDoses = activeDoses.filter((d) => d.status === 'taken').length;
  const adherencePercentage = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  const handleMarkTaken = (doseId: string) => {
    medicalAudio.playDoseSuccessPing();
    if (selectedDayOffset === 0) {
      onUpdateDoseStatus(doseId, 'taken');
    } else {
      setFutureDayDoses((prev) => ({
        ...prev,
        [selectedDayOffset]: {
          ...(prev[selectedDayOffset] || {}),
          [doseId]: {
            status: 'taken',
            confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        },
      }));
    }

    // Trigger subtle celebratory confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0891b2', '#10b981', '#38bdf8'],
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  const handleConfirmSkip = () => {
    if (skipModalDoseId) {
      if (selectedDayOffset === 0) {
        onUpdateDoseStatus(skipModalDoseId, 'skipped', skipReasonText);
      } else {
        setFutureDayDoses((prev) => ({
          ...prev,
          [selectedDayOffset]: {
            ...(prev[selectedDayOffset] || {}),
            [skipModalDoseId]: {
              status: 'skipped',
              skipReason: skipReasonText,
            },
          },
        }));
      }
      setSkipModalDoseId(null);
    }
  };

  return (
    <div>
      {/* Top Controls & Daily Adherence Bar */}
      <div className="clinical-card" style={{ marginBottom: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Daily Recovery & Medicine Schedule
              </h2>
              <span style={{ fontSize: '0.8rem', background: 'var(--teal-50)', color: 'var(--teal-700)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, border: '1px solid var(--teal-100)' }}>
                Family Caregiver Mode
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Clear plain-language slots for {activePatient.name}. Ticking off doses updates the patient timeline for the next doctor visit.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* View Switcher: Day vs Week */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.2rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)' }}>
              <button
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  background: activeView === 'day' ? '#ffffff' : 'transparent',
                  color: activeView === 'day' ? 'var(--teal-700)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  boxShadow: activeView === 'day' ? 'var(--shadow-sm)' : 'none',
                }}
                onClick={() => setActiveView('day')}
              >
                Today's Slots
              </button>
              <button
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  background: activeView === 'week' ? '#ffffff' : 'transparent',
                  color: activeView === 'week' ? 'var(--teal-700)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  boxShadow: activeView === 'week' ? 'var(--shadow-sm)' : 'none',
                }}
                onClick={() => setActiveView('week')}
              >
                Week View
              </button>
            </div>

            <button className="btn-outline" onClick={onOpenTestReminder} title="Test push notification & audible chime">
              <Bell size={15} />
              <span>Simulate Alarm</span>
            </button>
          </div>
        </div>

        {/* Adherence Progress Bar */}
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--teal-600)" />
              {selectedDayOffset === 0 ? "Today's Adherence Rate" : `${weekDays[selectedDayOffset].label} Adherence`}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: adherencePercentage >= 75 ? 'var(--emerald-600)' : 'var(--teal-700)' }}>
              {selectedDayOffset === 0 
                ? `${takenDoses} of ${totalDoses} doses taken (${adherencePercentage}%)`
                : `${takenDoses} of ${totalDoses} taken · ${totalDoses - takenDoses} Untaken`}
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${adherencePercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Week Selector Bar when in Week View */}
      {activeView === 'week' && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {weekDays.map((day) => (
            <button
              key={day.offset}
              onClick={() => setSelectedDayOffset(day.offset)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: selectedDayOffset === day.offset ? 'var(--teal-600)' : '#ffffff',
                color: selectedDayOffset === day.offset ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: selectedDayOffset === day.offset ? '0 4px 10px rgba(8, 145, 178, 0.25)' : 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 500 }}>{day.date}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '0.2rem' }}>
                {day.offset === 0 ? 'Today' : day.label.split(',')[0]}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Slots Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {slotsOrder.map((slot) => {
          const slotDoses = activeDoses.filter((d) => d.slot === slot);
          if (slotDoses.length === 0) return null;

          const slotAllTaken = slotDoses.every((d) => d.status === 'taken');

          return (
            <div key={slot} className="slot-section">
              <div className="slot-header">
                <div className="slot-title">
                  {slotIcons[slot]}
                  <span>{slot} Slot</span>
                  {slotAllTaken ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--emerald-600)', background: 'var(--emerald-50)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, border: '1px solid var(--emerald-100)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={13} />
                      Completed
                    </span>
                  ) : selectedDayOffset > 0 ? (
                    <span style={{ fontSize: '0.72rem', color: '#b45309', background: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', fontWeight: 600, border: '1px solid #fde68a' }}>
                      Untaken (Scheduled)
                    </span>
                  ) : null}
                </div>
                <div className="slot-time-badge">{slotTimes[slot]}</div>
              </div>

              <div>
                {slotDoses.map((dose) => {
                  const isTaken = dose.status === 'taken';
                  const isSkipped = dose.status === 'skipped';

                  return (
                    <div key={dose.id} className={`dose-item-card ${isTaken ? 'is-taken' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--radius-md)',
                            background: isTaken ? 'var(--emerald-100)' : isSkipped ? '#fee2e2' : 'var(--teal-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isTaken ? 'var(--emerald-700)' : isSkipped ? 'var(--rose-700)' : 'var(--teal-700)',
                            flexShrink: 0,
                          }}
                        >
                          <Pill size={20} />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <span className="dose-med-title">{dose.medicineName}</span>
                            <span className="dose-strength-badge">{dose.strength}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({dose.form})</span>
                          </div>

                          <div className="dose-timing-sub">
                            <span>{dose.instructions}</span>
                            <span>·</span>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                              Scheduled: {dose.scheduledTime}
                            </span>
                          </div>

                          {isTaken && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--emerald-700)', fontWeight: 600, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={13} />
                              Confirmed taken at {dose.confirmedAt}
                            </div>
                          )}

                          {!isTaken && !isSkipped && selectedDayOffset > 0 && (
                            <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={12} />
                              Untaken · Scheduled for {weekDays[selectedDayOffset].date}
                            </div>
                          )}

                          {isSkipped && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--rose-700)', fontWeight: 600, marginTop: '0.2rem' }}>
                              Skipped: {dose.skipReason || 'Reason not specified'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {!isTaken && (
                          <button
                            className="btn-success"
                            onClick={() => handleMarkTaken(dose.id)}
                            title="Confirm dose taken"
                          >
                            <Check size={16} />
                            <span>Mark Taken</span>
                          </button>
                        )}

                        {isTaken && (
                          <span style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', fontWeight: 700, padding: '0.4rem 0.8rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
                            ✓ Taken
                          </span>
                        )}

                        {!isSkipped && !isTaken && (
                          <button
                            className="btn-outline"
                            style={{ color: 'var(--rose-600)' }}
                            onClick={() => setSkipModalDoseId(dose.id)}
                            title="Skip this dose with reason"
                          >
                            <X size={15} />
                            <span>Skip</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip Reason Modal */}
      {skipModalDoseId && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Reason for Skipping Dose
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              A record will be saved in the patient timeline for review by Dr. Vikram Anand.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {['Patient felt nauseous', 'Medication out of stock / awaiting refill', 'Doctor advised temporary pause', 'Patient asleep / unarousable', 'Other reason'].map((reason) => (
                <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer', padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: skipReasonText === reason ? '#f1f5f9' : 'transparent' }}>
                  <input
                    type="radio"
                    name="skipReason"
                    value={reason}
                    checked={skipReasonText === reason}
                    onChange={(e) => setSkipReasonText(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn-outline" onClick={() => setSkipModalDoseId(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleConfirmSkip}>
                Record Skipped Dose
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
