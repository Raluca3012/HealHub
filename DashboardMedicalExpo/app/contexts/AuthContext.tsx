import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type Profile = {
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  avatar?: string | null;
};

interface AuthContextType {
  token: string | null;
  profile: Profile | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfileLocal: (p: Profile | null) => void; // pentru update optimist în Settings
}

const AuthContext = createContext<AuthContextType | null>(null);

// ⚠️ dacă rulezi pe device/emulator, pune IP-ul LAN al PC-ului (nu 127.0.0.1)
const API_BASE = 'http://127.0.0.1:8000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  // încarcă token-ul și, dacă există, preia profilul
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const isOnAuth = segments?.[0] === '(auth)';

      if (storedToken) {
        setToken(storedToken);
        // încărcăm profilul înainte de navigare (nu blocant)
        refreshProfile(storedToken).catch(() => {});
        if (isOnAuth) router.replace('/(dashboard)');
      } else {
        setProfile(null);
        if (!isOnAuth) router.replace('/(auth)/login');
      }
      setLoading(false);
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments]);

  const refreshProfile = async (tk?: string) => {
    const useToken = tk ?? token;
    if (!useToken) return;

    const res = await fetch(`${API_BASE}/user-profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useToken}`,
      },
    });

    if (!res.ok) {
      // 401/403 etc — profilul nu poate fi preluat.
      return;
    }

    const data = await res.json();
    const u = data?.user || {};
    const p: Profile = {
      name: u.name ?? '',
      email: u.email ?? '',
      phone: u.phone ?? '',
      role: u.role ?? '',
      avatar: u.avatar ?? null,
    };
    setProfile(p);
  };

  const setProfileLocal = (p: Profile | null) => setProfile(p);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    await refreshProfile(newToken); // încărcăm profilul imediat
    router.replace('/(dashboard)');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setProfile(null);
    router.replace('/(auth)/login');
  };

  const value = useMemo(
    () => ({ token, profile, login, logout, refreshProfile, setProfileLocal }),
    [token, profile]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Verifying session...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
