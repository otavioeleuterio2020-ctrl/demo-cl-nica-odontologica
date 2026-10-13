/* ===== EDITE AQUI: dados reais da clínica =====
   Deixe vazio o que ainda não foi confirmado: a seção correspondente se ajusta sozinha. */
const CLINICA = {
  nome: "Clínica Odontológica",
  whatsapp: "",            // só dígitos com DDI+DDD, ex.: "5516999999999"
  telefone: "",            // ex.: "+55 16 3333-0000"
  endereco: "",            // endereço completo (ativa o mapa)
  horarios: [],            // ex.: ["Seg a Sex: 8h às 18h"]
  instagram: "",           // URL completa
  mensagemInicial: "Olá! Gostaria de agendar uma consulta.",
  /* Serviços: mantenha apenas os que a clínica realmente oferece. */
  servicos: [
    { t: "Avaliação e diagnóstico", d: "Exame clínico e radiográfico para entender a sua saúde bucal e definir o plano.", img: "radiografia" },
    { t: "Prevenção e cuidados de rotina", d: "Limpeza, orientação de higiene e retornos periódicos.", img: "bandeja" },
    { t: "Estética do sorriso", d: "Tratamentos para harmonizar o sorriso, sempre com avaliação individual.", img: "procedimento" }
  ],
  /* Equipe: preencha para exibir a seção. Ex.: { nome:"Dra. Nome", cargo:"Cirurgiã-dentista", cro:"CRO-SP 00000", foto:"img/dra.jpg", bio:"..." } */
  equipe: []
};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const wa = (txt = CLINICA.mensagemInicial) => CLINICA.whatsapp ? `https://wa.me/${CLINICA.whatsapp}?text=${encodeURIComponent(txt)}` : "#contato";
$$("[data-c=nome]").forEach(e => e.textContent = CLINICA.nome);
$$("[data-wa]").forEach(a => { a.href = wa(); if (CLINICA.whatsapp) { a.target = "_blank"; a.rel = "noopener"; } });
$$("[data-tel]").forEach(a => CLINICA.telefone ? a.href = "tel:" + CLINICA.telefone.replace(/[^\d+]/g, "") : a.hidden = true);
$("#ano").textContent = new Date().getFullYear();

$("#servicos").innerHTML = CLINICA.servicos.map(s => `<a class="card" data-wa href="${wa('Olá! Gostaria de saber mais sobre: ' + s.t)}" ${CLINICA.whatsapp ? 'target="_blank" rel="noopener"' : ''}><img loading="lazy" src="img/${s.img}.jpg" alt=""><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><span>Solicitar informações</span></div></a>`).join("");

if (CLINICA.equipe.length) {
  $$("[data-team]").forEach(e => e.hidden = false);
  $("#equipeLista").innerHTML = CLINICA.equipe.map(p => `<article><img loading="lazy" src="${esc(p.foto)}" alt="${esc(p.nome)}"><h3>${esc(p.nome)}</h3><p>${esc([p.cargo, p.cro].filter(Boolean).join(" · "))}</p>${p.bio ? `<p>${esc(p.bio)}</p>` : ""}</article>`).join("");
}

const fotos = [["consultorio", "Consultório com cadeira azul e painel de radiografia"], ["bandeja", "Instrumentais sobre a bandeja de atendimento"], ["microscopio", "Sala com microscópio clínico e monitor"], ["radiografia", "Radiografia panorâmica exibida em tablet"], ["consultorio-escuro", "Equipamento odontológico em ambiente de luz suave"], ["procedimento", "Detalhe em preto e branco de um atendimento"]];
$("#gal").innerHTML = fotos.map(([f, a]) => `<button type="button" data-f="${f}" data-a="${esc(a)}"><img loading="lazy" src="img/${f}.jpg" alt="${esc(a)}"></button>`).join("");
const lb = $("#lb");
$("#gal").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $("img", lb).src = `img/${b.dataset.f}.jpg`; $("img", lb).alt = b.dataset.a; lb.showModal(); });
lb.addEventListener("click", e => { if (e.target !== $("img", lb)) lb.close(); });

/* local */
$("#end").textContent = CLINICA.endereco || "Endereço em breve.";
$("#info").innerHTML = [...CLINICA.horarios.map(h => `<li>${esc(h)}</li>`),
  CLINICA.telefone ? `<li><a href="tel:${CLINICA.telefone.replace(/[^\d+]/g, "")}">${esc(CLINICA.telefone)}</a></li>` : "",
  CLINICA.whatsapp ? `<li><a href="${wa()}" target="_blank" rel="noopener">WhatsApp</a></li>` : ""].join("");
if (CLINICA.endereco) {
  const q = encodeURIComponent(CLINICA.endereco);
  $("#maps").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  $("#mapa").innerHTML = `<iframe loading="lazy" title="Mapa da clínica" src="https://maps.google.com/maps?q=${q}&output=embed"></iframe>`;
} else { $("#maps").hidden = true; $("#mapa").textContent = "O mapa aparece aqui quando o endereço for informado."; }
if (CLINICA.instagram) $("#redes").innerHTML = `<a href="${esc(CLINICA.instagram)}" target="_blank" rel="noopener">Instagram</a>`;

/* formulário -> WhatsApp (sem armazenar dados) */
const f = $("#form"), st = $(".status", f);
f.addEventListener("submit", e => {
  e.preventDefault(); const d = new FormData(f); let ok = true;
  ["nome", "tel"].forEach(n => { const i = f.elements[n], bad = !i.value.trim() || (n === "tel" && i.value.replace(/\D/g, "").length < 10); i.setAttribute("aria-invalid", bad); if (bad) ok = false; });
  st.className = "status";
  if (!ok) { st.classList.add("err"); st.textContent = "Preencha seu nome e um telefone com DDD."; return; }
  if (!CLINICA.whatsapp) { st.classList.add("err"); st.textContent = "O WhatsApp da clínica ainda não foi configurado."; return; }
  const m = `Olá! Meu nome é ${d.get("nome")}. ${d.get("msg") || CLINICA.mensagemInicial} Meu telefone: ${d.get("tel")}.`;
  window.open(wa(m), "_blank", "noopener"); st.textContent = "Abrimos o WhatsApp com a sua mensagem. Basta enviar.";
});

/* menu e cabeçalho */
const hdr = $("#topo"), nav = $("#menu"), bg = $(".burger");
const sc = () => hdr.classList.toggle("solid", scrollY > 40); sc(); addEventListener("scroll", sc, { passive: true });
bg.addEventListener("click", () => { const o = nav.classList.toggle("open"); bg.setAttribute("aria-expanded", o); bg.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu"); });
nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); bg.setAttribute("aria-expanded", false); } });

/* revelação sutil, só nas seções */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12 });
  $$(".head,.copy,.tall,.trio,.contact,.gal,.map").forEach(el => { el.classList.add("rv"); io.observe(el); });
}
