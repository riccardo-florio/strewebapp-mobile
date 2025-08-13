import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MOVIES = [
  { id: '1', title: 'Inception', url: 'https://example.com/inception' },
  { id: '2', title: 'Interstellar', url: 'https://example.com/interstellar' },
  { id: '3', title: 'The Matrix', url: 'https://example.com/the-matrix' },
  { id: '4', title: 'The Lord of the Rings', url: 'https://example.com/lord-of-the-rings' },
  { id: '5', title: 'The Dark Knight', url: 'https://example.com/the-dark-knight' },
];

export class App extends Component {
  state = { streDomain: null, query: '', results: [] };

  handleSearch = () => {
    const results = MOVIES.filter((item) =>
      item.title.toLowerCase().includes(this.state.query.toLowerCase().trim())
    );
    this.setState({ results });
  };

  componentDidMount() {
    fetch('https://strewebapp.riccardohs.it/api/get-stre-domain')
      .then((res) => res.json())
      .then((streDomain) => this.setState({ streDomain }))
      .catch(() => { });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>StreWebApp</Text>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Nome del film / serie tv"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            value={this.state.query}
            onChangeText={(query) => this.setState({ query })}
            onSubmitEditing={this.handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.icon} onPress={this.handleSearch}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.results}>
          {this.state.results.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => Linking.openURL(item.url)}>
              <Text style={styles.result}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {this.state.streDomain && (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`https://${this.state.streDomain}`);
            }}
          >
            <Text style={styles.link}>{this.state.streDomain}</Text>
          </TouchableOpacity>
        )}
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
  results: {
    width: '80%',
    marginTop: 20,
  },
  result: {
    color: 'white',
    paddingVertical: 8,
  },
  link: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
});

