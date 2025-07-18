import { StyleSheet, Text, View } from 'react-native';

type ProgramItem = { time: string; name: string };

export default function ProgramList({ items }: { items: ProgramItem[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today’s Program 📅</Text>
            {items.map((item, i) => (
                <View key={i} style={styles.item}>
                    <Text style={styles.text}>{item.time} - {item.name}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        width: 240,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 6,
    },
    text: {
        fontSize: 14,
    },
});
