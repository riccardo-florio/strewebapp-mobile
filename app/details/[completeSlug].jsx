import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

async function fetchStreamingLinks(id, episodeId = null) {
  const url = episodeId
    ? `https://strewebapp.riccardohs.it/api/get-streaming-links/${id}?episode_id=${episodeId}`
    : `https://strewebapp.riccardohs.it/api/get-streaming-links/${id}`;
  console.log('Fetching streaming links from', url);
  const res = await fetch(url);
  const data = await res.json();
  console.log('Streaming links response', data);
  return data;
}

export default function Details() {
  const { completeSlug, domain } = useLocalSearchParams();
  const [info, setInfo] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    if (!completeSlug) return;

    fetch(`https://strewebapp.riccardohs.it/api/get-extended-info/${completeSlug}`)
      .then((res) => res.json())
      .then(setInfo)
      .catch(() => setInfo(null));
  }, [completeSlug]);

  useEffect(() => {
    if (info?.episodeList?.length) {
      const seasons = Array.from(
        new Set(info.episodeList.map((e) => e.season))
      ).sort((a, b) => a - b);
      setSelectedSeason(seasons[0]);
    }
  }, [info]);

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

  const seasons = info?.episodeList
    ? Array.from(new Set(info.episodeList.map((e) => e.season))).sort(
        (a, b) => a - b
      )
    : [];
  const episodes = info?.episodeList
    ? info.episodeList.filter((e) => e.season === selectedSeason)
    : [];

  const handlePlay = async () => {
    if (!info?.id) return;

    try {
      const links = await fetchStreamingLinks(info.id);
      console.log('Received streaming links', links);
      const vixLink = Array.isArray(links)
        ? links.find((l) => typeof l === 'string' && l.includes('vixcloud'))
        : null;
      console.log('Selected VixCloud link', vixLink);
      if (vixLink) {
        router.push({ pathname: '/player', params: { url: encodeURIComponent(vixLink) } });
      }
    } catch (_e) {
      console.error('Failed to fetch or play streaming links', _e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {backgroundUri && <Image source={{ uri: backgroundUri }} style={styles.background} />}
      <Text style={styles.title}>{info.name}</Text>
      {info.plot && <Text style={styles.plot}>{info.plot}</Text>}
      <Text style={styles.meta}>Durata: {info.duration ? `${info.duration} min` : 'N/A'}</Text>
      <Text style={styles.meta}>Valutazione: {info.rating ?? 'N/A'}</Text>

      {!info?.episodeList?.length && (
        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <Text style={styles.playButtonText}>Riproduci</Text>
        </TouchableOpacity>
      )}

      {seasons.length > 0 && (
        <>
          <ScrollView
            horizontal
            style={styles.seasonSelector}
            contentContainerStyle={styles.seasonList}
            showsHorizontalScrollIndicator={false}
          >
            {seasons.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSelectedSeason(s)}
                style={[
                  styles.seasonButton,
                  selectedSeason === s && styles.seasonButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.seasonButtonText,
                    selectedSeason === s && styles.seasonButtonTextActive,
                  ]}
                >
                  Stagione {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.episodes}>
            {episodes.map((ep) => {
              const cover = Array.isArray(ep.images)
                ? ep.images.find((img) => img.type === 'cover')
                : null;
              const coverUri = cover && domain
                ? `https://cdn.${domain}/images/${cover.filename}`
                : null;
              const openEpisode = () => ep.url && Linking.openURL(ep.url);

              return (
                <TouchableOpacity
                  key={ep.id}
                  style={styles.episodeCard}
                  onPress={openEpisode}
                  disabled={!ep.url}
                >
                  {coverUri && (
                    <Image source={{ uri: coverUri }} style={styles.episodeImage} />
                  )}
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeTitle}>
                      {`${ep.episode}. ${ep.name}`}
                    </Text>
                    {ep.description && (
                      <Text style={styles.episodeDesc}>{ep.description}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
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
  playButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3f3f3f',
    alignItems: 'center',
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  seasonSelector: {
    marginTop: 16,
  },
  seasonList: {
    gap: 8,
  },
  seasonButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2f2f2fff',
  },
  seasonButtonActive: {
    backgroundColor: '#3f3f3f',
  },
  seasonButtonText: {
    color: '#9ca3af',
  },
  seasonButtonTextActive: {
    color: 'white',
  },
  episodes: {
    marginTop: 16,
    gap: 12,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#2f2f2fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  episodeImage: {
    width: 120,
    height: 80,
  },
  episodeInfo: {
    flex: 1,
    padding: 8,
  },
  episodeTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  episodeDesc: {
    color: '#9ca3af',
    fontSize: 12,
  },
});
