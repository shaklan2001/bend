import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './auth';
import { supabase } from './supabase';

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
    rest_duration?: number;
  }>;
  totalDuration: number;
  createdAt: string;
  user_id?: string;
}

export interface DatabaseCustomRoutine {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  cover_image: string;
  total_duration: number;
  exercises_count: number;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomRoutineExercise {
  id: string;
  routine_id: string;
  exercise_name: string;
  description: string;
  image_url: string;
  video_url?: string;
  duration_seconds: number;
  sequence: number;
  rest_duration?: number;
  created_at: string;
}

const CUSTOM_ROUTINES_KEY = 'customRoutines';

/**
 * Convert CustomRoutine to DatabaseCustomRoutine format
 */
function convertToDatabaseFormat(
  routine: CustomRoutine,
  userId: string
): Omit<DatabaseCustomRoutine, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    name: routine.name,
    slug: routine.slug,
    cover_image: routine.coverImage,
    total_duration: routine.totalDuration,
    exercises_count: routine.exercises.length,
    description: '',
    is_public: false,
  };
}

/**
 * Convert DatabaseCustomRoutine to CustomRoutine format
 */
function convertFromDatabaseFormat(
  routine: DatabaseCustomRoutine,
  exercises: DatabaseCustomRoutineExercise[]
): CustomRoutine {
  return {
    id: routine.id,
    name: routine.name,
    slug: routine.slug,
    coverImage: routine.cover_image,
    totalDuration: routine.total_duration,
    createdAt: routine.created_at,
    user_id: routine.user_id,
    exercises: exercises
      .sort((a, b) => a.sequence - b.sequence)
      .map(exercise => ({
        id: exercise.id,
        name: exercise.exercise_name,
        description: exercise.description,
        image_url: exercise.image_url,
        video_url: exercise.video_url,
        duration_seconds: exercise.duration_seconds,
        sequence: exercise.sequence,
        rest_duration: exercise.rest_duration,
      })),
  };
}

/**
 * Save custom routine to database
 */
async function saveToDatabase(routine: CustomRoutine): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) return false;

    const dbRoutine = convertToDatabaseFormat(routine, user.id);

    // Check for duplicate slug
    const { data: existingRoutine } = await supabase
      .from('custom_routines')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', routine.slug)
      .single();

    if (existingRoutine && existingRoutine.id !== routine.id) {
      console.error('Slug already exists for this user');
      return false;
    }

    let routineId: string;

    if (routine.id.startsWith('custom_')) {
      // New routine, insert
      const { data: newRoutine, error: routineError } = await supabase
        .from('custom_routines')
        .insert(dbRoutine)
        .select('id')
        .single();

      if (routineError) {
        console.error('Error saving routine to database:', routineError);
        return false;
      }

      routineId = newRoutine.id;
    } else {
      // Existing routine, update
      const { error: routineError } = await supabase
        .from('custom_routines')
        .update(dbRoutine)
        .eq('id', routine.id)
        .eq('user_id', user.id);

      if (routineError) {
        console.error('Error updating routine in database:', routineError);
        return false;
      }

      routineId = routine.id;

      // Delete existing exercises
      const { error: deleteError } = await supabase
        .from('custom_routine_exercises')
        .delete()
        .eq('routine_id', routineId);

      if (deleteError) {
        console.error('Error deleting existing exercises:', deleteError);
        return false;
      }
    }

    // Save exercises
    const exerciseData = routine.exercises.map(exercise => ({
      routine_id: routineId,
      exercise_name: exercise.name,
      description: exercise.description,
      image_url: exercise.image_url,
      video_url: exercise.video_url || null,
      duration_seconds: exercise.duration_seconds,
      sequence: exercise.sequence,
      rest_duration: exercise.rest_duration || null,
    }));

    const { error: exercisesError } = await supabase
      .from('custom_routine_exercises')
      .insert(exerciseData);

    if (exercisesError) {
      console.error('Error saving exercises to database:', exercisesError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving to database:', error);
    return false;
  }
}

/**
 * Load custom routines from database
 */
