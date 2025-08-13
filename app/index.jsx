import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>StreWebApp</Text>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Nome del film / serie tv"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <TouchableOpacity style={styles.icon}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#212121',
    gap: 20,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: '400',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 100,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  icon: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 100,
    marginLeft: 10,
  },
});
