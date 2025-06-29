import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ConfidenceScoreProps {
  score: number;
  recommendation: string;
}

export default function ConfidenceScore({ score, recommendation }: ConfidenceScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return ['#2ECC71', '#27AE60'];
    if (score >= 60) return ['#F1C40F', '#F39C12'];
    return ['#E74C3C', '#C0392B'];
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <LinearGradient
          colors={getScoreColor()}
          style={styles.scoreGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.scoreText}>{score}%</Text>
          <Text style={styles.confidenceText}>confidence</Text>
        </LinearGradient>
      </View>
      <Text style={styles.recommendationText}>{recommendation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scoreContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  scoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  scoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  confidenceText: {
    color: 'white',
    fontSize: 14,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
