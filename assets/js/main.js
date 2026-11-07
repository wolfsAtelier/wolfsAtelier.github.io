"use strict";

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* Animaciones de la portada y sus tarjetas. */
const animationGroups = [
  [".hero-content", "from-left"],
  ["#acerca", "from-right"],
  ["#perfil .profile", "blinds"],
  ["#software .card", "flip"],
  ["#proyectos .card", "from-top"],
  ["#tutoriales .card", "tutorial-slide"],
];

const revealItems = [];

animationGroups.forEach(([selector, animation]) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.classList.add("reveal", animation);
    revealItems.push(element);
  });
});

if (!reduceMotion && "IntersectionObserver" in window && revealItems.length) {
  document.documentElement.classList.add("js-motion");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px",
    },
  );

  revealItems.forEach((element) => revealObserver.observe(element));
}

/* Numeración de líneas y botón para copiar cada bloque de código. */
document.querySelectorAll("pre code").forEach((code) => {
  const originalCode = code.textContent.replace(/\n$/, "");
  const lines = originalCode.split("\n");
  const fragment = document.createDocumentFragment();

  lines.forEach((line, index) => {
    const lineElement = document.createElement("span");
    lineElement.className = "code-line";
    lineElement.dataset.line = String(index + 1);
    lineElement.textContent = line || " ";
    fragment.appendChild(lineElement);
  });

  code.replaceChildren(fragment);

  const pre = code.parentElement;
  if (!pre || pre.querySelector(".copy-button")) return;

  const button = document.createElement("button");
  button.className = "copy-button";
  button.type = "button";
  button.textContent = "Copiar";
  button.setAttribute("aria-label", "Copiar código");

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(originalCode);
      button.textContent = "¡Copiado!";
    } catch {
      button.textContent = "No se pudo copiar";
    }

    window.setTimeout(() => {
      button.textContent = "Copiar";
    }, 1800);
  });

  pre.appendChild(button);
});
