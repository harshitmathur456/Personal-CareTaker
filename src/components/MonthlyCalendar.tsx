import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Pill, 
  CheckCircle2, 
  Clock, 
  Stethoscope, 
  Activity, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { Dose, Patient, PhysioSession } from '../types';

interface MonthlyCalendarProps {
  patient: Patient;
  doses: Dose[];
  physioSessions: PhysioSession[];
  onUpdateDoseStatus: (doseId: string, status: 'taken' | 'skipped', reason?: string) => void;
  onOpenTestReminder: () => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  patient,
  doses,
  physioSessions,
  onUpdateDoseStatus,
  onOpenTestReminder,
}) => {
  // Current view: October 2026 (matches discharge timeframe)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(13); // Default today (Oct 13)
  const [hoveredDayNumber, setHoveredDayNumber] = useState<number | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // First day offset (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Check special events on specific dates
  const isCheckupDay = (day: number) => {
    // Oct 20, 2026 is the 7-day review day
    return currentYear === 2026 && currentMonth === 9 && day === 20;
  };

  const isDischargeDay = (day: number) => {
    return currentYear === 2026 && currentMonth === 9 && day === 13;
  };

  const getPhysioForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return physioSessions.filter((s) => s.date === dateStr);
  };

  // Multi-day dose tracker: preserves that dates 14-19 are strictly UNTAKEN by default
  const [multiDayDoses, setMultiDayDoses] = useState<Record<string, Record<string, { status: 'taken' | 'skipped'; confirmedAt?: string }>>>({});

  // Selected date string & temporal classification
  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDayNumber).padStart(2, '0')}`;
  const selectedDayPhysio = getPhysioForDay(selectedDayNumber);
  const isSelectedDayCheckup = isCheckupDay(selectedDayNumber);
  const isToday = currentYear === 2026 && currentMonth === 9 && selectedDayNumber === 13;
  const isFutureDate = currentYear === 2026 && currentMonth === 9 ? selectedDayNumber > 13 : (currentYear > 2026 || currentMonth > 9);

  // Compute active doses for the selected day: Oct 13 has morning taken, while 14-19 are UNTAKEN
  const displayedDoses = doses.map((d) => {
    if (isToday) {
      return d; // Today: Oct 13 live doses
    }

    const dayOverride = multiDayDoses[selectedDateStr]?.[d.id];
    if (dayOverride) {
      return {
        ...d,
        status: dayOverride.status,
        confirmedAt: dayOverride.confirmedAt,
      };
    }

    // Oct 14-19 and future dates: strictly UNTAKEN
    return {
      ...d,
      status: 'pending' as const,
      confirmedAt: undefined,
      skipReason: undefined,
    };
  });

  const handleUpdateDayDose = (doseId: string, status: 'taken' | 'skipped') => {
    if (isToday) {
      onUpdateDoseStatus(doseId, status);
    } else {
      setMultiDayDoses((prev) => ({
        ...prev,
        [selectedDateStr]: {
          ...(prev[selectedDateStr] || {}),
          [doseId]: {
            status,
            confirmedAt: status === 'taken' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          },
        },
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Monthly Calendar View Header */}
      <div className="clinical-card" style={{ background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Recovery & Medicine Monthly Calendar
              </h2>
              <span style={{ fontSize: '0.78rem', background: 'var(--teal-50)', color: 'var(--teal-700)', padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, border: '1px solid var(--teal-100)' }}>
                Interactive 31-Day View
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Hover over any day to preview schedule badges. Click a date to inspect and tick doses, checkups, and therapy sessions.
            </p>
          </div>

          {/* Month Selector Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <button
                className="btn-outline"
                style={{ padding: '0.35rem 0.55rem', border: 'none', background: 'transparent' }}
                onClick={handlePrevMonth}
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>

              <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--teal-900)', minWidth: '150px', textAlign: 'center' }}>
                {monthNames[currentMonth]} {currentYear}
              </span>

              <button
                className="btn-outline"
                style={{ padding: '0.35rem 0.55rem', border: 'none', background: 'transparent' }}
                onClick={handleNextMonth}
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              className="btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
              onClick={() => {
                setCurrentMonth(9);
                setCurrentYear(2026);
                setSelectedDayNumber(13);
              }}
            >
              Jump to Today (Oct 13)
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--teal-600)' }}></span>
            <span>Today (Discharge Day)</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--emerald-600)' }}></span>
            <span>Prescribed Doses</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }}></span>
            <span>Doctor Check-Up (Oct 20)</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }}></span>
            <span>Physiotherapy Rehab</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left is 7x5 Calendar Grid, Right is Selected Day Detail Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(320px, 1fr)', gap: '1.5rem' }}>
        {/* Calendar Grid Container */}
        <div className="clinical-card" style={{ padding: '1.25rem' }}>
          {/* Weekday Names Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {weekDayNames.map((day) => (
              <div key={day} style={{ padding: '0.4rem 0' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.45rem' }}>
            {/* Blank tiles for previous month offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} style={{ minHeight: '85px', background: '#f8fafc', borderRadius: 'var(--radius-md)', opacity: 0.4 }}></div>
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDayNumber === day;
              const isToday = isDischargeDay(day);
              const hasCheckup = isCheckupDay(day);
              const dayPhysio = getPhysioForDay(day);
              const isHovered = hoveredDayNumber === day;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDayNumber(day)}
                  onMouseEnter={() => setHoveredDayNumber(day)}
                  onMouseLeave={() => setHoveredDayNumber(null)}
                  style={{
                    minHeight: '88px',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? '2px solid var(--teal-600)'
                      : hasCheckup
                      ? '2px solid #fecdd3'
                      : isHovered
                      ? '1px solid var(--teal-500)'
                      : '1px solid var(--border-light)',
                    background: isSelected
                      ? '#f0fdfa'
                      : isHovered
                      ? '#fafbfd'
                      : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    boxShadow: isHovered
                      ? '0 6px 14px rgba(8, 145, 178, 0.15)'
                      : isSelected
                      ? '0 4px 10px rgba(8, 145, 178, 0.18)'
                      : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {/* Day Number and Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: isSelected || isToday ? 800 : 600,
                        color: isToday
                          ? '#ffffff'
                          : isSelected
                          ? 'var(--teal-800)'
                          : 'var(--text-primary)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isToday ? 'var(--teal-600)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {day}
                    </span>

                    {isToday && (
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--teal-700)', textTransform: 'uppercase' }}>
                        Today
                      </span>
                    )}
                  </div>

                  {/* Badges / Dots on the Tile */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.35rem' }}>
                    {hasCheckup && (
                      <div
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: '#fff1f2',
                          color: '#e11d48',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          border: '1px solid #fecdd3',
                        }}
                      >
                        <Stethoscope size={9} />
                        <span>Check-Up</span>
                      </div>
                    )}

                    {dayPhysio.length > 0 && (
                      <div
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: '#f3e8ff',
                          color: '#7e22ce',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          border: '1px solid #e9d5ff',
                        }}
                      >
                        <Activity size={9} />
                        <span>Physio</span>
                      </div>
                    )}

                    {/* Doses indicator: Active during recovery month */}
                    {day >= 13 && day <= 28 && (
                      <div
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          background: isSelected ? 'var(--teal-100)' : day === 13 ? '#ecfdf5' : '#f8fafc',
                          color: day === 13 ? 'var(--emerald-800)' : 'var(--text-secondary)',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          border: day === 13 ? '1px solid #a7f3d0' : '1px solid var(--border-light)',
                        }}
                      >
                        <Pill size={9} color={day === 13 ? 'var(--emerald-600)' : 'var(--teal-600)'} />
                        <span>{day === 13 ? '1 Taken · 3 Due' : '4 Untaken'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Drawer Panel */}
        <div className="clinical-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--teal-700)', fontWeight: 800 }}>
                Date Schedule Details
              </span>
              {selectedDayNumber === 13 && (
                <span style={{ fontSize: '0.72rem', background: 'var(--teal-600)', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                  Today
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {new Date(currentYear, currentMonth, selectedDayNumber).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>
          </div>

          {/* Special Events for this Date */}
          {isSelectedDayCheckup && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#be123c', fontWeight: 800, fontSize: '0.9rem' }}>
                <Stethoscope size={16} />
                <span>Cardiology OPD Check-Up Consultation</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                With {patient.treatingDoctor.name} at {patient.nextCheckupDepartment}. Carry ECG report & medication strips!
              </div>
            </div>
          )}

          {selectedDayPhysio.length > 0 && (
            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#6d28d9', fontWeight: 800, fontSize: '0.9rem' }}>
                <Activity size={16} />
                <span>Physiotherapy Appointment</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {selectedDayPhysio[0].providerName} ({selectedDayPhysio[0].mode}) at {selectedDayPhysio[0].timeSlot}
              </div>
            </div>
          )}

          {/* Prescribed Doses for This Day */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Pill size={15} color="var(--teal-600)" />
                <span>Prescribed Medications ({displayedDoses.length} Doses)</span>
              </span>

              {isToday ? (
                <span style={{ fontSize: '0.74rem', color: 'var(--emerald-800)', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                  Today's Active Schedule
                </span>
              ) : isFutureDate ? (
                <span style={{ fontSize: '0.74rem', color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                  Untaken · Scheduled for Oct {selectedDayNumber}
                </span>
              ) : (
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
                  Hospital In-Patient Record
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '380px', overflowY: 'auto' }}>
              {displayedDoses.map((dose) => (
                <div
                  key={dose.id}
                  style={{
                    background: dose.status === 'taken' ? '#f0fdf4' : '#f8fafc',
                    border: dose.status === 'taken' ? '1px solid #bbf7d0' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {dose.medicineName}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                        {dose.strength}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Slot: {dose.slot} ({dose.scheduledTime}) · {dose.instructions}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {dose.status === 'taken' ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--emerald-700)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <CheckCircle2 size={13} />
                        Taken {dose.confirmedAt ? `(${dose.confirmedAt})` : ''}
                      </span>
                    ) : (
                      <>
                        {isFutureDate && (
                          <span style={{ fontSize: '0.72rem', color: '#b45309', background: '#fef3c7', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600, border: '1px solid #fde68a' }}>
                            Untaken
                          </span>
                        )}
                        <button
                          className={isToday ? "btn-success" : "btn-outline"}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          onClick={() => handleUpdateDayDose(dose.id, 'taken')}
                          title={`Mark dose taken for Oct ${selectedDayNumber}`}
                        >
                          Mark Taken
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
