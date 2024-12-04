import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ListObj from './ListObj'; 
import Meteo from './Meteo'; 

const Stack = createStackNavigator();

function PortailApp({ navigation }) {
  return (
      <View style={styles.container}>
        <Text style={styles.title}>Portail d'Applications</Text>
        
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Objectifs')}>
          <Image source={require('./assets/todolist.png')} style={styles.icon} />
          <Text style={styles.iconText}>Liste d'Objectifs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Meteo')}>
          <Image source={require('./assets/meteo.png')} style={styles.icon} />
          <Text style={styles.iconText}>Météo</Text>
        </TouchableOpacity>
      </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Portail">
        <Stack.Screen name="Portail" component={PortailApp} options={{ headerShown: false }} />
        <Stack.Screen name="Objectifs" component={ListObj} />
        <Stack.Screen name="Meteo" component={Meteo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:"black",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 60,
    marginBottom: 10,
  },
  iconText: {
    fontSize: 18,
    color: '#fff',
  },
});