async function loadFromDatabase(): Promise<CustomRoutine[]> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) return [];

    const { data: routines, error: routinesError } = await supabase
      .from('custom_routines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (routinesError) {
      console.error('Error loading routines from database:', routinesError);
      return [];
    }

    if (!routines || routines.length === 0) return [];

    // Load exercises for each routine
    const routinesWithExercises = await Promise.all(
      routines.map(async routine => {
        const { data: exercises, error: exercisesError } = await supabase
          .from('custom_routine_exercises')
          .select('*')
          .eq('routine_id', routine.id)
          .order('sequence', { ascending: true });

        if (exercisesError) {
          console.error('Error loading exercises for routine:', exercisesError);
          return convertFromDatabaseFormat(routine, []);
        }

        return convertFromDatabaseFormat(routine, exercises || []);
      })
    );

    return routinesWithExercises;
  } catch (error) {
    console.error('Error loading from database:', error);
    return [];
  }
}

/**
 * Load custom routines from AsyncStorage only
 */
async function loadLocalRoutines(): Promise<CustomRoutine[]> {
  try {
    const routinesJson = await AsyncStorage.getItem(CUSTOM_ROUTINES_KEY);
    return routinesJson ? JSON.parse(routinesJson) : [];
  } catch (error) {
    console.error('Error loading local routines:', error);
    return [];
  }
}

/**
 * Save custom routines to AsyncStorage
 */
async function saveLocalRoutines(routines: CustomRoutine[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(routines));
    return true;
  } catch (error) {
    console.error('Error saving local routines:', error);
    return false;
  }
}

/**
 * Generate unique slug for custom routine
 */
async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const user = authService.getCurrentUserFromState();
  let slug = baseSlug;
  let counter = 1;

  if (user) {
    // Check database for duplicates
    while (true) {
      const { data: existingRoutine } = await supabase
        .from('custom_routines')
        .select('id')
        .eq('user_id', user.id)
        .eq('slug', slug)
        .single();

      if (!existingRoutine || (excludeId && existingRoutine.id === excludeId)) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  } else {
    // Check local storage for duplicates
    const localRoutines = await loadLocalRoutines();
    while (localRoutines.some(routine => routine.slug === slug && routine.id !== excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}

/**
 * Sync local custom routines to database (for when user logs in)
 */
export async function syncLocalCustomRoutinesToDatabase(): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) {
      console.log('No user logged in, skipping sync');
      return false;
    }

    const localRoutines = await loadLocalRoutines();
    if (localRoutines.length === 0) {
      console.log('No local custom routines to sync');
      return true;
    }

    // Check if user already has custom routines in database
    const { data: existingRoutines } = await supabase
      .from('custom_routines')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existingRoutines && existingRoutines.length > 0) {
      console.log('User already has custom routines in database, skipping sync');
      return true;
    }

    // Sync each local routine to database
    for (const routine of localRoutines) {
      await saveToDatabase(routine);
    }

    console.log(`✅ Synced ${localRoutines.length} custom routines to database`);
    return true;
  } catch (error) {
    console.error('Error syncing custom routines to database:', error);
    return false;
  }
}

/**
 * Load custom routines from AsyncStorage and/or database
 */
export async function getCustomRoutines(): Promise<CustomRoutine[]> {
  try {
    const user = authService.getCurrentUserFromState();

    if (user) {
      // User is logged in, load from database
      const dbRoutines = await loadFromDatabase();
      if (dbRoutines.length > 0) {
        return dbRoutines;
      }

      // If no database routines, try to sync local routines to database
      const localRoutines = await loadLocalRoutines();
      if (localRoutines.length > 0) {
        await syncLocalCustomRoutinesToDatabase();
        return await loadFromDatabase();
      }

      return [];
    } else {
      // User not logged in, load from local storage
      return await loadLocalRoutines();
    }
  } catch (error) {
    console.error('Error loading custom routines:', error);
    return [];
  }
}

/**
 * Save a custom routine
 */
export async function saveCustomRoutine(
  routine: Omit<CustomRoutine, 'id' | 'slug' | 'createdAt'>
): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    const uniqueSlug = await generateUniqueSlug(routine.name);

    const newRoutine: CustomRoutine = {
      ...routine,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug: uniqueSlug,
      createdAt: new Date().toISOString(),
    };

    // Save to database if user is logged in
    if (user) {
      const dbSuccess = await saveToDatabase(newRoutine);
      if (dbSuccess) {
        return true;
      }
    }

    // Also save to local storage (for offline support and non-logged-in users)
    const currentRoutines = await loadLocalRoutines();
    const updatedRoutines = [...currentRoutines, newRoutine];
    const localSuccess = await saveLocalRoutines(updatedRoutines);

    return localSuccess;
  } catch (error) {
    console.error('Error saving custom routine:', error);
    return false;
  }
}

