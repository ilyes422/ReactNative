import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const Meteo = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const fetchWeatherData = async () => {
    try {
      const location = await fetchLocation();
      if (location) {
        const { latitude, longitude } = location;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f971c97baeeea5c409f72f5c1328bcf7&units=metric`
        );
        setWeatherData(response.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        weatherData && (
          <View style={styles.contentContainer}>
            <Text style={styles.city}>{weatherData.name}</Text>
            <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Humidité</Text>
                <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Vent</Text>
                <Text style={styles.detailValue}>{Math.round(weatherData.wind.speed)} m/s</Text>
              </View>
            </View>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: "#fff",
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#fff",
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: "#fff",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#fff",
  },
});

export default Meteo;
