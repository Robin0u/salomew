const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEiGvE1AFhph9Rh0OU4MlFUDDwm2Y4kZTtoUA3ARi_TVpkrSw8qp5sgbyxL5ELTcdB1Q/exec";

let prenomUtilisateur = "";
const reponses = [];

// === LISTE DES QUESTIONS ===
const starQuestions = [
  "Comment tu te sens aujourd’hui ?",
  "As-tu bien dormi ?",
  "T’as bien mangé aujourd'hui ?",
  "T’as pensé à moi ?",
  "T’as été fière de toi aujourd’hui ?",
  "C’était une bonne journée ?"
];

const textQuestions = [
  "Un mot pour le meilleur copain du monde ?",
  "Décris-moi ta journée, chat ❤️",
  "Ton ressenti aujourd’hui ?",
  "Y a un truc que t’aimerais me dire et que t’as pas encore dit ?",
  "Si je pouvais t’offrir n’importe quoi là tout de suite, tu choisirais quoi ?",
  "Tu veux me dire quoi pour bien finir ta journée ? 💖"
];

const loveQuestion = "Est-ce que tu m’aimes ?";
const totalQuestions = starQuestions.length + textQuestions.length + 1;

let currentQuestion = 0;

// === ELEMENTS DOM ===
const app   = document.getElementById("app");
const popup = document.getElementById("popup");
const btnValider      = document.getElementById("btn-valider");
const btnPopupSuivant = document.getElementById("btn-popup-suivant");

// === EVENTS ===
btnValider.addEventListener("click", verifierPrenom);
btnPopupSuivant.addEventListener("click", fermerPopup);

// === FONCTIONS ===
function verifierPrenom() {
  const prenomInput = document.getElementById("prenom");
  const prenom = prenomInput.value.trim();
  const normalise = prenom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (normalise === "salome") {
    prenomUtilisateur = prenom;
    currentQuestion = 0;
    afficherQuestion();
  } else {
    alert("Ptdr t'es qui ? C'est réservé à la meilleure copine du monde (donc pas toi dégage)");
  }
}

function afficherQuestion() {
  if (currentQuestion >= totalQuestions) {
    afficherMessageFinal();
    return;
  }

  let html = `<div class="card fade-in">`;

  if (currentQuestion < starQuestions.length) {
    // Questions étoiles
    const q = starQuestions[currentQuestion];
    html += `<h2>${q}</h2><div class="stars">`;
    for (let i = 1; i <= 5; i++) {
      html += `<span data-note="${i}">★</span>`;
    }
    html += `</div>`;
  } 
  else if (currentQuestion < starQuestions.length + textQuestions.length) {
    // Questions texte
    const idx = currentQuestion - starQuestions.length;
    const q = textQuestions[idx];
    html += `
      <h2>${q}</h2>
      <textarea id="reponseTexte" rows="4" 
        style="width:100%;padding:10px;font-size:16px;resize:none;"
        placeholder="Écris ta réponse ici..."
      ></textarea>
      <button id="btn-suivant-texte" style="margin-top:10px;">Suivant</button>
    `;
  } 
  else {
    // Question finale "love"
    html += `<h2>${loveQuestion}</h2>
      <button id="btn-oui1">Oui</button>
      <button id="btn-oui2">Oui 🥺</button>`;
  }

  html += `</div>`;
  app.innerHTML = html;

  // Ajout listeners selon le type
  if (currentQuestion < starQuestions.length) {
    document.querySelectorAll(".stars span").forEach(star => {
      star.addEventListener("click", () => noter(parseInt(star.dataset.note)));
    });
  } 
  else if (currentQuestion < starQuestions.length + textQuestions.length) {
    document.getElementById("btn-suivant-texte").addEventListener("click", () => {
      const rep = document.getElementById("reponseTexte").value.trim();
      if (!rep) {
        alert("Tu dois écrire quelque chose, chat ❤️");
        return;
      }
      reponses[currentQuestion] = rep;
      currentQuestion++;
      afficherQuestion();
    });
  } 
  else {
    document.getElementById("btn-oui1").addEventListener("click", afficherPopup);
    document.getElementById("btn-oui2").addEventListener("click", afficherPopup);
  }
}

function noter(note) {
  reponses[currentQuestion] = note;
  const stars = document.querySelectorAll(".stars span");
  stars.forEach((s, i) => s.classList.toggle("selected", i < note));

  setTimeout(() => {
    currentQuestion++;
    afficherQuestion();
  }, 300);
}

function afficherPopup() {
  reponses[currentQuestion] = "Oui ❤️"; 
  popup.style.display = "flex";
}

function fermerPopup() {
  popup.style.display = "none";
  currentQuestion++;
  envoyerReponses();
  afficherQuestion();
}

function envoyerReponses() {
  const payload = {
    prenom: prenomUtilisateur,
    q1:  reponses[0]  || "",
    q2:  reponses[1]  || "",
    q3:  reponses[2]  || "",
    q4:  reponses[3]  || "",
    q5:  reponses[4]  || "",
    q6:  reponses[5]  || "",
    q7:  reponses[6]  || "",
    q8:  reponses[7]  || "",
    q9:  reponses[8]  || "",
    q10: reponses[9]  || "",
    q11: reponses[10] || "",
    q12: reponses[11] || "",
    q13: reponses[12] || ""
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => console.log("Réponses envoyées avec succès !"))
  .catch(e => console.error("Erreur d’envoi :", e));
}


function afficherMessageFinal() {
  app.innerHTML = `
    <div class="card fade-in">
      <h2>Merci d’avoir répondu 💖</h2>
      <p>Bonne nuit ma Salomé ✨<br>Je t’aime plus que tout ❤️</p>
    </div>
  `;
}

console.log("Envoi des données :", payload);

fetch(SCRIPT_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
.then(res => res.text())
.then(txt => console.log("Réponse du serveur :", txt))
.catch(e => console.error("Erreur d’envoi :", e));
