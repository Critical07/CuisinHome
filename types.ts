
export type IngredientCategory = 'Proteines' | 'Legumes' | 'Feculents' | 'Laiterie' | 'Autres';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity?: string;
  addedAt: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  category: IngredientCategory;
}

export type MealType = 'Entrée' | 'Plat' | 'Dessert' | 'Goûter';
export type PrepTimePreference = 'express' | 'gourmet';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
  imageUrl: string;
  mealType?: MealType;
  isPossible: boolean;
  missingTypeExplanation?: string;
  fridgeMatchPercentage?: number;
  healthScore?: number;
}

export interface RecipeBook {
  id: string;
  name: string;
  emoji: string;
  recipes: Recipe[];
}

export interface DailyLog {
  date: string;
  totalKcal: number;
  targetKcal: number;
  goalMet: boolean;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
  meals: Array<{
    id: string;
    name: string;
    kcal: number;
    time: string;
    type: MealType;
  }>;
}

export interface UserProfile {
  name: string;
  goal: 'lose' | 'maintain' | 'gain';
  dailyKcalTarget: number;
  isPremium: boolean;
  importsUsed: number;
}

export enum AppTab {
  PANTRY = 'pantry',
  TRACKER = 'tracker',
  SUGGESTION = 'suggestion',
  PROGRESS = 'progress',
  PROFILE = 'profile',
  SHOPPING = 'shopping',
  TIKTOK_IMPORT = 'tiktok_import',
  PAYWALL = 'paywall',
  RECIPE_BOOKS = 'recipe_books'
}
