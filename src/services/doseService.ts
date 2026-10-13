import { Dose, PlanItem, Slot } from '../types';

export const DEFAULT_SLOT_TIMES: Record<Slot, string> = {
  Morning: '08:00 AM',
  Afternoon: '01:00 PM',
  Night: '08:30 PM',
  Bedtime: '10:00 PM',
  SOS: 'As Needed',
};

export function generateDailyDoses(planItems: PlanItem[], dateStr: string = '2026-10-13'): Dose[] {
  const doses: Dose[] = [];

  // Strictly respect PRD Guardrail: "Never show an unapproved item to the family as final."
  const approvedMeds = planItems.filter((i) => i.kind === 'medicine' && i.status === 'approved');

  approvedMeds.forEach((item) => {
    const slots: Slot[] = item.slots && item.slots.length > 0 ? item.slots : (['Morning'] as Slot[]);

    slots.forEach((slot) => {
      doses.push({
        id: `dose-${item.id}-${slot.toLowerCase()}`,
        planItemId: item.id,
        medicineName: item.name,
        strength: item.strength || '',
        form: item.form || 'Tablet',
        slot: slot,
        scheduledTime: DEFAULT_SLOT_TIMES[slot] || '08:00 AM',
        instructions: item.timingNotes || 'With water',
        status: slot === 'Morning' ? 'taken' : 'pending',
        confirmedAt: slot === 'Morning' ? '08:14 AM' : undefined,
        dateStr,
      });
    });
  });

  return doses;
}
