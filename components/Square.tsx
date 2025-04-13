import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  Pressable, 
  Platform, 
  View,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Volume2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Square as SquareType } from '@/types/square';
import { speakText, makePhoneCall } from '@/utils/communication';

interface SquareProps {
  square: SquareType;
  onEdit?: () => void;
}

export const Square: React.FC<SquareProps> = ({ square, onEdit }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const DOUBLE_TAP_DELAY = 300;

  const handlePressIn = () => {
    setIsPressed(true);
    speakText(square.text);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    const now = Date.now();
    const isDoubleTap = now - lastTap < DOUBLE_TAP_DELAY;
    
    if (isDoubleTap) {
      // Handle double tap - make phone call immediately
      if (Platform.OS === 'web') {
        Alert.alert('Call', `Would call ${square.phoneNumber} on a mobile device`);
      } else {
        // Call directly without confirmation
        makePhoneCall(square.phoneNumber);
      }
    }
    
    setLastTap(now);
  };

  const handleLongPress = () => {
    if (onEdit) {
      onEdit();
    }
  };

  // Create a lighter version of the square color for the gradient
  const lightenColor = (color: string, amount: number = 30) => {
    // Simple lightening for demo purposes
    return color + '99'; // Adding transparency
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      accessibilityLabel={square.text}
      accessibilityHint={`Double tap to dial ${square.phoneNumber}`}
    >
      <LinearGradient
        colors={[square.color, lightenColor(square.color)]}
        style={[
          styles.gradient,
          isPressed && styles.gradientPressed
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.text} numberOfLines={2}>{square.text}</Text>
        
        <View style={styles.iconContainer}>
          <Volume2 size={20} color={colors.white} style={styles.icon} />
          <Text style={styles.instruction}>Press to hear</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <Phone size={20} color={colors.white} style={styles.icon} />
          <Text style={styles.instruction}>Double tap to dial</Text>
        </View>
        
        <Text style={styles.phoneNumber}>{square.phoneNumber}</Text>
        
        {square.favorite && (
          <View style={styles.favoriteIndicator} />
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    margin: '1%',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  gradientPressed: {
    opacity: 0.9,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  instruction: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.9,
  },
  phoneNumber: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
});