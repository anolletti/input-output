("use strict");

// CREATING DOM OBJECTS
const mainButton = document.getElementById("btn-main");
const inputField = document.getElementById("user-input-value");
const inputDiv = document.getElementById("user-input-div");
const outputField = document.getElementById("output-value");
const inputFieldContainer = document.getElementById("input-container");
const robotButton = document.getElementById("robot-image");
const settingsButton = document.getElementById("settings-button");
const instructionsButton = document.getElementById("instructions-button");
const graphButton = document.getElementById("graph-button");
const restartButton = document.getElementById("restart-button");
const setLevelButton = document.getElementById("set-level");
const inputAnimationElement = document.getElementById("animation");
const checkAnswerButton = document.getElementById("checkAnswer");

// Initialize audio
let soundIsOn = true;
$(document).on("change", 'input:radio[name="audio"]', function (event) {
  soundIsOn = !soundIsOn;
});

// Initialize modal

$(document).ready(function () {
  $("#settingsModal").modal("show");
});

// Blur buttons when modals close
$("body").on("hidden.bs.modal", ".modal", function () {
  $(".btn").blur();
});

// RANDOM FUNCTION GENERATOR

let mValue,
  bValue,
  xValues,
  yValues,
  xValuesAll,
  yValuesAll,
  fractions,
  divisor,
  operation1,
  operation2,
  randomIndex,
  difficulty,
  gameIsWon,
  language,
  trueCount = 0;
truthyArray = [];

function init() {
  xValues = [];
  xValuesAll = [];
  yValues = [];
  yValuesAll = [];
  fractions = [-0.5, -0.25, -0.1, 0.1, 0.25, 0.5];
  divisors = [-2, -4, -10, 10, 4, 2];
  truthyArray = [];
  document.getElementById("m-value-guess").value = "";
  document.getElementById("b-value-guess").value = "";

  if (difficulty != "custom") {
    difficulty = document.querySelector('input[name="level"]:checked').value;
  }
}

init();
setDifficulty();

//DIFFICULY LEVEL

function addOrSubtract() {
  if (bValue >= 0) {
    operation2 = "add";
    return operation2;
  }
  if (bValue < 0) {
    operation2 = "subtract";
    return operation2;
  }
}

// Detecting a change in difficulty selection

$(document).on("change", 'input:radio[name="level"]', function (event) {
  difficulty = document.querySelector('input[name="level"]:checked').value;
  setDifficulty();
});

// Functions for custom setting
function custom() {
  let operation1custom = document.querySelector(
    'input[name="operation1custom"]:checked'
  );
  let mValueCustom = document.getElementById("mValueCustom");
  let operation2custom = document.querySelector(
    'input[name="operation2custom"]:checked'
  );
  let bValueCustom = document.getElementById("bValueCustom");

  if (
    operation1custom == null ||
    mValueCustom.value == "" ||
    operation2custom == null ||
    bValueCustom.value == ""
  ) {
    alertMessageEmptyFields();
  } else if (isDecimal(mValueCustom.value)) {
    alertMessageDecimals();
  } else {
    operation1 = operation1custom.value;

    mValue = Number(mValueCustom.value);

    operation2 = operation2custom.value;
    $("#customModal").modal("hide");

    bValue = Number(bValueCustom.value);

    $("#customModal").modal("hide");
    document.getElementById("custom").checked = false;
  }
}

// Opening custom modal on click
function openCustomModal() {
  $(document).ready(function () {
    $("#customModal").modal("show");
  });
}

$("input[id='custom']").change(openCustomModal);

// Resetting level to beginner on cancel

document
  .getElementById("customRuleCancel")
  .addEventListener("click", function () {
    document.getElementById("custom").checked = false;
    document.getElementById("custom-label").classList.remove("active");
    document.getElementById("beginner").checked = true;
    document.getElementById("beginner-label").classList.add("active");
    $("#customModal").modal("hide");
  });

function setDifficulty() {
  document.getElementById("subtractLabel2").classList.remove("disabled");
  document.getElementById("addLabel").classList.remove("disabled");
  document.getElementById("b-value-guess").disabled = false;

  if (difficulty == "custom") {
    document
      .getElementById("customRuleSubmit")
      .addEventListener("click", custom);
  }

  if (difficulty == "beginner" || difficulty == null) {
    mValue = Math.floor(Math.random() * 11);
    bValue = 0;
    operation1 = "multiply";
    operation2 = addOrSubtract();
    document.getElementById("subtractLabel2").classList.add("disabled");
    document.getElementById("addLabel").classList.add("disabled");
    document.getElementById("b-value-guess").disabled = true;
  }

  if (difficulty == "novice") {
    mValue = Math.floor(Math.random() * 11);
    bValue = Math.floor(Math.random() * 11);
    operation1 = "multiply";
    operation2 = addOrSubtract();
  }

  if (difficulty == "intermediate") {
    mValue = Math.floor(Math.random() * 21 - 10);
    bValue = Math.floor(Math.random() * 21 - 10);
    operation1 = "multiply";
    operation2 = addOrSubtract();
  }

  if (difficulty == "advanced") {
    randomIndex = Math.floor(Math.random() * fractions.length);
    mValue = fractions[randomIndex];
    divisor = divisors[randomIndex];
    bValue = Math.floor(Math.random() * 21 - 10);
    operation1 = "divide";
    operation2 = addOrSubtract();
  }
  resetTable();
}

