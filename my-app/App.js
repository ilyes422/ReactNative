import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ImageBackground } from 'react-native';

export default function App() {
  const [text, setText] = useState('');
  const [goals, setGoals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const addOrEditGoal = () => {
    if (text.trim()) {
      if (isEditing && editingIndex !== null) {
        const updatedGoals = [...goals];
        updatedGoals[editingIndex] = text;
        setGoals(updatedGoals);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        setGoals(currentGoals => [...currentGoals, text]);
      }
      setText('');
    }
  };

  const startEditingGoal = (index) => {
    setText(goals[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const suppr = (index) => {
    setGoals(currentGoals => currentGoals.filter((goal, goalIndex) => goalIndex !== index));
    if (isEditing && editingIndex === index) {
      setIsEditing(false);
      setText('');
    }
  };

  return (
    <ImageBackground source={require('./assets/bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Ajouter ou modifier un objectif"
          />
          <TouchableOpacity style={styles.addButton} onPress={addOrEditGoal}>
            <Text style={styles.addButtonText}>{isEditing ? 'Modifier' : '\u2713'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={goals}
          renderItem={({ item, index }) => (
            <View style={styles.list}>
              <TouchableOpacity onPress={() => startEditingGoal(index)}>
                <Text style={styles.text}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => suppr(index)}>
                <Text style={styles.deleteText}>{'\u2715'}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', 
    paddingTop: 50, 
  },
  inputContainer: {
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
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
  deleteText: {
    color: 'red',
  },
});
