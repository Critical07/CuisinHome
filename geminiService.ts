
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Ingredient, MealType, PrepTimePreference } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NUTRITION_SYSTEM_INSTRUCTION = `Tu es un expert nutritionniste et chef cuisinier de renommée mondiale. 
Règles strictes de création culinaire :
1. COHÉRENCE DES SAVEURS : Un "Dessert" ou "Goûter" DOIT être sucré ou fruité. N'utilise JAMAIS de légumes salés (potiron, oignon, avocat, etc.) pour des desserts sauf si c'est une pâtisserie reconnue (ex: carrot cake).
2. ANALYSE DU FRIGO : Si les ingrédients du frigo ne permettent pas de faire un plat COHÉRENT pour la catégorie demandée, mets "isPossible: false" et explique pourquoi dans "missingTypeExplanation".
3. DIVERSITÉ : Ne propose JAMAIS deux fois la même base.
4. TIMING : Respecte scrupuleusement le temps demandé (Express = <15min, Gourmet = 30-45min).
5. FORMAT : Réponds uniquement en JSON sans texte autour.`;

export async function importRecipeFromTikTokUrl(url: string): Promise<Recipe & { error?: string }> {
  const prompt = `ANALYSE TIKTOK NUTRITIONNELLE. URL : ${url}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: NUTRITION_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          prepTime: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          healthScore: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              carbs: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            },
            required: ["carbs", "protein", "fats"]
          }
        },
        required: ["id", "title", "ingredients", "instructions", "calories", "macros", "healthScore"]
      }
    }
  });

  const recipe = JSON.parse(response.text);
  recipe.isPossible = true;
  recipe.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(recipe.title + Date.now())}/800/600`;
  return recipe;
}

export async function analyzeFoodImage(base64Image: string): Promise<{
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fats: number;
}> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Identifie ce plat et ses macros." }
        ]
      }
    ],
    config: {
      systemInstruction: NUTRITION_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          kcal: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          fats: { type: Type.NUMBER }
        },
        required: ["name", "kcal", "carbs", "protein", "fats"]
      }
    }
  });

  return JSON.parse(response.text);
}

const normalize = (str: string) => str.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/s$/, "")
  .trim();

export async function generateRecipe(
  pantry: Ingredient[], 
  goal: string, 
  mealType: MealType,
  timePref: PrepTimePreference = 'express'
): Promise<Recipe> {
  const pantryList = pantry.map(i => i.name).join(", ");
  const goalFR = goal === 'lose' ? 'perdre du poids' : goal === 'gain' ? 'prendre de la masse' : 'maintenir ma forme';
  const timeLabel = timePref === 'express' ? "EXPRESS (max 15 minutes, préparation rapide)" : "GOURMET (30 à 45 minutes, plus élaboré)";
  
  const salt = Math.random().toString(36).substring(7);
  const prompt = `Génère une recette de ${mealType}. 
  CONTRAINTE TEMPS : ${timeLabel}.
  FRIGO : ${pantryList}. 
  OBJECTIF : ${goalFR}.
  IMPORTANT : Pour un Dessert/Goûter, si tu n'as pas de fruits ou base sucrée, dis que c'est impossible. Ne mélange pas légumes salés et sucre. Seed: ${salt}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: NUTRITION_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          isPossible: { type: Type.BOOLEAN },
          missingTypeExplanation: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          prepTime: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          healthScore: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              carbs: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            },
            required: ["carbs", "protein", "fats"]
          }
        },
        required: ["id", "isPossible", "calories", "macros", "healthScore"]
      }
    }
  });

  const recipe = JSON.parse(response.text);
  
  if (recipe.isPossible) {
    const pantryNormalized = pantry.map(p => normalize(p.name));
    const matching = recipe.ingredients.filter((ing: string) => {
      const ingNorm = normalize(ing);
      return pantryNormalized.some(p => ingNorm.includes(p) || p.includes(ingNorm));
    }).length;
    
    recipe.fridgeMatchPercentage = Math.round((matching / recipe.ingredients.length) * 100);
    recipe.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(recipe.title + salt)}/600/400`;
  }
  
  return recipe;
}
