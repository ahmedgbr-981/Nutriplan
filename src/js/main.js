/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

const searchInput = document.getElementById("search-input");
const areaBtns = document.querySelectorAll("#search-filters-section button");
const recipesCount = document.getElementById("recipes-count");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebar-overlay");
const burgerBtn = document.querySelectorAll(".header-menu-btn");
const closeBtn = document.getElementById("sidebar-close-btn");
const sideBtns = document.querySelectorAll(".nav-link");
const mainContent = document.querySelectorAll("#main-content section");
const barcodeInput = document.getElementById("barcode-input");
const lookupBtn = document.getElementById("lookup-barcode-btn");
const productSearchInput = document.getElementById("product-search-input");
let mealType;

const mealCat = document.querySelectorAll(".category-card");

import { Mealdb } from "./api/mealdb.js";
import { emtyState, spinner } from "./ui/components.js";

const meals = new Mealdb();

// onload fun
async function onload() {
  spinner("recipes-grid");
  let resapices = await meals.get25Meals();
  meals.displayCount(resapices, "All Resapices");
  meals.displayMeals(resapices);
  console.log(resapices);
}

onload();
// Search meals
searchInput.addEventListener("input", async () => {
  const searchedMeals = await meals.search(searchInput.value);

  if (searchInput.value) {
    const byName = searchedMeals.byName || [];
    const byArea = searchedMeals.byArea || [];
    const byIngredient = searchedMeals.byIngredient || [];

    if (![byName, byArea, byIngredient].some((arr) => arr.length)) {
      emtyState();
      meals.displayCount([], searchInput.value);
    } else if (
      byName.length >= byArea.length &&
      byName.length >= byIngredient.length
    ) {
      meals.displayCount(byName, searchInput.value);
      meals.displayMeals(byName.slice(0, 20), searchInput.value);
    } else if (
      byArea.length >= byName.length &&
      byArea.length >= byIngredient.length
    ) {
      meals.displayCount(byArea, searchInput.value);
      meals.displayMeals(byArea.slice(0, 20), searchInput.value);
    } else {
      meals.displayCount(byIngredient, searchInput.value);
      meals.displayMeals(byIngredient.slice(0, 20), searchInput.value);
    }
  } else {
    let resapices = await meals.get25Meals();
    meals.displayCount(resapices, "All Resapices");
    meals.displayMeals(resapices);
    console.log(resapices);
  }
});
// get by Area
for (let i = 0; i < areaBtns.length; i++) {
  areaBtns[i].addEventListener("click", async (e) => {
    areaBtns.forEach((btn) => {
      btn.classList.remove("bg-emerald-600", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-700");
    });
    e.currentTarget.classList.remove("bg-gray-100", "text-gray-700");
    e.currentTarget.classList.add("bg-emerald-600", "text-white");

    let area = e.currentTarget.dataset.area;
    if (area === "AllRecipes") {
      meals.displayCount(resapices, "All Resapices");
      meals.displayMeals(resapices);
    } else {
      let mealByArea = (await meals.getByArea(area)) || [];
      if (mealByArea) {
        spinner("recipes-grid");
        getmealByid(mealByArea);
      }
      meals.displayCount(mealByArea, area);
    }
  });
}

// Get meal byId
async function getmealByid(x) {
  let mealByIdArr = [];
  for (let i = 0; i < x.slice(0, 20).length; i++) {
    let mealById = await meals.getById(x[i].idMeal);
    mealByIdArr.push(mealById[0]);
  }
  console.log(mealByIdArr);
  meals.displayMeals(mealByIdArr);
  // x.slice(0, 20).forEach(async (meal) => {
  //   let mealById = await meals.getById(meal.idMeal);
  //   console.log(mealById);
  //   meals.displayMeals(
  //     x.slice(0, 20),
  //     mealById[0].strCategory,
  //     mealById[0].strInstructions,
  //   );
  // });
  console.log(x);
}

// get by Cat
for (let i = 0; i < mealCat.length; i++) {
  mealCat[i].addEventListener("click", async (e) => {
    let userChoise = e.currentTarget.dataset.category;
    mealType = await meals.getByCat(userChoise);
    meals.displayCount(mealType, userChoise);
    meals.displayMeals(mealType.slice(0, 20), userChoise);
    spinner("recipes-grid");
    getmealByid(mealType);
  });
}

// navBar functionalty

sideBtns[0].addEventListener("click", () => {
  mainContent.forEach((section) => {
    section.classList.add("hidden");
  });
  sideBtns.forEach((btn) => {
    btn.classList.remove("text-emerald-700", "bg-emerald-50");
    btn.classList.add("text-gray-600");
  });
  sideBtns[0].classList.add("text-emerald-700", "bg-emerald-50");
  sideBtns[0].classList.remove("text-gray-600");

  document.getElementById("header").classList.remove("hidden");
  document.getElementById("scannerHeader").classList.add("hidden");
  document.getElementById("detailsHeader").classList.add("hidden");
  document.getElementById("logHeader").classList.add("hidden");
  document.getElementById("search-filters-section").classList.remove("hidden");
  document.getElementById("meal-categories-section").classList.remove("hidden");
  document.getElementById("all-recipes-section").classList.remove("hidden");
});

sideBtns[1].addEventListener("click", () => {
  mainContent.forEach((section) => {
    section.classList.add("hidden");
  });

  sideBtns.forEach((btn) => {
    btn.classList.remove("text-emerald-700", "bg-emerald-50");
    btn.classList.add("text-gray-600");
  });
  sideBtns[1].classList.add("text-emerald-700", "bg-emerald-50");
  sideBtns[1].classList.remove("text-gray-600");
  document.getElementById("header").classList.add("hidden");
  document.getElementById("scannerHeader").classList.remove("hidden");
  document.getElementById("detailsHeader").classList.add("hidden");
  document.getElementById("logHeader").classList.add("hidden");
  document.getElementById("products-section").classList.remove("hidden");
});

sideBtns[2].addEventListener("click", () => {
  mainContent.forEach((section) => {
    section.classList.add("hidden");
  });
  sideBtns.forEach((btn) => {
    btn.classList.remove("text-emerald-700", "bg-emerald-50");
    btn.classList.add("text-gray-600");
  });
  sideBtns[2].classList.add("text-emerald-700", "bg-emerald-50");
  sideBtns[2].classList.remove("text-gray-600");
  document.getElementById("header").classList.add("hidden");
  document.getElementById("detailsHeader").classList.add("hidden");
  document.getElementById("scannerHeader").classList.add("hidden");
  document.getElementById("logHeader").classList.remove("hidden");
  document.getElementById("foodlog-section").classList.remove("hidden");
});

sideBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeSidebar();
  });
});

