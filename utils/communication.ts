import * as Speech from 'expo-speech';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const speakText = async (text: string) => {
  try {
    // Stop any ongoing speech
    Speech.stop();
    
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync();
    }
    
    // Speak the text
    await Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to speak text:', error);
    return false;
  }
};

export const makePhoneCall = async (phoneNumber: string) => {
  try {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Format the phone number for linking
    const phoneUrl = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
    
    // Check if the device can handle the phone call
    const canOpen = await Linking.canOpenURL(phoneUrl);
    
    if (canOpen) {
      await Linking.openURL(phoneUrl);
      return true;
    } else {
      console.warn('Device cannot make phone calls');
      return false;
    }
  } catch (error) {
    console.error('Failed to make phone call:', error);
    return false;
  }
};