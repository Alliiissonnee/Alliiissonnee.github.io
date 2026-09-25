// ==========================================================
// Traduction (FR / EN / ID)
// ==========================================================
const LANGUES = ["fr", "en", "id"];
let langueActuelle = "fr";

const elementsTexte = document.querySelectorAll("[data-i18n]");
const elementsAttributs = document.querySelectorAll("[data-i18n-attr]");
const boutonsLangue = document.querySelectorAll("[data-langue]");

// On garde le texte français d'origine pour pouvoir y revenir
const textesOriginaux = new Map();
elementsTexte.forEach((el) => textesOriginaux.set(el, el.innerHTML));

const attributsOriginaux = new Map();
elementsAttributs.forEach((el) => {
  const valeurs = {};
  lirePaires(el).forEach(([attribut]) => {
    valeurs[attribut] = el.getAttribute(attribut);
  });
  attributsOriginaux.set(el, valeurs);
});

// "aria-label:cle, alt:cle2" -> [["aria-label", "cle"], ["alt", "cle2"]]
function lirePaires(el) {
  return el.dataset.i18nAttr.split(",").map((paire) => paire.split(":").map((s) => s.trim()));
}

// Texte traduit pour le JavaScript (ex : libellé du bouton burger)
function texte(cle) {
  return traductions[langueActuelle][cle] ?? traductions.fr[cle];
}

function traduire(langue) {
  langueActuelle = langue;
  document.documentElement.lang = langue;
  const dico = traductions[langue];

  elementsTexte.forEach((el) => {
    el.innerHTML = (langue !== "fr" && dico[el.dataset.i18n]) || textesOriginaux.get(el);
  });

  elementsAttributs.forEach((el) => {
    const originaux = attributsOriginaux.get(el);
    lirePaires(el).forEach(([attribut, cle]) => {
      el.setAttribute(attribut, (langue !== "fr" && dico[cle]) || originaux[attribut]);
    });
  });

  boutonsLangue.forEach((bouton) => {
    bouton.setAttribute("aria-pressed", bouton.dataset.langue === langue);
  });

  majBurger();
}

function langueDeDepart() {
  try {
    const sauvegardee = localStorage.getItem("langue");
    if (LANGUES.includes(sauvegardee)) return sauvegardee;
  } catch {
    // localStorage indisponible (navigation privée...) : on continue
  }
  const navigateur = navigator.language.slice(0, 2);
  return LANGUES.includes(navigateur) ? navigateur : "fr";
}

boutonsLangue.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    traduire(bouton.dataset.langue);
    try {
      localStorage.setItem("langue", bouton.dataset.langue);
    } catch {
      // pas grave si la langue n'est pas mémorisée
    }
  });
});

// ==========================================================
// Menu burger (mobile)
// ==========================================================
const entete = document.querySelector(".entete");
const burger = document.querySelector(".burger");

function majBurger() {
  const ouvert = entete.classList.contains("menu-ouvert");
  burger.setAttribute("aria-expanded", ouvert);
  burger.setAttribute("aria-label", texte(ouvert ? "burger.fermer" : "burger.ouvrir"));
}

burger.addEventListener("click", () => {
  entete.classList.toggle("menu-ouvert");
  majBurger();
});

// ==========================================================
// Bouton mode sombre
// ==========================================================
const boutonTheme = document.querySelector(".theme");
const systemeSombre = window.matchMedia("(prefers-color-scheme: dark)");

function themeActuel() {
  return document.documentElement.dataset.theme || (systemeSombre.matches ? "dark" : "light");
}

function majBoutonTheme() {
  boutonTheme.dataset.sombre = themeActuel() === "dark";
}

boutonTheme.addEventListener("click", () => {
  const nouveau = themeActuel() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nouveau;
  try {
    localStorage.setItem("theme", nouveau);
  } catch {
    // pas grave si le choix n'est pas mémorisé
  }
  majBoutonTheme();
});

// Si le visiteur change le réglage de son appareil pendant la visite
systemeSombre.addEventListener("change", majBoutonTheme);
majBoutonTheme();

// ==========================================================
// Carrousels de la page projets
// ==========================================================
document.querySelectorAll(".carrousel").forEach((carrousel) => {
  const galerie = carrousel.querySelector(".projet__galerie");
  const precedent = carrousel.querySelector(".carrousel__fleche--precedent");
  const suivant = carrousel.querySelector(".carrousel__fleche--suivant");

  // On avance d'une capture (largeur d'une capture + l'espace entre deux)
  function pas() {
    const [premiere, deuxieme] = galerie.children;
    return deuxieme ? deuxieme.offsetLeft - premiere.offsetLeft : galerie.clientWidth;
  }

  // On masque la flèche quand on est au début ou à la fin
  function majFleches() {
    const fin = galerie.scrollWidth - galerie.clientWidth;
    precedent.disabled = galerie.scrollLeft <= 1;
    suivant.disabled = galerie.scrollLeft >= fin - 1;
  }

  precedent.addEventListener("click", () => galerie.scrollBy({ left: -pas() }));
  suivant.addEventListener("click", () => galerie.scrollBy({ left: pas() }));
  galerie.addEventListener("scroll", majFleches);
  window.addEventListener("resize", majFleches);
  majFleches();
});

traduire(langueDeDepart());
