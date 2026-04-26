import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';

const HomeScreen = ({ navigation }) => {
    const { logout, user } = useContext(AuthContext);

    const handleOtherModule = () => {
        Alert.alert('Notice', 'This module will be developed by another group member.');
    };

    const getModules = () => {
        const baseModules = [
            { title: 'Products', onPress: () => navigation.navigate('ProductList'), icon: '📦' },
        ];

        if (user?.role === 'admin') {
            return [
                ...baseModules,
                { title: 'Orders', onPress: handleOtherModule, icon: '🛒' },
                { title: 'Suppliers', onPress: handleOtherModule, icon: '🚛' },
                { title: 'Inventory', onPress: handleOtherModule, icon: '📋' },
                { title: 'Feedback', onPress: handleOtherModule, icon: '💬' },
                { title: 'Service Booking', onPress: handleOtherModule, icon: '🛠️' },
            ];
        }

        // For customers, only show Products for now
        return baseModules;
    };

    const modules = getModules();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Hello, {user?.name || 'User'}</Text>
                <Text style={styles.role}>Role: {user?.role || 'Unknown'}</Text>
                <Text style={styles.subtitle}>Welcome to SpareParts Hub</Text>
            </View>

            <View style={styles.grid}>
                {modules.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.card} 
                        onPress={item.onPress}
                    >
                        <Text style={styles.icon}>{item.icon}</Text>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <CustomButton title="Logout" onPress={logout} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    role: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        fontSize: 40,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    footer: {
        marginTop: 20,
        marginBottom: 40,
    },
});

export default HomeScreen;
