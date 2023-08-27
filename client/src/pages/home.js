import {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useGetUserID} from "../hooks/userGetUserID";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);


  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`,  
          {userID}
          );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes(); 
    if (cookies.access_token) {
      fetchSavedRecipes();
    }
    
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", 
      {
        recipeID, 
        userID,
      },
      {headers: {authorization: cookies.access_token}}
      
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {  
      console.err(err); 
    }  

  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);
  

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            
            <div>
              <h2>{recipe.name}</h2>
              <button 
                onClick={() => saveRecipe(recipe._id)} 
                disabled={isRecipeSaved(recipe._id) || !cookies.access_token}
                >
                  {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p> {recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name}/>
            <p> Cooking Time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
        
      </ul>
    </div>
  );
};