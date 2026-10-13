import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Stethoscope,
  Filter,
  FileText,
  Flame,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Patient, PhysioSession } from '../types';

interface PhysioDoctorScheduleViewProps {
  patient: Patient;
  sessions: PhysioSession[];
  onUpdateSessionNotes?: (sessionId: string, newNotes: string) => void;
}

export const PhysioDoctorScheduleView: React.FC<PhysioDoctorScheduleViewProps> = ({
  patient,
  sessions,
  onUpdateSessionNotes,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  // Sort sessions chronologically by date
  const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));

  const completedSessions = sortedSessions.filter((s) => s.status === 'Completed');
  const upcomingSessions = sortedSessions.filter((s) => s.status === 'Confirmed' || s.status === 'Pending');

  // Filter based on active tab and selected date
  const displayedSessions = sortedSessions.filter((s) => {
    if (selectedDateFilter && s.date !== selectedDateFilter) return false;
    if (filterMode === 'upcoming') return s.status === 'Confirmed' || s.status === 'Pending';
    if (filterMode === 'completed') return s.status === 'Completed';
    return true;
  });

  const handleStartEditNote = (sess: PhysioSession) => {
    setEditingSessionId(sess.id);
    setNoteInput(sess.clinicalNotes || '');
  };

  const handleSaveNote = (sessionId: string) => {
    if (onUpdateSessionNotes) {
      onUpdateSessionNotes(sessionId, noteInput);
    }
    setEditingSessionId(null);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Physio Doctor Official Header Banner */}
      <div 
        className="clinical-card" 
        style={{ 
          background: 'linear-gradient(135deg, #042f2e 0%, #115e59 55%, #0f766e 100%)', 
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: '0 10px 25px -5px rgba(15, 118, 110, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#99f6e4' }}>
                <Activity size={14} />
                Physio Doctor Rehabilitation Portal · October 2026 Timetable
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Dr. Rahul Verma, MPT (Cardio-Pulmonary Rehabilitation Specialist)
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.35rem', fontSize: '0.88rem', color: '#ccfbf1' }}>
                <span>Reg. No: <strong>IAP-28491</strong></span>
                <span>·</span>
                <span>Treating Patient: <strong style={{ color: '#ffffff' }}>{patient.name}</strong> ({patient.age}y / {patient.gender})</span>
                <span>·</span>
                <span>Protocol: <strong>Phase 1 Post-PCI Cardiac Recovery</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{sessions.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#99f6e4', textTransform: 'uppercase', fontWeight: 600 }}>Total Oct Sessions</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a7f3d0' }}>{completedSessions.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#99f6e4', textTransform: 'uppercase', fontWeight: 600 }}>Completed</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fed7aa' }}>{upcomingSessions.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#99f6e4', textTransform: 'uppercase', fontWeight: 600 }}>Scheduled Dates</div>
              </div>
            </div>
          </div>

          {/* Clinical Vital Safeguards Strip */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.18)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#ccfbf1' }}>
              <Heart size={16} color="#fda4af" />
              <span>Max Exercise HR: <strong style={{ color: '#ffffff' }}>&lt; 100 bpm</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#ccfbf1' }}>
              <Zap size={16} color="#fde047" />
              <span>Target SpO2: <strong style={{ color: '#ffffff' }}>&gt; 95% at all times</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#ccfbf1' }}>
              <Flame size={16} color="#fb923c" />
              <span>Borg RPE Scale: <strong style={{ color: '#ffffff' }}>11 - 13 (Fairly Light)</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#ccfbf1' }}>
              <ShieldCheck size={16} color="#86efac" />
              <span>Sternal Safety: <strong style={{ color: '#ffffff' }}>No lifting &gt; 2.5 kg</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* October 2026 Interactive Date Selector Ribbon */}
      <div className="clinical-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--teal-600)" />
              <span>October 2026 Patient Rehabilitation Schedule (Dates of this Month)</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Review the patient's prescribed rehabilitation timetable across October dates. Click any date below to inspect the session protocol.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
            <button
              onClick={() => { setFilterMode('all'); setSelectedDateFilter(null); }}
              style={{
                border: 'none',
                background: filterMode === 'all' && !selectedDateFilter ? '#ffffff' : 'transparent',
                color: filterMode === 'all' && !selectedDateFilter ? 'var(--teal-800)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                boxShadow: filterMode === 'all' && !selectedDateFilter ? 'var(--shadow-sm)' : 'none',
              }}
            >
              All Dates ({sortedSessions.length})
            </button>
            <button
              onClick={() => { setFilterMode('upcoming'); setSelectedDateFilter(null); }}
              style={{
                border: 'none',
                background: filterMode === 'upcoming' && !selectedDateFilter ? '#ffffff' : 'transparent',
                color: filterMode === 'upcoming' && !selectedDateFilter ? 'var(--teal-800)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                boxShadow: filterMode === 'upcoming' && !selectedDateFilter ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Scheduled / Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => { setFilterMode('completed'); setSelectedDateFilter(null); }}
              style={{
                border: 'none',
                background: filterMode === 'completed' && !selectedDateFilter ? '#ffffff' : 'transparent',
                color: filterMode === 'completed' && !selectedDateFilter ? 'var(--teal-800)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                boxShadow: filterMode === 'completed' && !selectedDateFilter ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Completed ({completedSessions.length})
            </button>
          </div>
        </div>

        {/* October Date Badges Scrollable Horizontal Track */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '0.65rem', 
            overflowX: 'auto', 
            paddingBottom: '0.5rem',
            paddingTop: '0.25rem',
          }}
        >
          {sortedSessions.map((sess) => {
            const isSelected = selectedDateFilter === sess.date;
            const isCompleted = sess.status === 'Completed';
            const isToday = sess.date === '2026-10-13';
            const dayNum = sess.date.split('-')[2];

            return (
              <button
                key={sess.id}
                onClick={() => setSelectedDateFilter(isSelected ? null : sess.date)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '78px',
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected 
                    ? '2px solid var(--teal-600)' 
                    : isToday 
                    ? '2px solid #f59e0b'
                    : '1px solid var(--border-light)',
                  background: isSelected 
                    ? 'var(--teal-50)' 
                    : isToday
                    ? '#fffbeb'
                    : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(13, 148, 136, 0.15)' : 'none',
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: isSelected ? 'var(--teal-800)' : 'var(--text-muted)' }}>
                  Oct 2026
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isToday ? '#b45309' : isCompleted ? 'var(--emerald-700)' : 'var(--teal-900)', margin: '0.1rem 0' }}>
                  {dayNum}
                </span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: 'var(--radius-pill)',
                  background: isCompleted ? '#ecfdf5' : '#f0fdfa',
                  color: isCompleted ? 'var(--emerald-700)' : 'var(--teal-700)',
                  border: `1px solid ${isCompleted ? '#a7f3d0' : 'var(--border-teal)'}`
                }}>
                  {isToday ? 'Today' : isCompleted ? 'Done' : 'Slot'}
                </span>
              </button>
            );
          })}
        </div>

        {selectedDateFilter && (
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--teal-50)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-teal)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--teal-900)', fontWeight: 600 }}>
              Filtering for date: <strong>{formatDateDisplay(selectedDateFilter)}</strong>
            </span>
            <button 
              onClick={() => setSelectedDateFilter(null)}
              style={{ border: 'none', background: 'transparent', color: 'var(--teal-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear filter (Show all October dates)
            </button>
          </div>
        )}
      </div>

      {/* Date-wise Detailed Rehabilitation Schedule Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--teal-600)" />
            <span>Prescribed Rehabilitation Schedule ({displayedSessions.length} Sessions)</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing October 2026 chronological timetable
          </span>
        </div>

        {displayedSessions.map((sess) => {
          const isCompleted = sess.status === 'Completed';
          const isToday = sess.date === '2026-10-13';
          const isEditing = editingSessionId === sess.id;

          return (
            <div
              key={sess.id}
              className="clinical-card"
              style={{
                borderLeft: isToday 
                  ? '5px solid #f59e0b' 
                  : isCompleted 
                  ? '5px solid var(--emerald-600)' 
                  : '5px solid var(--teal-600)',
                background: isToday ? '#fffdf7' : '#ffffff',
                padding: '1.35rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '0.88rem', 
                      fontWeight: 800, 
                      color: 'var(--text-primary)',
                      background: '#f1f5f9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      📅 {formatDateDisplay(sess.date)}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      <Clock size={14} color="var(--teal-600)" />
                      {sess.timeSlot}
                    </span>
                    <span style={{ fontSize: '0.76rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                      {sess.mode}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: '0.76rem', background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-pill)', fontWeight: 800 }}>
                        ★ Today's Active Session
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--teal-950)', marginTop: '0.5rem' }}>
                    {sess.sessionTitle || 'Cardiac Mobility & Rehabilitation Session'}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.82rem', 
                    fontWeight: 700, 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem', 
                    borderRadius: 'var(--radius-pill)',
                    background: isCompleted ? '#ecfdf5' : '#f0fdfa',
                    color: isCompleted ? 'var(--emerald-800)' : 'var(--teal-800)',
                    border: `1px solid ${isCompleted ? '#a7f3d0' : 'var(--border-teal)'}`
                  }}>
                    {isCompleted ? <CheckCircle2 size={15} color="var(--emerald-600)" /> : <Clock size={15} color="var(--teal-600)" />}
                    {isCompleted ? 'Completed & Documented' : 'Scheduled · Upcoming'}
                  </span>
                </div>
              </div>

              {/* Prescribed Exercise Protocol Section */}
              <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--teal-800)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Activity size={14} />
                  Prescribed Exercise Protocol for {sess.date}
                </div>

                {sess.exerciseProtocol && sess.exerciseProtocol.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    {sess.exerciseProtocol.map((ex, idx) => (
                      <li key={idx} style={{ lineHeight: 1.45 }}>
                        {ex}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {sess.clinicalNotes}
                  </p>
                )}
              </div>

              {/* Precautions and Target Vitals Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                {sess.precautions && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <AlertCircle size={16} color="#d97706" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
                      <strong>Doctor Precautions:</strong> {sess.precautions}
                    </div>
                  </div>
                )}

                {sess.targetVitals && (
                  <div style={{ background: '#f0fdfa', border: '1px solid var(--border-teal)', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Heart size={16} color="var(--teal-600)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--teal-900)' }}>
                      <strong>Target Vitals / Safe Limit:</strong> {sess.targetVitals}
                    </div>
                  </div>
                )}
              </div>

              {/* Recorded Outcome / Clinical Notes */}
              {isCompleted && sess.completionNotes && (
                <div style={{ marginTop: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--emerald-600)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.82rem', color: 'var(--emerald-900)' }}>
                    <strong>Clinical Outcome Logged:</strong> {sess.completionNotes}
                  </div>
                </div>
              )}

              {/* Doctor's Notes Update Area */}
              <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--teal-900)' }}>
                      Update Physio Doctor Clinical Notes for this Date:
                    </label>
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--teal-500)',
                        fontFamily: 'inherit',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setEditingSessionId(null)}
                        style={{
                          border: '1px solid var(--border-light)',
                          background: '#ffffff',
                          color: 'var(--text-secondary)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(sess.id)}
                        className="btn-primary"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Physiotherapist Supervisor: <strong>{sess.providerName}</strong>
                    </div>
                    <button
                      onClick={() => handleStartEditNote(sess)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--teal-700)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>Edit Doctor Note</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* October Rehabilitation Milestones & Clearance Card */}
      <div className="clinical-card" style={{ background: '#f8fafc', border: '1px solid var(--border-light)', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--teal-600)" />
          <span>October 2026 Clinical Milestones & Phase 1 Objectives</span>
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Target clinical milestones established by Dr. Rahul Verma for patient Kamla Devi to reach by October 31, 2026:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target 6-Min Walk Test</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teal-900)', marginTop: '0.2rem' }}>180 Meters</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Current progress: 50m corridor walk achieved safely without dyspnea.</div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sternal Stability</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald-700)', marginTop: '0.2rem' }}>100% Guarding</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Patient utilizes hug-pillow bracing for coughing and transfers.</div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cardiologist Follow-up</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teal-900)', marginTop: '0.2rem' }}>Oct 23, 2026</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Pre-OPD functional mobility report to be delivered to Dr. Vikram Anand.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
