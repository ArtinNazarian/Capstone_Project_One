const BASEURL = `https://api.edamam.com/api/recipes/v2?type=public`;
const app_id = "034b4f2e";
const app_key = "9377319e4689186f9116d036194e02d0";

const $searchForm = $(".search-form");
const $recipeList = $(".search-result");
const favoriteLink = document.querySelector(".list-favorites");
const tableEl = document.querySelector("table");

let favoriteLocalStorage = JSON.parse(localStorage.getItem("recipes")) || [];

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
      uri: recipe.uri.slice(-6),
    };
  });
  return result;
}

function displayResult(recipes) {
  $recipeList.empty();
  for (let recipe of recipes) {
    const $recipe = $(
      `<div class="item">
        <img class="recipe-img" src=${recipe.img} alt="" />
        <div class="flex-container">
          <h3 class="title">${recipe.name}</h3>
          <a class="view-btn" href=${recipe.url}>View Recipe</a>             
          <button class="btn btn-like" recipe-id="${recipe.uri}">            
            <span class="fa fa-heart"></span>
            </span> 
          </button>   
        </div>          
          <p class="item-data">Calories: ${recipe.calories}</p>
          <p class="item-data">Cook Time: ${recipe.cook_time} Minutes</p>
          <p class="item-data cuisine-type">Cusine Type: ${recipe.cuisine}</p>
      </div>
      `
    );
    $recipeList.append($recipe);
  }
}

function toggleFavorite(evt) {
  console.log(evt.target);
  if (evt.target.classList.contains("favorite")) {
    //remove favorite class
    evt.target.classList.remove("favorite");
  } else {
    //add favorite class
    evt.target.classList.add("favorite");

    const recipeCard = evt.target.parentElement.parentElement;
    const likeBtn = document.querySelector(".btn-like");
    let dataID = likeBtn.getAttribute("recipe-id");

    const recipeData = {
      name: recipeCard.querySelector(".title").textContent,
      url: recipeCard.querySelector("a").getAttribute("href"),
      id: dataID,
    };
    //Add into storage
    savetoLocalStorage(recipeData);
    console.log(favoriteLocalStorage);
  }
}

$recipeList.on("click", ".fa-heart", toggleFavorite);

//add data to local storage
function savetoLocalStorage(data) {
  favoriteLocalStorage.push(data);
  localStorage.setItem("recipes", JSON.stringify(favoriteLocalStorage));
}

function displayFavorites(favorites) {
  const favoriteTable = document.querySelector(".list-favorites");
  favorites.forEach((recipe) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td>
            ${recipe.name}
          </td>
          <td>
            <a href="${recipe.url}" class="btn btn-success view-recipes">View</a>
          </td>
          <td>
            <a href="#" class="btn btn-danger delete-favorite" recipe-id="${recipe.id}">Delete</a>
          </td>
        `;
    favoriteTable.appendChild(tr);
  });
}

favoriteLink.addEventListener("click", displayFavorites(favoriteLocalStorage));

//favoriete recipes delete button
tableEl.addEventListener("click", deleteFavorite);

//delete table row function
function deleteFavorite(e) {
  if (e.target.classList.contains("delete-favorite")) {
    const deleteBtn = e.target;
    const recipeID = deleteBtn.getAttribute("recipe-id");

    deleteBtn.closest("tr").remove();
    //delete item from local storage
    favoriteLocalStorage.forEach((item, index) => {
      if (item.id == recipeID) {
        favoriteLocalStorage.splice(index, 1);
      }
    });
    console.log(favoriteLocalStorage);
  }
  localStorage.setItem("recipes", JSON.stringify(favoriteLocalStorage));
}
