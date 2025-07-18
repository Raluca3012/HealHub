import { Image, StyleSheet, Text, View } from 'react-native';

type StatCardsProps = {
  patients: number;
  consultations: number;
};

export default function StatCards({ patients, consultations }: StatCardsProps) {
  const stats = [
    {
      label: 'Total Doctors',
      value: 3098,
      icon: require('../../assets/images/3dDoc.png'),
    },
    {
      label: 'Total Patients',
      value: 2309,
      icon: require('../../assets/images/patient.png'),
    },
    {
      label: 'Total Appointments',
      value: 4000,
      icon: require('../../assets/images/appointment.png'),
    },
  ];

  return (
    <View style={styles.row}>
      {stats.map((item, index) => (
        <View key={index} style={styles.card}>
          <View>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
          {item.icon && <Image source={item.icon} style={styles.avatar} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 87,
    marginBottom: 20,
  },
  card: {
    width: 350,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 150,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});