/**
 * Get custom routine by slug
 */
export async function getCustomRoutineBySlug(slug: string): Promise<CustomRoutine | null> {
  try {
    const user = authService.getCurrentUserFromState();

    if (user) {
      // Load from database
      const { data: routine, error: routineError } = await supabase
        .from('custom_routines')
        .select('*')
        .eq('user_id', user.id)
        .eq('slug', slug)
        .single();

      if (routineError || !routine) return null;

      const { data: exercises, error: exercisesError } = await supabase
        .from('custom_routine_exercises')
        .select('*')
        .eq('routine_id', routine.id)
        .order('sequence', { ascending: true });

      if (exercisesError) {
        console.error('Error loading exercises for routine:', exercisesError);
        return null;
      }

      return convertFromDatabaseFormat(routine, exercises || []);
    } else {
      // Load from local storage
      const routines = await loadLocalRoutines();
      return routines.find(routine => routine.slug === slug) || null;
    }
  } catch (error) {
    console.error('Error getting custom routine by slug:', error);
    return null;
  }
}

/**
 * Delete a custom routine
 */
export async function deleteCustomRoutine(routineId: string): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();

    // Delete from database if user is logged in
    if (user) {
      const { error: exercisesError } = await supabase
        .from('custom_routine_exercises')
        .delete()
        .eq('routine_id', routineId);

      if (exercisesError) {
        console.error('Error deleting exercises:', exercisesError);
        return false;
      }

      const { error: routineError } = await supabase
        .from('custom_routines')
        .delete()
        .eq('id', routineId)
        .eq('user_id', user.id);

      if (routineError) {
        console.error('Error deleting routine from database:', routineError);
        return false;
      }
    }

    // Also delete from local storage
    const currentRoutines = await loadLocalRoutines();
    const updatedRoutines = currentRoutines.filter(routine => routine.id !== routineId);
    const localSuccess = await saveLocalRoutines(updatedRoutines);

    return localSuccess;
  } catch (error) {
    console.error('Error deleting custom routine:', error);
    return false;
  }
}

/**
 * Update a custom routine
 */
export async function updateCustomRoutine(
  routineId: string,
  updates: Partial<Omit<CustomRoutine, 'id' | 'createdAt' | 'user_id'>>
): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();

    // Get existing routine
    const existingRoutines = await getCustomRoutines();
    const existingRoutine = existingRoutines.find(r => r.id === routineId);
    if (!existingRoutine) return false;

    // Generate new slug if name changed
    let newSlug = existingRoutine.slug;
    if (updates.name && updates.name !== existingRoutine.name) {
      newSlug = await generateUniqueSlug(updates.name, routineId);
    }

    const updatedRoutine: CustomRoutine = {
      ...existingRoutine,
      ...updates,
      slug: newSlug,
    };

    // Update in database if user is logged in
    if (user) {
      const dbSuccess = await saveToDatabase(updatedRoutine);
      if (dbSuccess) {
        return true;
      }
    }

    // Also update in local storage
    const currentRoutines = await loadLocalRoutines();
    const updatedRoutines = currentRoutines.map(routine =>
      routine.id === routineId ? updatedRoutine : routine
    );
    const localSuccess = await saveLocalRoutines(updatedRoutines);

    return localSuccess;
  } catch (error) {
    console.error('Error updating custom routine:', error);
    return false;
  }
}

/**
 * Clear all custom routines
 */
export async function clearAllCustomRoutines(): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();

    // Clear from database if user is logged in
    if (user) {
      const { error: exercisesError } = await supabase
        .from('custom_routine_exercises')
        .delete()
        .eq(
          'routine_id',
          'in',
          (await supabase.from('custom_routines').select('id').eq('user_id', user.id)).data?.map(
            r => r.id
          ) || []
        );

      if (exercisesError) {
        console.error('Error clearing exercises:', exercisesError);
        return false;
      }

      const { error: routinesError } = await supabase
        .from('custom_routines')
        .delete()
        .eq('user_id', user.id);

      if (routinesError) {
        console.error('Error clearing routines from database:', routinesError);
        return false;
      }
    }

    // Also clear from local storage
    await AsyncStorage.removeItem(CUSTOM_ROUTINES_KEY);
    console.log('All custom routines cleared');
    return true;
  } catch (error) {
    console.error('Error clearing custom routines:', error);
    return false;
  }
}