function openSidebar() {
  sidebar.classList.add("sidebar-open");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  sidebar.classList.remove("sidebar-open");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

burgerBtn.forEach((btn) => {
  btn.addEventListener("click", openSidebar);
});

closeBtn.addEventListener("click", closeSidebar);

overlay.addEventListener("click", closeSidebar);

window.BackToRecipes = function () {
  document.getElementById("meal-details").classList.add("hidden");
  document.getElementById("detailsHeader").classList.add("hidden");
  document.getElementById("header").classList.remove("hidden");
  document.getElementById("search-filters-section").classList.remove("hidden");
  document.getElementById("all-recipes-section").classList.remove("hidden");
  document.getElementById("meal-categories-section").classList.remove("hidden");
};

// barcode btn
lookupBtn.addEventListener("click", async () => {
  let mealByBarcode = await meals.getProductsByBarcode(barcodeInput.value);
  console.log(mealByBarcode);
  openBarCodeModal(mealByBarcode);
  // foodLog();
});

// barcode modal
document
  .getElementById("productByBarcode-modal")
  .addEventListener("click", (e) => {
    if (e.target.id === "productByBarcode-modal") {
      closeBarCodeModal();
    }
  });

window.openbarcodeModal = function () {
  console.log("ok");
  const overlay = document.getElementById("barcode-overlay");
  overlay.classList.add("active", "barcode-overlay");
  const modal = document.getElementById("productByBarcode-modal");
  const content = document.getElementById("product-modal-content");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

function openBarCodeModal(product) {
  const overlay = document.getElementById("barcode-overlay");
  overlay.classList.add("active", "barcode-overlay");
  const modal = document.getElementById("productByBarcode-modal");
  const content = document.getElementById("product-modal-content");

  content.innerHTML = createProductModal(product);
  document
    .getElementById("add-product-to-log")
    .addEventListener("click", () => {
      console.log("a7a ba5a");
      loggedMeals.push(barCodeProduct);
      localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));
      foodLog();
      overlay.classList.remove("active", "barcode-overlay");
      modal.classList.add("hidden");
      Swal.fire({
        icon: "success",
        title: "Meal Logged!",
        html: `<span style="font-size:1.6rem">${barCodeProduct.name}</span> <br> <b style='color:green ;font-size:1.5rem'>+${Math.round(barCodeProduct.calories)} calories</b> `,
        width: "620px",
        backdrop: false,
        showConfirmButton: false,
        timer: 3000,
      });
    });

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}
let barCodeProduct;
// display barcode product
function createProductModal(product) {
  console.log("proHere", product);
  barCodeProduct = {
    id: product.barcode,
    name: product.name,
    image: product.image,

    date: new Date().toLocaleString(),
    calories: Math.round(product.nutrients.calories),
    protein: Math.floor(product.nutrients.protein),
    carbs: Math.floor(product.nutrients.carbs),
    fat: Math.floor(product.nutrients.fat),
  };

  return `
        <div  class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">   
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    
                        <img src="${product.image}" alt="Céréales Chocapic" class="w-full h-full object-contain">
                    
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${product.brand}</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
                    
                    <div class="flex items-center gap-3">
                        
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #fecb0220">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: #fecb02">
                                    ${product.nutritionGrade}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: #fecb02">Nutri-Score</p>
                                </div>
                            </div>
                        
                        
                        
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #e63e1120">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #e63e11">
                                    ${product.novaGroup || "N/A"}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: #e63e11">NOVA</p>
                                </div>
                            </div>
                        
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="text-2xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg></i>
                </button>
            </div>
            
            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-chart-pie" data-prefix="fas" data-icon="chart-pie" role="img" viewBox="0 0 576 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M512.4 240l-176 0c-17.7 0-32-14.3-32-32l0-176c0-17.7 14.4-32.2 31.9-29.9 107 14.2 191.8 99 206 206 2.3 17.5-12.2 31.9-29.9 31.9zM222.6 37.2c18.1-3.8 33.8 11 33.8 29.5l0 197.3c0 5.6 2 11 5.5 15.3L394 438.7c11.7 14.1 9.2 35.4-6.9 44.1-34.1 18.6-73.2 29.2-114.7 29.2-132.5 0-240-107.5-240-240 0-115.5 81.5-211.9 190.2-234.8zM477.8 288l64 0c18.5 0 33.3 15.7 29.5 33.8-10.2 48.4-35 91.4-69.6 124.2-12.3 11.7-31.6 9.2-42.4-3.9L374.9 340.4c-17.3-20.9-2.4-52.4 24.6-52.4l78.2 0z"></path></svg></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                
                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${Math.floor(product.nutrients.calories)}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: 17.6%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${Math.floor(product.nutrients.protein)}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: 73.6%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${Math.floor(product.nutrients.carbs)}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: 7.384615384615384%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${Math.floor(product.nutrients.fat)}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: 44.8%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${Math.floor(product.nutrients.sugar)}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${Math.floor(product.nutrients.fiber)}g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${Math.floor(product.nutrients.sodium)}g</p>
                        <p class="text-xs text-gray-500">Salt</p>
                    </div>
                </div>
            </div>
            
            <!-- Additional Info 
            
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-list" data-prefix="fas" data-icon="list" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"></path></svg></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">Blé complet 35,0%, chocolat en poudre 22,5% (sucre, cacao en poudre), farine de blé 17,0%, semoule de maïs, sirop de glucose, sucre, extrait de malt d'orge (orge, orge malté), contient de l'huile de tournesol et/ou de palme, carbonate de calcium, émulsifiant : lécithines; sel, arômes naturels, fer, vitamines B3, B5, D, B6, B1, B2 et B9.</p>
                </div>
            
            
            
                <div class="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">
                    <h3 class="font-bold text-red-700 mb-2 flex items-center gap-2">
                        <i data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" data-prefix="fas" data-icon="triangle-exclamation" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"></path></svg></i>
                        Allergens
                    </h3>
                    <p class="text-sm text-red-600">gluten</p>
                </div> -->
            
            
            <!-- Actions -->
            <div class="flex gap-3">
                <button id="add-product-to-log" class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="7613034626844">
                    <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>
    
            </div>
    `;
}

