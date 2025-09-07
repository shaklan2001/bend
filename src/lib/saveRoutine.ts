import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedRoutine {
  id: string;
  name: string;
  description: string;
  total_duration_minutes: number;
  body_part_id: string;
  slug: string;
  image_url?: string;
  savedAt: number;
}

export const saveRoutine = async (routine: Omit<SavedRoutine, 'savedAt'>): Promise<boolean> => {
  try {
    const savedData = await AsyncStorage.getItem('savedRoutines');
    let savedRoutines: SavedRoutine[] = [];

    if (savedData) {
      savedRoutines = JSON.parse(savedData);
    }

    const existingIndex = savedRoutines.findIndex(r => r.id === routine.id);

    if (existingIndex !== -1) {
      savedRoutines[existingIndex] = {
        ...routine,
        savedAt: Date.now(),
      };
    } else {
      savedRoutines.push({
        ...routine,
        savedAt: Date.now(),
      });
    }

    await AsyncStorage.setItem('savedRoutines', JSON.stringify(savedRoutines));
    return true;
  } catch (error) {
    console.error('Error saving routine:', error);
    return false;
  }
};

export const removeRoutine = async (routineId: string): Promise<boolean> => {
  try {
    const savedData = await AsyncStorage.getItem('savedRoutines');
    if (savedData) {
      let savedRoutines: SavedRoutine[] = JSON.parse(savedData);
      savedRoutines = savedRoutines.filter(r => r.id !== routineId);
      await AsyncStorage.setItem('savedRoutines', JSON.stringify(savedRoutines));
    }
    return true;
  } catch (error) {
    console.error('Error removing routine:', error);
    return false;
  }
};

export const isRoutineSaved = async (routineId: string): Promise<boolean> => {
  try {
    const savedData = await AsyncStorage.getItem('savedRoutines');
    if (savedData) {
      const savedRoutines: SavedRoutine[] = JSON.parse(savedData);
      return savedRoutines.some(r => r.id === routineId);
    }
    return false;
  } catch (error) {
    console.error('Error checking if routine is saved:', error);
    return false;
  }
};

export const getSavedRoutines = async (): Promise<SavedRoutine[]> => {
  try {
    const savedData = await AsyncStorage.getItem('savedRoutines');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  } catch (error) {
    console.error('Error getting saved routines:', error);
    return [];
  }
};
