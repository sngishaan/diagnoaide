import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DiagnoMateLogoProps {
  size?: number;
}

export default function DiagnoMateLogo({ size = 60 }: DiagnoMateLogoProps) {
  const logoSize = size;
  const innerSize = logoSize * 0.7;
  const faceSize = logoSize * 0.45;
  
  return (
    <View style={[styles.container, { width: logoSize, height: logoSize }]}>
      {/* Outer glow effect */}
      <View style={[styles.glowOuter, { width: logoSize * 1.3, height: logoSize * 1.3 }]} />
      
      {/* Main robot head */}
      <LinearGradient
        colors={['#0EA5E9', '#06B6D4', '#4CD7B0']}
        style={[styles.robotHead, { width: logoSize, height: logoSize * 0.8, borderRadius: logoSize * 0.2 }]}
      >
        {/* Antenna */}
        <View style={[styles.antenna, { width: 4, height: logoSize * 0.15, top: -logoSize * 0.1 }]} />
        <View style={[styles.antennaLight, { width: 8, height: 8, top: -logoSize * 0.15 }]} />
        
        {/* Medical cross */}
        <View style={[styles.medicalCross, { top: logoSize * 0.1 }]}>
          <View style={[styles.crossVertical, { width: 3, height: 12 }]} />
          <View style={[styles.crossHorizontal, { width: 12, height: 3 }]} />
        </View>
        
        {/* Face container */}
        <View style={[styles.faceContainer, { 
          width: faceSize, 
          height: faceSize * 0.8, 
          borderRadius: faceSize * 0.15,
          top: logoSize * 0.25 
        }]}>
          {/* Eyes */}
          <View style={styles.eyesContainer}>
            <View style={[styles.eye, { width: 8, height: 8 }]} />
            <View style={[styles.eye, { width: 8, height: 8 }]} />
          </View>
          
          {/* Smile */}
          <View style={[styles.smile, { width: 20, height: 10, borderRadius: 10 }]} />
        </View>
      </LinearGradient>
      
      {/* Side speakers/headphones */}
      <View style={[styles.speaker, styles.speakerLeft, { 
        width: logoSize * 0.2, 
        height: logoSize * 0.3,
        borderRadius: logoSize * 0.1,
        left: -logoSize * 0.05
      }]} />
      <View style={[styles.speaker, styles.speakerRight, { 
        width: logoSize * 0.2, 
        height: logoSize * 0.3,
        borderRadius: logoSize * 0.1,
        right: -logoSize * 0.05
      }]} />
      
      {/* Speech bubble tail */}
      <View style={[styles.speechTail, { 
        bottom: -logoSize * 0.1,
        left: logoSize * 0.15,
        borderTopWidth: logoSize * 0.15,
        borderLeftWidth: logoSize * 0.1,
        borderRightWidth: logoSize * 0.1
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    backgroundColor: 'rgba(76, 215, 176, 0.1)',
    borderRadius: 1000,
    shadowColor: '#4CD7B0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  robotHead: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#4CD7B0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },
  antenna: {
    position: 'absolute',
    backgroundColor: '#1E293B',
    left: '50%',
    marginLeft: -2,
  },
  antennaLight: {
    position: 'absolute',
    backgroundColor: '#4CD7B0',
    borderRadius: 4,
    left: '50%',
    marginLeft: -4,
    shadowColor: '#4CD7B0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  medicalCross: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossVertical: {
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  crossHorizontal: {
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  faceContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 24,
    marginBottom: 4,
  },
  eye: {
    backgroundColor: '#1E293B',
    borderRadius: 4,
  },
  smile: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E293B',
    borderStyle: 'solid',
  },
  speaker: {
    position: 'absolute',
    backgroundColor: '#1E293B',
    top: '25%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  speakerLeft: {},
  speakerRight: {},
  speechTail: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: '#4CD7B0',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