function closeBarCodeModal() {
  const overlay = document.getElementById("barcode-overlay");
  overlay.classList.remove("active", "barcode-overlay");
  const modal = document.getElementById("productByBarcode-modal");

  modal.classList.remove("flex");
  modal.classList.add("hidden");
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".close-product-modal")) {
    closeBarCodeModal();
  }
});

// display modal of product searched by name
document
  .getElementById("search-product-btn")
  .addEventListener("click", async () => {
    let res = await meals.getProductsByName(
      productSearchInput.value.toLowerCase(),
    );
    console.log("res", res);

    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        for (let i = 0; i < res.length; i++) {
          if (e.currentTarget.dataset.barcode === res[i].barcode)
            openBarCodeModal(res[i]);
        }
      });
    });
  });

// search product by name btn
document
  .getElementById("product-search-input")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("search-product-btn").click();
    }
  });

// display products by NutriScore A B C E D
document.querySelectorAll("#NutriScore button").forEach((score) => {
  score.addEventListener("click", (e) => {
    console.log(e.currentTarget.dataset.grade);

    meals.getProductsByNutriScore(
      e.currentTarget.dataset.grade.toLowerCase(),
      productSearchInput.value,
    );
  });
});

// display products by cat
document.querySelectorAll("#productCategory button").forEach((btn) => {
  btn.addEventListener("click", () => {
    spinner("products-grid");
  });
});

