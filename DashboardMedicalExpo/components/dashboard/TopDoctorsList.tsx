import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  average_rating: number;
}

export default function TopDoctorsList() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const router = useRouter();

  // ✅ Format image from storage
  const formatImageUrl = (path?: string): string => {
    if (!path) return 'https://via.placeholder.com/80';
    return path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`;
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/doctors/top-rated')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(console.error);
  }, []);

  const showMenu = (event: GestureResponderEvent, doctor: Doctor) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPos({ x: pageX, y: pageY });
    setSelectedDoctor(doctor);
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
    setSelectedDoctor(null);
  };

  const handleViewDoctor = () => {
    if (selectedDoctor) {
      router.push({
        pathname: '/(dashboard)/doctors/[id]',
        params: { id: String(selectedDoctor.id) },
      });
      hideMenu();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Doctors</Text>
      {doctors.map((doc) => (
        <View key={doc.id} style={styles.doctorRow}>
          <View style={styles.left}>
            <Image source={{ uri: formatImageUrl(doc.image) }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{doc.name}</Text>
              <Text style={styles.specialty}>{doc.specialty}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={(e) => showMenu(e, doc)}
            style={styles.moreBtn}
          >
            <Text style={styles.moreText}>⋮</Text>
          </TouchableOpacity>
        </View>
      ))}

      {menuVisible && menuPos && (
        <Modal transparent animationType="fade" visible={menuVisible}>
          <TouchableWithoutFeedback onPress={hideMenu}>
            <View style={styles.overlay}>
              <View style={[styles.dropdown, { top: menuPos.y, left: menuPos.x - 70 }]}>
                <Pressable style={styles.dropdownItem} onPress={handleViewDoctor}>
                  <Feather name="eye" size={14} color="green" />
                  <Text style={[styles.dropdownText, { color: 'green' }]}>View</Text>
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 370,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
  },
  doctorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    color: 'darkblue',
  },
  specialty: {
    fontSize: 12,
    color: '#666',
  },
  moreBtn: {
    padding: 6,
  },
  moreText: {
    fontSize: 20,
    color: '#666',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'rgba(211,211,211,0.5)',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    maxWidth: 140,
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
});
