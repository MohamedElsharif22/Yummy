let searchInputLtr = document.getElementById("ByLtr");
let searchInputName = document.getElementById("ByName");
let submitBtn = document.getElementById("submitBtn");
let defaultMeals;
// document ready
$(function () {
  $(".sk-cube-grid").fadeOut(500, function () {
    $(".loading").fadeOut(500, function () {
      $(".loading").remove();
    });
  });
});

// handle nav
let navWidth = $(".side-nav-menu").outerWidth();
let navHeadWidth = $(".nav-header").outerWidth();
let sideNav = document.getElementById("sideNave");

$(".side-nav-menu").animate({ left: `-${navWidth - navHeadWidth}` }, 500);
document.addEventListener("click", (e) => {
  if (e.target !== sideNav.children) {
    console.log(e.target);
  }
});
$(".toggleNav").click(function () {
  let navWidth = $(".side-nav-menu").outerWidth();
  let navHeadWidth = $(".nav-header").outerWidth();
  if ($(".side-nav-menu").css("left") == "0px") {
    $(".side-nav-menu").animate({ left: `-${navWidth - navHeadWidth}` }, 1000);
    $(".navbtn").removeClass("fa-x");
    $(".navbtn").addClass("fa-list");
    $(".links-list").hide(1000);
  } else {
    $(".side-nav-menu").animate({ left: `0px` }, 500);
    $(".navbtn").removeClass("fa-list");
    $(".navbtn").addClass("fa-x");
    $(".links-list").show(1000);
  }
});

$(".closeNav").click(function () {
  let navWidth = $(".side-nav-menu").outerWidth();
  let navHeadWidth = $(".nav-header").outerWidth();
  if ($(".side-nav-menu").css("left") == "0px") {
    $(".side-nav-menu").animate({ left: `-${navWidth - navHeadWidth}` }, 1000);
    $(".navbtn").removeClass("fa-x");
    $(".navbtn").addClass("fa-list");
    $(".links-list").hide(1000);
  }
});

// get Api
getApi();
async function getApi(s) {
  let http;
  if (!s) {
    http = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
  } else if (s.length === 1) {
    http = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${s}`);
  } else {
    http = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${s}`);
  }
  if (http.status === 200 && http.ok) {
    let meal = await http.json();
    let meals = meal.meals;
    defaultMeals = meals;
    // console.log(meals);
    displayMeals(defaultMeals);
  }
}

// display Meals
function displayMeals(arr) {
  // console.log(arr);
  let cards = ``;
  for (let i = 0, n = arr.length; i < n; i++) {
    cards += `
    <div class="col-md my-3">
      <div class="card position-relative overflow-hidden">
        <div class="card-img"">
          <img class="w-100" src="${arr[i].strMealThumb}" alt="..">
        </div>
        <div onclick="displayMealInfo(${arr[i].idMeal})" class="card-info d-flex align-items-center">
          ${arr[i].strMeal}
        </div>
      </div>
    </div>
    `;
  }

  $("#meals").html(`<div class="container">
  <div id="#mealsRow" class="row row-cols-lg-4 row-cols-md-3">
    ${cards}
  </div>
</div>`);
}

// search validation
$("#searchbtn").click(function () {
  $("#search").fadeIn(100);
  // $('#meals').hide(500);
});

$(".logo").click(() => displayMeals(defaultMeals));

$("#ByLtr").keydown(function () {
  $("#ByLtr").attr("maxlength", "1");
  let regex = /[A-z]/g;
  x = regex.test(searchInputLtr.value);
  if (x) {
    getApi(searchInputLtr.value);
    // $('#meals').show(500);
  }
});

$("#ByName").keydown(function () {
  getApi(searchInputName.value);
});

