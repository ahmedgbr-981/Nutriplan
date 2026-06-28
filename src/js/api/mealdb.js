import { showDeailsSpinner, spinner } from "../ui/components.js";

const recipesCount = document.getElementById("recipes-count");
const mainContent = document.querySelectorAll("#main-content section");
const mealDetails = document.getElementById("meal-details");
export class Mealdb {
  async getByArea(area) {
    let resp = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
    }
    let data = await resp.json();
    let resapices = data.meals;
    return resapices;
  }

  async getById(id) {
    let resp = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
    }
    let data = await resp.json();
    let meal = data.meals;
    return meal;
  }

  async get25Meals() {
    let resp = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
    }
    let data = await resp.json();
    let resapices = data.meals;
    return resapices;
    console.log(resapices);
  }

  async getByCat(cat) {
    let resp = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
    }
    let data = await resp.json();
    let category = data.meals;
    return category;
  }

  async search(searchQuery) {
    try {
      const [nameRes, areaRes, ingredientRes] = await Promise.all([
        fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`,
        ),
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchQuery}`,
        ),
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchQuery}`,
        ),
      ]);

      const nameData = await nameRes.json();
      const areaData = await areaRes.json();
      const ingredientData = await ingredientRes.json();

      console.log("By name:", nameData.meals);
      console.log("By area:", areaData.meals);
      console.log("By ingredient:", ingredientData.meals);

      return {
        byName: nameData.meals,
        byArea: areaData.meals,
        byIngredient: ingredientData.meals,
      };
    } catch (err) {
      console.error(err);
    }
  }

  displayCount(arr, x) {
    const displayed = Math.min(arr.length, 20);

    recipesCount.innerHTML = x
      ? `Showing ${displayed} recipes of "${x}"`
      : `Showing ${displayed} recipes`;
  }

  displayMeals(arr, cat, ins) {
    let box = ``;
    arr.forEach((meal) => {
      box += `<div
            class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            data-meal-id="${meal.idMeal}">
            <div class="relative h-48 overflow-hidden">
              <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src="${meal.strMealThumb}" alt="${meal.strMeal}"
                loading="lazy" />
              <div class="absolute bottom-3 left-3 flex gap-2">
                <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                  ${meal.strCategory ? meal.strCategory : cat}
                </span>
                ${
                  meal.strArea
                    ? `
<span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
  ${meal.strArea}
</span>
`
                    : ""
                }
              </div>
            </div>
            <div class="p-4">
              <h3
                class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                ${meal.strMeal}
              </h3>
              <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                ${meal.strInstructions ? meal.strInstructions : ins}
              </p>
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-gray-900">
                  <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                  ${meal.strCategory ? meal.strCategory : cat}
                </span>
                <span class="font-semibold text-gray-500">
                  <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                  ${meal.strArea || "International"}
                </span>
              </div>
            </div>
          </div>`;
    });
    document.getElementById("recipes-grid").innerHTML = box;
    this.showDetailes();
  }

  hideAndshow() {
    mainContent.forEach((section) => {
      section.classList.add("hidden");
    });
    document.getElementById("detailsHeader").classList.remove("hidden");
    mealDetails.classList.remove("hidden");
    document.getElementById("header").classList.add("hidden");
    document.getElementById("scannerHeader").classList.add("hidden");
    document.getElementById("logHeader").classList.add("hidden");
  }

  showDetailes() {
    const recipeCards = document.querySelectorAll(".recipe-card");
    const ingredients = [];
    for (let i = 0; i < recipeCards.length; i++) {
      let box = ``;
      recipeCards[i].addEventListener("click", async (e) => {
        this.hideAndshow();
        const [meal] = await this.getById(e.currentTarget.dataset.mealId);
        console.log(meal);
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];

          if (ing && ing.trim()) {
            ingredients.push(`${measure} ${ing}`.trim());
          }
        }

        showDeailsSpinner();
        let NutritionFacts = await this.getNutritionFacts(
          ingredients,
          meal.strMeal,
        );
        console.log(NutritionFacts);

        // buildIngs
        let mealIngs = ``;
        for (let i = 0; i < NutritionFacts.ingredients.length; i++) {
          mealIngs += `
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                  <span class="text-gray-700">
                    <span class="font-medium text-gray-900">${NutritionFacts.ingredients[i].parsed.quantity} ${NutritionFacts.ingredients[i].parsed.unit}</span> 
                    ${NutritionFacts.ingredients[i].parsed.foodName}
                  </span>
                </div>
                `;
        }
        // build Instractions
        const steps = meal.strInstructions
          .split(/\r\n\r\n/)
          .filter((step) => step.trim())
          .map((step) => step.replace(/^\d+\r\n/, "").trim());
        let Steps = ``;
        for (let i = 0; i < steps.length; i++) {
          Steps += ` <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    ${i + 1}
                  </div>
                  <p class="text-gray-700 leading-relaxed pt-2">
                  ${steps[i]}
                  </p>
                </div>`;
        }
        const embedUrl = meal.strYoutube
          ? `https://www.youtube.com/embed/${new URL(
              meal.strYoutube,
            ).searchParams.get("v")}`
          : "";

        box += `<div class="max-w-7xl mx-auto">
        <!-- Back Button -->
        <button id="back-to-meals-btn" onclick='BackToRecipes()'
          class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Recipes</span>
        </button>

        <!-- Hero Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div class="relative h-80 md:h-96">
            <img src="${meal.strMealThumb}"
              alt="${meal.strMeal}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="flex items-center gap-3 mb-3">
                <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.strCategory}</span>
                <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.strArea}</span>
                <span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${meal.strMeal}</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                ${meal.strMeal}
              </h1>
              <div class="flex items-center gap-6 text-white/90">
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-clock"></i>
                  <span>30 min</span>
                </span>
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-utensils"></i>
                  <span id="hero-servings">4 servings</span>
                </span>
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-fire"></i>
                  <span id="hero-calories">${NutritionFacts.perServing.calories} cal/serving</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button id="log-meal-btn" onclick='logMeal(${meal.idMeal})'
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            data-meal-id="${meal.idMeal}">
            <i class="fa-solid fa-clipboard-list"></i>
            <span>Log This Meal</span>
          </button>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Ingredients & Instructions -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Ingredients -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-list-check text-emerald-600"></i>
                Ingredients
                <span class="text-sm font-normal text-gray-500 ml-auto">${NutritionFacts.ingredients.length} items</span>
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${mealIngs}
              </div>
            </div>

            <!-- Instructions -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                Instructions
              </h2>
              <div class="space-y-4">
               ${Steps}
              </div>
            </div>

            <!-- Video Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-video text-red-500"></i>
                Video Tutorial
              </h2>
              <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              ${
                embedUrl
                  ? `<iframe src="${embedUrl}"  class="absolute inset-0 w-full h-full"  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>`
                  : ""
              }
                
              </div>
            </div>
          </div>

          <!-- Right Column - Nutrition -->
          <div class="space-y-6">
            <!-- Nutrition Facts -->
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                Nutrition Facts
              </h2>
              <div id="nutrition-facts-container">
                <p class="text-sm text-gray-500 mb-4">Per serving</p>

                <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                  <p class="text-sm text-gray-600">Calories per serving</p>
                  <p class="text-4xl font-bold text-emerald-600">${Math.floor(NutritionFacts.totals.calories / 4)}</p>
                  <p class="text-xs text-gray-500 mt-1">Total: ${NutritionFacts.perServing.calories} cal</p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${NutritionFacts.perServing.protein}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width:${Math.min(NutritionFacts.perServing.protein, 95)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${NutritionFacts.perServing.carbs}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(NutritionFacts.perServing.carbs, 95)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${NutritionFacts.perServing.fat}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min(NutritionFacts.perServing.fat, 95)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${NutritionFacts.perServing.fiber}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min(NutritionFacts.perServing.fiber, 95)}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${NutritionFacts.perServing.sugar}g</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width:${Math.min(NutritionFacts.perServing.sugar, 95)}%"></div>
                  </div>
                </div>

                <div class="mt-6 pt-6 border-t border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-900 mb-3">
                    Other
                  </h3>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">cholesterol</span>
                      <span class="font-medium">${NutritionFacts.totals.cholesterol}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">sodium</span>
                      <span class="font-medium">${NutritionFacts.totals.sodium}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
        mealDetails.innerHTML = box;
      });
    }
  }

  async getNutritionFacts(ingredients, recipeName) {
    const resp = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "TcBSDyGFP3imn8lDEt5G0z4d0JPu4s0SImB4NEFJ",
        },
        body: JSON.stringify({
          recipeName,
          ingredients,
        }),
      },
    );

    const data = await resp.json();
    return data.data;
  }

  async getProductsByCats() {
    let resp = await fetch(
      `https://nutriplan-api.vercel.app/api/products/categories`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
    }
    let data = await resp.json();
    console.log("products cats :");

    console.log(data.results);
  }

  async getProductsByName(name) {
    spinner("products-grid");
    let resp = await fetch(
      `https://nutriplan-api.vercel.app/api/products/search?q=${name}`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
      document.getElementById("products-grid").innerHTML =
        `<div class="text-center">
                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="text-3xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path></svg></i>
                        </div>
                        <p class="text-gray-500 text-lg mb-2">No products to display</p>
                        <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                    </div>`;
      document.getElementById("products-count").innerHTML = `No Products Found`;
    }
    let data = await resp.json();
    console.log("products by name :");

    console.log(data.results);
    let results = data.results;
    let box = ``;
    for (let i = 0; i < results.length; i++) {
      box += `<div
              class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-barcode="${results[i].barcode}">
              <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  src="${results[i].image}"
                  alt="${results[i].name}" loading="lazy" />

                <!-- Nutri-Score Badge -->
                <div
                  class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                  Nutri-Score ${results[i].nutritionGrade}
                </div>

                <!-- NOVA Badge -->
                <div
                  class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                  title="NOVA 2">
                  ${results[i].novaGroup || "N/A"}
                </div>
              </div>

              <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                  ${results[i].brand}
                </p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  ${results[i].name}
                </h3>

                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <!--  <span><i class="fa-solid fa-weight-scale mr-1"></i>250g</span> -->
                  <span><i class="fa-solid fa-fire mr-1"></i>${Math.floor(results[i].nutrients.calories)} kcal/100g</span>
                </div>

                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                  <div class="bg-emerald-50 rounded p-1.5">
                    <p class="text-xs font-bold text-emerald-700">${Math.floor(results[i].nutrients.protein)}g</p>
                    <p class="text-[10px] text-gray-500">Protein</p>
                  </div>
                  <div class="bg-blue-50 rounded p-1.5">
                    <p class="text-xs font-bold text-blue-700">${Math.floor(results[i].nutrients.carbs)}g</p>
                    <p class="text-[10px] text-gray-500">Carbs</p>
                  </div>
                  <div class="bg-purple-50 rounded p-1.5">
                    <p class="text-xs font-bold text-purple-700">${Math.floor(results[i].nutrients.fat)}g</p>
                    <p class="text-[10px] text-gray-500">Fat</p>
                  </div>
                  <div class="bg-orange-50 rounded p-1.5">
                    <p class="text-xs font-bold text-orange-700">${Math.floor(results[i].nutrients.sugar)}g</p>
                    <p class="text-[10px] text-gray-500">Sugar</p>
                  </div>
                </div>
              </div>
            </div>`;
    }
    document.getElementById("products-grid").innerHTML = box;
    document.getElementById("products-count").innerHTML =
      `Found ${results.length} product of ${name}`;
    return results;
     
  }
  async getProductsByNutriScore(score, name) {
    spinner("products-grid");
    let resp = await fetch(
      `https://nutriplan-api.vercel.app/api/products/search?q=${name}`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
      document.getElementById("products-grid").innerHTML =
        `<div class="text-center">
                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="text-3xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path></svg></i>
                        </div>
                        <p class="text-gray-500 text-lg mb-2">No products to display</p>
                        <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                    </div>`;
      document.getElementById("products-count").innerHTML = `No Products Found`;
    }
    let data = await resp.json();
    console.log("products by score :");

    console.log(data.results);
    let results = data.results;

    let box = ``;
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].nutritionGrade === score);

      if (results[i].nutritionGrade === score) {
        box += ` <div
              class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-barcode="${results[i].barcode}">
              <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  src="${results[i].image}"
                  alt="${results[i].name}" loading="lazy" />

                <!-- Nutri-Score Badge -->
                <div
                  class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                  Nutri-Score ${results[i].nutritionGrade}
                </div>

                <!-- NOVA Badge -->
                <div
                  class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                  title="NOVA 2">
                  ${results[i].novaGroup || "N/A"}
                </div>
              </div>

              <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                  ${results[i].brand}
                </p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  ${results[i].name}
                </h3>

                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <!--  <span><i class="fa-solid fa-weight-scale mr-1"></i>250g</span> -->
                  <span><i class="fa-solid fa-fire mr-1"></i>${Math.floor(results[i].nutrients.calories)} kcal/100g</span>
                </div>

                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                  <div class="bg-emerald-50 rounded p-1.5">
                    <p class="text-xs font-bold text-emerald-700">${Math.floor(results[i].nutrients.protein)}g</p>
                    <p class="text-[10px] text-gray-500">Protein</p>
                  </div>
                  <div class="bg-blue-50 rounded p-1.5">
                    <p class="text-xs font-bold text-blue-700">${Math.floor(results[i].nutrients.carbs)}g</p>
                    <p class="text-[10px] text-gray-500">Carbs</p>
                  </div>
                  <div class="bg-purple-50 rounded p-1.5">
                    <p class="text-xs font-bold text-purple-700">${Math.floor(results[i].nutrients.fat)}g</p>
                    <p class="text-[10px] text-gray-500">Fat</p>
                  </div>
                  <div class="bg-orange-50 rounded p-1.5">
                    <p class="text-xs font-bold text-orange-700">${Math.floor(results[i].nutrients.sugar)}g</p>
                    <p class="text-[10px] text-gray-500">Sugar</p>
                  </div>
                </div>
              </div>
            </div>`;
      }
    }
    document.getElementById("products-grid").innerHTML = box;
    document.getElementById("products-count").innerHTML =
      `Found ${results.length} product of ${name}`;
  }

  async getProductsByBarcode(code) {
    spinner("products-grid");
    let resp = await fetch(
      `https://nutriplan-api.vercel.app/api/products/barcode/${code}`,
    );
    if (!resp.ok) {
      let error = new Error("try again");
      console.log(error);
      document.getElementById("products-grid").innerHTML =
        `<div id="products-empty" class="py-12">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="text-3xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path></svg></i>
                        </div>
                        <p class="text-gray-500 text-lg mb-2">No products to display</p>
                        <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                    </div>
                </div>`;
    }
    let data = await resp.json();
    console.log("products by barcode :");
    console.log(data.result);
    let result = data.result;
    let box = ``;
    box += ` <div onclick='openbarcodeModal()'
              class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-barcode="${code}">
              <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  src="${result.image}"
                  alt="Product Name" loading="lazy" />

                <!-- Nutri-Score Badge -->
                <div
                  class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                  Nutri-Score ${result.nutritionGrade}
                </div>

                <!-- NOVA Badge -->
                <div
                  class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                  title="NOVA 2">
                  ${result.novaGroup || "unKonwn"}
                </div>
              </div>

              <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                  ${result.brand}
                </p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  ${result.name}
                </h3>

                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <!--  <span><i class="fa-solid fa-weight-scale mr-1"></i>250g</span> -->
                  <span><i class="fa-solid fa-fire mr-1"></i>${Math.floor(result.nutrients.calories)} kcal/100g</span>
                </div>

                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                  <div class="bg-emerald-50 rounded p-1.5">
                    <p class="text-xs font-bold text-emerald-700">${Math.floor(result.nutrients.protein)}g</p>
                    <p class="text-[10px] text-gray-500">Protein</p>
                  </div>
                  <div class="bg-blue-50 rounded p-1.5">
                    <p class="text-xs font-bold text-blue-700">${Math.floor(result.nutrients.carbs)}g</p>
                    <p class="text-[10px] text-gray-500">Carbs</p>
                  </div>
                  <div class="bg-purple-50 rounded p-1.5">
                    <p class="text-xs font-bold text-purple-700">${Math.floor(result.nutrients.fat)}g</p>
                    <p class="text-[10px] text-gray-500">Fat</p>
                  </div>
                  <div class="bg-orange-50 rounded p-1.5">
                    <p class="text-xs font-bold text-orange-700">${Math.floor(result.nutrients.sugar)}g</p>
                    <p class="text-[10px] text-gray-500">Sugar</p>
                  </div>
                </div>
              </div>
            </div>`;
    document.getElementById("products-grid").innerHTML = box;
    document.getElementById("products-count").innerHTML =
      `Found product ${result.length}: ${result.name}`;
    return data.result;
  }
}
