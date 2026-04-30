import React, { useState, useContext, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';
import { ProductContext } from '../../context/ProductContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

// Safe helper to extract image URI
const getImageUri = (image) => {
    console.log("GETTING IMAGE URI FROM:", image);
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (image && image.uri) return image.uri;
    return null;
};

const AddProductScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const { addProduct, products } = useContext(ProductContext);

    useEffect(() => {
        if (user?.role !== 'admin') {
            Alert.alert('Access Denied', 'Admin only.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    }, [user, navigation]);

    const [form, setForm] = useState({
        productId: '',
        name: '',
        brand: '',
        vehicleType: '',
        vehicleBrand: '',
        category: '',
        price: '',
        discount: '',
        stocks: '',
        warrantyMonths: '',
        description: '',
    });
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleCreate = async () => {
        const { 
            productId, name, brand, vehicleType, vehicleBrand, category,
            price, discount, stocks, warrantyMonths, description 
        } = form;

        // 1. Required field validation
        if (!productId || !name || !brand || !vehicleType || !category || !price || warrantyMonths === '') {
            Alert.alert('Validation Error', 'Please fill in all required fields marked with *');
            return;
        }

        // 2. Unique Product ID validation
        const isDuplicate = products.some(p => p.productId.toLowerCase() === productId.toLowerCase());
        if (isDuplicate) {
            Alert.alert('Validation Error', 'Product ID already exists. Please use a unique ID.');
            return;
        }

        // 3. Numeric validation
        const numPrice = parseFloat(price);
        const numDiscount = discount === '' ? 0 : parseFloat(discount);
        const numStocks = stocks === '' ? 0 : parseInt(stocks);
        const numWarranty = parseInt(warrantyMonths);

        if (isNaN(numPrice) || numPrice <= 0) {
            Alert.alert('Validation Error', 'Price must be a number greater than 0');
            return;
        }

        if (discount !== '' && (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100)) {
            Alert.alert('Validation Error', 'Discount must be between 0 and 100');
            return;
        }

        if (stocks !== '' && (isNaN(numStocks) || numStocks < 0)) {
            Alert.alert('Validation Error', 'Stocks must be 0 or a positive number');
            return;
        }

        if (isNaN(numWarranty) || numWarranty < 0) {
            Alert.alert('Validation Error', 'Warranty must be 0 (for no warranty) or a positive number');
            return;
        }

        console.log("SELECTED IMAGE:", image);
        const imageUri = getImageUri(image);
        console.log("IMAGE URI:", imageUri);

        // 4. Save to Context (now calls API)
        const result = await addProduct({
            productId,
            name,
            brand,
            vehicleType,
            vehicleBrand,
            category,
            price: numPrice,
            discount: numDiscount,
            stocks: numStocks,
            warrantyMonths: numWarranty,
            description,
            image: image // Pass the full image object, not just URI
        });

        if (result?.success) {
            Alert.alert('Success', 'Product added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', result?.message || 'Failed to add product');
        }
    };

    if (user?.role !== 'admin') return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Product</Text>
            </View>

            <View style={styles.formCard}>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="camera-outline" size={40} color="#999" />
                            <Text style={styles.imagePlaceholder}>Select Product Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Product ID *</Text>
                    <CustomInput 
                        placeholder="e.g. P00123" 
                        value={form.productId} 
                        onChangeText={(val) => setForm({...form, productId: val})} 
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Product Name *</Text>
                    <CustomInput 
                        placeholder="e.g. Brake Pad Set" 
                        value={form.name} 
                        onChangeText={(val) => setForm({...form, name: val})} 
                    />
                </View>

                <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.inputLabel}>Product Brand *</Text>
                        <CustomInput 
                            placeholder="e.g. Toyota" 
                            value={form.brand} 
                            onChangeText={(val) => setForm({...form, brand: val})} 
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Vehicle Type *</Text>
                        <CustomInput 
                            placeholder="e.g. Car / Bike / Van" 
                            value={form.vehicleType} 
                            onChangeText={(val) => setForm({...form, vehicleType: val})} 
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Vehicle Brand (Compatible)</Text>
                    <CustomInput 
                        placeholder="e.g. Toyota / Honda / Nissan" 
                        value={form.vehicleBrand} 
                        onChangeText={(val) => setForm({...form, vehicleBrand: val})} 
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Category *</Text>
                    <CustomInput 
                        placeholder="e.g. Spare Parts / Accessories / Tools" 
                        value={form.category} 
                        onChangeText={(val) => setForm({...form, category: val})} 
                    />
                </View>

                <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.inputLabel}>Price *</Text>
                        <CustomInput 
                            placeholder="e.g. 12500" 
                            value={form.price} 
                            onChangeText={(val) => setForm({...form, price: val})} 
                            keyboardType="numeric" 
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Discount (%) Optional</Text>
                        <CustomInput 
                            placeholder="e.g. 10" 
                            value={form.discount} 
                            onChangeText={(val) => setForm({...form, discount: val})} 
                            keyboardType="numeric" 
                        />
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.inputLabel}>Stocks</Text>
                        <CustomInput 
                            placeholder="e.g. 20" 
                            value={form.stocks} 
                            onChangeText={(val) => setForm({...form, stocks: val})} 
                            keyboardType="numeric" 
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Warranty (Months) *</Text>
                        <CustomInput 
                            placeholder="0 = No, 12 = 12 mo" 
                            value={form.warrantyMonths} 
                            onChangeText={(val) => setForm({...form, warrantyMonths: val})} 
                            keyboardType="numeric" 
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <CustomInput 
                        placeholder="Add product description..." 
                        value={form.description} 
                        onChangeText={(val) => setForm({...form, description: val})} 
                        multiline={true}
                        numberOfLines={4}
                        style={styles.textArea}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton title="Save Product" onPress={handleCreate} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1b2559',
    },
    formCard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 15,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    imagePicker: {
        height: 180,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    imagePlaceholder: {
        color: '#999',
        marginTop: 8,
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: 8,
        marginLeft: 4,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: 10,
    },
});

export default AddProductScreen;
