import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Results() {
  const { query, domain } = useLocalSearchParams();
  const router = useRouter();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    fetch(`https://strewebapp.riccardohs.it/api/search/${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const items = Object.values(data).map((item) => {
          const poster = Array.isArray(item.images)
            ? item.images.find((img) => img.type === 'cover')
            : null;
          const imageDomain = domain || (item.url ? new URL(item.url).host : null);

          return {
            id: String(item.id),
            slug: item.slug,
            domain: imageDomain,
            title: item.name,
            type: item.type,
            score: item.score,
            lastAirDate: item.last_air_date,
            poster:
              poster && imageDomain
                ? `https://cdn.${imageDomain}/images/${poster.filename}`
                : null,
          };
        });
        setResults(items);
      })
      .catch(() => setResults([]));
  }, [query, domain]);

  const renderItem = ({ item }) => {
    const completeSlug = `${item.id}-${item.slug}`;
    const handlePress = () => {
      router.push({ pathname: `/details/${completeSlug}`, params: { domain: item.domain } });
    };

    return (
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        {item.poster && <Image source={{ uri: item.poster }} style={styles.poster} />}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>Tipo: {item.type}</Text>
        <Text style={styles.cardMeta}>Valutazione: {item.score ?? 'N/A'}</Text>
        <Text style={styles.cardMeta}>Data di uscita: {item.lastAirDate ?? 'N/A'}</Text>
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
    gap: 15,
  },
  card: {
    backgroundColor: '#2f2f2fff',
    borderRadius: 16,
    padding: 16,
  },
  poster: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
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
