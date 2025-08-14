import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getMonthDates = (year: number, monthIndex: number) => {
  const days = [];
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, monthIndex, i);
    days.push({
      date,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: i,
    });
  }
  return days;
};

export default function AppointmentsScreen() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [monthSelectorVisible, setMonthSelectorVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [takenTimes, setTakenTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_time: '',
    specialist: '',
  });

  const selectedYear = new Date().getFullYear();
  const monthDates = getMonthDates(selectedYear, selectedMonthIndex);
  const formattedDate = new Date(selectedYear, selectedMonthIndex, selectedDay)
    .toLocaleDateString('en-CA'); // ✅ fix fus orar

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/appointments/by-date/${formattedDate}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/patients');
      setPatients(res.data);
    } catch (e) {
      console.error('Error loading patients', e);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/doctors');
      setDoctors(res.data);
    } catch (e) {
      console.error('Error loading doctors', e);
    }
  };

  const fetchTakenTimes = async () => {
    if (!selectedDoctor || !formData.appointment_date) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/appointments/times/${selectedDoctor.id}/${formData.appointment_date}`);
      setTakenTimes(res.data);
    } catch (e) {
      console.error('Error loading taken times', e);
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!selectedPatient || !selectedDoctor) return;
    const payload = {
      ...formData,
      patient_id: selectedPatient.id,
      doctor_id: selectedDoctor.id,
      specialty: selectedDoctor.specialist,
    };
    try {
      await axios.post('http://127.0.0.1:8000/api/appointments', payload);
      setModalVisible(false);
      fetchAppointments();
    } catch (e) {
      console.error('Error adding appointment', e);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDay, selectedMonthIndex]);

  useEffect(() => {
    if (modalVisible) {
      fetchPatients();
      fetchDoctors();
    }
  }, [modalVisible]);

  useEffect(() => {
    fetchTakenTimes();
  }, [selectedDoctor, formData.appointment_date]);

  const possibleTimes = [
    '08:00:00', '09:00:00', '10:00:00', '11:00:00',
    '12:00:00', '13:00:00', '14:00:00', '15:00:00',
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.calendarHeader}>
        <Pressable onPress={() => setMonthSelectorVisible(!monthSelectorVisible)}>
          <Text style={styles.monthLabel}>
            {months[selectedMonthIndex]} <Feather name="chevron-down" size={16} />
          </Text>
        </Pressable>
        <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={14} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 6 }}>Add Appointment</Text>
        </Pressable>
      </View>

      {monthSelectorVisible && (
        <View style={styles.monthDropdown}>
          {months.map((m, idx) => (
            <Pressable
              key={m}
              style={[styles.monthItem, selectedMonthIndex === idx && { backgroundColor: '#eef' }]}
              onPress={() => {
                setSelectedMonthIndex(idx);
                setSelectedDay(1);
                setMonthSelectorVisible(false);
              }}
            >
              <Text>{m}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={{ marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {monthDates.map((item) => (
            <Pressable
              key={item.day}
              onPress={() => setSelectedDay(item.day)}
              style={[styles.dayItem, item.day === selectedDay && styles.activeDay]}
            >
              <Text style={[styles.dayLabel, item.day === selectedDay && { color: '#fff' }]}>
                {item.label}
              </Text>
              <Text style={[styles.dayNumber, item.day === selectedDay && { color: '#fff' }]}>
                {item.day}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.appointmentScroll}>
        <View style={styles.appointmentBox}>
          <View style={styles.grid}>
            {appointments.map((item: any, index: number) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Image source={{ uri: item.doctor_image }} style={styles.avatar} />
                  <View>
                    <Text style={styles.name}>{item.patient_name}</Text>
                    <Text style={styles.id}>#{item.id}</Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableCell}>
                    <Feather name="activity" size={14} color="#2f3c7e" />
                    <Text style={styles.info}>{item.patient_problem}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Feather name="user" size={14} color="#2f3c7e" />
                    <Text style={styles.info}>{item.doctor_name}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Feather name="calendar" size={14} color="#2f3c7e" />
                    <Text style={styles.info}>{item.appointment_date}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Feather name="clock" size={14} color="#2f3c7e" />
                    <Text style={styles.info}>{item.appointment_time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Appointment</Text>

            <TextInput
              style={styles.input}
              placeholder="Search patient by name"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setSelectedPatient(null);
              }}
            />
            {searchText.length > 0 && !selectedPatient && (
              <ScrollView style={{ maxHeight: 100 }}>
                {patients
                  .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
                  .map(p => (
                    <Pressable key={p.id} onPress={() => {
                      setSelectedPatient(p);
                      setSearchText(p.name);
                    }}>
                      <Text>{p.name} (#{p.id})</Text>
                    </Pressable>
                  ))}
              </ScrollView>
            )}
            {selectedPatient && (
              <Text>Selected: {selectedPatient.name} (#{selectedPatient.id})</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Search doctor"
              value={searchDoctor}
              onChangeText={(text) => {
                setSearchDoctor(text);
                setSelectedDoctor(null);
              }}
            />
            {searchDoctor.length > 0 && !selectedDoctor && (
              <ScrollView style={{ maxHeight: 100 }}>
                {doctors
                  .filter(d => d.name.toLowerCase().includes(searchDoctor.toLowerCase()))
                  .map(d => (
                    <Pressable key={d.id} onPress={() => {
                      setSelectedDoctor(d);
                      setSearchDoctor(d.name);
                      setFormData(prev => ({ ...prev, specialist: d.specialist }));
                    }}>
                      <Text>{d.name} (#{d.id})</Text>
                    </Pressable>
                  ))}
              </ScrollView>
            )}
            {selectedDoctor && (
              <Text>Selected: {selectedDoctor.name} (#{selectedDoctor.id})</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Appointment Date (YYYY-MM-DD)"
              value={formData.appointment_date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, appointment_date: text }))}
            />

            <ScrollView horizontal style={{ marginBottom: 10 }}>
              {possibleTimes.map((time) => {
                const isTaken = Array.isArray(takenTimes) && takenTimes.includes(time);
                const isSelected = formData.appointment_time === time;
                return (
                  <Pressable
                    key={time}
                    disabled={isTaken}
                    onPress={() => {
                      if (!isTaken) {
                        setFormData(prev => ({ ...prev, appointment_time: time }));
                      }
                    }}
                    style={{
                      backgroundColor: isTaken ? 'red' : isSelected ? '#2f3c7e' : '#eee',
                      padding: 10,
                      marginRight: 6,
                      borderRadius: 6,
                      opacity: isTaken ? 0.5 : 1,
                    }}
                  >
                    <Text style={{
                      color: isTaken ? '#fff' : isSelected ? '#fff' : '#000',
                      fontWeight: isSelected ? 'bold' : 'normal',
                    }}>
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <TextInput
              style={[styles.input, { backgroundColor: '#e5e5e5' }]}
              placeholder="Specialty"
              value={formData.specialist}
              editable={false}
            />

            <Pressable style={styles.submitBtn} onPress={handleAppointmentSubmit}>
              <Text style={{ color: '#fff' }}>Add</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#333" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f6fa',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#2f3c7e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  monthDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    padding: 5,
    marginBottom: 10,
  },
  monthItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 50,
    minHeight: 50,
    backgroundColor: '#fff',
  },
  activeDay: {
    backgroundColor: '#2f3c7e',
  },
  dayLabel: {
    fontSize: 12,
    color: '#999',
  },
  dayNumber: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#999',
  },
  appointmentScroll: {
    paddingBottom: 100,
  },
  appointmentBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    backgroundColor: '#f6f7fc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  name: {
    fontWeight: '600',
    color: '#2f3c7e',
  },
  id: {
    fontSize: 12,
    color: '#999',
  },
  table: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tableCell: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    color: '#444',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '50%',
    borderRadius: 10,
    padding: 40,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 19,
  },
  rowInput: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  submitBtn: {
    backgroundColor: '#2f3c7e',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
