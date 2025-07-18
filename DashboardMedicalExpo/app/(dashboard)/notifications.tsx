import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

const notifications = [
  { id: '1', title: 'Appointment Reminder', message: 'You have an appointment with Dr. Smith at 3 PM.' },
  { id: '2', title: 'New Patient Registered', message: 'John Doe has registered as a new patient.' },
  { id: '3', title: 'Device Alert', message: 'Heart monitor needs calibration.' },
  { id: '4', title: 'System Update', message: 'Dashboard system update scheduled for tonight.' },
];

export default function NotificationsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
});
