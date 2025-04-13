import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch
} from 'react-native';
import { X, Palette } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Square } from '@/types/square';

interface EditSquareModalProps {
  visible: boolean;
  square: Square | null;
  onClose: () => void;
  onSave: (id: number, updates: Partial<Omit<Square, 'id'>>) => void;
}

export const EditSquareModal: React.FC<EditSquareModalProps> = ({
  visible,
  square,
  onClose,
  onSave,
}) => {
  const [text, setText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  React.useEffect(() => {
    if (square) {
      setText(square.text);
      setPhoneNumber(square.phoneNumber);
      setFavorite(square.favorite || false);
      setSelectedColor(square.color);
    }
  }, [square]);

  const handleSave = () => {
    if (square && (text.trim() || phoneNumber.trim())) {
      onSave(square.id, {
        text: text.trim() || square.text,
        phoneNumber: phoneNumber.trim() || square.phoneNumber,
        favorite,
        color: selectedColor,
      });
      onClose();
    }
  };

  if (!square) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Edit Square</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.label}>Text to Speak</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Enter text to be spoken"
              placeholderTextColor={colors.lightText}
              multiline
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              placeholderTextColor={colors.lightText}
              keyboardType="phone-pad"
            />

            <View style={styles.colorSection}>
              <View style={styles.sectionHeader}>
                <Palette size={20} color={colors.text} />
                <Text style={styles.sectionTitle}>Choose Color</Text>
              </View>
              <View style={styles.colorOptions}>
                {colors.squares.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Mark as Favorite</Text>
              <Switch
                value={favorite}
                onValueChange={setFavorite}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={favorite ? colors.white : colors.white}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 5,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  colorSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 16,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
});