import React, { useState, useEffect, useContext } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity 
} from 'react-native';
import { getProductById, deleteProduct } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import Loading from '../../components/Loading';

const IMAGE_BASE_URL = "http://10.218.46.146:5000";

const ProductDetailsScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { token, user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        try {
            const response = await getProductById(id);
            setProduct(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleDelete = () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(id, token);
                            Alert.alert('Success', 'Product deleted');
                            navigation.navigate('ProductList');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete product');
                        }
                    }
                }
            ]
        );
    };

    if (loading) return <Loading />;
    if (!product) return <View><Text>Product not found</Text></View>;

    console.log("Image URL:", IMAGE_BASE_URL + product.image);

    return (
        <ScrollView style={styles.container}>
            {product.image ? (
                <Image source={{ uri: IMAGE_BASE_URL + product.image }} style={styles.image} />
            ) : (
                <View style={styles.placeholder}><Text>No Image</Text></View>
            )}

            <View style={styles.content}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.brand}>{product.brand} | {product.category}</Text>
                
                <View style={styles.priceSection}>
                    <Text style={styles.finalPrice}>Rs. {product.finalPrice}</Text>
                    {product.discount > 0 && (
                        <>
                            <Text style={styles.originalPrice}>Rs. {product.price}</Text>
                            <Text style={styles.discountBadge}>{product.discount}% OFF</Text>
                        </>
                    )}
                </View>

                <View style={styles.infoGrid}>
                    <DetailItem label="Product ID" value={product.productId} />
                    <DetailItem label="Vehicle" value={`${product.vehicleType} - ${product.vehicleName}`} />
                    <DetailItem label="Stock" value={product.stockQuantity} />
                    <DetailItem label="Rating" value={`⭐ ${product.rating}`} />
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{product.description || 'No description available.'}</Text>

                {user?.role === 'admin' && (
                    <View style={styles.actions}>
                        <CustomButton 
                            title="Edit Product" 
                            onPress={() => navigation.navigate('EditProduct', { product })} 
                        />
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                            <Text style={styles.deleteText}>Delete Product</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const DetailItem = ({ label, value }) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
    },
    placeholder: {
        width: '100%',
        height: 300,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    brand: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    finalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28a745',
    },
    originalPrice: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 10,
    },
    discountBadge: {
        backgroundColor: '#dc3545',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 12,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
    },
    detailItem: {
        width: '50%',
        marginVertical: 8,
    },
    detailLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    actions: {
        marginTop: 30,
        marginBottom: 40,
    },
    deleteBtn: {
        padding: 15,
        alignItems: 'center',
    },
    deleteText: {
        color: '#dc3545',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProductDetailsScreen;
