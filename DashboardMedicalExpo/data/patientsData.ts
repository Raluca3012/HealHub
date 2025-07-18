export type Patient = {
    id: string;
    name: string;
    diagnosis: string;
    address: string;
    image: string;
};

export const recentPatients: Patient[] = [
    {
        id: 'P001',
        name: 'Abbey Carter',
        diagnosis: 'Cancer',
        address: '795 Folsom Ave, Suite 600 San Francisco, CADGE 94107',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
        id: 'P002',
        name: 'Noah',
        diagnosis: 'Obesity',
        address: '795 Folsom Ave, Suite 600 San Francisco, CADGE 94107',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
        id: 'P003',
        name: 'James',
        diagnosis: 'Physical Therapy',
        address: '795 Folsom Ave, Suite 600 San Francisco, CADGE 94107',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
        id: 'P004',
        name: 'Amelia',
        diagnosis: 'Diabetes',
        address: '795 Folsom Ave, Suite 600 San Francisco, CADGE 94107',
        image: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
];