let loggedMeals = [];
if (localStorage.getItem("loggedMeals")) {
  loggedMeals = JSON.parse(localStorage.getItem("loggedMeals"));
  foodLog();
}
console.log(loggedMeals);

window.logMeal = async function (id) {
  document.getElementById("log-meal-modal").classList.remove("hidden");
  spinner("log-meal-modal");
  const ingredients = [];
  let [meal] = await meals.getById(id);
  console.log(meal);

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ing && ing.trim()) {
      ingredients.push(`${measure} ${ing}`.trim());
    }
  }
  let NutritionFacts = await meals.getNutritionFacts(ingredients, meal.strMeal);

  document.getElementById("log-meal-modal").innerHTML = `
  <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center gap-4 mb-6">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                        <p class="text-gray-500 text-sm">${meal.strMeal}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-minus" data-prefix="fas" data-icon="minus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"></path></svg></i>
                        </button>
                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2">
                        <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>
                        </button>
                    </div>
                </div>
                
                
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${NutritionFacts.perServing.calories}</p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">${NutritionFacts.perServing.protein}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${NutritionFacts.perServing.carbs}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">${NutritionFacts.perServing.fat}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>
                    </div>
                </div>
                
                
                <div class="flex gap-3">
                    <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Cancel
                    </button>
                    <button onclick='LogMeal(${meal.idMeal})' id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                        <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-clipboard-list" data-prefix="fas" data-icon="clipboard-list" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i>
                        Log Meal
                    </button>
                </div>
            </div>`;

  const servingsInput = document.getElementById("meal-servings");
  const decreaseBtn = document.getElementById("decrease-servings");
  const increaseBtn = document.getElementById("increase-servings");
  const cancelBtn = document.getElementById("cancel-log-meal");

  // Increase servings
  increaseBtn.addEventListener("click", () => {
    let value = parseFloat(servingsInput.value);

    if (value < 10) {
      servingsInput.value = value + 0.5;
    }
  });

  // Decrease servings
  decreaseBtn.addEventListener("click", () => {
    let value = parseFloat(servingsInput.value);

    if (value > 0.5) {
      servingsInput.value = value - 0.5;
    }
  });

  // Cancel
  cancelBtn.addEventListener("click", () => {
    const modal = document.getElementById("log-meal-modal");

    modal.classList.add("hidden");
    modal.innerHTML = "";
  });

  const logBtn = document.getElementById("confirm-log-meal");
  logBtn.addEventListener("click", () => {
    const servings = parseFloat(document.getElementById("meal-servings").value);

    let loggedMeal = {
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      servings,
      date: new Date().toLocaleString(),
      calories: Math.round(NutritionFacts.perServing.calories * servings),
      protein: +(NutritionFacts.perServing.protein * servings),
      carbs: +(NutritionFacts.perServing.carbs * servings),
      fat: +(NutritionFacts.perServing.fat * servings),
    };

    loggedMeals.push(loggedMeal);
    localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));
    console.log(loggedMeal);

    // Hide modal
    document.getElementById("log-meal-modal").classList.add("hidden");
    document.getElementById("log-meal-modal").innerHTML = "";

    Swal.fire({
      icon: "success",
      title: "Meal Logged!",
      html: `<span style="font-size:1.6rem">${meal.strMeal}</span> <br> <b style='color:green ;font-size:1.5rem'>+${Math.round(loggedMeal.calories)} calories</b> `,
      width: "620px",
      backdrop: false,
      showConfirmButton: false,
      timer: 3000,
    });
  });
};

