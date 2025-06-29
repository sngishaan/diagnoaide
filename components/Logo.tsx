import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 40 }: LogoProps) {
  return (
    <Image
      source={{ 
        uri: 'https://api.a0.dev/assets/image?text=robot%20medical%20assistant%20blue%20speech%20bubble%20with%20white%20plus%20sign%20and%20smiling%20face&aspect=1:1&seed=diagnomate-logo'
      }}
      style={[styles.logo, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
});
