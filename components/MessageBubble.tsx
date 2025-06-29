import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MessageBubbleProps {
  isUser: boolean;
  text: string;
  conditions?: Array<{
    name: string;
    risk: 'Low' | 'Medium' | 'High';
  }>;
}

export default function MessageBubble({ isUser, text, conditions }: MessageBubbleProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#22C55E';
      default: return '#64748B';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return 'exclamation-triangle';
      case 'Medium': return 'exclamation-circle';
      case 'Low': return 'info-circle';
      default: return 'info';
    }
  };

  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.userBubble}
        >
          <Text style={styles.userText}>{text}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.aiContainer}>
      <View style={styles.aiHeader}>
        <FontAwesome5 name="robot" size={16} color="#4CD7B0" />
        <Text style={styles.aiLabel}>DiagnoAide</Text>
      </View>
      <View style={styles.aiBubble}>
        <Text style={styles.aiText}>{text}</Text>
        
        {conditions && conditions.length > 0 && (
          <View style={styles.conditionsContainer}>
            <Text style={styles.conditionsTitle}>Possible Conditions:</Text>
            {conditions.map((condition, index) => (
              <View key={index} style={styles.conditionItem}>
                <FontAwesome5 
                  name={getRiskIcon(condition.risk)} 
                  size={14} 
                  color={getRiskColor(condition.risk)} 
                />
                <Text style={styles.conditionName}>{condition.name}</Text>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(condition.risk) }]}>
                  <Text style={styles.riskText}>{condition.risk}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  userBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  userText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  aiContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 16,
  },
  aiLabel: {
    color: '#4CD7B0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  aiBubble: {
    maxWidth: '85%',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(76, 215, 176, 0.2)',
  },
  aiText: {
    color: '#E2E8F0',
    fontSize: 16,
    lineHeight: 22,
  },
  conditionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 215, 176, 0.2)',
  },
  conditionsTitle: {
    color: '#4CD7B0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  conditionName: {
    color: '#E2E8F0',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
