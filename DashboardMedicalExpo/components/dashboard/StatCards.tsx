import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function StatCards() {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/stats') 
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error('API error:', error);
      });
  }, []);

  const cards = [
    {
      label: 'Total Doctors',
      value: stats.doctors,
      icon: require('../../assets/images/3dDoc.png'),
    },
    {
      label: 'Total Patients',
      value: stats.patients,
      icon: require('../../assets/images/patient.png'),
    },
    {
      label: 'Total Appointments',
      value: stats.appointments,
      icon: require('../../assets/images/appointment.png'),
    },
  ];

  return (
    <View style={styles.row}>
      {cards.map((item, index) => (
        <View key={index} style={styles.card}>
          <View>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
          <Image source={item.icon} style={styles.avatar} />
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
