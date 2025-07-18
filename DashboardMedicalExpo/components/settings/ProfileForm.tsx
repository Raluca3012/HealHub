import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userProfile } from '../../data/userProfile';

export default function ProfileForm() {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Profile</Text>

            <View style={styles.content}>
                <View style={styles.left}>
                    <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                    <TouchableOpacity>
                        <Text style={styles.changePhoto}>📷 Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.right}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput style={styles.input} value={userProfile.name} editable={false} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.input} value={userProfile.email} editable={false} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput style={styles.input} value={userProfile.phone} editable={false} />
                    </View>

                    <TouchableOpacity style={styles.changePassword}>
                        <Text style={{ color: '#333' }}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton}>
                        <Text style={{ color: '#fff' }}>Delete Account</Text>
                    </TouchableOpacity>
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
    deleteButton: {
        marginTop: 16,
        alignSelf: 'flex-start',
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#e53935',
    },
});
