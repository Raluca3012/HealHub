import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Patient {
    id: number;
    name: string;
    gender: string;
    image: string;
    checkin: string;
    mobile: string;
    email: string;
    address: string;
    doctor_name: string;
    problem: string;
    room: string;
    status: string;
    created_at: string;
}

interface Note {
    id: number;
    patient_id: number;
    content: string;
    author: string;
    created_at: string;
    doctor_name: string;
    note_date: string;
}

interface Report {
    id: number;
    patient_id: number;
    type: string;
    value: number;
    test_type: 'EEG' | 'FNIRS';
}

interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    doctor_id: number;
    patient_id: number;
    specialty: string;

    doctor_name?: string;
    doctor_email?: string;
    doctor_phone?: string;
    doctor_specialty?: string;
    doctor_image?: string;
}


interface Doctor {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string;
    specialty: string;
    experience: number;
    average_rating?: number;
    review_comment?: string;
}

export default function PatientViewScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeTab, setActiveTab] = useState<'EEG' | 'FNIRS'>('EEG');
    const [rating, setRating] = useState<number | null>(null);
    const [ratingCount, setRatingCount] = useState<number>(0);

    const [showAllNotes, setShowAllNotes] = useState(false);


    useEffect(() => {
        fetch(`http://localhost:8000/api/patient/${id}/details`)
            .then((response) => response.json())
            .then((data) => {
                setPatient(data.patient);
                setDoctor({
                    ...data.doctor,
                    experience: data.doctor.experience ?? data.doctor.experience_years ?? 0,
                });

                setNotes(data.notes);
                setReports(data.reports);

                setAppointments(data.appointments);

                setRating(parseFloat(data.rating) || 0);
                setRatingCount(data.rating_count || 0);
            })
            .catch((error) => console.error('Error loading patient details:', error));
    }, [id]);




    if (!patient) return <Text style={styles.loading}>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>{'<'} Back</Text>
            </TouchableOpacity>

            <View style={styles.gridTop}>
                {/* Patient Card */}
                <View style={styles.headerCard}>
                    <View style={styles.profileRow}>
                        <Image source={{ uri: patient.image || '...' }} style={styles.profileImage} />
                        <Text style={styles.name}>{patient.name}</Text>
                    </View>
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}><Text style={styles.label}>Mobile Number</Text><Text style={styles.value}>{patient.mobile}</Text></View>
                        <View style={styles.detailItem}><Text style={styles.label}>Problem</Text><Text style={styles.value}>{patient.problem}</Text></View>
                        <View style={styles.detailItem}><Text style={styles.label}>Gender</Text><Text style={styles.value}>{patient.gender}</Text></View>
                        <View style={styles.detailItem}><Text style={styles.label}>Patient Status</Text><Text style={styles.value}>{patient.status}</Text></View>
                        <View style={styles.detailItem}><Text style={styles.label}>Email Address</Text><Text style={styles.value}>{patient.email}</Text></View>
                        <View style={styles.detailItem}><Text style={styles.label}>Address</Text><Text style={styles.value}>{patient.address}</Text></View>
                    </View>
                </View>

                {/* Notes */}
                <View style={styles.cardNotes}>
                    <View style={styles.notesHeader}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        {notes.length > 1 && (
                            <TouchableOpacity onPress={() => setShowAllNotes(!showAllNotes)}>
                                <Text style={styles.seeAll}>{showAllNotes ? 'Show less' : 'See all'}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {showAllNotes ? (
                        notes.map((note, index) => (
                            <View key={note.id} style={styles.noteBox}>
                                <Text style={styles.noteContent}>{note.content}</Text>
                                <Text style={styles.noteMeta}>
                                    Note {index + 1} •{' '}
                                    <Text style={{ fontWeight: 'bold', color: '#2F3C7E' }}>{note.doctor_name}</Text> •{' '}
                                    {new Date(note.note_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </Text>
                            </View>
                        ))
                    ) : (
                        notes[0] && (
                            <>
                                <View style={styles.noteBox}>
                                    <Text style={styles.noteContent}>{notes[0].content}</Text>
                                </View>
                                <Text style={styles.noteMeta}>
                                    Note 1 •{' '}
                                    <Text style={{ fontWeight: 'bold', color: '#2F3C7E' }}>{notes[0].doctor_name}</Text> •{' '}
                                    {new Date(notes[0].note_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </Text>
                            </>
                        )
                    )}
                </View>


                {/* Doctor Info */}
                <View style={styles.cardDoctor}>
                    <Text style={styles.sectionTitle}>Assigned Doctor</Text>

                    <View style={styles.doctorHeader}>
                        <Image
                            source={{ uri: doctor?.image || 'https://via.placeholder.com/80' }}
                            style={styles.doctorImage}
                        />
                        <View>
                            <Text style={styles.doctorName}>{doctor?.name}</Text>
                            {(ratingCount ?? 0) > 0 && rating !== null ? (
                                <Text style={styles.ratingText}>
                                    ⭐ {rating.toFixed(1)} ({ratingCount})
                                </Text>
                            ) : (
                                <Text style={styles.ratingText}>⭐ No ratings</Text>
                            )}




                        </View>
                    </View>

                    <View style={styles.iconDetail}>
                        <Text style={styles.iconLabel}>📧 Email Address</Text>
                        <Text style={styles.detail}>{doctor?.email}</Text>
                    </View>
                    <View style={styles.iconDetail}>
                        <Text style={styles.iconLabel}>📞 Phone Number</Text>
                        <Text style={styles.detail}>+91 {doctor?.phone}</Text>
                    </View>
                    <View style={styles.iconDetail}>
                        <Text style={styles.iconLabel}>🩺 Speciality</Text>
                        <Text style={styles.detail}>{doctor?.specialty}</Text>
                    </View>
                    <View style={styles.iconDetail}>
                        <Text style={styles.iconLabel}>💼Work Experience</Text>
                        <Text style={styles.detail}>{doctor?.experience || 'N/A'} Years</Text>

                    </View>
                </View>


            </View>

            {/* Appointments + Reports */}
            <View style={styles.gridBottom}>
                <View style={styles.cardAppointments}>
                    <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                    {appointments
                        .filter((appt) => {
                            const apptDateTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`);
                            return apptDateTime > new Date();
                        })
                        .sort((a, b) => {
                            const aTime = new Date(`${a.appointment_date}T${a.appointment_time}`);
                            const bTime = new Date(`${b.appointment_date}T${b.appointment_time}`);
                            return aTime.getTime() - bTime.getTime();
                        })
                        .map((appt) => (
                            <View key={appt.id} style={styles.appointmentRow}>
                                <Image
                                    source={{ uri: appt.doctor_image || 'https://via.placeholder.com/80' }}
                                    style={styles.profileImage}
                                />
                                <View style={{ flex: 1, marginLeft: 40 }}>
                                    <Text style={styles.detail}>{appt.doctor_name || 'Unavailable'}</Text>
                                    <Text style={{ color: '#888' }}>{appt.doctor_specialty || 'Unknown'}</Text>
                                </View>
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
                                    <Text style={styles.timeText}>{appt.appointment_time?.slice(0, 5)}</Text>
                                </View>
                            </View>
                        ))
                    }
                    {appointments.filter((appt) => {
                        const apptDateTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`);
                        return apptDateTime > new Date();
                    }).length === 0 && (
                            <Text>No upcoming appointments.</Text>
                        )}


                </View>

                {/* EEG & FNIRS Reports */}
                <View style={styles.cardChart}>
                    <View style={styles.tabRow}>
                        {['EEG', 'FNIRS'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab as 'EEG' | 'FNIRS')}
                                style={[styles.tab, activeTab === tab && styles.activeTab]}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Report - 2024</Text>
                        {reports
                            .filter((r) => r.test_type === activeTab)
                            .map((r, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    <Text style={{ fontWeight: '600', width: 70 }}>{r.type}</Text>
                                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                                        <View style={{ height: 2, backgroundColor: '#333', width: `${Math.min(r.value * 2, 100)}%` }} />
                                    </View>
                                    <Text style={{ color: '#4B5563', fontWeight: '500' }}>{r.value} Hz</Text>
                                </View>
                            ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
    backButton: { marginBottom: 10 },
    backButtonText: { color: '#2F3C7E', fontWeight: 'bold' },
    gridTop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 16 },
    headerCard: { flexBasis: '32%', backgroundColor: '#2F3C7E', borderRadius: 12, padding: 20 },
    //profileImage: { width: 60, height: 60, borderRadius: 40, alignSelf: 'flex-start', },
    // name: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 10 },
    detailsGrid: { marginTop: 20, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' },
    detailItem: { width: '48%', marginBottom: 10 },
    label: { fontWeight: '600', color: '#e0e7ff' },
    value: { color: '#fff', marginTop: 4 },
    cardNotes: { flexBasis: '32%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
    cardDoctor: { flexBasis: '32%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
    sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 10 },
    notes: { fontSize: 14, color: '#333' },
    noteMeta: { fontSize: 12, color: '#666', marginTop: 4 },
    detail: { fontSize: 14, marginBottom: 4, },
    gridBottom: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
    cardAppointments: { flexBasis: '49%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
    cardChart: { flexBasis: '49%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
    appointmentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    appointmentImg: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    dateBox: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 8, marginHorizontal: 6 },
    dateText: { fontSize: 12, textAlign: 'center' },
    timeBox: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 8 },
    timeText: { fontSize: 12 },
    tabRow: { flexDirection: 'row', gap: 12 },
    tab: { padding: 8, borderRadius: 6, backgroundColor: '#e5e7eb' },
    activeTab: { backgroundColor: 'darkblue' },
    tabText: { fontSize: 14, color: '#333' },
    activeTabText: { color: '#fff' },
    loading: { marginTop: 50, textAlign: 'center', fontSize: 16 },
    ratingText: {
        fontSize: 14,
        color: '#fbbf24',
        fontWeight: '600',
        marginBottom: 6,
    },
    notesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    seeAll: {
        fontSize: 13,
        color: '#2F3C7E',
        fontWeight: '600',
    },
    noteBox: {
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    noteContent: {
        fontSize: 13.5,
        color: '#333',
        lineHeight: 18,
    },
    doctorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    doctorImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    doctorName: {
        fontWeight: '600',
        fontSize: 15,
    },
    iconDetail: {
        marginBottom: 10,
    },
    iconLabel: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '600',
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 16,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },



});
