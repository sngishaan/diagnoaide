import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSelectSymptom: (symptom: string) => void;
}

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 
  'Dizziness', 'Chest Pain', 'Shortness of Breath'
];

export default function SymptomSelector({ selectedSymptoms, onSelectSymptom }: SymptomSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Symptoms</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {commonSymptoms.map((symptom) => (
          <TouchableOpacity
            key={symptom}
            style={[
              styles.symptomButton,
              selectedSymptoms.includes(symptom) && styles.symptomButtonSelected
            ]}
            onPress={() => onSelectSymptom(symptom)}
          >
            <Text style={[
              styles.symptomText,
              selectedSymptoms.includes(symptom) && styles.symptomTextSelected
            ]}>
              {symptom}
            </Text>
            {selectedSymptoms.includes(symptom) && (
              <FontAwesome5 name="check" size={12} color="white" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  scrollView: {
    flexDirection: 'row',
  },
  symptomButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(76, 215, 176, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  symptomButtonSelected: {
    backgroundColor: '#4CD7B0',
    borderColor: '#22C55E',
  },
  symptomText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
  },
  symptomTextSelected: {
    color: 'white',
  },
  checkIcon: {
    marginLeft: 6,
  },
});
