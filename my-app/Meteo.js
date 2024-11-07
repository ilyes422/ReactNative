import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const WeatherCard = ({ weatherData }) => {
  return (
    <View style={styles.weatherCard}>
      <Text style={styles.city}>{weatherData.name}</Text>
      <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
      <Text style={styles.description}>{weatherData.weather[0].description}</Text>
      <Image source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }} style={styles.icon} />
    </View>
  );
};

const ForecastCard = ({ forecast }) => {
  return (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastTime}>{forecast.dt_txt}</Text>
      <Text style={styles.forecastTemp}>{Math.round(forecast.main.temp)}°C</Text>
      <Text style={styles.forecastDescription}>{forecast.weather[0].description}</Text>
      <Image source={{ uri: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png` }} style={styles.icon} />
    </View>
  );
};

const Loader = () => {
  return <ActivityIndicator size="large" color="#ffffff" />;
};

const Meteo = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState('');
  const [searchingByCity, setSearchingByCity] = useState(false);

  useEffect(() => {
    if (!searchingByCity) {
      fetchWeatherData();
    }
  }, [searchingByCity]);

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
    setIsLoading(true);
    try {
      const location = await fetchLocation();
      if (location) {
        const { latitude, longitude } = location;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f971c97baeeea5c409f72f5c1328bcf7&units=metric`
        );
        setWeatherData(response.data);
        fetchWeatherForecast(latitude, longitude);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!city) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f971c97baeeea5c409f72f5c1328bcf7&units=metric`
      );
      setWeatherData(response.data);
      setSearchingByCity(true);
      fetchWeatherForecast(response.data.coord.lat, response.data.coord.lon);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherForecast = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=f971c97baeeea5c409f72f5c1328bcf7&units=metric`
      );
      setForecastData(response.data.list);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Rechercher une ville"
          placeholderTextColor="#ffffff88"
        />
        <TouchableOpacity onPress={fetchWeatherByCity} style={styles.checkmarkButton}>
          <Text style={styles.checkmark}> {'\u2713'} </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loader />
      ) : (
        weatherData && (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <WeatherCard weatherData={weatherData} />
            <Text style={styles.forecastTitle}>Prévisions sur 5 jours :</Text>
            <FlatList
              data={forecastData}
              keyExtractor={(item) => item.dt_txt}
              renderItem={({ item }) => <ForecastCard forecast={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </ScrollView>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40, 
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ffffff',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#ffffff',
    width: '80%', 
    marginRight: 10, 
    borderRadius: 5,
  },
  checkmarkButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 20,
    color: '#ffffff',
  },
  weatherCard: {
    alignItems: 'center',
    padding: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  description: {
    fontSize: 18,
    marginBottom: 24,
    color: '#ffffff',
  },
  icon: {
    width: 100,
    height: 100,
  },
  forecastTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  forecastItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  forecastTime: {
    color: '#ffffff',
    fontSize: 16,
  },
  forecastTemp: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forecastDescription: {
    color: '#ffffff',
    fontSize: 14,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default Meteo;