function printValues() {
  console.log("mValue: " + mValue);
  console.log("bValue: " + bValue);
  console.log("operation1: " + operation1);
  console.log("operation2: " + operation2);
  console.log("divisor" + divisor);
}

function resetTable() {
  for (let i = 0; xValues.length; i++) {
    xValues.shift();
    xValuesAll.shift();
    yValues.shift();
    yValuesAll.shift();
    const inputBox = document.getElementById(`input${i}`);
    inputBox.innerHTML = '<i class="fa-regular fa-square fa-l">';

    const outputBox = document.getElementById(`output${i}`);
    outputBox.innerHTML = '<i class="fa-regular fa-square fa-l">';
  }
  inputField.value = "";
  outputField.value = "";

  document.getElementById("multiply").checked = false;
  document.getElementById("multiplyLabel").classList.remove("active");

  document.getElementById("divide").checked = false;
  document.getElementById("divideLabel").classList.remove("active");

  document.getElementById("add").checked = false;
  document.getElementById("addLabel").classList.remove("active");

  document.getElementById("subtract").checked = false;
  document.getElementById("subtractLabel").classList.remove("active");

  init();
}

restartButton.addEventListener("click", resetGame);

function resetGame() {
  resetTable();
  setDifficulty();
}

function tableAppend() {
  if (xValues.length == 5) {
    for (let i = 0; xValues.length - 1; i++) {
      xValues.shift();
      yValues.shift();
      const inputBox = document.getElementById(`input${i}`);
      inputBox.innerHTML = '<i class="fa-regular fa-square fa-l">';

      const outputBox = document.getElementById(`output${i}`);
      outputBox.innerHTML = '<i class="fa-regular fa-square fa-l">';
    }
  }
  if (xValues.length < 5) {
    for (let i = 0; i < xValues.length; i++) {
      const inputBox = document.getElementById(`input${i}`);
      inputBox.innerHTML = "";
      inputBox.textContent = xValues[i];
      const outputBox = document.getElementById(`output${i}`);
      outputBox.innerHTML = "";
      outputBox.textContent = yValues[i];
    }
  }
}

// PLAYER MOVES

var id = null;

function myMove() {
  // Setting user input value to animation
  let inputValue = inputField.value;
  inputField.value = "";

  // Playing audio
  let audio = new Audio("audio/robosound.m4a");

  if (soundIsOn) {
    audio.play();
  }
  // Setting output VALUE
  let outputValue = mValue * inputValue + bValue;

  xValues.push(Number(inputValue));
  yValues.push(Number(outputValue));
  outputField.value = outputValue;

  xValuesAll.push(Number(inputValue));
  yValuesAll.push(Number(outputValue));

  // Appending input and output to array
  tableAppend();
}

document.addEventListener("keydown", function (enter) {
  if (
    enter.key === "Enter" &&
    !inputField.value == "" &&
    !$("#guessModal").hasClass("modal-open")
  ) {
    myMove();
  }
});

robotButton.addEventListener("click", myMove);

//Graphing

// We need graph to be traced on click of button
function drawGraph() {
  var trace1 = {
    x: xValuesAll,
    y: yValuesAll,
    mode: "markers",
    type: "scatter",
    marker: { size: 12 },
  };

  var data = [trace1];

  var layout = {
    xaxis: {
      title: {
        text: "INPUT VALUES",
        dtick: 1,
        font: {
          size: 18,
          color: "#7f7f7f",
        },
      },
    },
    yaxis: {
      title: {
        text: "OUTPUT VALUES",
        dtick: 1,
        font: {
          size: 18,
          color: "#7f7f7f",
        },
      },
    },
  };

  Plotly.newPlot("scatterPlot", data, layout);
}

graphButton.addEventListener("click", drawGraph);

// Check user answer

function checkEquality(value1, value2) {
  if (value1 == value2) {
    truthyArray.push(true);
  } else {
    truthyArray.push(false);
  }
}

function onWin() {
  $("#guessModal").modal("hide");

  overlayOn();
  gameIsWon = false;
  resetGame();
  let audio2 = new Audio("audio/celebrate.wav");
  if (soundIsOn) {
    audio2.play();
  }
}

