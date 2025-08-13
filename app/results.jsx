import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Results() {
  const { query } = useLocalSearchParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    fetch(`https://strewebapp.riccardohs.it/api/search/${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const items = Object.values(data).map((item) => ({
          id: String(item.id),
          title: item.name,
          type: item.type,
          score: item.score,
          genres: item.genres,
          url: item.url,
        }));
        setResults(items);
      })
      .catch(() => setResults([]));
  }, [query]);

  const renderItem = ({ item }) => {
    const genreText = Array.isArray(item.genres)
      ? item.genres.map((g) => (typeof g === 'string' ? g : g.name)).join(', ')
      : 'N/A';

    return (
      <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>Tipo: {item.type}</Text>
        <Text style={styles.cardMeta}>Generi: {genreText}</Text>
        <Text style={styles.cardMeta}>Valutazione: {item.score ?? 'N/A'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    padding: 20,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardMeta: {
    color: '#9ca3af',
  },
});
