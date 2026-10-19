// Génère les 3 CV (cv.html, cv-en.html, cv-id.html) à partir d'un seul modèle.
// Usage : node cv/generer-cv.js   (depuis le dossier du projet)
// Les PDF (assets/CV_Alison_Faidherbe_web*.pdf) s'impriment ensuite depuis ces pages, un par un.
const fs = require("fs");
const path = require("path");

const ICONES = {
  lieu: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
};

const CV = {
  fr: {
    fichier: "cv.html", pdf: "CV_Alison_Faidherbe_web.pdf", titre: "CV · Alison Faidherbe", photo: "Photo d'Alison Faidherbe",
    metier: "Développeur web et web mobile",
    accroche: "En reconversion dans le développement web, je serai disponible dès décembre 2026 pour mettre mes compétences et ma motivation au service de nouveaux projets.",
    lieu: "Marseille (13)",
    titres: { experiences: "Expériences professionnelles", formations: "Formations et diplômes", competences: "Compétences", technique: "Technique", atouts: "Atouts", divers: "Divers", interets: "Centres d'intérêt" },
    experiences: [
      { quand: "Août – octobre 2026", ou: ["Vaniseo – Agence web", "MARSEILLE (13)"], poste: "Stagiaire développeur web WordPress", puces: ["Conception et réalisation complète du site e-commerce Foorthune (WordPress / WooCommerce), du cahier des charges à la mise en ligne.", "Personnalisation CSS / PHP (thème enfant) et maquettage de boutiques pour plusieurs clients (Laseris, Hexapol)."] },
      { quand: "2015 – 2026", ou: ["Ministère des Armées – Armée de terre", "SUIPPES (51) · CANJUERS (83)"], poste: "Maître de chien", puces: ["Dressage, entraînement et suivi de chiens opérationnels.", "Capacité d'adaptation aux différents chiens et environnements."] },
      { quand: "2015", ou: ["Gendarmerie", "ANNECY (74)"], poste: "Gendarme adjoint de réserve", puces: ["Participation aux missions de sécurité et de prévention sur le terrain.", "Travail en équipe dans le respect strict des procédures."] },
      { quand: "2015", ou: ["Supermarché", "ANNECY (74)"], poste: "Hôtesse de caisse", puces: ["Accueil et encaissement de la clientèle.", "Développement du sens du service et de la relation client."] },
    ],
    formations: [
      { quand: "2026", ou: "FONTENAY-LE-COMTE (85)", texte: "Titre professionnel de niveau 5 – Développeur web et web mobile (en cours, fin novembre 2026)." },
      { quand: "2025", ou: "CANJUERS (83)", texte: "Prévention et Secours Civiques de niveau 1 (PSC1)." },
      { quand: "2020", ou: "SUIPPES (51)", texte: "Certificat de qualification technique supérieur : permet de diriger une équipe de 9 personnes." },
      { quand: "2015", ou: "SEYNOD (74)", texte: "Baccalauréat ST2S – Sciences et Technologies de la Santé et du Social." },
    ],
    competences: ["Coder", "Concevoir une application web", "Prendre en compte les retours utilisateurs afin d'améliorer les applications et systèmes", "Tester un logiciel, un système d'information, une application"],
    groupes: ["Front-end", "Back-end", "Bases de données", "CMS", "Outils"],
    atouts: ["Autonome", "Travail en équipe", "Rigoureuse", "Curieuse"],
    divers: ["Anglais B2", "Permis B et C"],
    interets: ["Course à pied", "Vélo de route", "Snowboard", "Voyages"],
  },
  en: {
    fichier: "cv-en.html", pdf: "CV_Alison_Faidherbe_web_en.pdf", titre: "Resume · Alison Faidherbe", photo: "Photo of Alison Faidherbe",
    metier: "Web and mobile web developer",
    accroche: "Retraining in web development, I will be available from December 2026 to bring my skills and motivation to new projects.",
    lieu: "Marseille, France",
    titres: { experiences: "Work experience", formations: "Education and qualifications", competences: "Skills", technique: "Technical", atouts: "Strengths", divers: "Other", interets: "Interests" },
    experiences: [
      { quand: "August – October 2026", ou: ["Vaniseo – Web agency", "MARSEILLE (13)"], poste: "WordPress web developer intern", puces: ["Designed and built the entire Foorthune e-commerce website (WordPress / WooCommerce), from the specifications to the launch.", "CSS / PHP customisation (child theme) and shop mock-ups for several clients (Laseris, Hexapol)."] },
      { quand: "2015 – 2026", ou: ["French Ministry of the Armed Forces – French Army", "SUIPPES (51) · CANJUERS (83)"], poste: "Military dog handler", puces: ["Training, conditioning and monitoring of operational dogs.", "Ability to adapt to different dogs and environments."] },
      { quand: "2015", ou: ["Gendarmerie (French military police)", "ANNECY (74)"], poste: "Reserve assistant gendarme", puces: ["Took part in on-the-ground security and prevention missions.", "Teamwork with strict adherence to procedures."] },
      { quand: "2015", ou: ["Supermarket", "ANNECY (74)"], poste: "Cashier", puces: ["Welcoming customers and handling payments.", "Developed a strong sense of customer service."] },
    ],
    formations: [
      { quand: "2026", ou: "FONTENAY-LE-COMTE (85)", texte: "French professional qualification, level 5 – Web and mobile web developer (in progress, ends November 2026)." },
      { quand: "2025", ou: "CANJUERS (83)", texte: "First aid certificate, level 1 (PSC1)." },
      { quand: "2020", ou: "SUIPPES (51)", texte: "Advanced technical qualification certificate: qualified to lead a team of 9 people." },
      { quand: "2015", ou: "SEYNOD (74)", texte: "French baccalaureate (high school diploma) in Health and Social Sciences and Technologies." },
    ],
    competences: ["Coding", "Designing a web application", "Using user feedback to improve applications and systems", "Testing software, information systems and applications"],
    groupes: ["Front-end", "Back-end", "Databases", "CMS", "Tools"],
    atouts: ["Independent", "Team player", "Thorough", "Curious"],
    divers: ["English: B2", "Driving licence: car and truck (B, C)"],
    interets: ["Running", "Road cycling", "Snowboarding", "Travel"],
  },
  id: {
    fichier: "cv-id.html", pdf: "CV_Alison_Faidherbe_web_id.pdf", titre: "CV · Alison Faidherbe", photo: "Foto Alison Faidherbe",
    metier: "Pengembang web dan web mobile",
    accroche: "Sedang beralih karier ke pengembangan web, saya akan tersedia mulai Desember 2026 untuk menyumbangkan keterampilan dan motivasi saya bagi proyek-proyek baru.",
    lieu: "Marseille, Prancis",
    titres: { experiences: "Pengalaman kerja", formations: "Pendidikan dan sertifikasi", competences: "Kompetensi", technique: "Teknis", atouts: "Kelebihan", divers: "Lain-lain", interets: "Minat" },
    experiences: [
      { quand: "Agustus – Oktober 2026", ou: ["Vaniseo – Agensi web", "MARSEILLE (13)"], poste: "Magang pengembang web WordPress", puces: ["Merancang dan membangun seluruh situs e-commerce Foorthune (WordPress / WooCommerce), dari spesifikasi kebutuhan hingga peluncuran.", "Kustomisasi CSS / PHP (child theme) dan pembuatan mockup toko untuk beberapa klien (Laseris, Hexapol)."] },
      { quand: "2015 – 2026", ou: ["Kementerian Angkatan Bersenjata Prancis – Angkatan Darat", "SUIPPES (51) · CANJUERS (83)"], poste: "Pawang anjing militer", puces: ["Melatih dan memantau anjing operasional.", "Mampu beradaptasi dengan berbagai anjing dan lingkungan."] },
      { quand: "2015", ou: ["Gendarmerie (polisi militer Prancis)", "ANNECY (74)"], poste: "Gendarme cadangan", puces: ["Ikut serta dalam misi keamanan dan pencegahan di lapangan.", "Bekerja dalam tim dengan mematuhi prosedur secara ketat."] },
      { quand: "2015", ou: ["Supermarket", "ANNECY (74)"], poste: "Kasir", puces: ["Melayani pelanggan dan menangani pembayaran.", "Mengembangkan jiwa pelayanan dan hubungan baik dengan pelanggan."] },
    ],
    formations: [
      { quand: "2026", ou: "FONTENAY-LE-COMTE (85)", texte: "Sertifikasi profesi Prancis tingkat 5 – Pengembang web dan web mobile (sedang berjalan, selesai November 2026)." },
      { quand: "2025", ou: "CANJUERS (83)", texte: "Sertifikat pertolongan pertama tingkat 1 (PSC1)." },
      { quand: "2020", ou: "SUIPPES (51)", texte: "Sertifikat kualifikasi teknis lanjutan: berwenang memimpin tim beranggotakan 9 orang." },
      { quand: "2015", ou: "SEYNOD (74)", texte: "Ijazah SMA Prancis (Baccalauréat) jurusan Ilmu dan Teknologi Kesehatan dan Sosial." },
    ],
    competences: ["Pemrograman", "Merancang aplikasi web", "Memanfaatkan masukan pengguna untuk meningkatkan aplikasi dan sistem", "Menguji perangkat lunak, sistem informasi, dan aplikasi"],
    groupes: ["Front-end", "Back-end", "Basis data", "CMS", "Alat"],
    atouts: ["Mandiri", "Mampu bekerja dalam tim", "Teliti", "Selalu ingin tahu"],
    divers: ["Bahasa Inggris: B2", "SIM Prancis: mobil dan truk"],
    interets: ["Lari", "Bersepeda jalan raya", "Snowboard", "Bepergian"],
  },
};
const TECHNO = [["HTML", "CSS", "JavaScript", "React"], ["PHP", "Node.js"], ["MongoDB", "MySQL"], ["WordPress"], ["Docker"]];

