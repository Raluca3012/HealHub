import { useAuth } from '@/app/contexts/AuthContext';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://127.0.0.1:8000/api/user-profile';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export default function ProfileForm() {
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [image, setImage] = useState<any>(null);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!token) return;

    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.user) {
          setUser({
            name: res.data.user.name || '',
            email: res.data.user.email || '',
            phone: res.data.user.phone || '',
            avatar: res.data.user.avatar || '',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Error', 'Failed to load profile data.');
      });
  }, [token]);

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Access to the gallery is needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const pickedImage = result.assets[0];
      setImage(pickedImage);
      setUser((prev) => ({ ...prev, avatar: pickedImage.uri }));
    }
  };

  const handleSave = async () => {
    const formData: any = new FormData();
    formData.append('name', user.name);
    formData.append('phone', user.phone ?? '');

    if (image?.uri) {
      const uri = image.uri;
      const uriParts = uri.split('.');
      const ext = uriParts.length > 1 ? uriParts[uriParts.length - 1] : 'jpg';
      const fileName = `avatar.${ext}`;
      const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      formData.append('avatar', {
        uri,
        name: fileName,
        type: mimeType,
      });
    }

    try {
      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser({
        name: res.data.user.name || '',
        email: res.data.user.email || '',
        phone: res.data.user.phone || '',
        avatar: res.data.user.avatar || '',
      });

      setEditable(false);
      setImage(null);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err: any) {
      console.log('Backend error:', err.response?.data || err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.content}>
        <View style={styles.left}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
          )}
          {editable && (
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Text style={styles.changePhoto}>📷 Change photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.right}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={user.name || ''}
            editable={editable}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email || ''}
            editable={false}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={user.phone || ''}
            editable={editable}
            onChangeText={(text) => setUser({ ...user, phone: text })}
          />

          {!editable ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditable(true)}
            >
              <Text>Edit profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{ color: '#fff' }}>Save changes</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  content: {
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 8,
  },
  changePhoto: {
    fontSize: 13,
    color: '#444',
  },
  right: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
  },
  editBtn: {
    marginTop: 14,
    backgroundColor: '#fff8dc',
    padding: 8,
    borderRadius: 6,
    borderColor: '#999',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  saveBtn: {
    marginTop: 14,
    backgroundColor: '#2e7d32',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});
