import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './auth';
import { supabase } from './supabase';

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

export interface DatabaseFavoriteItem {
  id: string;
  user_id: string;
  routine_type: string;
  routine_id: string;
  routine_name: string;
  routine_slug: string;
  image_url: string;
  duration_minutes: number;
  exercises_count: number;
  added_at: string;
}

const FAVORITES_STORAGE_KEY = 'bendapp_saved_routines';

/**
 * Convert SavedRoutine to DatabaseFavoriteItem format
 */
function convertToDatabaseFormat(item: SavedRoutine, userId: string): Omit<DatabaseFavoriteItem, 'id'> {
  return {
    user_id: userId,
    routine_type: 'yoga', // Default type
    routine_id: item.id,
    routine_name: item.name,
    routine_slug: item.slug,
    image_url: item.image_url || '',
    duration_minutes: item.total_duration_minutes,
    exercises_count: 0, // We don't have this info in SavedRoutine, could be added later
    added_at: new Date(item.savedAt).toISOString(),
  };
}

/**
 * Convert DatabaseFavoriteItem to SavedRoutine format
 */
function convertFromDatabaseFormat(item: DatabaseFavoriteItem): SavedRoutine {
  return {
    id: item.routine_id,
    name: item.routine_name,
    description: '', // We don't store description in database, could be added later
    total_duration_minutes: item.duration_minutes,
    body_part_id: '', // We don't store body_part_id in database, could be added later
    slug: item.routine_slug,
    image_url: item.image_url,
    savedAt: new Date(item.added_at).getTime(),
  };
}

/**
 * Save favorite to database
 */
async function saveToDatabase(item: SavedRoutine): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) {
      console.log('No user logged in, skipping database save');
      return false;
    }

    const dbItem = convertToDatabaseFormat(item, user.id);
    const { error } = await supabase
      .from('user_favorites')
      .insert([dbItem]);

    if (error) {
      console.error('Error saving favorite to database:', error);
      return false;
    }

    console.log('✅ Favorite saved to database');
    return true;
  } catch (error) {
    console.error('Error saving favorite to database:', error);
    return false;
  }
}

/**
 * Load favorites from database
 */
async function loadFromDatabase(): Promise<SavedRoutine[]> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) {
      console.log('No user logged in, skipping database load');
      return [];
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error loading favorites from database:', error);
      return [];
    }

    return data.map(convertFromDatabaseFormat);
  } catch (error) {
    console.error('Error loading favorites from database:', error);
    return [];
  }
}

/**
 * Load favorites from AsyncStorage only
 */
async function loadLocalFavorites(): Promise<SavedRoutine[]> {
  try {
    const savedData = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  } catch (error) {
    console.error('Error loading local favorites:', error);
    return [];
  }
}

/**
 * Save favorites to AsyncStorage
 */
async function saveLocalFavorites(favorites: SavedRoutine[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Error saving local favorites:', error);
    return false;
  }
}

/**
 * Load favorites from AsyncStorage and/or database
 */
export async function loadFavorites(): Promise<SavedRoutine[]> {
  try {
    const user = authService.getCurrentUserFromState();
    
    if (user) {
      // User is logged in, load from database
      const dbFavorites = await loadFromDatabase();
      if (dbFavorites.length > 0) {
        return dbFavorites;
      }
      
      // If no database favorites, try to sync local favorites to database
      const localFavorites = await loadLocalFavorites();
      if (localFavorites.length > 0) {
        await syncLocalFavoritesToDatabase();
        return localFavorites;
      }
      
      return [];
    } else {
      // User not logged in, load from local storage
      return await loadLocalFavorites();
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

/**
 * Save a routine as favorite
 */
export async function saveRoutine(routine: Omit<SavedRoutine, 'savedAt'>): Promise<boolean> {
  try {
    const favoriteItem: SavedRoutine = {
      ...routine,
      savedAt: Date.now(),
    };

    // Save to database if user is logged in
    const user = authService.getCurrentUserFromState();
    if (user) {
      const dbSuccess = await saveToDatabase(favoriteItem);
      if (dbSuccess) {
        console.log('✅ Favorite saved to database');
        return true;
      }
    }

    // Also save to local storage (for offline support and non-logged-in users)
    const currentFavorites = await loadLocalFavorites();
    const existingIndex = currentFavorites.findIndex(r => r.id === routine.id);

    if (existingIndex !== -1) {
      currentFavorites[existingIndex] = favoriteItem;
    } else {
      currentFavorites.push(favoriteItem);
    }
    
    const localSuccess = await saveLocalFavorites(currentFavorites);
    if (localSuccess) {
      console.log('✅ Favorite saved to local storage');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error saving favorite:', error);
    return false;
  }
}

/**
 * Remove a routine from favorites
 */
export async function removeRoutine(routineId: string): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    
    // Remove from database if user is logged in
    if (user) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('routine_id', routineId);

      if (error) {
        console.error('Error removing favorite from database:', error);
      } else {
        console.log('✅ Favorite removed from database');
      }
    }

    // Also remove from local storage
    const currentFavorites = await loadLocalFavorites();
    const updatedFavorites = currentFavorites.filter(r => r.id !== routineId);
    
    const localSuccess = await saveLocalFavorites(updatedFavorites);
    if (localSuccess) {
      console.log('✅ Favorite removed from local storage');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
}

/**
 * Check if a routine is saved as favorite
 */
export async function isRoutineSaved(routineId: string): Promise<boolean> {
  try {
    const favorites = await loadFavorites();
    return favorites.some(r => r.id === routineId);
  } catch (error) {
    console.error('Error checking if routine is saved:', error);
    return false;
  }
}

/**
 * Sync local favorites to database (for when user logs in)
 */
export async function syncLocalFavoritesToDatabase(): Promise<boolean> {
  try {
    const user = authService.getCurrentUserFromState();
    if (!user) {
      console.log('No user logged in, skipping sync');
      return false;
    }

    const localFavorites = await loadLocalFavorites();
    if (localFavorites.length === 0) {
      console.log('No local favorites to sync');
      return true;
    }

    // Convert local favorites to database format
    const dbItems = localFavorites.map(item => convertToDatabaseFormat(item, user.id));

    // Insert all items to database
    const { error } = await supabase
      .from('user_favorites')
      .insert(dbItems);

    if (error) {
      console.error('Error syncing favorites to database:', error);
      return false;
    }

    console.log(`✅ Synced ${localFavorites.length} favorites to database`);
    return true;
  } catch (error) {
    console.error('Error syncing favorites to database:', error);
    return false;
  }
}

/**
 * Clear all favorites (for testing or reset purposes)
 */
export async function clearFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    console.log('✅ Favorites cleared successfully');
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}
