import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import DiagnoMateLogo from './DiagnoMateLogo';

export interface UserProfile {
  age: string;
  gender: string;
  medicalHistory: string[];
  additionalInfo: string;
}

interface OnboardingModalProps {
  visible: boolean;
  onComplete: (profile: UserProfile) => void;
}

const MEDICAL_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Allergies',
  'Depression', 'Anxiety', 'Arthritis', 'Migraine', 'COPD',
  'Kidney Disease', 'Liver Disease', 'Cancer History', 'Stroke History'
];

export default function OnboardingModal({ visible, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: '',
    gender: '',
    medicalHistory: [],
    additionalInfo: ''
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, step]);

  const handleConditionToggle = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return profile.age.trim() !== '';
      case 2: return profile.gender.trim() !== '';
      case 3: return true; // Medical history is optional
      case 4: return true; // Additional info is optional
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <FontAwesome5 name="birthday-cake" size={32} color="#4CD7B0" style={styles.stepIcon} />
            <Text style={styles.stepTitle}>What's your age?</Text>
            <Text style={styles.stepSubtitle}>This helps me provide more accurate medical insights</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={profile.age}
                onChangeText={(text) => setProfile(prev => ({ ...prev, age: text }))}
                placeholder="Enter your age"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <FontAwesome5 name="user" size={32} color="#4CD7B0" style={styles.stepIcon} />
            <Text style={styles.stepTitle}>What's your gender?</Text>
            <Text style={styles.stepSubtitle}>Some conditions affect different genders differently</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    profile.gender === gender && styles.genderButtonSelected
                  ]}
                  onPress={() => setProfile(prev => ({ ...prev, gender }))}
                >
                  <LinearGradient
                    colors={profile.gender === gender 
                      ? ['#4CD7B0', '#22C55E'] 
                      : ['rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.8)']}
                    style={styles.genderButtonGradient}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      profile.gender === gender && styles.genderButtonTextSelected
                    ]}>
                      {gender}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <FontAwesome5 name="notes-medical" size={32} color="#4CD7B0" style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Medical History</Text>
            <Text style={styles.stepSubtitle}>Select any conditions that apply to you (optional)</Text>
            <ScrollView style={styles.conditionsContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.conditionsGrid}>
                {MEDICAL_CONDITIONS.map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionButton,
                      profile.medicalHistory.includes(condition) && styles.conditionButtonSelected
                    ]}
                    onPress={() => handleConditionToggle(condition)}
                  >
                    <LinearGradient
                      colors={profile.medicalHistory.includes(condition)
                        ? ['#4CD7B0', '#22C55E']
                        : ['rgba(30, 41, 59, 0.6)', 'rgba(30, 41, 59, 0.8)']}
                      style={styles.conditionButtonGradient}
                    >
                      <Text style={[
                        styles.conditionButtonText,
                        profile.medicalHistory.includes(condition) && styles.conditionButtonTextSelected
                      ]}>
                        {condition}
                      </Text>
                      {profile.medicalHistory.includes(condition) && (
                        <FontAwesome5 name="check" size={12} color="white" style={styles.checkIcon} />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <FontAwesome5 name="info-circle" size={32} color="#4CD7B0" style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Additional Information</Text>
            <Text style={styles.stepSubtitle}>Anything else I should know? (optional)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.additionalInfo}
                onChangeText={(text) => setProfile(prev => ({ ...prev, additionalInfo: text }))}
                placeholder="Current medications, recent surgeries, allergies, etc."
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(11, 15, 26, 0.95)', 'rgba(26, 31, 58, 0.95)', 'rgba(42, 63, 95, 0.95)']}
          style={styles.modalContainer}
        >
          <View style={styles.modal}>
            <View style={styles.header}>
              <DiagnoMateLogo size={60} />
              <Text style={styles.title}>Welcome to DiagnoAide</Text>
              <Text style={styles.subtitle}>Let's get to know you better</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#4CD7B0', '#22C55E']}
                  style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]}
                />
              </View>
              <Text style={styles.progressText}>Step {step} of 4</Text>
            </View>

            <View style={styles.content}>
              {renderStep()}
            </View>

            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <LinearGradient
                    colors={['rgba(100, 116, 139, 0.3)', 'rgba(71, 85, 105, 0.3)']}
                    style={styles.backButtonGradient}
                  >
                    <FontAwesome5 name="arrow-left" size={16} color="#94A3B8" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
                onPress={handleNext}
                disabled={!canProceed()}
              >
                <LinearGradient
                  colors={canProceed() 
                    ? ['#4CD7B0', '#22C55E'] 
                    : ['#64748B', '#475569']}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {step === 4 ? 'Get Started' : 'Next'}
                  </Text>
                  <FontAwesome5 
                    name={step === 4 ? "check" : "arrow-right"} 
                    size={16} 
                    color="white" 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(76, 215, 176, 0.2)',
    shadowColor: '#4CD7B0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E2E8F0',
    textAlign: 'center',
    marginTop: 16,
    textShadow: '0 0 10px rgba(76, 215, 176, 0.3)',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    color: '#4CD7B0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepIcon: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E2E8F0',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#E2E8F0',
    borderWidth: 2,
    borderColor: 'rgba(76, 215, 176, 0.2)',
    textAlign: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
  genderContainer: {
    width: '100%',
  },
  genderButton: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  genderButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  genderButtonSelected: {
    shadowColor: '#4CD7B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94A3B8',
  },
  genderButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  conditionsContainer: {
    maxHeight: 200,
    width: '100%',
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conditionButton: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  conditionButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  conditionButtonSelected: {
    shadowColor: '#4CD7B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  conditionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
  },
  conditionButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  backButton: {
    flex: 0.4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  nextButton: {
    flex: 0.55,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CD7B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonDisabled: {
    shadowOpacity: 0.1,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
