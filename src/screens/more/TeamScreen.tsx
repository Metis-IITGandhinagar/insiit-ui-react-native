import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TeamScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello Users</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default TeamScreen;