// calc total nutritions
function total() {
  // const today = new Date().toDateString();
  // const lastDay = localStorage.getItem("lastDay");

  // if (lastDay !== today) {
  //   // New day: reset logged meals
  //   loggedMeals = [];
  //   localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));
  //   localStorage.setItem("lastDay", today);
  // } else {
  //   loggedMeals = JSON.parse(localStorage.getItem("loggedMeals")) || [];
  // }

  loggedMeals = JSON.parse(localStorage.getItem("loggedMeals")) || [];

  console.log("total", loggedMeals);

  let total = {
    protein: 0,
    fat: 0,
    carb: 0,
    calories: 0,
  };

  const today = new Date().toDateString();

  for (const meal of loggedMeals) {
    if (new Date(meal.date).toDateString() === today) {
      total.protein += meal.protein;
      total.fat += meal.fat;
      total.carb += meal.carbs;
      total.calories += meal.calories;
    }
  }

  return total;
}

// log meals and products in food log section
function foodLog() {
  let Total = total();
  document.getElementById("logCalories").innerHTML =
    `${Total.calories}/ 2000 kcal`;
  document.getElementById("logProtein").innerHTML = `${Total.protein}/ 50 g`;
  document.getElementById("logCarbs").innerHTML = `${Total.carb}/ 250 g g`;
  document.getElementById("logFat").innerHTML = `${Total.fat}/ 65 g`;
  document.getElementById("calW").style.width =
    `${Math.min((Total.calories / 2000) * 100, 100)}%`;
  document.getElementById("proW").style.width =
    `${Math.min((Total.protein / 50) * 100, 100)}%`;
  document.getElementById("carbW").style.width =
    `${Math.min((Total.carb / 250) * 100, 100)}%`;
  document.getElementById("fatW").style.width =
    `${Math.min((Total.fat / 65) * 100, 100)}%`;
  let bars = [
    { total: Total.calories, max: 2000, id: "calW" },
    { total: Total.protein, max: 50, id: "proW" },
    { total: Total.fat, max: 65, id: "fatW" },
    { total: Total.carb, max: 250, id: "carbW" },
  ];

  console.log(Total);
  bars.forEach(({ total, max, id }) => {
    document.getElementById(id).classList.toggle("bg-red-500", total >= max);
  });
  let box = ``;
  for (let i = 0; i < loggedMeals.length; i++) {
    document.getElementById("loggedCount").innerHTML =
      `Logged Items (${loggedMeals.length})`;
    box += `<div class="border-t border-gray-200 pt-4">
                       
            <div class="space-y-3 max-h-96 overflow-y-auto">
                
                    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            <img src="${loggedMeals[i].image}" alt="Chicken Mandi" class="w-14 h-14 rounded-xl object-cover">
                            <div>
                                <p class="font-semibold text-gray-900">${loggedMeals[i].name}</p>
                                <p class="text-sm text-gray-500">
                                    ${loggedMeals[i].servings} serving
                                    <span class="mx-1">•</span>
                                    <span class="text-emerald-600">Recipe</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${loggedMeals[i].date}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${loggedMeals[i].calories}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${loggedMeals[i].protein}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${loggedMeals[i].carbs}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${loggedMeals[i].fat}g F</span>
                            </div>
                            <button onclick="deleteMeal(${i})" class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="0">
                              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"></path></svg></i>
                            </button>
                        </div>
                    </div>
                
            </div>
        
                    </div>`;
  }
  document.getElementById("logged-items-list").innerHTML = box;
  weekOverview();
}

