import { useAuth } from '@/app/contexts/AuthContext';
import axios from 'axios';
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
import {
    Asset,
    ImageLibraryOptions,
    launchImageLibrary,
} from 'react-native-image-picker';

const API_URL = 'http://127.0.0.1:8000/api/user-profile'; // schimbă IP dacă rulezi pe telefon real

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

  const [editable, setEditable] = useState(false);
  const [image, setImage] = useState<Asset | null>(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.log(err);
        Alert.alert('Error', 'Could not fetch profile');
      });
  }, [token]);

  const handleChoosePhoto = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        const img = response.assets[0];
        setImage(img);
        if (img.uri) {
          setUser((prev) => ({ ...prev, avatar: img.uri }));
        }
      }
    });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('phone', user.phone ?? '');

    if (image && image.uri) {
      const fallbackName = image.uri.endsWith('.png') ? 'photo.png' : 'photo.jpg';
      const fallbackType = image.uri.endsWith('.png') ? 'image/png' : 'image/jpeg';

      formData.append('avatar', {
        uri: image.uri,
        name: image.fileName ?? fallbackName,
        type: image.type ?? fallbackType,
      } as any);
    }

    try {
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Profile updated!');
      setEditable(false);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        console.log('Validation errors:', err.response.data.errors);
        Alert.alert('Validation failed', JSON.stringify(err.response.data.errors));
      } else {
        console.log('Other error:', err.response?.data || err);
        Alert.alert('Error', 'Could not update profile');
      }
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
              <Text style={styles.changePhoto}>📷 Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.right}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              editable={editable}
              onChangeText={(text) => setUser({ ...user, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={user.email} editable={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={user.phone ?? ''}
              editable={editable}
              onChangeText={(text) => setUser({ ...user, phone: text })}
            />
          </View>

          {!editable ? (
            <TouchableOpacity
              style={styles.changePassword}
              onPress={() => setEditable(true)}
            >
              <Text style={{ color: '#333' }}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={{ color: '#fff' }}>Save Changes</Text>
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
    alignItems: 'flex-start',
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
    color: '#333',
    fontSize: 14,
  },
  right: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 6,
  },
  changePassword: {
    marginTop: 10,
    alignSelf: 'flex-start',
    padding: 6,
    borderWidth: 1,
    borderColor: '#e0c97d',
    borderRadius: 6,
    backgroundColor: '#fff8dc',
  },
  saveButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#2e7d32',
  },
});
