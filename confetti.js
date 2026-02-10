const colors = ["#ff4d6d", "#ffd166", "#06d6a0", "#118ab2", "#ef476f"];

function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 4000);
  }
}

/* SAFE EVENT HOOKS */
window.addEventListener("load", launchConfetti);
document.addEventListener("click", launchConfetti);
