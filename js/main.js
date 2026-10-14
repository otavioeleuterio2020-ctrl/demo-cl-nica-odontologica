// Edite aqui os dados da clínica
const CLINICA = {
  whatsapp: "5516900000000", // DDI + DDD + número, sem símbolos
  mensagem: "Olá! Gostaria de agendar uma consulta.",
  maps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Franca, SP")
};
const wa = "https://wa.me/" + CLINICA.whatsapp + "?text=" + encodeURIComponent(CLINICA.mensagem);
document.querySelectorAll("[data-wa]").forEach(a => { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
document.getElementById("map").href = CLINICA.maps;
document.getElementById("y").textContent = new Date().getFullYear();

const top = document.getElementById("top"), burger = document.querySelector(".burger"), nav = document.getElementById("nav");
const onScroll = () => top.classList.toggle("solid", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

const els = document.querySelectorAll(".sec h2, .treat li, .diffs > div, .gallery figure, .media");
els.forEach(el => el.classList.add("rv"));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }), { threshold: .15 });
els.forEach(el => io.observe(el));