const e = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const icone = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES[n]}</svg>`;
const liste = (items, cls) => `<ul class="${cls}">${items.map((i) => `<li>${e(i)}</li>`).join("")}</ul>`;
const titre = (t) => `<h2><span>${e(t)}</span></h2>`;

function page(langue, c) {
  return `<!DOCTYPE html>
<html lang="${langue}">
<head>
  <meta charset="UTF-8">
  <title>${e(c.titre)}</title>
  <!-- Fichier généré par cv/generer-cv.js : modifier le modèle, pas ce fichier.
       Le PDF est imprimé depuis cette page : assets/${c.pdf} -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Allura&family=Inter:wght@400;500;600;700;800&display=swap">
  <style>
    :root {
      --creme: #fbf6f3;
      --rose-clair: #f5d5db;
      --rose: #c98a95;
      --marine: #223346;
      --ardoise: #6c7482;
    }
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Inter", sans-serif;
      font-size: 9pt;
      line-height: 1.4;
      color: var(--ardoise);
      background: var(--creme);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3, p, ul { margin: 0; }
    ul { padding: 0; list-style: none; }
    a { color: inherit; text-decoration: none; }

    .page {
      position: relative;
      width: 210mm;
      height: 297mm;
      padding: 14mm 14mm 0;
      overflow: hidden;
      background: var(--creme);
    }
    /* Grand disque rose en haut à droite */
    .page::before {
      content: "";
      position: absolute;
      top: -62mm;
      left: 146mm;
      width: 116mm;
      height: 116mm;
      border-radius: 50%;
      background: var(--rose-clair);
    }

    /* ---------- En-tête ---------- */
    .entete {
      position: relative;
      display: grid;
      grid-template-columns: 44mm 1fr;
      column-gap: 9mm;
      align-items: end;
      padding-bottom: 5mm;
      border-bottom: 1px solid var(--rose-clair);
    }
    .photo {
      width: 44mm;
      height: 54mm;
      border-radius: 22mm 22mm 4mm 4mm;
      object-fit: cover;
      object-position: center 20%;
    }
    .prenom {
      font-family: "Allura", cursive;
      font-size: 34pt;
      font-weight: 400;
      line-height: 0.9;
      color: var(--rose);
    }
    .nom {
      font-size: 29pt;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: 0.02em;
      color: var(--marine);
    }
    .metier {
      margin-top: 4mm;
      font-size: 8.6pt;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--marine);
    }
    .accroche {
      margin-top: 2.5mm;
      font-size: 9.6pt;
      line-height: 1.45;
    }
    .coordonnees {
      display: flex;
      flex-wrap: wrap;
      gap: 2mm 4.5mm;
      margin-top: 4mm;
      font-size: 8.4pt;
      white-space: nowrap;
      color: var(--marine);
    }
    .coordonnees li { display: flex; align-items: center; gap: 2mm; }
    .coordonnees svg {
      width: 4mm; height: 4mm; flex-shrink: 0;
      fill: none; stroke: var(--rose); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    }

    /* ---------- Corps ---------- */
    .corps {
      display: grid;
      grid-template-columns: 1fr 54mm;
      column-gap: 9mm;
      padding-top: 4mm;
    }
    .colonne { display: flex; flex-direction: column; gap: 3mm; }

    /* Titres de section manuscrits suivis d'un filet */
    h2 {
      display: flex;
      align-items: center;
      gap: 3mm;
      margin-bottom: 2mm;
      font-family: "Allura", cursive;
      font-size: 19pt;
      font-weight: 400;
      line-height: 1.1;
      color: var(--rose);
    }
    h2::after { content: ""; flex: 1; height: 1px; background: var(--rose-clair); }

    .parcours { display: grid; gap: 3.5mm; }
    .parcours > li { display: grid; grid-template-columns: 29mm 1fr; column-gap: 4mm; }
    .quand { font-size: 8.6pt; line-height: 1.35; }
    .quand strong { display: block; font-weight: 700; color: var(--marine); }
    .quand span { display: block; font-size: 8pt; }
    .poste { margin-bottom: 0.8mm; font-size: 9.4pt; font-weight: 700; color: var(--marine); }

    .puces { display: grid; gap: 0.8mm; }
    .puces li { position: relative; padding-left: 3.5mm; }
    .puces li::before {
      content: ""; position: absolute; top: 0.55em; left: 0;
      width: 1.3mm; height: 1.3mm; border-radius: 50%; background: var(--rose);
    }

    .tirets { display: grid; gap: 0.6mm; }
    .tirets li::before { content: "— "; color: var(--rose); }

    .groupe { margin: 1.6mm 0 1mm; font-size: 7.6pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--marine); }
    .groupe:first-of-type { margin-top: 0; }
    .etiquettes { display: flex; flex-wrap: wrap; gap: 1.5mm; }
    .etiquettes li {
      padding: 0.5mm 2.5mm;
      border-radius: 10mm;
      font-size: 8pt;
      font-weight: 600;
      color: var(--marine);
      background: var(--rose-clair);
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="entete">
      <img class="photo" src="../assets/images/photo.png" alt="${e(c.photo)}">
      <div>
        <h1><span class="prenom">Alison</span><br><span class="nom">FAIDHERBE</span></h1>
        <p class="metier">${e(c.metier)}</p>
        <p class="accroche">${e(c.accroche)}</p>
        <ul class="coordonnees">
          <li>${icone("lieu")}${e(c.lieu)}</li>
          <li>${icone("linkedin")}<a href="https://www.linkedin.com/in/alliiissonnee">linkedin.com/in/alliiissonnee</a></li>
          <li>${icone("github")}<a href="https://github.com/Alliiissonnee">github.com/Alliiissonnee</a></li>
        </ul>
      </div>
    </header>

    <div class="corps">
      <div class="colonne">
        <section>
          ${titre(c.titres.experiences)}
          <ul class="parcours">
            ${c.experiences.map((x) => `<li>
              <p class="quand"><strong>${e(x.quand)}</strong>${x.ou.map((o) => `<span>${e(o)}</span>`).join("")}</p>
              <div><h3 class="poste">${e(x.poste)}</h3>${liste(x.puces, "puces")}</div>
            </li>`).join("\n            ")}
          </ul>
        </section>
        <section>
          ${titre(c.titres.formations)}
          <ul class="parcours">
            ${c.formations.map((x) => `<li>
              <p class="quand"><strong>${e(x.quand)}</strong><span>${e(x.ou)}</span></p>
              <p>${e(x.texte)}</p>
            </li>`).join("\n            ")}
          </ul>
        </section>
      </div>

      <aside class="colonne">
        <section>${titre(c.titres.competences)}${liste(c.competences, "puces")}</section>
        <section>
          ${titre(c.titres.technique)}
          ${c.groupes.map((g, i) => `<h3 class="groupe">${e(g)}</h3>${liste(TECHNO[i], "etiquettes")}`).join("\n          ")}
        </section>
        <section>${titre(c.titres.atouts)}${liste(c.atouts, "tirets")}</section>
        <section>${titre(c.titres.divers)}${liste(c.divers, "tirets")}</section>
        <section>${titre(c.titres.interets)}${liste(c.interets, "tirets")}</section>
      </aside>
    </div>
  </main>
</body>
</html>
`;
}

for (const [langue, c] of Object.entries(CV)) {
  fs.writeFileSync(path.join(__dirname, c.fichier), page(langue, c));
  console.log("écrit", c.fichier);
}
