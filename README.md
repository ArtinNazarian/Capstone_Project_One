# Capstone_Project_One
## Title: Recipe Box
The application is desinged to allow users to search for recipes using ingredients. The user would enter few key ingredients seprated by a comman and would hit search.
The app would then display different recipes that use the key ingredients. 

### Features
The app allows user to like/save to the favorite page. Also, a user can update their email account or user name.

### User Flow
The landing page of the app gives users the option to create an account if they are new or access their profile using the login option.
The registration page asks users for email, username and a password. Once an account is created, the user is routed to the home page.
The home page is where the user can search for recipes. For this app, I used https://api.edamam.com/api/recipes/v2 API. I chose this API because the data had the URL to the full recipe, image of the dish, and nutritional information about the recipe. When the user performs a search, the result shows the image of the dish, cook time if it is available and it also shows the total calories and cuisine type.

If the user is interested in learning more about a specific recipe, they click on View Recipe. They can also add the recipe to the Favorites page by clicking the heart icon. 

I decided to use Local Storage in order to keep track of any recipes that have been added to the favorites instead of saving each recipe into a database. 

The Favorites link in the nav bar takes the user to the Favorite page where they will see a table that holds recipes that are added to the local storage. The table shows the name of the recipe and it has a View button and a Delete button.

 ### Tech Stack
 Fron End: HTML CSS Bootstrap  Back End: Flask SQLAlchemy Python JavaScript 
