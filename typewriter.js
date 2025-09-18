const typewriterSpan = document.getElementById('typewriter');
const cursor = typewriterSpan.querySelector('.cursor');

const texts = ["Ronogamy.", "Aditya."];
let currentTextIndex = 0;
let typing = false;

// Ensure the first child is a text node (for easier manipulation)
if (!typewriterSpan.firstChild || typewriterSpan.firstChild.nodeType !== 3) {
  typewriterSpan.insertBefore(document.createTextNode(""), cursor);
}
function typeText(text, callback) {
  let i = 0;
  typing = true;
  function type() {
    if (i <= text.length) {
      typewriterSpan.childNodes[0].nodeValue = text.slice(0, i);
      i++;
      setTimeout(type, 80);
    } else {
      typing = false;
      if (callback) callback();
    }
  }
  type();
}

function eraseText(callback) {
  let text = typewriterSpan.childNodes[0].nodeValue;
  let i = text.length;
  typing = true;
  function erase() {
    if (i >= 0) {
      typewriterSpan.childNodes[0].nodeValue = text.slice(0, i);
      i--;
      setTimeout(erase, 60);
    } else {
      typing = false;
      if (callback) callback();
    }
  }
  erase();
}

// Initial setup
typewriterSpan.childNodes[0].nodeValue = "";
typeText(texts[currentTextIndex]);

typewriterSpan.addEventListener('mouseenter', () => {
  if (typing || currentTextIndex === 1) return;
  eraseText(() => {
    currentTextIndex = 1;
    typeText(texts[currentTextIndex]);
  });
});

typewriterSpan.addEventListener('mouseleave', () => {
  if (typing || currentTextIndex === 0) return;
  eraseText(() => {
    currentTextIndex = 0;
    typeText(texts[currentTextIndex]);
  });
});