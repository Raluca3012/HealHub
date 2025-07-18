import { Entypo, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const devices = [
  { id: '102567', mac: '3324', patient: '5' },
  { id: '102567', mac: '3324', patient: '5' },
  { id: '102567', mac: '3324', patient: '5' },
  { id: '102567', mac: '3324', patient: '5' },
];

export default function DevicesScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();

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
          <View key={idx} style={styles.wrapper}>
            <View style={styles.row}>
              <Text style={styles.cell}>{device.id}</Text>
              <Text style={styles.cell}>{device.mac}</Text>
              <Text style={styles.cell}>{device.patient}</Text>

              {openIndex === idx && (
                <View style={styles.dropdown}>
                  <View style={styles.dropdownItem}>
                    <Feather name="eye" size={14} color="green" />
                    <Text style={[styles.dropdownText, { color: 'green' }]}>View</Text>
                  </View>
                  <View style={styles.dropdownItem}>
                    <Feather name="edit-2" size={14} color="#3b82f6" />
                    <Text style={[styles.dropdownText, { color: '#3b82f6' }]}>Edit</Text>
                  </View>
                  <View style={styles.dropdownItem}>
                    <Feather name="check-circle" size={14} color="orange" />
                    <Text style={[styles.dropdownText, { color: 'orange' }]}>Approve</Text>
                  </View>
                  <View style={styles.dropdownItem}>
                    <Feather name="slash" size={14} color="red" />
                    <Text style={[styles.dropdownText, { color: 'red' }]}>Suspend</Text>
                  </View>
                </View>
              )}

              <Pressable onPress={() => setOpenIndex(openIndex === idx ? null : idx)} style={styles.menuButton}>
                <Entypo name="dots-three-vertical" size={14} color="#444" />
              </Pressable>
            </View>
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
    zIndex: 0,
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
    zIndex: 1000,
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
    zIndex: -10,
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
});
