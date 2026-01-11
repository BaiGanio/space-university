// Това автоматично скрива/показва UI елементи.

auth.onAuthStateChanged(user => {
  console.log("Auth state:", user);

  const loggedIn = document.querySelectorAll(".requires-auth");
  const guestOnly = document.querySelectorAll(".guest-only");

  if (user) {
    loggedIn.forEach(el => el.style.display = "block");
    guestOnly.forEach(el => el.style.display = "none");
    loadGalaxies();
  } else {
    loggedIn.forEach(el => el.style.display = "none");
    guestOnly.forEach(el => el.style.display = "block");
  }
});
