// frontend/src/components/chef/VirtualChef.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-toastify';

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
}

export const VirtualChef: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  
  const { mutate: getRecommendation, data: recipe } = useMutation<Recipe>(
    async () => {
      const response = await fetch('/api/chef/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ingredients: selectedIngredients })
      });
      
      if (!response.ok) throw new Error('Failed to get recommendation');
      return response.json();
    },
    {
      onError: () => toast.error('Error getting recommendation')
    }
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Virtual Chef Assistant</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {/* Aquí iría un componente de selección múltiple de ingredientes */}
            <input
              type="text"
              placeholder="Add ingredient"
              className="border rounded p-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value) {
                    setSelectedIngredients(prev => [...prev, value]);
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="bg-blue-100 px-2 py-1 rounded-full text-sm"
              >
                {ingredient}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => setSelectedIngredients(prev => 
                    prev.filter((_, i) => i !== index)
                  )}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          disabled={selectedIngredients.length === 0}
          onClick={() => getRecommendation()}
        >
          Get Recommendation
        </button>

        {recipe && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-4">
              Preparation time: {recipe.preparationTime} minutes | 
              Difficulty: {recipe.difficulty}
            </p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ol className="list-decimal pl-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            </div>

            <div className="bg-yellow-50 p-4 rounded">
              <h4 className="font-medium mb-2">Chef's Tips:</h4>
              <ul className="list-disc pl-4">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="mb-1">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};