// display Meal info
async function displayMealInfo(id) {
  let http = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  let response = await http.json();
  let meal = response.meals[0];
  // console.log(meal);

  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (!meal[`strIngredient${i}`]) break;
    ingredients += `
    <li class="bg-info-subtle text-dark fs-4 px-2 py-1 rounded my-2 mx-1">${meal[`strMeasure${i}`]} ${
      meal[`strIngredient${i}`]
    }</li>
    `;
  }

  let sh = `
  <div class="container py-4">
        <div class="row g-4">
          <div class="col-md-3">
            <img class="w-100" src="${meal.strMealThumb}" alt="">
            <h3 class="text-white mt-2">${meal.strMeal}</h3>
          </div>
          <div class="col-md-9 text-white">
            <h3>Instructions</h3>
            <p> ${meal.strInstructions}</p>
            <h4>Area: ${meal.strArea}</h4>
            <h4>category: ${meal.strCategory}</h4>
            <h4 class="recipes">Recipes:</h4><br>
            <ul class="d-flex flex-wrap justify-align-content-around ps-0">
            ${ingredients}
            </ul>
            <h4 class="mt-4">Tags:</h4>
            <span class="bg-info-subtle text-dark fs-4 px-2 py-1 rounded">loem3</span><br>
            <a href="${meal.strYoutube}" class="mt-4 btn btn-danger">Youtube</a>
            <a href="${meal.strSource}" class="mt-4 btn btn-success">Source</a>
          </div>
        </div>
      </div>
  `;
  $("#meals").html(sh);
}

// get categories
$("#categories").click(function () {
  displayCategories();
});

async function displayCategories() {
  let http = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  let response;
  let categories;
  if (http.ok && http.status == 200) {
    response = await http.json();
    categories = response.categories;
  }

  console.log(categories);
  let cats = ``;

  for (let categorie of categories) {
    cats += `
    <div class="col-md my-3">
      <div class="card position-relative overflow-hidden">
        <div class="card-img"">
          <img class="w-100" src="${categorie.strCategoryThumb}" alt="..">
        </div>
        <div onclick="getCategoryMeals('${categorie.strCategory}')" class="card-info d-flex align-items-center">
          ${categorie.strCategory}
        </div>
      </div>
    </div>
    `;
  }
  $("#meals").html(`<div class="container">
  <div id="#mealsRow" class="row row-cols-lg-4 row-cols-md-3">
    ${cats}
  </div>
</div>`);
}

async function getCategoryMeals(cat) {
  let http = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
  let response = await http.json();
  let meals = response.meals.slice(0, 20);
  displayMeals(meals);
}

// get Meals by area

$("#area").click(function () {
  displayByArea();
});

async function displayByArea() {
  let http = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  let response = await http.json();
  let areas = response.meals;

  console.log(areas);
  let place = ``;

  for (let area of areas) {
    place += `
    <div class="col-md-3 text-white">
      <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h3>${area.strArea}</h3>
      </div>
    </div>
    `;
  }
  $("#meals").html(`<div class="container">
  <div id="#mealsRow" class="row row-cols-lg-4 row-cols-md-3">
    ${place}
  </div>
</div>`);
}

async function getAreaMeals(area) {
  let http = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  let response = await http.json();
  let meals = response.meals;
  displayMeals(meals);
}

// get meals by ingredients

$("#ingredients").click(function () {
  displayByIngredients();
});

async function displayByIngredients() {
  let http = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
  let response;
  let ingredients;
  if (http.ok && http.status == 200) {
    response = await http.json();
    ingredients = response.meals.slice(0, 30);
    console.log(ingredients);
    let ing = ``;

    for (let ingredient of ingredients) {
    ing += `
    <div class="col-md-3 text-white ">
      <div onclick="getIngredientMeals('${ingredient.strIngredient}')" class="rounded-2 text-center ingredient-card">
              <i class="fa-solid fa-utensils fa-4x"></i>
              <h3>${ingredient.strIngredient}</h3>
      </div>
    </div>
    `;
    }
    $("#meals").html(`<div class="container">
  <div id="#mealsRow" class="row row-cols-lg-4 row-cols-md-3">
    ${ing}
  </div>
</div>`);
  }
}

async function getIngredientMeals(area) {
  let http = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${area}`);
  let response = await http.json();
  let meals = response.meals;
  displayMeals(meals);
}

// contact
$("#contact").click(function () {
  showContacts();
});
function showContacts() {
  let contact = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `;
  $("#meals").html(contact);

  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document.getElementById("nameAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("nameAlert").classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (emailValidation()) {
      document.getElementById("emailAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("emailAlert").classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document.getElementById("ageAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("ageAlert").classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

// validation
function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value);
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value);
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value);
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
}
