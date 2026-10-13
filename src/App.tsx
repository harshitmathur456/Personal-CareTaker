import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Calendar as CalendarIcon, 
  Clock, 
  PhoneCall, 
  Utensils, 
  Activity, 
  HeartPulse, 
  CalendarDays,
  ArrowRight
} from 'lucide-react';
import { Patient, Role, Dose, PhysioSession, MealLog, AuditLogEntry, FamilyMember, Slot } from './types';
import { INITIAL_PATIENTS, INITIAL_PHYSIO_SESSIONS, INITIAL_MEAL_LOGS, INITIAL_AUDIT_LOGS } from './data/mockPatients';
import { generateDailyDoses } from './services/doseService';
import { Header } from './components/Header';
import { MedicineCalendar } from './components/MedicineCalendar';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { DischargeScanner } from './components/DischargeScanner';
import { NurseSignoffQueue } from './components/NurseSignoffQueue';
import { DoctorView } from './components/DoctorView';
import { CareCard } from './components/CareCard';
import { NextCheckupCard } from './components/NextCheckupCard';
import { FoodCheck } from './components/FoodCheck';
import { PhysiotherapyArranger } from './components/PhysiotherapyArranger';
import { DoseReminderModal } from './components/DoseReminderModal';
import { AuditLogModal } from './components/AuditLogModal';
import { LoginFlow } from './components/LoginFlow';
import { PatientRegistrationFlow } from './components/PatientRegistrationFlow';
import { GroqExtractionResult } from './services/groqExtractor';

export type AppFlowStep = 'login' | 'patient_info' | 'document_upload' | 'dashboard';

