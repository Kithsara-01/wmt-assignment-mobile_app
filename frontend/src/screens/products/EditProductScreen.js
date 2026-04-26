import React, { useState, useContext, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateProduct } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Loading from '../../components/Loading';

const EditProductScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { token, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

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

    const [form, setForm] = useState({
        productId: product.productId,
        name: product.name,
        brand: product.brand,
        vehicleType: product.vehicleType,
        vehicleName: product.vehicleName,
        category: product.category,
        price: product.price.toString(),
        discount: product.discount.toString(),
        stockQuantity: product.stockQuantity.toString(),
        description: product.description || '',
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

    const handleUpdate = async () => {
        const { 
            productId, name, brand, vehicleType, vehicleName, 
            category, price, discount, stockQuantity 
        } = form;

        // Validation
        if (!productId || !name || !brand || !vehicleType || !vehicleName || !category || !price || !stockQuantity) {
            Alert.alert('Error', 'Please fill in all required fields');
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

            await updateProduct(product._id, formData, token);
            Alert.alert('Success', 'Product updated successfully');
            navigation.navigate('ProductList');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    const currentImageUrl = product.image ? `http://localhost:5000${product.image}` : null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Product</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
                ) : currentImageUrl ? (
                    <Image source={{ uri: currentImageUrl }} style={styles.previewImage} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Tap to change product image</Text>
                )}
            </TouchableOpacity>

            <CustomInput placeholder="Product ID *" value={form.productId} onChangeText={(val) => setForm({...form, productId: val})} />
            <CustomInput placeholder="Product Name *" value={form.name} onChangeText={(val) => setForm({...form, name: val})} />
            <CustomInput placeholder="Brand *" value={form.brand} onChangeText={(val) => setForm({...form, brand: val})} />
            <CustomInput placeholder="Vehicle Type *" value={form.vehicleType} onChangeText={(val) => setForm({...form, vehicleType: val})} />
            <CustomInput placeholder="Vehicle Name *" value={form.vehicleName} onChangeText={(val) => setForm({...form, vehicleName: val})} />
            <CustomInput placeholder="Category *" value={form.category} onChangeText={(val) => setForm({...form, category: val})} />
            <CustomInput placeholder="Price (Rs.) *" value={form.price} onChangeText={(val) => setForm({...form, price: val})} keyboardType="numeric" />
            <CustomInput placeholder="Discount (%)" value={form.discount} onChangeText={(val) => setForm({...form, discount: val})} keyboardType="numeric" />
            <CustomInput placeholder="Stock Quantity *" value={form.stockQuantity} onChangeText={(val) => setForm({...form, stockQuantity: val})} keyboardType="numeric" />
            <CustomInput placeholder="Description" value={form.description} onChangeText={(val) => setForm({...form, description: val})} />

            <CustomButton title="Update Product" onPress={handleUpdate} />
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

export default EditProductScreen;
