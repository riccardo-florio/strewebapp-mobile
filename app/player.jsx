import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { VideoView } from 'expo-video';
import { useLocalSearchParams } from 'expo-router';

export default function Player() {
  const { url } = useLocalSearchParams();
  const playlistUrl = url ? decodeURIComponent(url) : null;
  const [streamUrl, setStreamUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStream = async () => {
      if (!playlistUrl) return;
      console.log('Player received URL', playlistUrl);
      try {
        console.log('Fetching playlist', playlistUrl);
        const res = await fetch(playlistUrl, {
          headers: {
            Referer: 'https://vixcloud.co',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        console.log('Playlist fetch status', res.status);
        const text = await res.text();
        console.log('Playlist snippet', text.slice(0, 100));
        console.log('Playlist length', text.length);
        let hls = null;
        try {
          const data = JSON.parse(text);
          hls =
            data?.playlist?.[0]?.sources?.find(
              (s) => typeof s.file === 'string' && s.file.includes('m3u8')
            )?.file || null;
          if (hls) {
            console.log('Parsed HLS from JSON', hls);
          }
        } catch (_e) {
          // response is plain M3U playlist; look for an HLS url inside
          let abs = text.match(/https?:\/\/[^\s]+\.m3u8[^\s]*/);
          if (!abs) {
            const collapsed = text.replace(/\n/g, '');
            abs = collapsed.match(/https?:\/\/[^\s]+\.m3u8[^\s]*/);
          }
          if (abs) {
            hls = abs[0];
            console.log('Found absolute stream', hls);
          } else {
            const rel = text.match(/^[^#\n]+\.m3u8[^\n]*/m);
            if (rel) {
              try {
                hls = new URL(rel[0].trim(), playlistUrl).href;
                console.log('Resolved relative stream', hls);
              } catch (err) {
                console.warn('Failed to resolve relative stream', err);
              }
            }
          }
        }
        if (!hls) {
          console.warn('No HLS stream found in playlist');
          setError('Stream non disponibile');
          return;
        }
        console.log('Using stream URL', hls);
        setStreamUrl(hls);
      } catch (e) {
        console.error('Failed to load playlist', e);
        setError('Errore durante il caricamento');
      }
    };

    loadStream();
  }, [playlistUrl]);

  const headers = {
    Referer: 'https://vixcloud.co',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };

  return (
    <View style={styles.container}>
      {streamUrl ? (
        <VideoView
          source={{ uri: streamUrl, headers }}
          style={styles.video}
          overrideFileExtensionAndroid="m3u8"
          nativeControls
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
          onError={(e) => console.error('Video error', e)}
          onLoadStart={() => console.log('Video load start')}
          onLoad={(status) => console.log('Video loaded', status)}
        />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <ActivityIndicator color="#fff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  message: {
    color: '#fff',
  },
});
