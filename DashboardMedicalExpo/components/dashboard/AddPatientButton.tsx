import { Button, StyleSheet, View } from 'react-native';

export default function AddPatientButton() {
    return (
        <View style={styles.container}>
            <Button
                title="ADD PATIENT"
                onPress={() => { }}
                color="#3b5bdb"
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        marginVertical: 10,
    },
});
