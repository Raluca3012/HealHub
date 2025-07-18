import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart as RawLineChart } from 'react-native-chart-kit';

const LineChart: any = RawLineChart;



const screenWidth = Dimensions.get('window').width;

const Dashboard: React.FC = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Hello, Dr. Doe!</Text>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>20</Text>
                    <Text>Patients</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text>Consultations Today</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Today's Program</Text>
            <View style={styles.listBox}>
                <Text>🕗 08:00 - Abby Carter</Text>
                <Text>🕘 09:00 - Noah Carter</Text>
                <Text>🕙 10:00 - John Carter</Text>
            </View>

            <Text style={styles.sectionTitle}>Last Notifications</Text>
            <View style={styles.listBox}>
                <Text>📩 Message from Abby Carter</Text>
                <Text>🧪 Results for Abby Carter</Text>
                <Text>🧪 Results for John Carter</Text>
            </View>

            <Text style={styles.sectionTitle}>Patients (Graph)</Text>
            <LineChart
                data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    datasets: [{ data: [5, 8, 6, 10, 12] }],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: () => '#000',
                }}
                style={{ borderRadius: 16, marginTop: 10 }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f2f4f7' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        width: '47%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    statNumber: { fontSize: 22, fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
    listBox: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
    },
});

export default Dashboard;
