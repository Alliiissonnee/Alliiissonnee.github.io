// ==========================================================
// Mode sombre : appliqué avant l'affichage pour éviter un flash blanc.
// Chargé dans le <head> sans "defer" pour cette raison.
// ==========================================================
try {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") {
    document.documentElement.dataset.theme = theme;
  }
} catch {
  // localStorage indisponible : on suit simplement le réglage de l'appareil
}
