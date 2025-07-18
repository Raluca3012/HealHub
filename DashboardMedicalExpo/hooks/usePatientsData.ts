import { recentPatients } from '../data/patientsData';

export function usePatientsData() {
  return { patients: recentPatients };
}
