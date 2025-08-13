import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Details() {
  const { completeSlug, domain } = useLocalSearchParams();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!completeSlug) return;

    fetch(`https://strewebapp.riccardohs.it/api/get-extended-info/${completeSlug}`)
      .then((res) => res.json())
      .then(setInfo)
      .catch(() => setInfo(null));
  }, [completeSlug]);

  if (!info) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Caricamento...</Text>
      </View>
    );
  }

  const background = Array.isArray(info.images)
    ? info.images.find((img) => img.type === 'background')
    : null;
  const backgroundUri = background && domain
    ? `https://cdn.${domain}/images/${background.filename}`
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {backgroundUri && <Image source={{ uri: backgroundUri }} style={styles.background} />}
      <Text style={styles.title}>{info.name}</Text>
      {info.plot && <Text style={styles.plot}>{info.plot}</Text>}
      <Text style={styles.meta}>Durata: {info.duration ? `${info.duration} min` : 'N/A'}</Text>
      <Text style={styles.meta}>Valutazione: {info.rating ?? 'N/A'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  content: {
    padding: 20,
  },
  loading: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  background: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  plot: {
    color: '#9ca3af',
    marginBottom: 12,
  },
  meta: {
    color: '#9ca3af',
    marginBottom: 4,
  },
});
