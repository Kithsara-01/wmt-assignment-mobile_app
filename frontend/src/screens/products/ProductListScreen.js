import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
    View, Text, StyleSheet, FlatList, TextInput, 
    TouchableOpacity, RefreshControl, ScrollView 
} from 'react-native';
import { getProducts, getTopRatedProducts } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import Loading from '../../components/Loading';

const ProductListScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters and Search states
    const [search, setSearch] = useState('');
    const [brand, setBrand] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('rating_desc');

    const fetchData = async () => {
        try {
            const params = {
                search,
                brand,
                minPrice,
                maxPrice,
                sort
            };
            const [productsRes, topRes] = await Promise.all([
                getProducts(params),
                getTopRatedProducts()
            ]);
            setProducts(productsRes.data);
            setTopRated(topRes.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [search, brand, minPrice, maxPrice, sort]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [search, brand, minPrice, maxPrice, sort]);

    if (loading && !refreshing) return <Loading />;

    const renderHeader = () => (
        <View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by ID or Name..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <View style={styles.filterRow}>
                <TextInput
                    style={[styles.filterInput, { flex: 2 }]}
                    placeholder="Brand"
                    value={brand}
                    onChangeText={setBrand}
                />
                <TextInput
                    style={styles.filterInput}
                    placeholder="Min Rs."
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.filterInput}
                    placeholder="Max Rs."
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => setSort(sort === 'rating_desc' ? 'newest' : 'rating_desc')}
            >
                <Text style={styles.sortText}>
                    Sort: {sort === 'rating_desc' ? 'Top Rated' : 'Newest'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Top Rated ⭐</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topRatedScroll}>
                {topRated.map(item => (
                    <TouchableOpacity 
                        key={item._id} 
                        style={styles.topRatedItem}
                        onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
                    >
                        <Text style={styles.topRatedName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.topRatedPrice}>Rs. {item.finalPrice}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>All Products</Text>
                {user?.role === 'admin' && (
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddProduct')}
                    >
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ProductCard 
                        product={item} 
                        onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
                    />
                )}
                ListHeaderComponent={renderHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>No products found</Text>}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    listContent: {
        padding: 15,
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterInput: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        marginHorizontal: 2,
        fontSize: 12,
    },
    sortButton: {
        backgroundColor: '#e9ecef',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    sortText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#495057',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    topRatedScroll: {
        marginBottom: 20,
    },
    topRatedItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
        width: 140,
        elevation: 2,
    },
    topRatedName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    topRatedPrice: {
        fontSize: 12,
        color: '#28a745',
        marginTop: 4,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
});

export default ProductListScreen;
