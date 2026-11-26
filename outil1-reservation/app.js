(function () {
  "use strict";
  var C = window.CONFIG;
  if (!C) { document.body.innerHTML = "<p style='padding:20px;text-align:center'>Configuration manquante. Vérifiez config.js.</p>"; return; }
  var T = C.textes;
  var state = { step: 1, service: null, date: null, heure: null, nom: "", cat: null };
  var app = document.getElementById("app");

  var today = new Date(); today.setHours(0,0,0,0);
  var maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + C.jours_anticipation_max);

  function nextOpenDay(from){
    var d = new Date(from);
    for (var i = 0; i <= C.jours_anticipation_max; i++){
      if (dayOpen(d)) return d;
      d.setDate(d.getDate() + 1);
    }
    return from;
  }

  function pad(n){ return n < 10 ? "0" + n : "" + n; }
  function dayKey(d){ return ["sun","mon","tue","wed","thu","fri","sat"][d.getDay()]; }
  function dayOpen(d){
    var j = C.jours.find(function(x){ return x.key === dayKey(d); });
    return j ? j.ouvert : false;
  }
  function isPast(dateStr, heure){
    var p = dateStr.split("-").map(Number);
    var h = heure.split(":").map(Number);
    return new Date(p[0], p[1]-1, p[2], h[0], h[1]) <= new Date();
  }
  function fmtDate(d){
    var months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
    var fallback = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    var j = C.jours.find(function(x){ return x.key === dayKey(d); });
    var label = j ? j.label : fallback[d.getDay()];
    return label + " " + d.getDate() + " " + months[d.getMonth()];
  }
  function fmtMoney(n){
    if (C.devise === "FCFA") return n.toLocaleString("fr-FR") + " F";
    return n.toLocaleString("fr-FR") + " " + C.devise;
  }
  function ymd(d){ return d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate()); }
  function toast(msg){
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add("show"); });
    setTimeout(function(){ t.classList.remove("show"); setTimeout(function(){ t.remove(); }, 300); }, 2600);
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  }); }
  function header(){
    var pct = (state.step / 5) * 100;
    return '<header class="top"><img class="logo" src="assets/logo.svg" width="56" height="56" alt=""><h1>' + esc(C.nom) + '</h1><p>' + esc(C.slogan) + '</p>' +
      '<div class="progress" role="progressbar" aria-valuenow="' + Math.round(pct) + '" aria-valuemin="0" aria-valuemax="100">' +
      '<span style="width:' + pct + '%"></span></div></header>';
  }
  function render(){
    app.innerHTML = header() + '<main class="steps" id="step"></main>';
    var el = document.getElementById("step");
    if (state.step === 1) stepService(el);
    else if (state.step === 2) stepDate(el);
    else if (state.step === 3) stepHeure(el);
    else if (state.step === 4) stepNom(el);
    else stepRecap(el);
    window.scrollTo(0,0);
  }

  function stepService(el){
    var cats = ["Tout"];
    C.services.forEach(function(s){ if (cats.indexOf(s.categorie) === -1) cats.push(s.categorie); });
    var activeCat = state.cat || "Tout";
    state.cat = activeCat;

    var h = '<h2 class="q">' + T.etape_service + '</h2>';
    h += '<p class="hint">' + (T.hint_service || "") + '</p>';
    h += '<div class="cat-tabs">';
    cats.forEach(function(c){
      h += '<button data-cat="' + esc(c) + '"' + (c === activeCat ? ' class="active"' : '') + '>' + esc(c) + '</button>';
    });
    h += '</div>';
    h += '<div class="grid svc" id="svc-grid">';
    var filtered = activeCat === "Tout" ? C.services : C.services.filter(function(s){ return s.categorie === activeCat; });
    filtered.forEach(function(s){
      h += '<div class="svc-card" data-svc="' + esc(s.id) + '">' +
           '<img src="' + esc(s.image) + '" alt="' + esc(s.nom) + '" loading="lazy">' +
           '<div class="info"><p class="name">' + esc(s.nom) + '</p><p class="price">' + fmtMoney(s.prix) + '</p></div></div>';
    });
    h += '</div>';
    el.innerHTML = h;

    el.querySelectorAll("[data-cat]").forEach(function(b){
      b.addEventListener("click", function(){
        state.cat = b.dataset.cat;
        stepService(el);
      });
    });
    el.querySelectorAll("[data-svc]").forEach(function(card){
      card.addEventListener("click", function(){
        el.querySelectorAll("[data-svc]").forEach(function(x){ x.classList.remove("selected"); });
        card.classList.add("selected");
        state.service = C.services.find(function(s){ return s.id === card.dataset.svc; });
        setTimeout(function(){ state.step = 2; render(); }, 180);
      });
    });
  }

  function stepDate(el){
    var h = '<h2 class="q">' + T.etape_date + '</h2>';
    h += '<p class="hint">Choisissez votre date de rendez-vous.</p>';
    h += '<div class="card" style="padding:8px"><input type="date" id="d" min="' +
      ymd(today) + '" max="' + ymd(maxDate) + '" value="' + (state.date || ymd(nextOpenDay(today))) + '"></div>';
    h += '<div class="footer-nav"><button class="btn ghost" id="back">' + T.btn_retour + '</button>' +
      '<button class="btn primary" id="next">' + T.btn_suivant + '</button></div>';
    el.innerHTML = h;
    var inp = document.getElementById("d");
    var next = document.getElementById("next");
    function check(){
      var d = new Date(inp.value + "T12:00:00");
      next.disabled = !dayOpen(d);
    }
    inp.addEventListener("change", function(){
      var d = new Date(inp.value + "T12:00:00");
      if (!dayOpen(d)) { toast(T.msg_ferme); return; }
      state.date = inp.value;
      state.step = 3; render();
    });
    document.getElementById("back").addEventListener("click", function(){ state.date = inp.value; state.step = 1; render(); });
    next.addEventListener("click", function(){
      var d = new Date(inp.value + "T12:00:00");
      if (!dayOpen(d)) { toast(T.msg_ferme); return; }
      state.date = inp.value; state.step = 3; render();
    });
    check();
  }

  function stepHeure(el){
    var h = '<h2 class="q">' + T.etape_heure + '</h2>';
    h += '<p class="hint">Choisissez l\'heure de votre rendez-vous.</p>';
    var allPast = true;
    h += '<div class="grid cols-2">';
    C.creneaux.forEach(function(cr){
      var past = isPast(state.date, cr);
      if (!past) allPast = false;
      h += '<button class="btn" data-h="' + cr + '"' + (past ? " disabled" : "") + '>' + cr + '</button>';
    });
    h += '</div>';
    if (allPast) {
      h += '<p class="hint" style="text-align:center;margin-top:12px">Tous les créneaux de ce jour sont passés. Choisissez un autre jour.</p>';
    }
    h += '<div class="footer-nav"><button class="btn ghost" id="back">' + T.btn_retour + '</button></div>';
    el.innerHTML = h;
    el.querySelectorAll("[data-h]").forEach(function(b){
      if (b.disabled) return;
      b.addEventListener("click", function(){
        if (isPast(state.date, b.dataset.h)) { toast(T.msg_passe); return; }
        b.classList.add("selected");
        state.heure = b.dataset.h;
        setTimeout(function(){ state.step = 4; render(); }, 180);
      });
    });
    document.getElementById("back").addEventListener("click", function(){ state.step = 2; render(); });
  }

  function stepNom(el){
    var h = '<h2 class="q">' + T.etape_nom + '</h2><p class="hint">Pour que le salon sache qui vient.</p>';
    h += '<div class="card"><div class="field"><label>Nom complet</label>' +
      '<input type="text" id="nom" autocomplete="name" placeholder="' + esc(T.champ_nom_placeholder) + '"></div></div>';
    h += '<div class="footer-nav"><button class="btn ghost" id="back">' + T.btn_retour + '</button>' +
      '<button class="btn primary" id="next">' + T.btn_suivant + '</button></div>';
    el.innerHTML = h;
    var inp = document.getElementById("nom"); inp.value = state.nom;
    document.getElementById("back").addEventListener("click", function(){ state.nom = inp.value; state.step = 3; render(); });
    document.getElementById("next").addEventListener("click", function(){
      if (!inp.value.trim()) { toast(T.msg_nom_vide); return; }
      state.nom = inp.value.trim(); state.step = 5; render();
    });
    inp.addEventListener("keydown", function(e){ if (e.key === "Enter") document.getElementById("next").click(); });
    inp.focus();
  }

  function buildMessage(){
    return T.msg_whatsapp
      .replace("{service}", state.service.nom)
      .replace("{date}", fmtDate(new Date(state.date + "T12:00:00")))
      .replace("{heure}", state.heure)
      .replace("{prix}", state.service.prix.toLocaleString("fr-FR"))
      .replace("{devise}", C.devise)
      .replace("{nom}", state.nom);
  }
  function waUrl(){
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(buildMessage());
  }

  function stepRecap(el){
    var msg = buildMessage();
    var h = '<h2 class="q">' + T.etape_recap + '</h2>';
    h += '<div class="card"><ul class="recap">' +
      '<li><span class="k">' + T.recap_service + '</span><span class="v">' + esc(state.service.nom) + '</span></li>' +
      '<li><span class="k">' + T.recap_date + '</span><span class="v">' + esc(fmtDate(new Date(state.date + "T12:00:00"))) + '</span></li>' +
      '<li><span class="k">' + T.recap_heure + '</span><span class="v">' + esc(state.heure) + '</span></li>' +
      '<li><span class="k">' + T.recap_nom + '</span><span class="v">' + esc(state.nom) + '</span></li>' +
      '</ul></div>';
    h += '<button class="btn accent" style="margin-top:12px" id="wa-btn" aria-label="Envoyer sur WhatsApp">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 1.8c2.17 0 4.21.85 5.74 2.38a8.07 8.07 0 0 1 2.38 5.73c0 4.48-3.65 8.11-8.12 8.11a8.2 8.2 0 0 1-4.14-1.13l-.3-.18-3.11.82.83-3.04-.2-.31a8.08 8.08 0 0 1-1.25-4.29c0-4.48 3.65-8.11 8.11-8.11zm-3.6 4.5c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.39 1.01 2.55.12.16 1.72 2.63 4.18 3.69.58.25 1.04.4 1.39.51.58.18 1.11.16 1.53.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.23-.16-.48-.28-.25-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.13-.16.25-.62.78-.76.94-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.42z"/></svg>' +
      T.btn_whatsapp + '</button>';
    h += '<div class="card" style="margin-top:12px"><p class="hint" style="margin:0 0 8px">' +
      esc(T.err_whatsapp.replace("{tel}", "+" + C.whatsapp)) + '</p>' +
      '<textarea class="copy-box" readonly id="msgbox">' + esc(msg) + '</textarea>' +
      '<button class="btn ghost" id="copy" style="margin-top:10px">' + T.btn_copier + '</button></div>';
    h += '<div class="footer-nav"><button class="btn ghost" id="back">' + T.btn_retour + '</button></div>';
    el.innerHTML = h;
    document.getElementById("wa-btn").addEventListener("click", function(){
      window.location.href = waUrl();
    });
    document.getElementById("back").addEventListener("click", function(){ state.step = 4; render(); });
    document.getElementById("copy").addEventListener("click", function(){
      var box = document.getElementById("msgbox");
      box.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch(e){}
      if (!ok && navigator.clipboard) { navigator.clipboard.writeText(msg).then(function(){ toast("Message copié"); }); return; }
      toast(ok ? "Message copié" : "Sélectionnez le texte et copiez-le");
    });
  }

  render();
})();