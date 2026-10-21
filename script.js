/* =====================================================
   CONFIGURAÇÃO: edite SOMENTE esta parte
   ===================================================== */
const CONFIG = {
  whatsapp: "5577999999999",          // seu número: 55 + DDD + número, só dígitos
  email: "contato@seudominio.com.br", // seu e-mail
  mensagemTeste: "Olá! Quero fazer um teste da MIPTV.",

  // Preços de exemplo: troque pelos seus valores reais
  periodos: [
    { id: "m",  nome: "Mensal",     sufixo: "/mês" },
    { id: "t",  nome: "Trimestral", sufixo: "/3 meses" },
    { id: "a",  nome: "Anual",      sufixo: "/ano" }
  ],
  planos: [
    { nome: "Básico",   preco: { m: "29,90", t: "79,90",  a: "289,90" }, destaque: false,
      itens: ["1 tela", "Qualidade HD", "Filmes e séries", "Suporte por WhatsApp"] },
    { nome: "Premium",  preco: { m: "39,90", t: "109,90", a: "389,90" }, destaque: true,
      itens: ["2 telas", "Full HD e 4K", "Todos os canais", "Filmes e séries", "Suporte prioritário"] },
    { nome: "Família",  preco: { m: "59,90", t: "169,90", a: "589,90" }, destaque: false,
      itens: ["3 telas", "Full HD e 4K", "Todos os canais", "Filmes e séries", "Suporte prioritário"] }
  ],

  /* DEPOIMENTOS: coloque aqui SOMENTE avaliações reais de clientes
     (com autorização deles). Enquanto estiver vazio, o site mostra
     um convite para avaliar. Modelo:
     { nome: "Nome do cliente", cidade: "Cidade", nota: 5, texto: "Texto que o cliente escreveu" }
  */
  depoimentos: [],

  faq: [
    ["Como funciona o teste?", "Você chama a gente no WhatsApp, informa seu aparelho e liberamos um acesso de teste para você avaliar a qualidade."],
    ["Em quais aparelhos funciona?", "Smart TVs, celulares Android e iPhone, tablets, TV Box, Fire Stick e computadores."],
    ["Preciso de internet rápida?", "Recomendamos pelo menos 15 Mbps para HD e 25 Mbps ou mais para 4K."],
    ["Quanto tempo leva para ativar?", "Normalmente poucos minutos após a confirmação do pagamento."],
    ["Quais formas de pagamento?", "Aceitamos Pix e as demais formas informadas no atendimento."],
    ["E se eu tiver problemas?", "Nosso suporte é feito pelo WhatsApp e ajuda com instalação, configuração e dúvidas."]
  ]
};
/* ===================================================== */

const $ = s => document.querySelector(s);
const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

// Links de WhatsApp
document.querySelectorAll(".js-wa").forEach(a => a.href = waLink(CONFIG.mensagemTeste));
$("#yr").textContent = new Date().getFullYear();
$("#mail").textContent = CONFIG.email;

// Menu mobile
$("#burger").onclick = () => $("#menu").classList.toggle("open");
document.querySelectorAll("#menu a").forEach(a => a.addEventListener("click", () => $("#menu").classList.remove("open")));

// Abas de conteúdo
document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
  document.querySelectorAll(".tab,.cat").forEach(e => e.classList.remove("on"));
  t.classList.add("on");
  document.getElementById(t.dataset.c).classList.add("on");
});

