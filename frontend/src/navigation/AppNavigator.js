import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailsScreen from '../screens/products/ProductDetailsScreen';
import AddProductScreen from '../screens/products/AddProductScreen';
import EditProductScreen from '../screens/products/EditProductScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loading />;
    }

    return (
        <Stack.Navigator>
            {user ? (
                // Authenticated Screens
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="ProductList" component={ProductListScreen} />
                    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
                    <Stack.Screen name="AddProduct" component={AddProductScreen} />
                    <Stack.Screen name="EditProduct" component={EditProductScreen} />
                </>
            ) : (
                // Unauthenticated Screens
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
