import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Square } from '@/types/square';
import { colors } from '@/constants/colors';

interface SquaresState {
  squares: Square[];
  updateSquare: (id: number, updates: Partial<Omit<Square, 'id'>>) => void;
  resetToDefaults: () => void;
}

const defaultSquares: Square[] = [
  { id: 1, text: "Emergency Services", phoneNumber: "911", color: colors.squares[0] },
  { id: 2, text: "Family Contact", phoneNumber: "123-456-7890", color: colors.squares[1] },
  { id: 3, text: "Medical Assistance", phoneNumber: "800-123-4567", color: colors.squares[2] },
  { id: 4, text: "Transportation", phoneNumber: "800-555-1234", color: colors.squares[3] },
  { id: 5, text: "Home Services", phoneNumber: "800-987-6543", color: colors.squares[4] },
  { id: 6, text: "Personal Assistant", phoneNumber: "800-111-2222", color: colors.squares[5] },
];

export const useSquaresStore = create<SquaresState>()(
  persist(
    (set) => ({
      squares: defaultSquares,
      updateSquare: (id, updates) => 
        set((state) => ({
          squares: state.squares.map((square) => 
            square.id === id ? { ...square, ...updates } : square
          ),
        })),
      resetToDefaults: () => set({ squares: defaultSquares }),
    }),
    {
      name: 'squares-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);