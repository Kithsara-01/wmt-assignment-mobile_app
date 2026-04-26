import React, { useState, useContext, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createProduct } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Loading from '../../components/Loading';

const AddProductScreen = ({ navigation }) => {
    const { token, user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.role !== 'admin') {
            Alert.alert('Access Denied', 'Admin only.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    }, [user, navigation]);

    if (user?.role !== 'admin') {
        return null; // Don't render anything while showing alert
    }
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        productId: '',
        name: '',
        brand: '',
        vehicleType: '',
        vehicleName: '',
        category: '',
        price: '',
        discount: '0',
        stockQuantity: '',
        description: '',
    });
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleCreate = async () => {
        const { 
            productId, name, brand, vehicleType, vehicleName, 
            category, price, discount, stockQuantity 
        } = form;

        // Validation
        if (!productId || !name || !brand || !vehicleType || !vehicleName || !category || !price || !stockQuantity) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (isNaN(price) || isNaN(discount) || isNaN(stockQuantity)) {
            Alert.alert('Error', 'Price, Discount, and Stock must be numbers');
            return;
        }

        if (Number(discount) > 100) {
            Alert.alert('Error', 'Discount cannot exceed 100%');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            if (image) {
                const uriParts = image.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                formData.append('image', {
                    uri: image.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
            }

            await createProduct(formData, token);
            Alert.alert('Success', 'Product created successfully');
            navigation.navigate('ProductList');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Product</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Tap to select product image</Text>
                )}
            </TouchableOpacity>

            <CustomInput placeholder="Product ID *" value={form.productId} onChangeText={(val) => setForm({...form, productId: val})} />
            <CustomInput placeholder="Product Name *" value={form.name} onChangeText={(val) => setForm({...form, name: val})} />
            <CustomInput placeholder="Brand *" value={form.brand} onChangeText={(val) => setForm({...form, brand: val})} />
            <CustomInput placeholder="Vehicle Type (e.g. Car, Bike) *" value={form.vehicleType} onChangeText={(val) => setForm({...form, vehicleType: val})} />
            <CustomInput placeholder="Vehicle Name (e.g. Corolla) *" value={form.vehicleName} onChangeText={(val) => setForm({...form, vehicleName: val})} />
            <CustomInput placeholder="Category (e.g. Engine) *" value={form.category} onChangeText={(val) => setForm({...form, category: val})} />
            <CustomInput placeholder="Price (Rs.) *" value={form.price} onChangeText={(val) => setForm({...form, price: val})} keyboardType="numeric" />
            <CustomInput placeholder="Discount (%)" value={form.discount} onChangeText={(val) => setForm({...form, discount: val})} keyboardType="numeric" />
            <CustomInput placeholder="Stock Quantity *" value={form.stockQuantity} onChangeText={(val) => setForm({...form, stockQuantity: val})} keyboardType="numeric" />
            <CustomInput placeholder="Description" value={form.description} onChangeText={(val) => setForm({...form, description: val})} />

            <CustomButton title="Save Product" onPress={handleCreate} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    imagePicker: {
        height: 200,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    imagePlaceholder: {
        color: '#999',
    },
});

export default AddProductScreen;
