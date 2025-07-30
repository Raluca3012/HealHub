import { Slot, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { label: 'Dashboard', route: '/' },
  { label: 'Appointments', route: '/appointments' },
  { label: 'Doctors', route: '/doctors' },
  { label: 'Patients', route: '/patients' },
  { label: 'Devices', route: '/devices' },
  { label: 'Notifications', route: '/notifications' },
  { label: 'Settings', route: '/settings' },
];

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, logout } = useAuth();

  if (!token) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={styles.logo}>🏥 RACES</Text>

        {menuItems.map((item) => {
          const isActive = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => router.push(item.route as any)}
              style={[styles.menuItemWrapper, isActive && styles.activeItem]}
            >
              <Text style={[styles.menuItemText, isActive && styles.activeItemText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <DashboardNavbar />
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#2F3C7E',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuItemWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 15,
    color: '#fff',
  },
  activeItem: {
    backgroundColor: '#fff',
  },
  activeItemText: {
    color: '#2F3C7E',
    fontWeight: 'bold',
  },
  logout: {
    marginTop: 'auto',
    paddingVertical: 10,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    padding: 20,
  },
});