// display weekly overveiw in food log section
function weekOverview() {
  const weekContainer = document.getElementById("weekOverview");
  let Total = total();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calories = [0, 0, 0, 0, 0, 0, 0];

  const today = new Date();
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay());
  firstDay.setHours(0, 0, 0, 0);

  for (const meal of loggedMeals) {
    const mealDate = new Date(meal.date);
    mealDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((mealDate - firstDay) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
      calories[diffDays] += meal.calories;
    }
  }

  weekContainer.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);

    weekContainer.innerHTML += `
        <div class="text-center eachDay">
            <p class="text-xs text-black mb-1">${dayNames[date.getDay()]}</p>
            <p class="text-sm font-medium text-black dayDate">${date.getDate()}</p>
            <div class="mt-2 ">
                <p class="text-green-500 font-bold text-xl">${calories[i]}</p>
                <p class="text-xs text-black">kcal</p>
            </div>
        </div>
    `;
  }
}
weekOverview();

const week = document.querySelectorAll(".eachDay");
const day = document.querySelectorAll(".dayDate");

const today = new Date().getDate().toString();

// mark today's day of the week
for (let i = 0; i < day.length; i++) {
  console.log(day[i].textContent.trim());
  console.log(today);
  if (day[i].textContent.trim() === today) {
    week[i].classList.add("today-bg");
    break;
  }
}

document.getElementById("clear-foodlog").addEventListener("click", clearAll);

// clear loggedMeals
async function clearAll() {
  const result = await Swal.fire({
    title: "Clear all meals?",
    text: "This will remove all logged meals. This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, clear all",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("loggedMeals");
    loggedMeals = [];

    document.getElementById("loggedCount").innerHTML = "Logged Items (0)";
    foodLog();

    Swal.fire({
      icon: "success",
      title: "Cleared!",
      text: "All logged meals have been removed.",
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

// delete one meal
window.deleteMeal = function (id) {
  let logs = JSON.parse(localStorage.getItem("loggedMeals")) || [];

  logs.splice(id, 1);

  localStorage.setItem("loggedMeals", JSON.stringify(logs));

  loggedMeals = logs;

  foodLog();
};

// log meal in meal detalies
window.LogMeal = async function (id) {
  let [meal] = await meals.getById(id);

  foodLog();
};

document.querySelector(".quick-log-btn").addEventListener("click", () => {
  goToRec();
});
document.getElementById("logScanBtn").addEventListener("click", () => {
  goToScan();
});

function goToScan() {
  mainContent.forEach((section) => {
    section.classList.add("hidden");
  });

  sideBtns.forEach((btn) => {
    btn.classList.remove("text-emerald-700", "bg-emerald-50");
    btn.classList.add("text-gray-600");
  });
  sideBtns[1].classList.add("text-emerald-700", "bg-emerald-50");
  sideBtns[1].classList.remove("text-gray-600");
  document.getElementById("header").classList.add("hidden");
  document.getElementById("scannerHeader").classList.remove("hidden");
  document.getElementById("detailsHeader").classList.add("hidden");
  document.getElementById("logHeader").classList.add("hidden");
  document.getElementById("products-section").classList.remove("hidden");
}
function goToRec() {
  mainContent.forEach((section) => {
    section.classList.add("hidden");
  });
  sideBtns.forEach((btn) => {
    btn.classList.remove("text-emerald-700", "bg-emerald-50");
    btn.classList.add("text-gray-600");
  });
  sideBtns[0].classList.add("text-emerald-700", "bg-emerald-50");
  sideBtns[0].classList.remove("text-gray-600");
  document.getElementById("header").classList.remove("hidden");
  document.getElementById("scannerHeader").classList.add("hidden");
  document.getElementById("detailsHeader").classList.add("hidden");
  document.getElementById("logHeader").classList.add("hidden");
  document.getElementById("search-filters-section").classList.remove("hidden");
  document.getElementById("meal-categories-section").classList.remove("hidden");
  document.getElementById("all-recipes-section").classList.remove("hidden");
}
// grid view and column view
const recipesGrid = document.getElementById("recipes-grid");
const gridBtn = document.getElementById("grid-view-btn");
const listBtn = document.getElementById("list-view-btn");

gridBtn.addEventListener("click", () => {
  // Grid view (3 columns on large screens)
  recipesGrid.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";

  gridBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
  listBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
});

listBtn.addEventListener("click", () => {
  // List view (2 columns)
  recipesGrid.className = "grid grid-cols-2 gap-4";

  listBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
  gridBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
});

document.querySelectorAll("#NutriScore button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll("#NutriScore button").forEach((btn) => {
      btn.classList.remove("bg-red-500");
    });
    e.currentTarget.classList.add("bg-red-500");
  });
});

// meals.getProductsByCats()
