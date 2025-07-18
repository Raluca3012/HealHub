import { Image, StyleSheet, Text, View } from 'react-native';
import { Patient } from '../../data/patientsData';

export default function PatientListCard({ patient }: { patient: Patient }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: patient.image }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.diagnosis}>{patient.diagnosis}</Text>
        <Text style={styles.address}>{patient.address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#3d5afe',
  },
  diagnosis: {
    fontSize: 14,
    color: '#444',
  },
  address: {
    fontSize: 12,
    color: '#888',
  },
});