function alertMessage() {
  checkLanguage();
  if (language == "en" || language == null) {
    alert("Please remember to complete all required fields.");
  }
  if (language == "fr") {
    alert("SVP. Complétez les champs obligatoires.");
  }
}

function isDecimal(n) {
  var result = n - Math.floor(n) !== 0;

  if (result) return true;
  else return false;
}

function alertMessageDecimals() {
  checkLanguage();
  if (language == "en" || language == null) {
    alert(
      "Values cannot be in decimal form. Maybe try a different operation. "
    );
  }
  if (language == "fr") {
    alert("La machine n'accepte pas les nombres décimaux. Réessayez, SVP. ");
  }
}

function alertMessageEmptyFields() {
  checkLanguage();
  if (language == "en" || language == null) {
    alert("Please complete all required fields. ");
  }
  if (language == "fr") {
    alert("Veuillez remplir tous les champs obligatoires. ");
  }
}

function tryAgain() {
  checkLanguage();
  if (language == "en" || language == null) {
    alert(`${trueCount} of your responses are correct.`);
    truthyArray = [];
  }
  if (language == "fr") {
    alert(`${trueCount} de vos réponses sont justes.`);
    truthyArray = [];
  }
}

function checkAnswer() {
  if (
    !document.querySelector('input[name="operation1"]:checked') ||
    document.getElementById("m-value-guess").value.length == 0
  ) {
    alertMessage();
    return false;
  }

  let operation1guess = document.querySelector(
    'input[name="operation1"]:checked'
  ).value;

  let mValueGuess = document.getElementById("m-value-guess").value;

  let isMvalueDecimal = isDecimal(mValueGuess);

  // if (isMvalueDecimal) {
  //   alertMessageDecimals();
  //   return false;
  // }

  if (difficulty == "advanced" && operation1guess == "divide") {
    checkEquality(mValueGuess, divisor);
    truthyArray.push(true);
  } else if (
    isMvalueDecimal &&
    operation1guess == "multiply" &&
    mValueGuess == mValue
  ) {
    checkEquality(mValue, mValueGuess);
    truthyArray.push(true);
  } else if (difficulty != "advanced") {
    checkEquality(operation1guess, operation1);
    checkEquality(mValueGuess, mValue);
  }

  if (difficulty != "beginner") {
    let operation2guess = document.querySelector(
      'input[name="operation2"]:checked'
    ).value;
    checkEquality(operation2guess, operation2);

    let bValueGuess = document.getElementById("b-value-guess").value;
    checkEquality(bValueGuess, Math.abs(bValue));

    // If adding a negative bValue

    if (bValue < 0 && bValue == bValueGuess && operation2 != operation2guess) {
      truthyArray.push(true);
      truthyArray.push(true);
    }

    // If subtracting a negative bValue

    if (
      bValue >= 0 &&
      bValue == bValueGuess * -1 &&
      operation2 != operation2guess
    ) {
      truthyArray.push(true);
      truthyArray.push(true);
    }

    trueCount = truthyArray.filter((w) => w === true).length;

    if (trueCount == 4) {
      gameIsWon = true;
    }
    if (trueCount != 4) {
      tryAgain();
      trueCount = [];
    }
  }

  if (difficulty == "beginner") {
    if (
      !document.querySelector('input[name="operation1"]:checked') ||
      document.getElementById("m-value-guess").value.length == 0
    ) {
      alertMessage();
      return false;
    }
    trueCount = truthyArray.filter((w) => w === true).length;
    if (trueCount == 2) {
      gameIsWon = true;
    }
    if (trueCount != 2) {
      tryAgain();
      trueCount = [];
    }
  }

  if (gameIsWon) {
    onWin();
  }
}

checkAnswerButton.addEventListener("click", checkAnswer);

document.addEventListener("keydown", function (enter) {
  if (enter.key === "Enter" && $("#guessModal").hasClass("show")) {
    checkAnswer();
  }
});

document.addEventListener("keydown", function (enter) {
  if (
    enter.key === "Escape" &&
    overLayOn &&
    !$("#guessModal").hasClass("show")
  ) {
    overlayOff();
  }
});

// Congratulations overlay

let overLayOn;

function overlayOn() {
  document.getElementById("overlay").style.display = "block";
  overLayOn = true;
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
  overLayOn = false;
}

document.getElementById("overlay").addEventListener("click", overlayOff);

// Language detection and change

$('[lang="fr"]').hide();

$(document).on("change", 'input:radio[name="language"]', function (event) {
  $('[lang="fr"]').toggle();
  $('[lang="en"]').toggle();
});

function checkLanguage() {
  language = document.querySelector('input[name="language"]:checked').value;
  if (!document.querySelector('input[name="level"]:checked')) {
    language == "en";
  }
  return language;
}