export const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<string>('pat-kamla-01');
  const [authenticatedUser, setAuthenticatedUser] = useState<{ role: Role; name: string }>({
    role: 'caregiver',
    name: 'Priya Sharma (Family Caregiver)',
  });
  const [currentRole, setCurrentRole] = useState<Role | 'scanner'>('caregiver');
  
  // App screen step: begins on login as requested
  const [currentFlowStep, setCurrentFlowStep] = useState<AppFlowStep>('login');

  // Caregiver tabs: default to the requested Monthly Calendar view
  const [caregiverTab, setCaregiverTab] = useState<'monthly' | 'schedule' | 'checkup' | 'carecard' | 'food' | 'physio'>('monthly');

  const [doses, setDoses] = useState<Dose[]>([]);
  const [physioSessions, setPhysioSessions] = useState<PhysioSession[]>(INITIAL_PHYSIO_SESSIONS);
  const [mealLogs, setMealLogs] = useState<MealLog[]>(INITIAL_MEAL_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];

  // Regenerate doses when patient or approved plan items change
  useEffect(() => {
    setDoses(generateDailyDoses(activePatient.planItems));
  }, [activePatientId, activePatient.planItems]);

  // Count flagged items for active patient
  const flaggedCount = activePatient.planItems.filter((i) => i.status === 'flagged').length;

  // Handlers
  const handleUpdateDoseStatus = (doseId: string, status: 'taken' | 'skipped', skipReason?: string) => {
    setDoses((prev) =>
      prev.map((d) =>
        d.id === doseId
          ? {
              ...d,
              status,
              confirmedAt: status === 'taken' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
              skipReason,
            }
          : d
      )
    );

    const dose = doses.find((d) => d.id === doseId);
    if (dose) {
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          timestamp: '2026-10-13 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: 'Priya Sharma (Family Caregiver)',
          actorRole: 'Family Caregiver',
          action: status === 'taken' ? 'Dose Confirmed Taken' : 'Dose Skipped',
          entity: `${dose.medicineName} (${dose.strength})`,
          details: status === 'taken' ? `Marked taken for ${dose.slot} slot.` : `Skipped with reason: ${skipReason || 'Unspecified'}`,
        },
        ...prev,
      ]);
    }
  };

  const handleApproveFlaggedItem = (
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
  ) => {
    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        return {
          ...pat,
          planItems: pat.planItems.map((item) => {
            if (item.id !== itemId) return item;
            return {
              ...item,
              name: updatedData.name,
              strength: updatedData.strength,
              form: updatedData.form,
              frequencyCode: updatedData.frequencyCode,
              frequencyDecoded: updatedData.frequencyDecoded,
              slots: updatedData.slots,
              timingNotes: updatedData.timingNotes,
              confidence: 100,
              status: 'approved',
              resolvedByNurse: {
                nurseName: updatedData.nurseName,
                reviewedAt: '2026-10-13 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                clinicalNote: updatedData.clinicalNote,
              },
            };
          }),
        };
      })
    );

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: '2026-10-13 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: updatedData.nurseName,
        actorRole: 'Nurse',
        action: 'Clinical Sign-Off & Verification',
        entity: `Prescription Item #${itemId}`,
        details: `Approved '${updatedData.name} ${updatedData.strength}' (${updatedData.frequencyCode}). Clinical Note: ${updatedData.clinicalNote}. Released to family recovery plan.`,
      },
      ...prev,
    ]);
  };

  const handleRemoveFlaggedItem = (itemId: string) => {
    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        return {
          ...pat,
          planItems: pat.planItems.filter((i) => i.id !== itemId),
        };
      })
    );
  };

  const handleAddFamilyMember = (member: FamilyMember) => {
    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        return {
          ...pat,
          familyMembers: [...pat.familyMembers, member],
        };
      })
    );
  };

  const handleBookPhysioSession = (session: PhysioSession) => {
    setPhysioSessions((prev) => [session, ...prev]);
  };

  const handleLogMeal = (meal: MealLog) => {
    setMealLogs((prev) => [meal, ...prev]);
  };

  const handleSavePatientProfile = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setCurrentFlowStep('document_upload');
  };

  const handleApplyExtractedGroqData = (extracted: GroqExtractionResult) => {
    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        return {
          ...pat,
          name: extracted.patientName || pat.name,
          age: extracted.age || pat.age,
          gender: extracted.gender || pat.gender,
          admissionReason: extracted.admissionReason || pat.admissionReason,
          hospitalName: extracted.hospitalName || pat.hospitalName,
          treatingDoctor: {
            ...pat.treatingDoctor,
            name: extracted.doctorName || pat.treatingDoctor.name,
            phone: extracted.doctorPhone || pat.treatingDoctor.phone,
          },
          nextCheckupDays: extracted.nextCheckupDays || pat.nextCheckupDays,
          nextCheckupDepartment: extracted.nextCheckupDepartment || pat.nextCheckupDepartment,
          planItems: extracted.planItems.length > 0 ? extracted.planItems : pat.planItems,
          warningSigns: extracted.warningSigns.length > 0 ? extracted.warningSigns : pat.warningSigns,
          dietRules: extracted.dietRules.length > 0 ? extracted.dietRules : pat.dietRules,
        };
      })
    );
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Header
        currentRole={currentRole}
        onRoleChange={(r) => {
          setCurrentRole(r);
          setCurrentFlowStep('dashboard');
        }}
        flaggedCount={flaggedCount}
        onOpenAuditLog={() => setIsAuditModalOpen(true)}
        onLogout={() => setCurrentFlowStep('login')}
        isLoggedIn={currentFlowStep !== 'login'}
        authenticatedRole={authenticatedUser.role}
        authenticatedUserName={authenticatedUser.name}
      />

      <main className="app-container">
        {/* Step 1: Login Screen */}
        {currentFlowStep === 'login' && (
          <LoginFlow
            onLoginSuccess={(role, name) => {
              setAuthenticatedUser({ role, name });
              setCurrentRole(role);
              setCurrentFlowStep('dashboard');
            }}
          />
        )}

        {/* Step 2: Patient Registration Form */}
        {currentFlowStep === 'patient_info' && (
          <PatientRegistrationFlow
            initialPatient={activePatient}
            onSavePatientAndContinue={handleSavePatientProfile}
            onBackToLogin={() => setCurrentFlowStep('login')}
          />
        )}

        {/* Step 3: Insert Discharge Documents & Scanner */}
        {currentFlowStep === 'document_upload' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Insert Discharge Documents
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Patient: {activePatient.name} · {activePatient.hospitalName}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-outline"
                  onClick={() => setCurrentFlowStep('patient_info')}
                >
                  Edit Patient Details
                </button>

                <button
                  className="btn-success"
                  onClick={() => setCurrentFlowStep('dashboard')}
                >
                  <span>Open Recovery Calendar</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <DischargeScanner
              activePatient={activePatient}
              onGoToNurseQueue={() => {
                setCurrentRole('nurse');
                setCurrentFlowStep('dashboard');
              }}
              onGoToCaregiverView={() => setCurrentFlowStep('dashboard')}
              onApplyExtractedPatientData={handleApplyExtractedGroqData}
            />
          </div>
        )}

        {/* Step 4: Active Recovery Dashboard & Monthly Calendar */}
        {currentFlowStep === 'dashboard' && (
          <>
            {/* Safety & Guardrail Banner */}
            <div className="safety-guardrail-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="safety-guardrail-pill">
                  <ShieldAlert size={12} />
                  Safety Guardrails
                </span>
                <span>
                  Never diagnoses · Never guesses · Shorthand decoded by deterministic rules · Ambiguity quarantined for nurse review.
                </span>
              </div>
            </div>

            {/* Patient Context Ribbon */}
            <div className="patient-ribbon-card">
              <div className="patient-info-meta">
                <div className="patient-avatar-box">
                  <HeartPulse size={30} />
                </div>

                <div>
                  <div className="patient-name-h2">
                    <span>{activePatient.name}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      ({activePatient.age} Y / {activePatient.gender})
                    </span>
                  </div>
                  <div className="patient-tag-diagnosis">
                    {activePatient.admissionReason}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hospital</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {activePatient.hospitalName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Treating Doctor</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--teal-800)' }}>
                    {activePatient.treatingDoctor.name}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discharged Date</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {activePatient.dischargeDate}
                  </div>
                </div>

                <div>
                  <button
                    className="btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                    onClick={() => setCurrentFlowStep('patient_info')}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Persona Content Switch */}
            {currentRole === 'scanner' && (
              <DischargeScanner
                activePatient={activePatient}
                onGoToNurseQueue={() => setCurrentRole('nurse')}
                onGoToCaregiverView={() => setCurrentRole('caregiver')}
                onApplyExtractedPatientData={handleApplyExtractedGroqData}
              />
            )}

            {currentRole === 'nurse' && (
              <NurseSignoffQueue
                patient={activePatient}
                currentUserRole={authenticatedUser.role}
                onApproveItem={handleApproveFlaggedItem}
                onRemoveItem={handleRemoveFlaggedItem}
                onGoToFamilyPlan={() => setCurrentRole('caregiver')}
              />
            )}

            {(currentRole === 'consulting_doctor' || currentRole === 'doctor') && (
              <DoctorView patient={activePatient} doses={doses} />
            )}

            {currentRole === 'physio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="clinical-card" style={{ background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)', border: '1px solid var(--border-teal)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal-700)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Activity size={15} />
                        Physio Doctor Rehabilitation Portal · Physical Recovery
                      </div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                        Dr. Rahul Verma, MPT (Physio Doctor) · Patient: {activePatient.name}
                      </h2>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.25rem' }}>
                        Post-PCI cardiac mobility protocols, sternal precautions, guided breathing exercises, and direct rehabilitation scheduling for home recovery.
                      </p>
                    </div>
                  </div>
                </div>

                <PhysiotherapyArranger
                  patient={activePatient}
                  sessions={physioSessions}
                  onBookSession={handleBookPhysioSession}
                />
              </div>
            )}

            {currentRole === 'caregiver' && (
              <div>
                {/* Caregiver Feature Tabs Navigation */}
                <div className="care-tabs-nav">
                  <button
                    className={`care-tab-btn ${caregiverTab === 'monthly' ? 'active' : ''}`}
                    onClick={() => setCaregiverTab('monthly')}
                  >
                    <CalendarDays size={16} />
                    <span>Monthly Calendar View</span>
                  </button>

                  <button
                    className={`care-tab-btn ${caregiverTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setCaregiverTab('schedule')}
                  >
                    <Clock size={16} />
                    <span>Daily Slots Schedule</span>
                  </button>

                  <button
                    className={`care-tab-btn ${caregiverTab === 'checkup' ? 'active' : ''}`}
                    onClick={() => setCaregiverTab('checkup')}
                  >
                    <CalendarIcon size={16} />
                    <span>Next Check-Up</span>
                  </button>

                  <button
                    className={`care-tab-btn ${caregiverTab === 'carecard' ? 'active' : ''}`}
                    onClick={() => setCaregiverTab('carecard')}
                  >
                    <PhoneCall size={16} />
                    <span>"Call Doctor If..." & Family Circle</span>
                  </button>

                  <button
                    className={`care-tab-btn ${caregiverTab === 'food' ? 'active' : ''}`}
                    onClick={() => setCaregiverTab('food')}
                  >
                    <Utensils size={16} />
                    <span>Food Check</span>
                  </button>

                  <button
                    className={`care-tab-btn ${caregiverTab === 'physio' ? 'active' : ''}`}
                    onClick={() => setCaregiverTab('physio')}
                  >
                    <Activity size={16} />
                    <span>Physiotherapy</span>
                  </button>
                </div>

                {/* Tab Views */}
                {caregiverTab === 'monthly' && (
                  <MonthlyCalendar
                    patient={activePatient}
                    doses={doses}
                    physioSessions={physioSessions}
                    onUpdateDoseStatus={handleUpdateDoseStatus}
                    onOpenTestReminder={() => setIsReminderOpen(true)}
                  />
                )}

                {caregiverTab === 'schedule' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <MedicineCalendar
                      doses={doses}
                      onUpdateDoseStatus={handleUpdateDoseStatus}
                      activePatient={activePatient}
                      onOpenTestReminder={() => setIsReminderOpen(true)}
                    />
                    <NextCheckupCard patient={activePatient} />
                  </div>
                )}

                {caregiverTab === 'checkup' && <NextCheckupCard patient={activePatient} />}

                {caregiverTab === 'carecard' && (
                  <CareCard patient={activePatient} onAddFamilyMember={handleAddFamilyMember} />
                )}

                {caregiverTab === 'food' && (
                  <FoodCheck patient={activePatient} mealLogs={mealLogs} onLogMeal={handleLogMeal} />
                )}

                {caregiverTab === 'physio' && (
                  <PhysiotherapyArranger
                    patient={activePatient}
                    sessions={physioSessions}
                    onBookSession={handleBookPhysioSession}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Clinical Disclaimer Footer */}
        <footer style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600, color: 'var(--teal-900)' }}>
            Personal Care Taker · Hospital Discharge to Home Care Portal
          </p>
          <p style={{ marginTop: '0.35rem' }}>
            Medical Notice: Personal Care Taker is a patient adherence and recovery coordination tool. Always confirm instructions with your treating physician.
          </p>
        </footer>
      </main>

      {/* Live Dose Reminder Alarm Modal */}
      <DoseReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        activePatient={activePatient}
        onConfirmDose={(doseId) => {
          handleUpdateDoseStatus(doseId, 'taken');
        }}
      />

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLogs={auditLogs}
      />
    </div>
  );
};

export default App;
