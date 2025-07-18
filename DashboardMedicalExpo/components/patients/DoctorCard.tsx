import { Image, StyleSheet, Text, View } from 'react-native';


export default function DoctorHeader() {
    return (
        <View style={styles.container}>
            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.name}>Dr. Doe</Text>

                <View style={styles.columns}>
                    {/* Col 1 */}
                    <View style={styles.column}>
                        <Text style={styles.line}>📞 +91 9505999901</Text>
                        <Text style={styles.line}>💼 10 Years</Text>
                        <Text style={styles.line}>📧 doe0107@gmail.com</Text>
                    </View>

                    {/* Col 2 */}
                    <View style={styles.column}>
                        <Text style={styles.line}>🧠 Neurologist</Text>
                        <Text style={styles.line}>📍 Hyderabad, Telangana</Text>
                        <Text style={styles.line}>🏥 Apollo Hospital</Text>
                    </View>
                </View>
            </View>

            {/* Profile Image */}
            <Image
                source={{
                    uri: 'https://randomuser.me/api/portraits/women/65.jpg',
                }}
                style={styles.avatar}
            />
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1e3a8a', 
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginRight: 20,
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    columns: {
        flexDirection: 'row',
        gap: 30,
    },
    column: {
        flex: 1,
    },
    line: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 6,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 20,
    },
});

