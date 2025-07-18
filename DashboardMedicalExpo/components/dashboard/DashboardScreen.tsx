import { ScrollView, StyleSheet, View } from 'react-native';
import { useDashboardData } from '../../hooks/useDashboardData';
import GenderPieChart from './GenderPieChart';
import PatientOverviewChart from './PatientOverviewChart';
import StatCards from './StatCards';
import TopDoctorsList from './TopDoctorsList';

export default function DashboardScreen() {
  const { stats, program, notifications, chartData } = useDashboardData();

  return (
    <ScrollView style={styles.page}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.stats}>
            <StatCards
              patients={stats.patients}
              consultations={stats.consultations}
            />
          </View>
        </View>
        <View style={styles.middleRow}>
        <PatientOverviewChart />
        <View style={styles.sidebar}>
            <TopDoctorsList />
            <GenderPieChart />
        </View>
        </View>

        
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    padding: 20,
  },
  card: {
    backgroundColor: '#f4f6fa',
    borderRadius: 16,
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: -35,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  sidebar: {
  alignSelf: 'flex-end',
  flexDirection: 'column',
  marginRight: -35,
  gap: 20,
},
middleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginTop: 20,
  gap: 20,
},

});
