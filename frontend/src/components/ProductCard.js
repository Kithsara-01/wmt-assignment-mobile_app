import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const IMAGE_BASE_URL = "http://10.218.46.146:5000";

const ProductCard = ({ product, onPress }) => {
    console.log("Image URL:", IMAGE_BASE_URL + product.image);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {product.image ? (
                <Image source={{ uri: IMAGE_BASE_URL + product.image }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.placeholder]}>
                    <Text>No Image</Text>
                </View>
            )}
            
            <View style={styles.info}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.productId}>ID: {product.productId}</Text>
                <Text style={styles.details}>{product.brand} | {product.vehicleType}</Text>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.finalPrice}>Rs. {product.finalPrice}</Text>
                    {product.discount > 0 && (
                        <Text style={styles.originalPrice}>Rs. {product.price}</Text>
                    )}
                </View>

                {product.discount > 0 && (
                    <Text style={styles.discount}>{product.discount}% OFF</Text>
                )}

                <Text style={styles.rating}>⭐ {product.rating}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    image: {
        width: 120,
        height: 120,
    },
    placeholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        padding: 10,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    productId: {
        fontSize: 12,
        color: '#666',
    },
    details: {
        fontSize: 14,
        color: '#888',
        marginVertical: 2,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    finalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    discount: {
        fontSize: 12,
        color: '#dc3545',
        fontWeight: 'bold',
    },
    rating: {
        fontSize: 14,
        marginTop: 5,
    },
});

export default ProductCard;
