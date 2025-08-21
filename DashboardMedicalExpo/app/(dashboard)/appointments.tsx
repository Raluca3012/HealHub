import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
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

const formatYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getMonthMatrix = (year: number, monthIndex: number) => {
  const firstDay = new Date(year, monthIndex, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  while (rows.length < 6) rows.push(new Array(7).fill(null));
  return rows;
};

function MiniCalendar({
  visible,
  onClose,
  initialDate,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  initialDate?: string;
  onSelect: (dateYMD: string) => void;
}) {
  const init = initialDate ? new Date(initialDate) : new Date();
  const [year, setYear] = useState(init.getFullYear());
  const [monthIdx, setMonthIdx] = useState(init.getMonth());
  const matrix = useMemo(() => getMonthMatrix(year, monthIdx), [year, monthIdx]);
  const todayYMD = formatYMD(new Date());

  useEffect(() => {
    const d = initialDate ? new Date(initialDate) : new Date();
    setYear(d.getFullYear());
    setMonthIdx(d.getMonth());
  }, [initialDate, visible]);

  if (!visible) return null;

  return (
    <View style={styles.calendarPopover}>
      <View style={styles.calHeader}>
        <Pressable onPress={() => { const m = monthIdx - 1; if (m < 0) { setMonthIdx(11); setYear(y => y - 1); } else setMonthIdx(m); }}>
          <Feather name="chevron-left" size={18} />
        </Pressable>
        <Text style={styles.calTitle}>{months[monthIdx]} {year}</Text>
        <Pressable onPress={() => { const m = monthIdx + 1; if (m > 11) { setMonthIdx(0); setYear(y => y + 1); } else setMonthIdx(m); }}>
          <Feather name="chevron-right" size={18} />
        </Pressable>
      </View>

      <View style={styles.calWeekRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
          <Text key={d} style={styles.calWeekday}>{d}</Text>
        ))}
      </View>

      {matrix.map((row, i) => (
        <View key={i} style={styles.calRow}>
          {row.map((cell, j) => {
            const cellYMD = cell ? formatYMD(cell) : '';
            const isToday = !!cell && cellYMD === todayYMD;
            const isPast = !!cell && cellYMD < todayYMD;

            const now = new Date();
            const afterCutoff = now.getHours() > 15 || (now.getHours() === 15 && now.getMinutes() > 0);
            const isTodayBlocked = isToday && afterCutoff;
            return (
              <Pressable
                key={j}
                disabled={!cell || isPast || isTodayBlocked}
                onPress={() => {
                  if (!cell || isPast || isTodayBlocked) return;
                  onSelect(cellYMD);
                  onClose();
                }}
                style={[
                  styles.calCell,
                  !cell && { backgroundColor: 'transparent' },
                  isToday && styles.calToday,
                  (isPast || isTodayBlocked) && styles.calCellDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.calCellText,
                    !cell && { color: 'transparent' },
                    (isPast || isTodayBlocked) && { color: '#9ca3af' },
                  ]}
                >
                  {cell ? cell.getDate() : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <Pressable style={styles.calClose} onPress={onClose}>
        <Text style={{ color: '#2f3c7e', fontWeight: '600' }}>Close</Text>
      </Pressable>
    </View>
  );
}

export default function AppointmentsScreen() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [monthSelectorVisible, setMonthSelectorVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [takenTimes, setTakenTimes] = useState<string[]>([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [formData, setFormData] = useState({ appointment_date: '', appointment_time: '', specialist: '' });

  const selectedYear = new Date().getFullYear();
  const monthDates = useMemo(() => {
    const totalDays = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const arr = [];
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(selectedYear, selectedMonthIndex, i);
      arr.push({ date, label: date.toLocaleDateString('en-US', { weekday: 'short' }), day: i });
    }
    return arr;
  }, [selectedYear, selectedMonthIndex]);

  const formattedDate = useMemo(
    () => formatYMD(new Date(selectedYear, selectedMonthIndex, selectedDay)),
    [selectedYear, selectedMonthIndex, selectedDay]
  );

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
    // important: marcăm orele doar dacă doctor + dată sunt setate
    if (!selectedDoctor || !formData.appointment_date) { setTakenTimes([]); return; }
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/appointments/times/${selectedDoctor.id}/${formData.appointment_date}`);
      setTakenTimes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Error loading taken times', e);
      setTakenTimes([]);
    }
  };

  useEffect(() => { fetchAppointments(); }, [selectedDay, selectedMonthIndex]);
  useEffect(() => {
    if (modalVisible) {
      fetchPatients();
      fetchDoctors();
      setFormData({ appointment_date: '', appointment_time: '', specialist: '' });
      setTakenTimes([]);
      setSearchText('');
      setSearchDoctor('');
      setSelectedPatient(null);
      setSelectedDoctor(null);
    }
  }, [modalVisible]);
  useEffect(() => { fetchTakenTimes(); }, [selectedDoctor, formData.appointment_date]);

  const possibleTimes = [
    '08:00:00', '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00',
    '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00',
    '14:00:00', '14:30:00', '15:00:00',
  ];

  const formatImageUrl = (path: string | undefined): string =>
    !path ? 'https://via.placeholder.com/80' : (path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`);

  const canShowTaken = !!selectedDoctor && !!formData.appointment_date;

  const handleAppointmentSubmit = async () => {
    const today = formatYMD(new Date());
    if (!selectedPatient || !selectedDoctor || !formData.appointment_date || !formData.appointment_time) return;
    if (formData.appointment_date < today) return; // blocăm submit pe trecut
    const payload = {
      patient_id: selectedPatient.id,
      doctor_id: selectedDoctor.id,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      specialty: selectedDoctor.specialist || formData.specialist,
    };
    try {
      await axios.post('http://127.0.0.1:8000/api/appointments', payload, { headers: { 'Content-Type': 'application/json' } });
      setModalVisible(false);
      fetchAppointments();
    } catch (e) {
      console.error('Error adding appointment', e);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.calendarHeader}>
        <Pressable onPress={() => setMonthSelectorVisible(!monthSelectorVisible)}>
          <Text style={styles.monthLabel}>{months[selectedMonthIndex]} <Feather name="chevron-down" size={16} /></Text>
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
              onPress={() => { setSelectedMonthIndex(idx); setSelectedDay(1); setMonthSelectorVisible(false); }}
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
              <Text style={[styles.dayLabel, item.day === selectedDay && { color: '#fff' }]}>{item.label}</Text>
              <Text style={[styles.dayNumber, item.day === selectedDay && { color: '#fff' }]}>{item.day}</Text>
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
                  <Image source={{ uri: formatImageUrl(item.patient_image) }} style={styles.avatar} />
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
                    <Text style={styles.info}>Dr. {item.doctor_name}</Text>
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

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Appointment</Text>

            <TextInput
              style={styles.input}
              placeholder="Search patient by name"
              value={searchText}
              onChangeText={(text) => { setSearchText(text); setSelectedPatient(null); }}
            />
            {searchText.length > 0 && !selectedPatient && (
              <ScrollView style={{ maxHeight: 100 }}>
                {patients
                  .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
                  .map(p => (
                    <Pressable key={p.id} onPress={() => { setSelectedPatient(p); setSearchText(p.name); }}>
                      <Text>{p.name} (#{p.id})</Text>
                    </Pressable>
                  ))}
              </ScrollView>
            )}
            {selectedPatient && <Text>Selected: {selectedPatient.name} (#{selectedPatient.id})</Text>}

            <TextInput
              style={styles.input}
              placeholder="Search doctor"
              value={selectedDoctor ? `Dr. ${selectedDoctor.name}` : searchDoctor}
              onChangeText={(text) => { setSearchDoctor(text); setSelectedDoctor(null); }}
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
                      <Text>Dr. {d.name} (#{d.id})</Text>
                    </Pressable>
                  ))}
              </ScrollView>
            )}
            {selectedDoctor && <Text>Selected: Dr. {selectedDoctor.name} (#{selectedDoctor.id})</Text>}

            <Pressable style={[styles.input, styles.inputLikeButton]} onPress={() => setDatePickerVisible(true)}>
              <Text style={{ color: formData.appointment_date ? '#111' : '#999' }}>
                {formData.appointment_date || 'Select date'}
              </Text>
              <Feather name="calendar" size={16} color="#666" />
            </Pressable>

            <MiniCalendar
              visible={datePickerVisible}
              initialDate={formData.appointment_date}
              onClose={() => setDatePickerVisible(false)}
              onSelect={(dateYMD) => { setFormData(prev => ({ ...prev, appointment_date: dateYMD, appointment_time: '' })); }}
            />

            <View style={{ marginBottom: 10 }}>
              {!canShowTaken && <Text style={{ color: '#777', marginBottom: 6 }}>Select doctor & date to see unavailable hours.</Text>}
              <ScrollView horizontal>
                {possibleTimes.map((time) => {
                  const isTaken = canShowTaken && takenTimes.includes(time);
                  const isSelected = formData.appointment_time === time;
                  const disabled = isTaken;
                  return (
                    <Pressable
                      key={time}
                      disabled={disabled}
                      onPress={() => { if (!disabled) setFormData(prev => ({ ...prev, appointment_time: time })); }}
                      style={[
                        styles.timePill,
                        isSelected && styles.timePillSelected,
                        disabled && styles.timePillDisabled,
                      ]}
                    >
                      <Text style={[styles.timePillText, (isSelected || disabled) && { color: '#fff', fontWeight: '700' }]}>
                        {time}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

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
  wrapper: { flex: 1, padding: 10, backgroundColor: '#f4f6fa' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  monthLabel: { fontSize: 16, fontWeight: '500', color: '#333' },
  addBtn: { flexDirection: 'row', backgroundColor: '#2f3c7e', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
  monthDropdown: { backgroundColor: '#fff', borderRadius: 8, elevation: 4, padding: 5, marginBottom: 10 },
  monthItem: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4 },
  dayItem: { alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginRight: 8, minWidth: 50, minHeight: 50, backgroundColor: '#fff' },
  activeDay: { backgroundColor: '#2f3c7e' },
  dayLabel: { fontSize: 12, color: '#999' },
  dayNumber: { fontSize: 17, fontWeight: 'bold', color: '#999' },
  appointmentScroll: { paddingBottom: 100 },
  appointmentBox: { backgroundColor: '#fff', borderRadius: 12, padding: 26 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '30%', backgroundColor: '#f6f7fc', borderRadius: 12, padding: 12, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  name: { fontWeight: '600', color: '#2f3c7e' },
  id: { fontSize: 12, color: '#999' },
  table: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tableCell: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  info: { fontSize: 13, color: '#444' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '50%', borderRadius: 10, padding: 40, position: 'relative' },
  modalTitle: { fontSize: 19, fontWeight: '600', marginBottom: 19 },
  input: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 18, marginBottom: 10 },
  inputLikeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  submitBtn: { backgroundColor: '#2f3c7e', paddingVertical: 15, alignItems: 'center', borderRadius: 6, marginTop: 12 },
  closeBtn: { position: 'absolute', top: 10, right: 10 },

  calendarPopover: { position: 'absolute', top: 160, right: 40, zIndex: 9999, width: 280, backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16, elevation: 10 },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  calTitle: { fontWeight: '600' },
  calWeekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  calWeekday: { width: 34, textAlign: 'center', color: '#6b7280', fontSize: 12 },
  calRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  calCell: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
  calToday: { borderWidth: 1, borderColor: '#2f3c7e' },
  calCellDisabled: { backgroundColor: '#f3f4f6', opacity: 0.5 },
  calCellText: { color: '#111827', fontSize: 12, fontWeight: '600' },
  calClose: { alignSelf: 'flex-end', marginTop: 6 },

  timePill: { backgroundColor: '#eee', paddingVertical: 10, paddingHorizontal: 12, marginRight: 6, borderRadius: 8 },
  timePillSelected: { backgroundColor: '#2f3c7e' },
  timePillDisabled: { backgroundColor: '#ef4444' },
  timePillText: { color: '#111' },
});
