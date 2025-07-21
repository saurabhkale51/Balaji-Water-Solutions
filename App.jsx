import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/Screens/Home';
import Login from './src/Screens/Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Customer from './src/Screens/Customer';
import Orders from './src/Screens/Orders';
import Items from './src/Screens/Items';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: 'orange',
      tabBarInactiveTintColor: 'black',
      tabBarLabelStyle: {
        fontSize: 16,
        fontWeight:'bold'
      },
      tabBarStyle:{
        height:59
      }
    }}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} />
        }}
      />
      <Tab.Screen name='Customer'
        component={Customer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="users" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name='Orders'
        component={Orders}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainApp"
        screenOptions={{ title: 'Balaji Water Solutions' }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
