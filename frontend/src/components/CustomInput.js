import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ value, onChangeText, placeholder, secureTextEntry }) => {
    return (
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        fontSize: 16,
    },
});

export default CustomInput;
