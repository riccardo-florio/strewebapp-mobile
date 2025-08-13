import React from 'react';
import { View, StyleSheet } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';

export default function Player() {
  const { url } = useLocalSearchParams();
  const source = url ? decodeURIComponent(url) : null;

  return (
    <View style={styles.container}>
      {source && (
        <Video
          source={{ uri: source }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          shouldPlay
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
