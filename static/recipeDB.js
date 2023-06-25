class RecipeDB {
  saveIntoDB(recipe) {
    const recipes = this.getFromDB();
    recipes.push(recipe);

    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  getFromDB() {
    let recipes;

    if (localStorage.getItem("recipe") === null) {
      recipes = [];
    } else {
      recipes = JSON.parse(localStorage.get("recipe"));
    }

    return recipes;
  }
}
