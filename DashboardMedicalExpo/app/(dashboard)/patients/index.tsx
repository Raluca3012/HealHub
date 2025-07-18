import { Entypo, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

const statusColors: Record<string, string> = {
  'On recovery': '#c7d2fe',
  Pending: '#fef3c7',
  Recovered: '#dcfce7',
  Rejected: '#fee2e2',
};

export default function PatientsScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Fetch error:', err);
        setLoading(false);
      });
  }, []);


  const showMenu = (event: any, patient: any) => {
    setMenuPos({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    setSelectedPatient(patient);
  };

  const hideMenu = () => {
    setMenuPos(null);
    setSelectedPatient(null);
  };

  const getStatusStyle = (status: string): ViewStyle => ({
    backgroundColor: statusColors[status] || '#f3f4f6',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
    minWidth: 100,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patients List</Text>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.flex1]}>Profile</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Patient Name</Text>
        <Text style={[styles.headerCell, styles.flex1]}>ID Number</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Check-in</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Mobile Number</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Doctor Assigned</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Problem</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Room No</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Status</Text>
        <Text style={[styles.headerCell, { width: 40 }]}></Text>
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <Text style={[styles.cell, styles.nameText]}>{item.name}</Text>
              <Text style={styles.cell}>#N-{String(item.id).padStart(8, '0')}</Text>
              <Text style={styles.cell}>{item.checkin}</Text>
              <Text style={styles.cell}>{item.mobile}</Text>
              <Text style={styles.cell}>{item.doctor_name}</Text>
              <Text style={styles.cell}>{item.problem}</Text>
              <Text style={styles.cell}>{item.room}</Text>
              <View style={[getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <Pressable
                onPress={(e) => showMenu(e, item)}
                style={[styles.menuButton, { width: 40 }]}
              >
                <Entypo name="dots-three-vertical" size={16} color="#444" />
              </Pressable>
            </View>
          </View>
        )}
      />

      {menuPos && selectedPatient && (
        <Modal transparent animationType="fade" visible>
          <TouchableWithoutFeedback onPress={hideMenu}>
            <View style={styles.overlay}>
              <View style={[styles.dropdown, { top: menuPos.y, left: menuPos.x }]}>
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    router.push(`/patients/${selectedPatient.id}`);
                    hideMenu();
                  }}
                >
                  <Feather name="eye" size={14} color="green" />
                  <Text style={[styles.dropdownText, { color: 'green' }]}>View</Text>
                </Pressable>
                <Pressable style={styles.dropdownItem} onPress={hideMenu}>
                  <Feather name="slash" size={14} color="red" />
                  <Text style={[styles.dropdownText, { color: 'red' }]}>Suspend</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginLeft: 10,
    maxWidth: 1200,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 14,
  },
  searchIcon: {
    marginTop: 2,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 12,
    color: '#555',
  },
  nameText: {
    color: '#2F3C7E',
    fontWeight: 'bold',
    marginRight: -20,
    marginLeft: 90,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#f4f4f4ff',
    borderColor: '#e5e7eb',
    marginBottom: 10,
    alignItems: 'center',
    gap: 1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  menuButton: {
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'rgba(211,211,211, 1)',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    width: 140,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  dropdownText: {
    fontSize: 13,
  },
  flex1: {
    flex: 1,
  },
});
