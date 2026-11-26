(function () {
  "use strict";

  var KEY = "creances-v1";
  var CFG = window.CONFIG || {};
  var DEV = CFG.devise || "FCFA";

  function load(){
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return demo();
      var d = JSON.parse(raw);
      if (!d || !Array.isArray(d.clients)) return { version: 1, clients: [] };
      return d;
    } catch(e){ return { version: 1, clients: [] }; }
  }
  function demo(){
    if (!Array.isArray(CFG.demo) || !CFG.demo.length) return { version: 1, clients: [] };
    function jour(n){ var d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + n); return ymd(d); }
    var d = { version: 1, clients: CFG.demo.map(function(x, i){
      var paye = (x.paiements || []).reduce(function(s, p){ return s + p.montant; }, 0);
      var reste = Math.max(0, x.montant - paye);
      return {
        id: "demo" + i, nom: x.nom, montant: x.montant, echeance: jour(x.echeance),
        telephone: x.telephone || "", motif: x.motif || "", reste: reste,
        statut: reste <= 0 ? "paye" : paye > 0 ? "partiel" : "du",
        historique: (x.paiements || []).map(function(p){ return { date: jour(p.jour), type: "paiement", montant: p.montant }; })
      };
    }) };
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e){}
    return d;
  }
  function save(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

  function todayYMD(){
    var d = new Date(); d.setHours(0,0,0,0);
    return ymd(d);
  }
  function ymd(d){
    function p(n){ return n < 10 ? "0"+n : ""+n; }
    return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate());
  }
  function parseYMD(s){
    if (!s) return null;
    var p = s.split("-").map(Number);
    return new Date(p[0], p[1]-1, p[2]);
  }
  function fmtDate(s){
    var d = parseYMD(s); if (!d) return "";
    return d.getDate() + " " + ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][d.getMonth()];
  }
  function fmt(n){ return n.toLocaleString("fr-FR") + " " + DEV; }
  function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  }); }

  var db = load();
  var currentId = null;
  var sortMode = "date";
  var searchQuery = "";

  var $ = function(id){ return document.getElementById(id); };
  var els = {
    list: $("list"), empty: $("empty"), total: $("total-value"), totalCount: $("total-count"),
    sheetForm: $("sheet-form"), sheetDetail: $("sheet-detail"), sheetPart: $("sheet-part"),
    sheetEdit: $("sheet-edit"), toast: $("toast"), search: $("search")
  };

  var shown = null;
  function countTo(el, end){
    var start = shown === null ? 0 : shown;
    shown = end;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || start === end) { el.textContent = fmt(end); return; }
    var t0 = performance.now(), dur = 1000;
    (function tick(now){
      var p = Math.min((now - t0) / dur, 1), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = fmt(Math.round(start + (end - start) * e));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function toast(msg){
    els.toast.textContent = msg; els.toast.classList.add("show");
    setTimeout(function(){ els.toast.classList.remove("show"); }, 2400);
  }

  function totalDu(){
    return db.clients.reduce(function(s, c){ return s + (c.reste || 0); }, 0);
  }
  function totalPaye(){
    return db.clients.reduce(function(s, c){ return s + ((c.montant || 0) - (c.reste || 0)); }, 0);
  }
  function stats(c){
    var today = parseYMD(todayYMD());
    var ech = parseYMD(c.echeance);
    var late = ech && ech < today && c.reste > 0;
    var soon = ech && (ech - today) <= 3*86400000 && (ech - today) >= 0 && c.reste > 0;
    return { late: late, soon: soon };
  }
  function badge(c){
    if (c.reste <= 0) return { cls: "paye", txt: "Payé" };
    var s = stats(c);
    if (s.late) return { cls: "retard", txt: "En retard" };
    if (c.statut === "partiel") return { cls: "partiel", txt: "Partiel" };
    if (s.soon) return { cls: "du", txt: "Bientôt" };
    return { cls: "du", txt: "Dû" };
  }

  function filteredClients(){
    var list = db.clients.slice();
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      list = list.filter(function(c){
        return c.nom.toLowerCase().indexOf(q) !== -1 ||
               (c.motif || "").toLowerCase().indexOf(q) !== -1;
      });
    }
    list.sort(function(a, b){
      if (a.reste <= 0 && b.reste > 0) return 1;
      if (b.reste <= 0 && a.reste > 0) return -1;
      if (sortMode === "nom") return a.nom.localeCompare(b.nom);
      if (sortMode === "montant") return b.reste - a.reste;
      return (a.echeance || "").localeCompare(b.echeance || "");
    });
    return list;
  }

  function render(){
    countTo(els.total, totalDu());
    var retard = db.clients.reduce(function(s, c){ return s + (stats(c).late ? c.reste : 0); }, 0);
    $("kpi-retard").textContent = fmt(retard);
    $("kpi-paye").textContent = fmt(totalPaye());
    if (els.totalCount) {
      var n = db.clients.length;
      els.totalCount.textContent = n === 0 ? "" : (n + " créance" + (n > 1 ? "s" : ""));
    }
    els.list.innerHTML = "";
    var sorted = filteredClients();
    els.empty.hidden = sorted.length > 0 || db.clients.length > 0;
    if (db.clients.length === 0) els.empty.hidden = false;
    if (sorted.length === 0 && db.clients.length > 0) {
      els.empty.hidden = false;
      els.empty.querySelector("p").textContent = "Aucun résultat";
    } else if (db.clients.length === 0) {
      els.empty.querySelector("p").textContent = "Aucune créance pour le moment";
    }

    sorted.forEach(function(c, i){
      var li = document.createElement("li");
      li.style.setProperty("--n", i);
      var b = badge(c);
      var s = stats(c);
      li.className = "item" + (s.late ? " overdue" : "");
      li.innerHTML =
        '<div class="av ' + b.cls + '" aria-hidden="true">' + esc(c.nom.trim().charAt(0).toUpperCase()) + '</div>' +
        '<div class="left"><div class="name">' + esc(c.nom) + '</div>' +
        '<div class="meta">' + (c.motif ? esc(c.motif) + ", " : "") + 'pour le ' + fmtDate(c.echeance) + '</div></div>' +
        '<div class="right"><div class="reste">' + fmt(c.reste) + '</div>' +
        '<span class="badge ' + b.cls + '">' + b.txt + '</span></div>';
      li.addEventListener("click", function(){ openDetail(c.id); });
      els.list.appendChild(li);
    });
  }

  function openForm(){
    $("form").reset();
    $("f-echeance").value = todayYMD();
    show(els.sheetForm);
    $("f-nom").focus();
  }
  function closeForm(){ hide(els.sheetForm); }

  $("form").addEventListener("submit", function(e){
    e.preventDefault();
    var nom = $("f-nom").value.trim();
    var montant = parseInt($("f-montant").value, 10);
    var echeance = $("f-echeance").value;
    if (!nom || !montant || montant <= 0 || !echeance) { toast("Remplissez les champs obligatoires"); return; }
    var c = {
      id: uid(), nom: nom, montant: montant, echeance: echeance,
      telephone: $("f-tel").value.trim(), motif: $("f-motif").value.trim(),
      reste: montant, statut: "du",
      historique: []
    };
    db.clients.push(c); save(db);
    closeForm(); render();
    toast("Créance ajoutée");
  });

  function openDetail(id){
    currentId = id;
    var c = db.clients.find(function(x){ return x.id === id; });
    if (!c) return;
    $("d-titre").textContent = c.nom;
    $("d-montant").textContent = fmt(c.montant);
    $("d-reste").textContent = fmt(c.reste);
    var paye = (c.montant || 0) - (c.reste || 0);
    $("d-paye").textContent = fmt(paye);
    $("d-echeance").textContent = fmtDate(c.echeance);
    $("d-motif").textContent = c.motif || "—";
    $("d-tel").textContent = c.telephone || "—";
    var b = badge(c);
    $("d-statut").textContent = b.txt;

    var h = $("d-histo"); h.innerHTML = "";
    if (!c.historique || c.historique.length === 0) {
      h.innerHTML = '<li><span>Aucun mouvement</span></li>';
    } else {
      c.historique.forEach(function(m){
        var li = document.createElement("li");
        var txt = m.type === "paiement" ? ("Paiement " + fmt(m.montant)) : "Relance WhatsApp";
        li.innerHTML = '<span>' + esc(txt) + '</span><span class="tag">' + fmtDate(m.date) + '</span>';
        h.appendChild(li);
      });
    }

    var pay = $("d-pay"), part = $("d-part"), rel = $("d-relance");
    pay.disabled = (c.reste <= 0);
    part.disabled = (c.reste <= 0);
    if (!c.telephone) {
      rel.disabled = true;
      rel.title = "Ajoutez un téléphone pour relancer";
      $("d-relance").innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2z"/></svg> Téléphone manquant';
    } else {
      rel.disabled = false;
      rel.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2z"/></svg> Relancer';
    }
    show(els.sheetDetail);
  }
  function closeDetail(){ hide(els.sheetDetail); currentId = null; }

  $("d-pay").addEventListener("click", function(){
    var c = db.clients.find(function(x){ return x.id === currentId; }); if (!c) return;
    if (!confirm("Marquer cette créance comme entièrement payée ?")) return;
    var paid = c.reste;
    c.reste = 0; c.statut = "paye";
    c.historique.push({ date: todayYMD(), type: "paiement", montant: paid });
    save(db); render(); openDetail(c.id);
    toast("Créance soldée");
  });

  $("d-part").addEventListener("click", function(){
    var c = db.clients.find(function(x){ return x.id === currentId; }); if (!c) return;
    $("p-reste").textContent = "Reste à payer : " + fmt(c.reste);
    $("p-montant").value = "";
    $("p-montant").max = c.reste;
    show(els.sheetPart);
    $("p-montant").focus();
  });

  $("form-part").addEventListener("submit", function(e){
    e.preventDefault();
    var c = db.clients.find(function(x){ return x.id === currentId; }); if (!c) return;
    var m = parseInt($("p-montant").value, 10);
    if (!m || m <= 0) { toast("Montant invalide"); return; }
    if (m > c.reste) m = c.reste;
    c.reste -= m;
    if (c.reste <= 0) { c.reste = 0; c.statut = "paye"; }
    else { c.statut = "partiel"; }
    c.historique.push({ date: todayYMD(), type: "paiement", montant: m });
    save(db);
    hide(els.sheetPart);
    render(); openDetail(c.id);
    toast("Paiement enregistré");
  });

  $("d-relance").addEventListener("click", function(){
    var c = db.clients.find(function(x){ return x.id === currentId; }); if (!c) return;
    if (!c.telephone) { toast("Pas de téléphone enregistré"); return; }
    var paye = (c.montant || 0) - (c.reste || 0);
    var template = CFG.msgRelanceTemplate ||
      "Bonjour {prenom}, j'espère que vous allez bien !\n\nJe me permets de vous rappeler pour {motif}.\nIl reste {reste} {devise} à régler (échéance : {echeance}).\n\nN'hésitez pas à passer au salon pour régler. {suffix}";
    var msg = template
      .replace("{prenom}", c.nom.split(" ")[0])
      .replace("{nom}", c.nom)
      .replace("{motif}", c.motif || "votre créance")
      .replace("{reste}", fmt(c.reste).replace(" " + DEV, ""))
      .replace("{montant}", fmt(c.montant).replace(" " + DEV, ""))
      .replace("{paye}", fmt(paye).replace(" " + DEV, ""))
      .replace("{devise}", DEV)
      .replace("{echeance}", fmtDate(c.echeance))
      .replace("{suffix}", CFG.msgRelanceSuffix || "Merci.");
    var num = c.telephone.replace(/\D/g, "");
    var url = "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
    c.historique.push({ date: todayYMD(), type: "relance" });
    save(db);
    window.open(url, "_blank", "noopener");
    toast("Relance préparée");
  });

  // Edit
  $("d-edit").addEventListener("click", function(){
    var c = db.clients.find(function(x){ return x.id === currentId; }); if (!c) return;
    $("e-nom").value = c.nom;
    $("e-montant").value = c.montant;
    $("e-echeance").value = c.echeance;
    $("e-tel").value = c.telephone || "";
    $("e-motif").value = c.motif || "";
    show(els.sheetEdit);
  });
  $("form-edit").addEventListener("submit", function(e){
    e.preventDefault();
    var c = db.clients.find(function(x){ return x.id === currentId; }); if (!c) return;
    var nom = $("e-nom").value.trim();
    var montant = parseInt($("e-montant").value, 10);
    var echeance = $("e-echeance").value;
    if (!nom || !montant || montant <= 0 || !echeance) { toast("Remplissez les champs obligatoires"); return; }
    c.nom = nom;
    c.montant = montant;
    c.echeance = echeance;
    c.telephone = $("e-tel").value.trim();
    c.motif = $("e-motif").value.trim();
    // Recalculate reste based on payment history
    var payeTotal = (c.historique || []).filter(function(m){ return m.type === "paiement"; }).reduce(function(s, m){ return s + (m.montant || 0); }, 0);
    c.reste = Math.max(0, montant - payeTotal);
    if (c.reste <= 0) { c.reste = 0; c.statut = "paye"; }
    else if (payeTotal > 0) { c.statut = "partiel"; }
    else { c.statut = "du"; }
    save(db);
    hide(els.sheetEdit);
    render(); openDetail(c.id);
    toast("Créance modifiée");
  });

  $("d-del").addEventListener("click", function(){
    var c = db.clients.find(function(x){ return x.id === currentId; }); if (!c) return;
    if (!confirm("Supprimer définitivement la créance de " + c.nom + " ?")) return;
    db.clients = db.clients.filter(function(x){ return x.id !== currentId; });
    save(db); closeDetail(); render(); toast("Créance supprimée");
  });

  $("d-back").addEventListener("click", closeDetail);
  $("form-cancel").addEventListener("click", closeForm);
  $("p-cancel").addEventListener("click", function(){ hide(els.sheetPart); });
  $("e-cancel").addEventListener("click", function(){ hide(els.sheetEdit); });
  $("btn-add").addEventListener("click", openForm);
  $("btn-export").addEventListener("click", exportCSV);

  // Search
  if (els.search) {
    els.search.addEventListener("input", function(){
      searchQuery = els.search.value.trim();
      render();
    });
  }

  // Sort tabs
  document.querySelectorAll(".sort-tab").forEach(function(tab){
    tab.addEventListener("click", function(){
      document.querySelectorAll(".sort-tab").forEach(function(t){ t.classList.remove("active"); });
      tab.classList.add("active");
      sortMode = tab.dataset.sort;
      render();
    });
  });

  function show(el){ el.hidden = false; document.body.style.overflow = "hidden"; }
  function hide(el){ el.hidden = true; document.body.style.overflow = ""; }

  [els.sheetForm, els.sheetDetail, els.sheetPart, els.sheetEdit].forEach(function(s){
    s.addEventListener("click", function(e){
      if (e.target === s) { s.hidden = true; document.body.style.overflow = ""; }
    });
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") {
      els.sheetForm.hidden = true; els.sheetDetail.hidden = true;
      els.sheetPart.hidden = true; els.sheetEdit.hidden = true;
      document.body.style.overflow = "";
    }
  });

  function exportCSV(){
    var rows = [["Nom","Téléphone","Motif","Montant","Payé","Reste","Échéance","Statut"]];
    db.clients.forEach(function(c){
      var paye = (c.montant || 0) - (c.reste || 0);
      rows.push([c.nom, c.telephone || "", c.motif || "", c.montant, paye, c.reste, c.echeance, c.statut]);
    });
    var csv = "\ufeff" + rows.map(function(r){
      return r.map(function(v){ return '"' + String(v).replace(/"/g,'""') + '"'; }).join(";");
    }).join("\r\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = (CFG.exportNomFichier || "creances") + "-" + todayYMD() + ".csv";
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 100);
    toast("Export Excel téléchargé");
  }

  els.list.classList.add("intro");
  render();
  setTimeout(function(){ els.list.classList.remove("intro"); }, 1200);
})();