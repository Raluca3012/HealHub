import { useAuth } from '@/app/contexts/AuthContext';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
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
  avatar?: string | null;
}


const showChangePhotoOnlyWhenEditable = true;

export default function ProfileForm() {
  const { token, profile, setProfileLocal, refreshProfile } = useAuth();

  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    avatar: null,
  });

  const [originalUser, setOriginalUser] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    avatar: null,
  });

  const [image, setImage] = useState<any>(null);
  const [editable, setEditable] = useState(false);

  // input file ascuns pentru web
  const webFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!profile) return;
    const userData: UserProfile = {
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      avatar: profile.avatar || null,
    };
    setUser(userData);
    setOriginalUser(userData);
  }, [profile]);

  const triggerWebPicker = () => {
    if (webFileInputRef.current) {
      webFileInputRef.current.value = ''; // reset pentru a permite aceeași poză din nou
      webFileInputRef.current.click();
    }
  };

  const onWebFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // preview instant
      const preview = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: preview }));
    }
  };

  const handleChoosePhoto = async () => {
    // dacă vrei să permiți schimbarea pozei doar în modul edit:
    if (showChangePhotoOnlyWhenEditable && !editable) return;

    if (Platform.OS === 'web') {
      triggerWebPicker();
      return;
    }

    // Mobile
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
      setImage({
        uri: pickedImage.uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });
      setUser((prev) => ({ ...prev, avatar: pickedImage.uri }));
    }
  };

  const handleSave = async () => {
    if (!token) return;

    const formData: any = new FormData();
    formData.append('name', user.name);
    formData.append('phone', user.phone ?? '');

    // atașează fișierul
    if (image) {
      if (Platform.OS === 'web') {
        // pe web e un File
        formData.append('avatar', image);
      } else {
        // pe mobil punem tripleta { uri, name, type }
        formData.append('avatar', image);
      }
    }

    try {
      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // nu seta 'Content-Type' manual; axios pune boundary corect
        },
      });

      const u = res.data?.user || {};

      // optimistic update -> Navbar se actualizează imediat
      setProfileLocal({
        name: u.name ?? user.name,
        email: u.email ?? user.email,
        phone: u.phone ?? user.phone,
        role: profile?.role ?? 'Receptionist',
        avatar: u.avatar ?? user.avatar ?? null,
      });

      // sync sigur
      await refreshProfile();

      // UI
      setUser({
        name: u.name ?? user.name,
        email: u.email ?? user.email,
        phone: u.phone ?? user.phone,
        avatar: u.avatar ?? user.avatar ?? null,
      });
      setOriginalUser({
        name: u.name ?? user.name,
        email: u.email ?? user.email,
        phone: u.phone ?? user.phone,
        avatar: u.avatar ?? user.avatar ?? null,
      });
      setEditable(false);
      setImage(null);

      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err: any) {
      console.log('Backend error:', err?.response?.data || err?.message || err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setImage(null);
    setEditable(false);
  };

  const showCameraButton =
    !showChangePhotoOnlyWhenEditable || (showChangePhotoOnlyWhenEditable && editable);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Profile</Text>

      {/* input ascuns pentru web */}
      {Platform.OS === 'web' && (
        <input
          ref={webFileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onWebFileChange}
        />
      )}

      <View style={styles.content}>
        {/* Avatar + overlay */}
        <View style={styles.left}>
          <View style={styles.avatarWrapper}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]} />
            )}

            {showCameraButton && (
              <TouchableOpacity style={styles.cameraBtn} onPress={handleChoosePhoto}>
                <Text style={styles.cameraIcon}>📷</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* alternativ: text sub avatar */}
          {showCameraButton && (
            <TouchableOpacity onPress={handleChoosePhoto} style={styles.changePhotoLink}>
              <Text style={styles.changePhotoText}>Change photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form fields */}
        <View style={styles.right}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, editable ? styles.inputEditable : undefined]}
            value={user.name || ''}
            editable={editable}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={user.email || ''} editable={false} />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, editable ? styles.inputEditable : undefined]}
            value={user.phone || ''}
            editable={editable}
            onChangeText={(text) => setUser({ ...user, phone: text })}
          />

          {!editable ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditable(true)}>
              <Text style={styles.editBtnText}>Edit profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save changes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1f2a5a',
  },
  content: {
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
    marginRight: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: '#e7e9f3',
  },
  cameraBtn: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2F3C7E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  cameraIcon: {
    fontSize: 16,
    color: '#fff',
  },
  changePhotoLink: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d7daf0',
  },
  changePhotoText: {
    fontSize: 12,
    color: '#2F3C7E',
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  right: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    color: '#2b2f42',
  },
  input: {
    backgroundColor: '#f4f6fa',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e4ef',
  },
  inputEditable: {
    backgroundColor: '#fff',
    borderColor: '#c9cde5',
  },
  editBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c9cde5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  editBtnText: {
    color: '#2b2f42',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  saveBtn: {
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  cancelBtn: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#fff', fontWeight: '700' },
});
