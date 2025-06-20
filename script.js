const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw424TpVQmwi6ISejCo3EtgGk5lmZ_xNlwfybQztkZL5BlMX9ZeQ_7QewNhLZNi9ijUlQ/exec";
let prenomUtilisateur = "";          // on sauvegarde le prénom
const reponses = [];                // tableau pour stocker les notes

const questions = [
  "Comment tu te sens aujourd’hui ?",
  "As-tu bien dormi ?",
  "T’as bien mangé aujourd'hui ?",
  "T’as pensé à moi ?",
  "T’as été fière de toi aujourd’hui ?",
  "C’était une bonne journée ?",
  "Est-ce que tu m’aimes ?"
];

let currentQuestion = 0;
const app = document.getElementById('app');
const btnValider = document.getElementById('btn-valider');
const popup = document.getElementById('popup');
const btnPopupSuivant = document.getElementById('btn-popup-suivant');

btnValider.addEventListener('click', verifierPrenom);
btnPopupSuivant.addEventListener('click', fermerPopup);

function verifierPrenom() {
  const prenomInput = document.getElementById('prenom');
  let prenom = prenomInput.value.trim();
  let normalise = prenom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalise === 'salome') {
    prenomUtilisateur = prenom;     // <‑‑ on garde la valeur tapée
    afficherQuestion();
  } else {
    alert("Ptdr t'es qui ? C'est réservé à la meilleure copine du monde (donc pas toi dégage)");
  }
}

function afficherQuestion() {
  if (currentQuestion < questions.length) {
    let question = questions[currentQuestion];

    let html = `<div class="card"><h2>${question}</h2>`;

    if (currentQuestion === questions.length - 1) {
      // Dernière question : boutons "Oui"
      html += `
        <button id="btn-oui1">Oui</button>
        <button id="btn-oui2">Oui 🥺</button>
      `;
    } else {
      // Questions avec étoiles
      html += `<div class="stars">`;
      for (let i = 1; i <= 5; i++) {
        html += `<span data-note="${i}">★</span>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    app.innerHTML = html;

    if (currentQuestion === questions.length - 1) {
      document.getElementById('btn-oui1').addEventListener('click', afficherPopup);
      document.getElementById('btn-oui2').addEventListener('click', afficherPopup);
    } else {
      document.querySelectorAll('.stars span').forEach(star => {
        star.addEventListener('click', () => {
          noter(parseInt(star.dataset.note));
        });
      });
    }
  } else {
    app.innerHTML = '<div class="card"><h2>Merci d\'avoir répondu 💖</h2></div>';
  }
}

function noter(note) {
  reponses[currentQuestion] = note;   // <‑‑ on mémorise la note (1‑5)
  const stars = document.querySelectorAll('.stars span');
  stars.forEach((star, index) => {
    star.classList.toggle('selected', index < note);
  });
  setTimeout(() => {
    currentQuestion++;
    afficherQuestion();
  }, 300);
}


function afficherPopup() {
  // on enregistre « Oui » (5 étoiles symboliquement)
  reponses[currentQuestion] = 5;
  popup.style.display = 'flex';
}

function fermerPopup() {
  popup.style.display = 'none';
  currentQuestion++;
  envoyerReponses();      // <‑‑ ENVOI VERS GOOGLE SHEETS
  afficherQuestion();     // affiche le message « Merci… »
}

function envoyerReponses() {
  // construit un objet clé / valeur compatible avec Apps Script
  const payload = {
    prenom: prenomUtilisateur,
    q1: reponses[0] || "",
    q2: reponses[1] || "",
    q3: reponses[2] || "",
    q4: reponses[3] || "",
    q5: reponses[4] || "",
    q6: reponses[5] || "",
    q7: reponses[6] || "",
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .catch(err => console.error("Erreur d’envoi vers Sheets :", err));
}

