import { useAuth } from '@/app/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function DashboardNavbar() {
  const { profile } = useAuth();

  const name = profile?.name || '';
  const role = profile?.role || 'Receptionist';
  const avatar = profile?.avatar || null;

  return (
    <View style={styles.container}>
      <View style={styles.rightSection}>
        <Ionicons name="notifications-outline" size={20} color="#4A5AA6" style={styles.icon} />

        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
        )}

        <View style={styles.userInfo}>
          <Text style={styles.user} numberOfLines={1}>{name}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{role}</Text>
        </View>

        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  icon: {
    marginRight: 6
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  userInfo: {
    marginLeft: 6,
    marginRight: 12,
    maxWidth: 160
  },
  user: {
    fontWeight: 'bold',
    fontSize: 14
  },
  subtitle: {
    fontSize: 12,
    color: '#999'
  },
  logo: {
    width: 80,
    height: 32,
    resizeMode: 'contain'
  },
});
