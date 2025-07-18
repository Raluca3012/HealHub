import { ScrollView, StyleSheet, Text } from 'react-native';
import { usePatientsData } from '../../hooks/usePatientsData';
import DoctorCard from './DoctorCard';
import PatientListCard from './PatientsListCard';

export default function PatientsScreen() {
  const { patients } = usePatientsData();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DoctorCard />
      <Text style={styles.sectionTitle}>Recent Patients</Text>
      {patients.map((patient) => (
        <PatientListCard key={patient.id} patient={patient} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f6f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});
