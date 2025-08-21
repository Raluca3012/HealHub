import { Entypo, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Device {
  id: number;
  device_id: string;
  mac_id: string;
  patient_id: number;
  model_id: number;
  status: 'approved' | 'pending' | 'suspended';
}

export default function DevicesScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedDevice, setEditedDevice] = useState<{ device_id: string; mac_id: string; patient_id: number }>({
    device_id: '',
    mac_id: '',
    patient_id: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/devices');
      const json = await res.json();
      setDevices(json);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch devices');
    }
  };

  const updateStatus = async (id: number, status: 'approved' | 'pending' | 'suspended') => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/devices/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Status updated to ${status}`);
        setDevices((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status } : d))
        );
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Server error');
    }
  };

  const handleEdit = (device: Device, idx: number) => {
    setEditingIndex(idx);
    setEditedDevice({ device_id: device.device_id, mac_id: device.mac_id, patient_id: device.patient_id });
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/devices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedDevice),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Device updated');
        setDevices((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, ...editedDevice, status: d.status } : d
          )
        );
        setEditingIndex(null);
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpenIndex(null)}>
      <View style={styles.container}>
        <View style={styles.tabs}>
          <Text style={styles.tabActive}>All Devices</Text>
          <Pressable onPress={() => router.push('/(dashboard)/devices/models')}>
            <Text style={styles.tab}>Models</Text>
          </Pressable>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Device Id</Text>
          <Text style={styles.headerText}>MAC ID</Text>
          <Text style={styles.headerText}>Patient</Text>
          <View style={{ width: 30 }} />
        </View>

        {devices.map((device, idx) => (
          <View key={device.id} style={styles.wrapper}>
            <View style={styles.row}>
              <View style={styles.cell}>
                {editingIndex === idx ? (
                  <TextInput
                    style={styles.input}
                    value={editedDevice.device_id}
                    onChangeText={(text) =>
                      setEditedDevice((prev) => ({ ...prev, device_id: text }))
                    }
                  />
                ) : (
                  <Text>{device.device_id}</Text>
                )}
              </View>
              <View style={styles.cell}>
                {editingIndex === idx ? (
                  <TextInput
                    style={styles.input}
                    value={editedDevice.mac_id}
                    onChangeText={(text) =>
                      setEditedDevice((prev) => ({ ...prev, mac_id: text }))
                    }
                  />
                ) : (
                  <Text>{device.mac_id}</Text>
                )}
              </View>
              <View style={styles.cell}>
                {editingIndex === idx ? (
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(editedDevice.patient_id)}
                    onChangeText={(text) =>
                      setEditedDevice((prev) => ({ ...prev, patient_id: parseInt(text) || 0 }))
                    }
                  />
                ) : (
                  <Text>{device.patient_id}</Text>
                )}
              </View>

              {editingIndex === idx ? (
                <Pressable
                  onPress={() => handleSave(device.id)}
                  style={styles.menuButton}
                >
                  <Feather name="check" size={18} color="green" />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
                  style={styles.menuButton}
                >
                  <Entypo name="dots-three-vertical" size={14} color="#444" />
                </Pressable>
              )}
            </View>

            {openIndex === idx && editingIndex !== idx && (
              <View style={styles.dropdown}>
                <Pressable
                  onPress={() => {
                    handleEdit(device, idx);
                    setOpenIndex(null);
                  }}
                  style={styles.dropdownItem}
                >
                  <Feather name="edit-2" size={14} color="#3b82f6" />
                  <Text style={[styles.dropdownText, { color: '#3b82f6' }]}>Edit</Text>
                </Pressable>
                {/* <Pressable onPress={() => setOpenIndex(null)} style={styles.dropdownItem}>
                  <Feather name="eye" size={14} color="green" />
                  <Text style={[styles.dropdownText, { color: 'green' }]}>View</Text>
                </Pressable> */}
                {/* <Pressable
                  onPress={() => updateStatus(device.id, 'approved')}
                  style={styles.dropdownItem}
                >
                  <Feather name="check-circle" size={14} color="orange" />
                  <Text style={[styles.dropdownText, { color: 'orange' }]}>Approve</Text>
                </Pressable>
                <Pressable
                  onPress={() => updateStatus(device.id, 'suspended')}
                  style={styles.dropdownItem}
                >
                  <Feather name="slash" size={14} color="red" />
                  <Text style={[styles.dropdownText, { color: 'red' }]}>Suspend</Text>
                </Pressable> */}
              </View>
            )}
          </View>
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 20,
    overflow: 'visible',
    zIndex: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#f1f1f1',
    fontSize: 14,
    color: '#555',
  },
  tabActive: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: 'darkblue',
    fontSize: 14,
    color: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  wrapper: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(222, 215, 215, 0.2)',
    alignItems: 'center',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  menuButton: {
    padding: 8,
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 12,
    right: 40,
    backgroundColor: 'rgba(211,211,211, 0.6)',
    borderRadius: 10,
    padding: 10,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
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

  input: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});
