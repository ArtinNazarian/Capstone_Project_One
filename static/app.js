const BASEURL = `https://api.edamam.com/api/recipes/v2?type=public`;
const app_id = "034b4f2e";
const app_key = "9377319e4689186f9116d036194e02d0";

const $searchForm = $(".search-form");
const $recipeList = $(".search-result");

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await getRecipeAndDisplay();
  findRecipe(query);
});

async function getRecipeAndDisplay() {
  let searchQuery = $("#form-input").val();
  query = formatQuery(searchQuery);
  const recipes = await findRecipe(query);
  $("#form-input").val("");
  displayResult(recipes);
}

function formatQuery(query) {
  let queryList = query.split(",");
  let queryStr = queryList.join("%2C%20");
  return queryStr;
}

async function findRecipe(query) {
  const response = await axios.get(
    `${BASEURL}&q=${query}&app_id=${app_id}&app_key=${app_key}`
  );

  let result = response.data.hits.map((obj) => {
    let recipe = obj.recipe;
    return {
      calories: Math.round(recipe.calories),
      cook_time: recipe.totalTime,
      url: recipe.url,
      img: recipe.images.REGULAR.url,
      name: recipe.label,
      cuisine: recipe.cuisineType[0],
    };
  });

  return result;
}

function displayResult(recipes) {
  $recipeList.empty();
  for (let recipe of recipes) {
    const $recipe = $(
      `<div "class="col-md-4 col-md-4 mb-6">
      <div class="media">
        <img 
           src=${recipe.img} 
           alt='dish'
           class="w-25 mr-3">
        <div class="media-body">
          <h5 class="text-primary">${recipe.name}</h5>
          <ul>
          <li>Calories: ${recipe.calories}</li>
          <li>Cook Time: ${recipe.cook_time}</li>
          <li>Cuisine: ${recipe.cuisine}</li>
          </ul>          
        </div>
      </div>  
    </div>`
    );
    $recipeList.append($recipe);
  }
}
