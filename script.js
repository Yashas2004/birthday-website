function goNext() {
  const name = document.getElementById("nameInput").value;
  if (!name) {
    alert("Please enter your name 💕");
    return;
  }
  localStorage.setItem("birthdayName", name);
  window.location.href = "wish.html";
}

if (document.getElementById("wishText")) {
  const name = localStorage.getItem("birthdayName");
  document.getElementById("wishText").innerText =
    `🎂 Happiest Birthday, ${name}! 🎉`;
}
