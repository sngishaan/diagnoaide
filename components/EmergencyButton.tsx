import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Linking, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface EmergencyButtonProps {
  riskLevel: 'Low' | 'Medium' | 'High';
}

export default function EmergencyButton({ riskLevel }: EmergencyButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleEmergencyCall = () => {
    const emergencyNumber = Platform.OS === 'ios' ? 'tel:911' : 'tel:911';
    Linking.openURL(emergencyNumber);
  };

  if (riskLevel !== 'High') return null;

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowModal(true)}
      >
        <FontAwesome5 name="phone" size={20} color="white" />
        <Text style={styles.buttonText}>Emergency Help</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emergency Services</Text>
            <Text style={styles.modalText}>
              Based on your symptoms, immediate medical attention may be required.
              Would you like to call emergency services?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.callButton]}
                onPress={handleEmergencyCall}
              >
                <FontAwesome5 name="phone" size={16} color="white" />
                <Text style={styles.callButtonText}>Call 911</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  callButton: {
    backgroundColor: '#E74C3C',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
