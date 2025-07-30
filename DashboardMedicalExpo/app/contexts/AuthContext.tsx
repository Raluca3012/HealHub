import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface AuthContextType {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkSession = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const isOnAuth = segments?.[0] === '(auth)';

      if (storedToken) {
        setToken(storedToken);
        if (isOnAuth) router.replace('/(dashboard)');
      } else {
        if (!isOnAuth) router.replace('/(auth)/login');
      }
      setLoading(false);
    };
    checkSession();
  }, [segments]);

  const login = async (token: string) => {
    await AsyncStorage.setItem('token', token);
    setToken(token);
    router.replace('/(dashboard)');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Verifying session...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};