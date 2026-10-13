import React, { useState } from 'react';
import { 
  Utensils, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ShieldAlert, 
  FileText, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';
import { Patient, MealLog, DietRule } from '../types';
import { checkMealAgainstDietRules } from '../services/rulesEngine';

interface FoodCheckProps {
  patient: Patient;
  mealLogs: MealLog[];
  onLogMeal: (newMeal: MealLog) => void;
}

export const FoodCheck: React.FC<FoodCheckProps> = ({ patient, mealLogs, onLogMeal }) => {
  const [mealText, setMealText] = useState<string>('');
  const [lastCheckResult, setLastCheckResult] = useState<{
    tested: boolean;
    isCompliant: boolean;
    violationReason?: string;
    sourceLineRef?: string;
  } | null>(null);

  const quickMealSuggestions = [
    { text: 'Oatmeal with boiled apple and unsalted almonds', safe: true },
    { text: 'Moong dal soup with soft phulka (no table salt)', safe: true },
    { text: 'Steamed vegetable khichdi with curd', safe: true },
    { text: 'Dal Khichdi with mango pickle and roasted papad', safe: false },
    { text: 'Crispy samosa with salted namkeen snack', safe: false },
    { text: 'Carbonated cola with fried chips', safe: false },
  ];

  const handleSelectQuick = (text: string) => {
    setMealText(text);
    const result = checkMealAgainstDietRules(text, patient.dietRules);
    setLastCheckResult({
      tested: true,
      isCompliant: result.isCompliant,
      violationReason: result.violationReason,
      sourceLineRef: result.sourceLineRef,
    });
  };

  const handleLogCurrentMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealText.trim()) return;

    const result = checkMealAgainstDietRules(mealText, patient.dietRules);

    const newLog: MealLog = {
      id: `meal-${Date.now()}`,
      patientId: patient.id,
      loggedAt: '2026-10-13 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealText: mealText.trim(),
      isCompliant: result.isCompliant,
      violationReason: result.violationReason,
      sourceLineRef: result.sourceLineRef,
    };

    onLogMeal(newLog);
    setMealText('');
    setLastCheckResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="clinical-card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ffffff)', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-700)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Utensils size={15} />
              Feature F8 · Food Check: Meals vs Doctor's Diet Orders
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              Dietary Safeguard & Meal Compliance Check
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.25rem' }}>
              <strong>Strict Guardrail (FR-8.3):</strong> The app reports exclusively against the doctor's discharge instructions. It never recommends outside commercial diets.
            </p>
          </div>
        </div>

        {/* Doctor Diet Orders Extracted from Summary */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Active Doctor Diet Directives (Discharge Summary Lines 28-30):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {patient.dietRules.map((rule) => (
              <div key={rule.id} style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', borderLeft: '4px solid var(--emerald-600)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {rule.directive}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                  Source: Line {rule.sourceLine} ("{rule.sourceText}")
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Logger Form */}
      <div className="clinical-card">
        <h3 className="card-title-lg" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={18} color="var(--teal-600)" />
          <span>Log Patient Meal & Check Against Doctor Rules</span>
        </h3>

        {/* Quick Suggestion Chips */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
            Quick Test Examples (Click to inspect rule engine reaction):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {quickMealSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuick(item.text)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: item.safe ? '1px solid #bbf7d0' : '1px solid #fecdd3',
                  background: item.safe ? '#f0fdf4' : '#fff1f2',
                  color: item.safe ? 'var(--emerald-800)' : 'var(--rose-800)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {item.safe ? <CheckCircle2 size={13} color="var(--emerald-600)" /> : <AlertTriangle size={13} color="var(--rose-600)" />}
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogCurrentMeal} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Type meals, drinks, or snacks given to patient..."
              value={mealText}
              onChange={(e) => {
                setMealText(e.target.value);
                if (e.target.value.trim().length > 3) {
                  const result = checkMealAgainstDietRules(e.target.value, patient.dietRules);
                  setLastCheckResult({
                    tested: true,
                    isCompliant: result.isCompliant,
                    violationReason: result.violationReason,
                    sourceLineRef: result.sourceLineRef,
                  });
                } else {
                  setLastCheckResult(null);
                }
              }}
              style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}
            />

            <button type="submit" className="btn-primary" style={{ padding: '0.7rem 1.4rem' }}>
              <Plus size={16} />
              <span>Log Meal</span>
            </button>
          </div>

          {/* Instant Rule Evaluation Banner */}
          {lastCheckResult?.tested && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: lastCheckResult.isCompliant ? '#f0fdf4' : '#fff1f2',
                border: lastCheckResult.isCompliant ? '1px solid #86efac' : '1px solid #fca5a5',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              {lastCheckResult.isCompliant ? (
                <CheckCircle2 size={20} color="var(--emerald-600)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              ) : (
                <ShieldAlert size={20} color="var(--rose-600)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              )}
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: lastCheckResult.isCompliant ? 'var(--emerald-900)' : 'var(--rose-900)' }}>
                  {lastCheckResult.isCompliant ? '✅ Compliant With Doctor\'s Diet Advice' : '⚠️ NOT In The Doctor\'s Diet Advice'}
                </div>
                {!lastCheckResult.isCompliant && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--rose-800)', marginTop: '0.2rem' }}>
                    {lastCheckResult.violationReason} <br />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      Ref: {lastCheckResult.sourceLineRef}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Historical Meal Logs Table */}
      <div className="clinical-card">
        <h3 className="card-title-lg" style={{ marginBottom: '1rem' }}>
          <Clock size={18} color="var(--teal-600)" />
          <span>Patient Meal History & Doctor Compliance Records ({mealLogs.length})</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {mealLogs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: log.isCompliant ? '#ffffff' : '#fff5f5',
                border: log.isCompliant ? '1px solid var(--border-light)' : '1px solid #fecdd3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {log.mealText}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Logged at {log.loggedAt}
                </div>
                {!log.isCompliant && log.violationReason && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--rose-700)', marginTop: '0.3rem', fontWeight: 600 }}>
                    ⚠️ {log.violationReason}
                  </div>
                )}
              </div>

              <div>
                {log.isCompliant ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-700)', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', border: '1px solid #a7f3d0' }}>
                    ✓ Compliant
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--rose-700)', background: '#fff1f2', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', border: '1px solid #fecdd3' }}>
                    ⚠️ Not in Advice
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
