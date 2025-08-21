import { Feather } from '@expo/vector-icons'; // import icon
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const API_URL = 'http://127.0.0.1:8000/api/notifications/week';

interface Notification {
  id: string;            // id unic
  title: string;
  message: string;
  patient_phone?: string; // telefon pacient
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    axios.get(API_URL)
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Error loading notifications:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notifications/${id}`); // backend no-op ok
    } catch (e) {
      // fallback local
    } finally {
      setNotifications(prev => prev.filter(n => n.id !== id)); // ascunde local
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.title}>{item.title}</Text>
              <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
                <Feather name="trash-2" size={18} color="#ef4444" />
              </Pressable>
            </View>
            <Text style={styles.message}>{item.message}</Text>
            {item.patient_phone ? (
              <Text style={styles.phone}>Patient phone: {item.patient_phone}</Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#888' }}>
            Does not exist any notifications for this week.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  message: { fontSize: 14, color: '#555' },
  phone: { marginTop: 6, fontSize: 13, color: '#374151' },
});
