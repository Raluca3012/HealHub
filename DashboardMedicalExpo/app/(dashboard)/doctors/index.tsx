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
} from 'react-native';

export default function DoctorsScreen() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? '-'
      : `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const showMenu = (event: any, doctor: any) => {
    setMenuPos({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    setSelectedDoctor(doctor);
  };

  const hideMenu = () => {
    setMenuPos(null);
    setSelectedDoctor(null);
  };

  const formatImageUrl = (path?: string) => {
    if (!path) return 'https://via.placeholder.com/80';
    return path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctors List</Text>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#999" />
      </View>

      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.flex1]}>Profile</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Doctor Name</Text>
        <Text style={[styles.headerCell, styles.flex1]}>ID Number</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Date of Joining</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Mobile Number</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Specialist</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Schedule</Text>
        <Text style={[styles.headerCell, styles.flex1]}>Status</Text>
        <Text style={[styles.headerCell, { width: 40 }]}></Text>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: formatImageUrl(item.image) }} style={styles.avatar} />
            <Text style={[styles.cell, styles.nameText]}>Dr. {item.name}</Text>
            <Text style={styles.cell}>#NP-{String(item.id).padStart(8, '0')}</Text>
            <Text style={styles.cell}>{formatDate(item.joining)}</Text>
            <Text style={styles.cell}>{item.mobile}</Text>
            <Text style={styles.cell}>{item.specialist}</Text>

            <View style={styles.badgeSchedule}>
              <Text style={styles.badgeText}>{item.schedule || 'No Schedule'}</Text>
            </View>

            <View
              style={[
                styles.badge,
                item.status === 'Available' ? styles.badgeGreen : styles.badgeRed,
              ]}
            >
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>

            <Pressable onPress={(e) => showMenu(e, item)} style={styles.menuButton}>
              <Entypo name="dots-three-vertical" size={16} color="#444" />
            </Pressable>
          </View>
        )}
      />

      {menuPos && selectedDoctor && (
        <Modal transparent animationType="fade" visible>
          <TouchableWithoutFeedback onPress={hideMenu}>
            <View style={styles.overlay}>
              <View style={[styles.dropdown, { top: menuPos.y, left: menuPos.x }]}>
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    router.push(`/doctors/${selectedDoctor.id}`);
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
    marginRight: -70,
    marginLeft: 20,
  },
  nameText: {
    color: '#2F3C7E',
    fontWeight: 'bold',
    marginRight: -40,
    marginLeft: 130,
    
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
    gap: 3,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: -15,
    marginLeft: 15,
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
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'center',
    minWidth: 90,
  },
  badgeGreen: {
    backgroundColor: '#bbf7d0',
  },
  badgeRed: {
    backgroundColor: '#fecaca',
  },
  badgeSchedule: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 100,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '500',
  },
});