// Planos
let periodo = "m";
function renderPlans(){
  $("#toggle").innerHTML = CONFIG.periodos.map(p => `<button class="${p.id===periodo?"on":""}" data-p="${p.id}">${p.nome}</button>`).join("");
  const suf = CONFIG.periodos.find(p => p.id===periodo).sufixo;
  $("#plans").innerHTML = CONFIG.planos.map(pl => `
    <div class="plan ${pl.destaque?"hot":""}">
      ${pl.destaque?'<span class="tag">MAIS ESCOLHIDO</span>':""}
      <h3>${pl.nome}</h3>
      <div class="price">R$ ${pl.preco[periodo]} <small>${suf}</small></div>
      <ul>${pl.itens.map(i=>`<li>${i}</li>`).join("")}</ul>
      <a class="btn ${pl.destaque?"btn-p":"btn-o"}" target="_blank" rel="noopener" href="${waLink(`Olá! Tenho interesse no plano ${pl.nome} (${CONFIG.periodos.find(p=>p.id===periodo).nome}) da MIPTV.`)}">Assinar ${pl.nome}</a>
    </div>`).join("");
  document.querySelectorAll("#toggle button").forEach(b => b.onclick = () => { periodo = b.dataset.p; renderPlans(); });
}
renderPlans();

// Depoimentos (somente os cadastrados em CONFIG.depoimentos)
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const starsOf = n => "★".repeat(n) + "☆".repeat(5-n);
(function renderReviews(){
  const d = CONFIG.depoimentos;
  if(!d.length){
    $("#reviews").innerHTML = `<div class="empty">Ainda não há avaliações publicadas.<br>Seja o primeiro cliente a avaliar a MIPTV usando o formulário abaixo.</div>`;
    return;
  }
  const avg = (d.reduce((a,r)=>a+r.nota,0)/d.length).toFixed(1);
  $("#revHead").innerHTML = `<span class="stars">${starsOf(Math.round(avg))}</span><b style="color:#fff">${avg}</b> · ${d.length} avaliações`;
  $("#reviews").innerHTML = d.map(r => `
    <div class="rev reveal">
      <div class="stars">${starsOf(r.nota)}</div>
      <p>“${esc(r.texto)}”</p>
      <div class="who"><div class="av">${esc(r.nome[0]).toUpperCase()}</div><div><b>${esc(r.nome)}</b><br><small>${esc(r.cidade||"")}</small></div></div>
    </div>`).join("");
})();

// Formulário de avaliação -> WhatsApp
let nota = 0;
const stars = document.querySelectorAll("#rate span");
stars.forEach(s => {
  s.onclick = () => { nota = +s.dataset.v; stars.forEach(x => x.classList.toggle("on", +x.dataset.v <= nota)); };
});
$("#revForm").onsubmit = e => {
  e.preventDefault();
  if(!nota){ alert("Escolha uma nota de 1 a 5 estrelas."); return; }
  const msg = `Avaliação MIPTV\nNome: ${$("#rName").value}\nCidade: ${$("#rCity").value||"-"}\nNota: ${nota}/5\nComentário: ${$("#rText").value}\n\nAutorizo a publicação no site.`;
  window.open(waLink(msg), "_blank");
  e.target.reset(); nota = 0; stars.forEach(x => x.classList.remove("on"));
};

// FAQ
$("#faqList").innerHTML = CONFIG.faq.map(([q,a]) => `<div class="q"><button>${q}</button><div>${a}</div></div>`).join("");
document.querySelectorAll(".q button").forEach(b => b.onclick = () => b.parentElement.classList.toggle("open"));

// Animações de entrada e contadores
const io = new IntersectionObserver(es => es.forEach(en => {
  if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
}), {threshold:.15});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

const cio = new IntersectionObserver(es => es.forEach(en => {
  if(!en.isIntersecting) return;
  const el = en.target, raw = el.dataset.n, plus = raw.startsWith("+"), end = parseFloat(raw), suf = el.dataset.s || "";
  const dec = String(end).includes(".") ? 1 : 0; let t0;
  const tick = t => { t0 = t0 || t; const p = Math.min((t-t0)/1400,1);
    el.textContent = (plus?"+":"") + (end*p).toFixed(dec).replace(".",",") + suf;
    if(p<1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick); cio.unobserve(el);
}), {threshold:.5});
document.querySelectorAll("[data-n]").forEach(el => cio.observe(el));
