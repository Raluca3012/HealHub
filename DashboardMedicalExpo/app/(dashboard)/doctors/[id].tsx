import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Doctor {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string;
    specialty: string;
    experience_years: number;
    address: string;
    working_at: string;
}

interface Patient {
    id: number;
    name: string;
    problem: string;
    image: string;
    address: string;
}

interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    patient_name: string;
    patient_problem: string;
    patient_image: string;
}

interface Review {
    id: number;
    patient_id: number;
    comment: string;
    rating: number;
}

type WeekDay = {
    date: Date;
    dayLabel: string;
    dateLabel: string;
};

const getWeekDays = (startDate: Date): WeekDay[] => {
    const days: WeekDay[] = [];
    const day = new Date(startDate);
    for (let i = 0; i < 7; i++) {
        days.push({
            date: new Date(day),
            dayLabel: day.toLocaleDateString('en-US', { weekday: 'short' }),
            dateLabel: day.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        });
        day.setDate(day.getDate() + 1);
    }
    return days;
};

export default function DoctorViewScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState<number | null>(null);
    const [ratingCount, setRatingCount] = useState<number>(0);
    const [selectedDayIndex, setSelectedDayIndex] = useState(3);

    const weekDays = getWeekDays(new Date());
    const selectedDate = weekDays[selectedDayIndex].date.toISOString().split('T')[0];

    const filteredAppointments = appointments
        .filter(appt => appt.appointment_date.startsWith(selectedDate))
        .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));


    useEffect(() => {
        fetch(`http://localhost:8000/api/doctor/${id}/details`)
            .then(res => res.json())
            .then(data => {
                setDoctor(data.doctor);
                setPatients(data.patients);
                setAppointments(data.appointments);
                setReviews(data.reviews);
                setRating(data.rating);
                setRatingCount(data.rating_count);
            })
            .catch(err => console.error('Error fetching doctor details:', err));
    }, [id]);

    const getPatientInfo = (patient_id: number) => {
        return patients.find(p => p.id === patient_id);
    };

    if (!doctor) return <Text style={styles.loading}>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>

            <View style={styles.mainWrapper}>
                <View style={styles.leftColumn}>
                    <View style={styles.doctorBanner}>
                        <View style={styles.doctorInfoBox}>
                            <Text style={styles.doctorTitle}>{doctor.name}</Text>
                            <View style={styles.infoGrid}>
                                <View style={styles.infoItem}><Text style={styles.infoLabel}>📱 Mobile Number</Text><Text style={styles.infoText}>+91 {doctor.phone}</Text></View>
                                <View style={styles.infoItem}><Text style={styles.infoLabel}>🧠 Speciality</Text><Text style={styles.infoText}>{doctor.specialty}</Text></View>
                                <View style={styles.infoItem}><Text style={styles.infoLabel}>💼 Work Experience</Text><Text style={styles.infoText}>{doctor.experience_years} Years</Text></View>
                                <View style={styles.infoItem}><Text style={styles.infoLabel}>📍 Address</Text><Text style={styles.infoText}>{doctor.address}</Text></View>
                                <View style={styles.infoItem}><Text style={styles.infoLabel}>✉️ Email Address</Text><Text style={styles.infoText}>{doctor.email}</Text></View>
                                <View style={styles.infoItem}><Text style={styles.infoLabel}>🏥 Working at</Text><Text style={styles.infoText}>{doctor.working_at}</Text></View>
                            </View>
                        </View>
                        <Image source={{ uri: doctor.image }} style={styles.bannerImage} />
                    </View>

                    <View style={styles.patientContainer}>
                        <Text style={styles.sectionTitle}>Recent Patients</Text>

                        {appointments
                            .filter(appt => {
                                const apptDateTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`);
                                const now = new Date();
                                return (
                                    apptDateTime < now &&
                                    apptDateTime.getMonth() === now.getMonth() &&
                                    apptDateTime.getFullYear() === now.getFullYear()
                                );
                            })
                            .reduce((acc: Appointment[], current) => {
                                if (!acc.find(a => a.patient_name === current.patient_name)) {
                                    acc.push(current);
                                }
                                return acc;
                            }, [])
                            .map(appt => (
                                <View key={appt.id} style={styles.patientCard}>
                                    <Image source={{ uri: appt.patient_image }} style={styles.avatar} />
                                    <View>
                                        <Text style={styles.cardName}>{appt.patient_name}</Text>
                                        <Text>{appt.patient_problem}</Text>
                                        <Text style={styles.cardSub}>Visited on {new Date(appt.appointment_date).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>


                    <View style={styles.reviewContainer}>
                        <Text style={styles.sectionTitle}>Patients Reviews</Text>
                        {reviews.map((r) => {
                            const patient = getPatientInfo(r.patient_id);
                            return (
                                <View key={r.id} style={styles.reviewCard}>
                                    <Image source={{ uri: patient?.image }} style={styles.avatar} />
                                    <View>
                                        <Text style={styles.cardName}>{patient?.name}</Text>
                                        <Text>{r.comment}</Text>
                                        <Text style={styles.rating}>⭐ {r.rating.toFixed(1)}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.appointmentsContainer}>
                        <View style={styles.headerCard}>
                            <Text style={styles.headerText}>Doctor's Appointments</Text>
                        </View>


                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekScroll}>
                            {weekDays.map((d: WeekDay, index: number) => (
                                <Pressable
                                    key={d.date.toDateString()}
                                    onPress={() => setSelectedDayIndex(index)}
                                    style={[styles.dayItem, index === selectedDayIndex && styles.activeDay]}
                                >
                                    <Text style={styles.dayLabel}>{d.dayLabel}</Text>
                                    <Text style={styles.dayDate}>{d.dateLabel}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <View style={styles.appointmentCard}>
                            {filteredAppointments.map((appt) => (
                                <View key={appt.id} style={styles.appointmentItem}>
                                    <Image source={{ uri: appt.patient_image }} style={styles.avatar} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardName}>{appt.patient_name}</Text>
                                        <Text>{appt.patient_problem}</Text>
                                    </View>
                                    <View style={styles.cardDateTimeSplit}>
                                        <View style={styles.dateBox}>
                                            <Text style={styles.dateText}>
                                                {new Date(appt.appointment_date).toLocaleDateString('en-GB', {
                                                    weekday: 'short',
                                                    day: '2-digit',
                                                    month: 'short',
                                                })}
                                            </Text>
                                        </View>
                                        <View style={styles.timeBox}>
                                            <Text style={styles.timeText}>{appt.appointment_time.slice(0, 5)}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9fafb'
    },
    backButton: {
        marginBottom: 10
    },
    backText: {
        color: '#2F3C7E',
        fontWeight: 'bold'
    },
    loading: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 16
    },
    mainWrapper: {
        flexDirection: 'row',
        gap: 16
    },
    leftColumn: {
        flex: 1
    },
    rightColumn: {
        flex: 1,
        maxWidth: 500,
    },
    doctorBanner: {
        backgroundColor: '#2F3C7E',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    doctorInfoBox: {
        flex: 1
    },
    doctorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    infoItem: {
        width: '48%',
        marginBottom: 10
    },
    infoLabel: {
        fontWeight: '600',
        color: '#cbd5e1'
    },
    infoText: {
        color: '#fff',
        marginTop: 4
    },
    bannerImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginLeft: 20
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    cardName: {
        fontWeight: '600'
    },
    cardSub: {
        fontSize: 12,
        color: '#666'
    },
    rating: {
        color: '#fbbf24',
        fontWeight: '600'
    },

    appointmentCard: {
        marginTop: 10
    },
    appointmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
        maxHeight: 100,
    },
    cardDateTimeSplit: {
        flexDirection: 'row',
        gap: 5,
        height: 40,
        fontSize: 12,
    },
    dateBox: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8
    },
    timeBox: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
    },
    timeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
    },
    reviewContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
    },
    reviewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
    },
    patientContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
    },
    patientCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
    },
    weekScroll: {
        marginBottom: 10,
    },
    dayItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginRight: 8,
        minWidth: 50,
        minHeight: 50,

        backgroundColor: '#fff',


    },
    activeDay: {
        backgroundColor: '#2f3c7e',
    },
    dayLabel: {
        fontSize: 12,
        color: '#999',
    },
    dayDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray',
    },
    dayNumber: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#999',
    },
    appointmentsContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },

    headerCard: {
        backgroundColor: '#2F3C7E',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        alignItems: 'flex-start',
    },

    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

});
