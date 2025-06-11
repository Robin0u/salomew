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
    afficherQuestion();
  } else {
    alert("C'est pas le bon prénom 🙃");
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
  const stars = document.querySelectorAll('.stars span');
  stars.forEach((star, index) => {
    star.classList.toggle('selected', index < note);
  });
  setTimeout(() => {
    currentQuestion++;
    afficherQuestion();
  }, 500);
}

function afficherPopup() {
  popup.style.display = 'flex';
}

function fermerPopup() {
  popup.style.display = 'none';
  currentQuestion++;
  afficherQuestion();
}
