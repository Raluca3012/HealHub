import { StyleSheet, Text, View } from 'react-native';

export default function NotificationList({ items }: { items: string[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Last Notifications</Text>
            {items.map((n, i) => (
                <View key={i} style={styles.item}>
                    <Text style={styles.text}>{n}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    text: {
        fontSize: 14,
    },
});
