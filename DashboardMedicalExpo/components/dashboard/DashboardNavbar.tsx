import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function DashboardNavbar() {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        placeholder="Search..."
        placeholderTextColor="#999"
        style={styles.input}
      />

      {/* Right Section */}
      <View style={styles.rightSection}>
        <Ionicons name="notifications-outline" size={20} color="#4A5AA6" style={styles.icon} />

        <Image
          source={{ uri: 'https://i.pravatar.cc/40?img=4' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.user}>Sarah John</Text>
          <Text style={styles.subtitle}>Hospital</Text>
        </View>

        <Image
  source={require('../../assets/images/logo.png')} 
  style={styles.logo}
/>

        
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f4f6fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 280,
    fontSize: 14,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    marginRight: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userInfo: {
    marginLeft: 6,
    marginRight: 12,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
  },
  logo: {
    width: 80,
    height: 32,
    resizeMode: 'contain',
  },
});
