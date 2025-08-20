import { ScrollView, StyleSheet } from 'react-native';
import ProfileForm from './ProfileForm';

export default function SettingsScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ProfileForm />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f6f9',
    },
});
    