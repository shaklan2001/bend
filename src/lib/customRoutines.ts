import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CustomRoutine {
    id: string;
    name: string;
    slug: string;
    coverImage: string;
    exercises: Array<{
        id: string;
        name: string;
        description: string;
        image_url: string;
        video_url?: string;
        duration_seconds: number;
        sequence: number;
    }>;
    totalDuration: number;
    createdAt: string;
}

const CUSTOM_ROUTINES_KEY = 'customRoutines';

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-') 
        .trim();
};


const ensureUniqueSlug = async (baseSlug: string): Promise<string> => {
    const existingRoutines = await getCustomRoutines();
    let slug = baseSlug;
    let counter = 1;

    while (existingRoutines.some(routine => routine.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export const saveCustomRoutine = async (routine: Omit<CustomRoutine, 'id' | 'slug' | 'createdAt'>): Promise<boolean> => {
    try {
        const existingRoutines = await getCustomRoutines();
        const baseSlug = generateSlug(routine.name);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        const newRoutine: CustomRoutine = {
            ...routine,
            id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            slug: uniqueSlug,
            createdAt: new Date().toISOString(),
        };

        const updatedRoutines = [...existingRoutines, newRoutine];
        await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));

        return true;
    } catch (error) {
        console.error('Error saving custom routine:', error);
        return false;
    }
};

export const getCustomRoutines = async (): Promise<CustomRoutine[]> => {
    try {
        const routinesJson = await AsyncStorage.getItem(CUSTOM_ROUTINES_KEY);
        return routinesJson ? JSON.parse(routinesJson) : [];
    } catch (error) {
        console.error('Error getting custom routines:', error);
        return [];
    }
};

export const getCustomRoutineBySlug = async (slug: string): Promise<CustomRoutine | null> => {
    try {
        const routines = await getCustomRoutines();
        return routines.find(routine => routine.slug === slug) || null;
    } catch (error) {
        console.error('Error getting custom routine by slug:', error);
        return null;
    }
};

export const deleteCustomRoutine = async (routineId: string): Promise<boolean> => {
    try {
        const existingRoutines = await getCustomRoutines();
        const updatedRoutines = existingRoutines.filter(routine => routine.id !== routineId);
        await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));

        return true;
    } catch (error) {
        console.error('Error deleting custom routine:', error);
        return false;
    }
};

export const updateCustomRoutine = async (routineId: string, updates: Partial<CustomRoutine>): Promise<boolean> => {
    try {
        const existingRoutines = await getCustomRoutines();
        const updatedRoutines = existingRoutines.map(routine =>
            routine.id === routineId ? { ...routine, ...updates } : routine
        );
        await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));

        return true;
    } catch (error) {
        console.error('Error updating custom routine:', error);
        return false;
    }
};

export const clearAllCustomRoutines = async (): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(CUSTOM_ROUTINES_KEY);
        console.log('All custom routines cleared from local storage');
        return true;
    } catch (error) {
        console.error('Error clearing custom routines:', error);
        return false;
    }
};
