import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingModal, { UserProfile } from '../components/OnboardingModal';
import SymptomSelector from '../components/SymptomSelector';
import MessageBubble from '../components/MessageBubble';
import DiagnoMateLogo from '../components/DiagnoMateLogo';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  conditions?: Array<{
    name: string;
    risk: 'Low' | 'Medium' | 'High';
  }>;
}

export default function HomeScreen() {  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const recognition = useRef<any>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const startListening = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        
        recognition.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };

        recognition.current.start();
        setIsListening(true);
      } else {
        alert('Speech recognition is not supported in this browser.');
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      alert('Unable to start speech recognition.');
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (userProfile) {
      const welcomeMessage: Message = {
        id: '1',
        text: `Welcome to DiagnoAide! I see you're ${userProfile.age} years old. I'll keep your medical history in mind during our conversation. How can I help you today?`,
        isUser: false
      };
      setMessages([welcomeMessage]);
    }
  }, [userProfile]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );    if (!selectedSymptoms.includes(symptom)) {
      setInputText(current => 
        current ? `${current}, ${symptom}` : symptom
      );
    }
  };  const systemPrompt = `You are DiagnoSidekick, an AI medical assistant. User Profile:
Age: ${userProfile?.age}
Gender: ${userProfile?.gender}
Medical History: ${userProfile?.medicalHistory.join(', ')}
Additional Info: ${userProfile?.additionalInfo}

IMPORTANT: You MUST ALWAYS include possible conditions in EVERY response, even follow-up questions.

Your role is to:
1. Ask relevant follow-up questions about symptoms
2. Consider the user's medical history in your responses
3. ALWAYS provide possible conditions with risk levels (Low 🟢, Medium 🟡, High 🔴)
4. Be compassionate but professional
5. Emphasize the importance of immediate medical attention for serious conditions
6. ALWAYS include the medical disclaimer

Format your response exactly like this every time:
---CONDITIONS---
[{"name": "Condition 1", "risk": "Low"}, {"name": "Condition 2", "risk": "Medium"}]
---END CONDITIONS---

Your regular response text goes here. Even if you're asking follow-up questions, always include at least preliminary possible conditions based on the information so far.

Remember: NEVER skip the conditions section, even in follow-up questions.`;

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedSymptoms([]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: inputText }
          ]
        })
      });

      const data = await response.json();
      
      // Parse conditions from the response
      let conditions = [];
      let messageText = data.completion;
      
      const conditionsMatch = data.completion.match(/---CONDITIONS---\n([\s\S]*?)\n---END CONDITIONS---/);
      if (conditionsMatch) {
        try {
          conditions = JSON.parse(conditionsMatch[1]);
          messageText = data.completion.replace(/---CONDITIONS---\n[\s\S]*?\n---END CONDITIONS---/, '').trim();
        } catch (e) {
          console.error('Failed to parse conditions:', e);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: messageText,
        isUser: false,
        conditions
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again.",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingModal
        visible={showOnboarding}
        onComplete={handleOnboardingComplete}
      />      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <LinearGradient
          colors={['#1e3a8a', '#3b82f6', '#4CD7B0']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <DiagnoMateLogo size={40} />
            <Text style={styles.headerText}>DiagnoAide</Text>
          </View>
        </LinearGradient>
      </Animated.View>      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This is not a substitute for professional medical advice, diagnosis, or treatment.
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.chatContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              isUser={message.isUser}
              text={message.text}
              conditions={message.conditions}
            />
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingIcon}>
                <FontAwesome5 name="brain" size={20} color="#4CD7B0" />
              </View>
              <Text style={styles.loadingText}>Analyzing symptoms...</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <SymptomSelector
            selectedSymptoms={selectedSymptoms}
            onSelectSymptom={handleSymptomSelect}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Describe your symptoms..."
              placeholderTextColor="#64748B"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.micButton, isListening && styles.micButtonActive]}
              onPress={isListening ? stopListening : startListening}
            >
              <FontAwesome5 
                name="microphone" 
                size={20} 
                color={isListening ? '#4CD7B0' : '#64748B'} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#64748B', '#475569'] : ['#4CD7B0', '#22C55E']}
                style={styles.sendButtonGradient}
              >
                <FontAwesome5 
                  name="paper-plane" 
                  size={18} 
                  color="white"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#4CD7B0',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
    textShadow: '0 0 10px rgba(76, 215, 176, 0.5)',
  },
  disclaimerContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  disclaimerText: {
    color: '#F87171',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(76, 215, 176, 0.1)',
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(76, 215, 176, 0.2)',
  },
  loadingIcon: {
    marginRight: 12,
  },
  loadingText: {
    color: '#4CD7B0',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 215, 176, 0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 120,
    color: '#E2E8F0',
    borderWidth: 2,
    borderColor: 'rgba(76, 215, 176, 0.2)',
  },
  sendButton: {
    borderRadius: 24,
    alignSelf: 'flex-end',
    shadowColor: '#4CD7B0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    shadowOpacity: 0.1,
  },
  sendButtonGradient: {
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginRight: 8,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: 'rgba(76, 215, 176, 0.2)',
  },
  micButtonActive: {
    backgroundColor: 'rgba(76, 215, 176, 0.2)',
    borderColor: '#4CD7B0',
    shadowColor: '#4CD7B0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
