import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';

export default function Player() {
  const { url } = useLocalSearchParams();
  const source = url ? decodeURIComponent(url) : null;

  useEffect(() => {
    console.log('Player received URL', url);
    console.log('Decoded source URL', source);

    const probePlaylist = async () => {
      if (!source) return;
      try {
        console.log('Probing playlist', source);
        const res = await fetch(source, {
          headers: {
            // Some providers require a referer/user-agent for authorized access
            Referer: 'https://vixcloud.co',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        console.log('Playlist fetch status', res.status);
      } catch (err) {
        console.error('Failed to fetch playlist', err);
      }
    };

    probePlaylist();
  }, [url, source]);

  return (
    <View style={styles.container}>
      {source && (
        <Video
          source={{
            uri: source,
            headers: {
              Referer: 'https://vixcloud.co',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          }}
          style={styles.video}
          overrideFileExtensionAndroid="m3u8"
          useNativeControls
          resizeMode="contain"
          shouldPlay
          onError={(e) => console.error('Video error', e)}
          onLoadStart={() => console.log('Video load start')}
          onLoad={(status) => console.log('Video loaded', status)}
          onPlaybackStatusUpdate={(status) =>
            console.log('Playback status update', status)
          }
        />
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
});
