// Typing effect for "Ronogamy." with persistent, shorter blinking cursor
const text = "Ronogamy.";
const typingElement = document.getElementById("typing");
let idx = 0;
function typeWriter() {
  if (idx <= text.length) {
    typingElement.innerHTML =
      `<span style="display:inline;">${text.slice(0, idx)}<span class="cursor"></span></span>`;
    idx++;
    setTimeout(typeWriter, 110);
  } else {
    typingElement.innerHTML =
      `<span style="display:inline;">${text}<span class="cursor"></span></span>`;
  }
}
typeWriter();