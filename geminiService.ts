import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Ingredient, MealType, PrepTimePreference } from "./types";

/**
 * Initialisation sécurisée du client Gemini.
 * process.env.API_KEY est injecté automatiquement par l'environnement de build/déploiement.
 */
const getAI = () => {
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
  if (!apiKey) {
    console.warn("API_KEY manquante dans l'environnement. Les fonctionnalités IA seront limitées.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

const NUTRITION_SYSTEM_INSTRUCTION = `Tu es un expert nutritionniste et chef cuisinier de renommée mondiale. 
Règles strictes de création culinaire :
1. COHÉRENCE DES SAVEURS : Un "Dessert" ou "Goûter" DOIT être sucré ou fruité.
2. ANALYSE DU FRIGO : Si les ingrédients ne permettent pas de faire un plat COHÉRENT, explique pourquoi dans "missingTypeExplanation".
3. FORMAT : Réponds uniquement en JSON sans texte explicatif autour.`;

export async function analyzeFoodImage(base64Image: string): Promise<{
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fats: number;
}> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Identifie ce plat et ses macros (kcal, glucides, protéines, lipides)." }
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

  const text = response.text;
  if (!text) throw new Error("Réponse vide de l'IA");
  return JSON.parse(text);
}

export async function generateRecipe(
  pantry: Ingredient[], 
  goal: string, 
  mealType: MealType,
  timePref: PrepTimePreference = 'express'
): Promise<Recipe> {
  const ai = getAI();
  const pantryList = pantry.map(i => i.name).join(", ");
  const prompt = `Génère une recette de ${mealType} (${timePref}). Ingrédients disponibles : ${pantryList}. Objectif : ${goal}.`;

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
        required: ["id", "isPossible", "title", "ingredients", "instructions", "calories", "macros"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Réponse vide de l'IA");
  const recipe = JSON.parse(text);
  recipe.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(recipe.title)}/600/400`;
  return recipe;
}

export async function importRecipeFromTikTokUrl(url: string): Promise<Recipe> {
  const ai = getAI();
  const prompt = `Analyse et importe la recette de cette vidéo TikTok : ${url}`;

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
          macros: {
            type: Type.OBJECT,
            properties: {
              carbs: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Réponse vide de l'IA");
  const recipe = JSON.parse(text);
  recipe.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(recipe.title)}/600/400`;
  return recipe;
}
