const questions = [
  { q: "What is the capital of France?", options: ["Paris", "Rome", "Madrid", "Berlin"], answer: 0 },
  { q: "HTML stands for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Markup Language", "None"], answer: 0 },
  { q: "Which planet is known as Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
  { q: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 2 },
  { q: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: 0 },
  { q: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Pb", "Fe"], answer: 0 },
  { q: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1 },
  { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"], answer: 1 },
  { q: "Who painted the Sistine Chapel ceiling?", options: ["Leonardo da Vinci", "Vincent van Gogh", "Michelangelo", "Pablo Picasso"], answer: 2 },
  { q: "What is the capital of Japan?", options: ["Tokyo", "Seoul", "Beijing", "Bangkok"], answer: 0 },
  { q: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
  { q: "Which element has the atomic number 1?", options: ["Oxygen", "Hydrogen", "Helium", "Carbon"], answer: 1 },
  { q: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Pepper", "Onion"], answer: 1 },
  { q: "Who discovered penicillin?", options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Albert Einstein"], answer: 1 },
  { q: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Lungs"], answer: 2 }
];

let currentQuestion = 0;
let score = 0;
let timer;
const timePerQuestion = 10;

const progressBar = document.getElementById("progress-bar");
const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const modal = document.getElementById("result-modal");
const scoreText = document.getElementById("score");
const stars = document.getElementById("stars");
const leaderboard = document.getElementById("leaderboard");

function loadQuestion() {
  clearInterval(timer);
  progressBar.style.transform = "scaleX(0)";

  const q = questions[currentQuestion];
  questionContainer.innerHTML = `
    <div class="question">
      <h2>${q.q}</h2>
      <div class="options">
        ${q.options.map((opt, i) => `
          <label>
            <input type="radio" name="option" value="${i}">
            <span>${opt}</span>
          </label>`).join("")}
      </div>
    </div>
  `;

  animateProgressBar();
  startTimer();
}

function animateProgressBar() {
  setTimeout(() => {
    progressBar.style.transform = "scaleX(1)";
  }, 100);
}

function startTimer() {
  let timeLeft = timePerQuestion;
  timer = setInterval(() => {
    if (--timeLeft <= 0) {
      clearInterval(timer);
      handleNext();
    }
  }, 1000);
}

function handleNext() {
  const selected = document.querySelector("input[name='option']:checked");
  if (selected) {
    const selectedIndex = parseInt(selected.value);
    if (selectedIndex === questions[currentQuestion].answer) {
      score++;
      selected.nextElementSibling.classList.add("correct");
    } else {
      selected.nextElementSibling.classList.add("incorrect");
    }
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 500);
}

function showResult() {
  modal.style.display = "flex";
  scoreText.textContent = `${score} / ${questions.length}`;
  stars.innerHTML = "★".repeat(score / 3) + "☆".repeat(5 - Math.floor(score / 3));

  updateLeaderboard(score);
}

function updateLeaderboard(newScore) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push(newScore);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(scores));

  leaderboard.innerHTML = scores.map(s => `<li>${s}</li>`).join("");
}

nextBtn.addEventListener("click", handleNext);
document.getElementById("restart-btn").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  modal.style.display = "none";
  loadQuestion();
});

loadQuestion();