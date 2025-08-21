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

interface Model {
  id: number;
  name: string;
  description: string;
  status: 'approved' | 'pending' | 'suspended';
}

export default function ModelsScreen() {
  const [models, setModels] = useState<Model[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedModel, setEditedModel] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  const router = useRouter();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/models');
      const data = await res.json();
      setModels(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch models');
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/models/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Status updated to ${status}`);
        setModels((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  status: status as 'approved' | 'pending' | 'suspended',
                }
              : m
          )
        );
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Server error');
    }
  };

  const handleEdit = (model: Model, idx: number) => {
    setEditingIndex(idx);
    setEditedModel({ name: model.name, description: model.description });
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/models/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedModel),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Model updated');
        setModels((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  ...editedModel,
                  status: m.status,
                }
              : m
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
          <Pressable onPress={() => router.push('/(dashboard)/devices')}>
            <Text style={styles.tab}>All Devices</Text>
          </Pressable>
          <Text style={styles.tabActive}>Models</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Model Name</Text>
          <Text style={styles.headerText}>Description</Text>
          <View style={{ width: 30 }} />
        </View>

        {models.map((model, idx) => (
          <View key={model.id} style={styles.wrapper}>
            <View style={styles.row}>
              {editingIndex === idx ? (
                <>
                  <TextInput
                    style={styles.cell}
                    value={editedModel.name}
                    onChangeText={(text) => setEditedModel((prev) => ({ ...prev, name: text }))}
                  />
                  <TextInput
                    style={styles.cell}
                    value={editedModel.description}
                    onChangeText={(text) => setEditedModel((prev) => ({ ...prev, description: text }))}
                  />
                  <Pressable onPress={() => handleSave(model.id)} style={styles.menuButton}>
                    <Feather name="check" size={18} color="green" />
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.cell}>{model.name}</Text>
                  <Text style={styles.cell}>{model.description}</Text>

                  {editingIndex !== idx && (
                    <Pressable
                      onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
                      style={styles.menuButton}
                    >
                      <Entypo name="dots-three-vertical" size={14} color="#444" />
                    </Pressable>
                  )}

                  {openIndex === idx && editingIndex !== idx && (
                    <View style={styles.dropdown}>
                      <Pressable
                        onPress={() => {
                          handleEdit(model, idx);
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
                      </Pressable>

                      <Pressable
                        onPress={() => updateStatus(model.id, 'approved')}
                        style={styles.dropdownItem}
                      >
                        <Feather name="check-circle" size={14} color="orange" />
                        <Text style={[styles.dropdownText, { color: 'orange' }]}>Approve</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => updateStatus(model.id, 'suspended')}
                        style={styles.dropdownItem}
                      >
                        <Feather name="slash" size={14} color="red" />
                        <Text style={[styles.dropdownText, { color: 'red' }]}>Suspend</Text>
                      </Pressable> */}
                    </View>
                  )}
                </>
              )}
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
});
