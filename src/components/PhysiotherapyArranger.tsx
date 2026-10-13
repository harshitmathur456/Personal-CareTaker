import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  Home, 
  PhoneCall, 
  Plus,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Patient, PhysioProvider, PhysioSession } from '../types';
import { MOCK_PHYSIO_PROVIDERS } from '../data/mockPatients';

interface PhysiotherapyArrangerProps {
  patient: Patient;
  sessions: PhysioSession[];
  onBookSession: (newSession: PhysioSession) => void;
}

export const PhysiotherapyArranger: React.FC<PhysiotherapyArrangerProps> = ({
  patient,
  sessions,
  onBookSession,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<PhysioProvider | null>(null);
  const [bookingMode, setBookingMode] = useState<'Home Visit' | 'Clinic OPD'>('Home Visit');
  const [bookingDate, setBookingDate] = useState<string>('2026-10-16');
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('11:00 AM - 11:45 AM');
  const [bookingNotes, setBookingNotes] = useState<string>('Post-MI recovery. Gentle phase 1 cardiac mobility & seated breathing exercise.');
  const [justBooked, setJustBooked] = useState<boolean>(false);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    const newSession: PhysioSession = {
      id: `physio-sess-${Date.now()}`,
      patientId: patient.id,
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      mode: bookingMode,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      status: 'Confirmed',
      clinicalNotes: bookingNotes,
    };

    onBookSession(newSession);
    setSelectedProvider(null);
    setJustBooked(true);
    setTimeout(() => setJustBooked(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <div className="clinical-card" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ffffff)', border: '1px solid var(--border-teal)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal-700)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Activity size={15} />
              Feature F9 · Physiotherapy & Rehabilitation Arrangement
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              In-Home & Clinic Physiotherapy Booking
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.25rem' }}>
              Summary mentions physical conditioning or mobility recovery. Book certified therapists for home visits or OPD sessions. Scheduled appointments sync directly to the medicine calendar.
            </p>
          </div>
        </div>

        {justBooked && (
          <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-800)', fontWeight: 700, fontSize: '0.88rem' }}>
            <CheckCircle2 size={18} color="var(--emerald-600)" />
            <span>Physiotherapy session confirmed! Synchronized with family calendar.</span>
          </div>
        )}
      </div>

      {/* Confirmed Sessions Timeline */}
      <div className="clinical-card">
        <h3 className="card-title-lg" style={{ marginBottom: '1rem' }}>
          <Calendar size={18} color="var(--teal-600)" />
          <span>Active Physiotherapy Schedule ({sessions.length})</span>
        </h3>

        {sessions.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No sessions arranged yet. Select a certified provider below to schedule.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sessions.map((sess) => (
              <div
                key={sess.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {sess.providerName}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-700)', background: 'var(--teal-50)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--teal-100)' }}>
                      {sess.mode}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    📅 {sess.date} · ⏰ {sess.timeSlot}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Care focus: {sess.clinicalNotes}
                  </div>
                </div>

                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--emerald-700)', background: '#ecfdf5', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', border: '1px solid #a7f3d0' }}>
                  ✓ {sess.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Directory of Certified Providers */}
      <div className="clinical-card">
        <h3 className="card-title-lg" style={{ marginBottom: '1rem' }}>
          <ShieldCheck size={18} color="var(--teal-600)" />
          <span>Verified Clinical Rehabilitation Providers</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {MOCK_PHYSIO_PROVIDERS.map((provider) => (
            <div
              key={provider.id}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                background: '#ffffff',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {provider.name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {provider.organization}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)' }}>
                    <Star size={13} fill="#b45309" />
                    <span>{provider.rating} ({provider.reviewCount})</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--teal-800)', marginTop: '0.65rem', fontWeight: 600 }}>
                  Specialty: {provider.specialty}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={13} color="var(--teal-600)" />
                  <span>{provider.availability}</span>
                </div>

                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                  {provider.modes.map((mode) => (
                    <span key={mode} style={{ fontSize: '0.72rem', background: '#f1f5f9', color: 'var(--text-secondary)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                      {mode}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teal-900)' }}>
                    ₹{provider.feePerSession}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}> / session</span>
                </div>

                <button className="btn-primary" onClick={() => setSelectedProvider(provider)}>
                  <span>Book Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedProvider && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Arrange Session with {selectedProvider.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Fee: ₹{selectedProvider.feePerSession} per 45-minute clinical rehabilitation session.
            </p>

            <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Service Delivery Mode *
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
                  {selectedProvider.modes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setBookingMode(mode)}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-md)',
                        border: bookingMode === mode ? '2px solid var(--teal-600)' : '1px solid var(--border-subtle)',
                        background: bookingMode === mode ? '#f0fdfa' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: bookingMode === mode ? 'var(--teal-800)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {mode === 'Home Visit' ? <Home size={15} /> : <Building2 size={15} />}
                      <span>{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.2rem', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Time Slot *
                  </label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.2rem', fontSize: '0.88rem' }}
                  >
                    <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM</option>
                    <option value="11:00 AM - 11:45 AM">11:00 AM - 11:45 AM</option>
                    <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                    <option value="04:30 PM - 05:15 PM">04:30 PM - 05:15 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Condition Notes for Physiotherapist *
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.2rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-outline" onClick={() => setSelectedProvider(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-success">
                  Confirm & Sync to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
