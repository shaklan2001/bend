import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';

interface VideoPlayerProps {
  videoUrl: string;
  style?: any;
}

const videoPlayerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: 200,
  },
});

export const VideoPlayer = memo(({ videoUrl, style }: VideoPlayerProps) => {
  return (
    <View style={[videoPlayerStyles.container, style]}>
      <Video
        source={{ uri: videoUrl }}
        style={videoPlayerStyles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={true}
        isLooping={true}
        isMuted={true}
      />
    </View>
  );
});
