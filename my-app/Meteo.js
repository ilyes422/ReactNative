import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const CarteMeteo = ({ dateMeteo }) => {
  return (
    <View style={styles.carteMeteo}>
      <Text style={styles.ville}>{dateMeteo.name}</Text>
      <Text style={styles.temperature}>{Math.round(dateMeteo.main.temp)}°C</Text>
      <Text style={styles.description}>{dateMeteo.weather[0].description}</Text>
      <Image source={{ uri: `https://openweathermap.org/img/wn/${dateMeteo.weather[0].icon}@2x.png` }} style={styles.icone} />
    </View>
  );
};

const CartePrevision = ({ prevision }) => {
  return (
    <View style={styles.elementPrevision}>
      <Text style={styles.heurePrevision}>{prevision.dt_txt}</Text>
      <Text style={styles.tempPrevision}>{Math.round(prevision.main.temp)}°C</Text>
      <Text style={styles.descriptionPrevision}>{prevision.weather[0].description}</Text>
      <Image source={{ uri: `https://openweathermap.org/img/wn/${prevision.weather[0].icon}@2x.png` }} style={styles.icone} />
    </View>
  );
};

const Chargement = () => <ActivityIndicator size="large" color="#ffffff" />;

const Meteo = () => {
  const [meteo, setMeteo] = useState(null);
  const [previsions, setPrevisions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [ville, setVille] = useState('');
  const [rechVille, setRechVille] = useState(false);

  useEffect(() => {
    if (!rechVille) {
      recupMeteo();
    }
  }, [rechVille]);

  const getPos = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;

      const pos = await Location.getCurrentPositionAsync({});
      return pos.coords;
    } catch {
      return null;
    }
  };

  const recupMeteo = async () => {
    setChargement(true);
    try {
      const pos = await getPos();
      if (pos) {
        const { latitude, longitude } = pos;
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f971c97baeeea5c409f72f5c1328bcf7&units=metric`);
        setMeteo(res.data);
        recupPrevision(latitude, longitude);
      }
    } finally {
      setChargement(false);
    }
  };

  const rechMeteoVille = async () => {
    if (!ville) return;
    setChargement(true);
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=f971c97baeeea5c409f72f5c1328bcf7&units=metric`);
      setMeteo(res.data);
      setRechVille(true);
      recupPrevision(res.data.coord.lat, res.data.coord.lon);
    } finally {
      setChargement(false);
    }
  };

  const recupPrevision = async (latitude, longitude) => {
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=f971c97baeeea5c409f72f5c1328bcf7&units=metric`);
      setPrevisions(res.data.list);
    } catch {}
  };

  return (
    <View style={styles.conteneur}>
      <View style={styles.barreRecherche}>
        <TextInput
          style={styles.champTexte}
          value={ville}
          onChangeText={setVille}
          placeholder="Rechercher une ville"
          placeholderTextColor="#ffffff88"
        />
        <TouchableOpacity onPress={rechMeteoVille} style={styles.boutonValidation}>
          <Text style={styles.validation}>✔</Text>
        </TouchableOpacity>
      </View>

      {chargement ? (
        <Chargement />
      ) : (
        meteo && (
          <ScrollView contentContainerStyle={styles.contenu}>
            <CarteMeteo dateMeteo={meteo} />
            <Text style={styles.titrePrevisions}>Prévisions sur 5 jours :</Text>
            <FlatList
              data={previsions}
              keyExtractor={(item) => item.dt_txt}
              renderItem={({ item }) => <CartePrevision prevision={item} />}
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
  conteneur: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  barreRecherche: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  champTexte: {
    height: 40,
    borderColor: '#ffffff',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#ffffff',
    width: '80%',
    marginRight: 10,
    borderRadius: 5,
  },
  boutonValidation: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validation: {
    fontSize: 20,
    color: '#ffffff',
  },
  carteMeteo: {
    alignItems: 'center',
    padding: 20,
  },
  ville: {
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
  icone: {
    width: 100,
    height: 100,
  },
  titrePrevisions: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  elementPrevision: {
    marginRight: 20,
    alignItems: 'center',
  },
  heurePrevision: {
    color: '#ffffff',
    fontSize: 16,
  },
  tempPrevision: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionPrevision: {
    color: '#ffffff',
    fontSize: 14,
  },
  contenu: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default Meteo;
