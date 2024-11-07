import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ImageBackground } from 'react-native';

export default function App() {
  const [texte, setText] = useState('');
  const [objectifs, setObjectifs] = useState([]);
  const [enEdition, setEnEdition] = useState(false);
  const [indexEdition, setIndexEdition] = useState(null);

  const ajouterOuEditer = () => {
    if (texte.trim()) {
      if (enEdition && indexEdition !== null) {
        const nouveauxObjectifs = [...objectifs];
        nouveauxObjectifs[indexEdition] = texte;
        setObjectifs(nouveauxObjectifs);
        setEnEdition(false);
        setIndexEdition(null);
      } else {
        setObjectifs(objectifsActuels => [...objectifsActuels, texte]);
      }
      setText('');
    }
  };

  const edit = (index) => {
    setText(objectifs[index]);
    setEnEdition(true);
    setIndexEdition(index);
  };

  const suppr = (index) => {
    setObjectifs(objectifsActuels => objectifsActuels.filter((_, i) => i !== index));
    if (enEdition && indexEdition === index) {
      setEnEdition(false);
      setText('');
    }
  };

  return (
    <ImageBackground source={require('./assets/bg.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            value={texte}
            onChangeText={setText}
            placeholder="Ajouter un objectif"
          />
          <TouchableOpacity style={styles.add} onPress={ajouterOuEditer}>
            <Text> {'\u2713'} </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={objectifs}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => edit(index)} style={styles.liste}>
              <Text style={styles.texte}>{item}</Text>
              <TouchableOpacity onPress={() => suppr(index)}>
                <Text style={styles.suppr}>{'\u2715'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', 
    paddingTop: 50, 
  },
  containerInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#007BFF',
    backgroundColor: '#f0f8ff',
  },
  add: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  liste: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
    backgroundColor: '#f0f8ff',
  },
  texte: {
    fontSize: 14,
  },
  suppr: {
    color: 'red',
  },
});
