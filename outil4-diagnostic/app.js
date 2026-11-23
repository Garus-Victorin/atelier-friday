(function () {
  "use strict";
  var C = window.CONFIG;
  if (!C) { document.body.innerHTML = "<p style='padding:20px;text-align:center'>Configuration manquante.</p>"; return; }
  var T = C.textes;

  var messages = [];
  var answers = {};
  var currentQ = 0;
  var messageCount = 0;
  var maxMessages = C.max_messages || 20;
  var finished = false;

  var $ = function(id){ return document.getElementById(id); };
  var chatArea = $("chat-area");
  var messagesEl = $("messages");
  var inputText = $("input-text");
  var btnSend = $("btn-send");
  var quickReplies = $("quick-replies");
  var inputBar = $("input-bar");
  var resultArea = $("result-area");
  var resultContent = $("result-content");
  var errorArea = $("error-area");

  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  }); }

  function scrollToBottom(){
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function addMessage(text, type){
    messageCount++;
    if (messageCount > maxMessages) {
      showLimit();
      return false;
    }
    var div = document.createElement("div");
    div.className = "msg " + type;
    var avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    if (type === "ai") {
      var avatarImg = document.createElement("img");
      avatarImg.src = "assets/favicon-96x96.webp";
      avatarImg.alt = "IA";
      avatarImg.style.width = "100%";
      avatarImg.style.height = "100%";
      avatarImg.style.borderRadius = "50%";
      avatarImg.style.objectFit = "cover";
      avatar.appendChild(avatarImg);
    } else {
      avatar.textContent = "V";
    }
    var bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.textContent = text;
    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    scrollToBottom();
    return true;
  }

  function showTyping(){
    var div = document.createElement("div");
    div.className = "msg ai";
    div.id = "typing";
    var avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    var avatarImg = document.createElement("img");
    avatarImg.src = "assets/favicon-96x96.webp";
    avatarImg.alt = "IA";
    avatarImg.style.width = "100%";
    avatarImg.style.height = "100%";
    avatarImg.style.borderRadius = "50%";
    avatarImg.style.objectFit = "cover";
    avatar.appendChild(avatarImg);
    var bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping(){
    var t = document.getElementById("typing");
    if (t) t.remove();
  }

  function askQuestion(){
    if (currentQ >= C.questions.length) {
      generateResult();
      return;
    }
    var q = C.questions[currentQ];
    showTyping();
    setTimeout(function(){
      hideTyping();
      addMessage(q.texte, "ai");
      showQuickReplies(q);
    }, 600);
  }

  function showQuickReplies(q){
    quickReplies.innerHTML = "";
    if (q.type === "choix" && q.options) {
      q.options.forEach(function(opt){
        var btn = document.createElement("button");
        btn.className = "quick-reply";
        btn.textContent = opt.label;
        btn.addEventListener("click", function(){ handleAnswer(opt.label, opt.value); });
        quickReplies.appendChild(btn);
      });
      inputText.placeholder = "Ou tapez votre réponse...";
    } else {
      inputText.placeholder = T.placeholder;
    }
  }

  function handleAnswer(label, value){
    if (finished) return;
    if (!addMessage(label, "user")) return;

    var q = C.questions[currentQ];
    answers[q.id] = value || label;
    currentQ++;

    quickReplies.innerHTML = "";
    inputText.value = "";
    inputText.placeholder = T.placeholder;

    setTimeout(function(){ askQuestion(); }, 400);
  }

  function handleTextInput(){
    var text = inputText.value.trim();
    if (!text || finished) return;
    if (currentQ >= C.questions.length) return;
    handleAnswer(text, text);
  }

  btnSend.addEventListener("click", handleTextInput);
  inputText.addEventListener("keydown", function(e){
    if (e.key === "Enter") handleTextInput();
  });

  function showLimit(){
    inputBar.style.display = "none";
    var div = document.createElement("div");
    div.className = "msg ai";
    var avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    var avatarImg = document.createElement("img");
    avatarImg.src = "assets/favicon-96x96.webp";
    avatarImg.alt = "IA";
    avatarImg.style.width = "100%";
    avatarImg.style.height = "100%";
    avatarImg.style.borderRadius = "50%";
    avatarImg.style.objectFit = "cover";
    avatar.appendChild(avatarImg);
    var bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.textContent = T.msg_limite;
    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    scrollToBottom();
    showResultButtons();
  }

  function showError(){
    inputBar.style.display = "none";
    chatArea.style.display = "none";
    errorArea.hidden = false;
    $("error-text").textContent = T.msg_erreur;
    var fabWa = $("error-wa");
    fabWa.href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent("Bonjour, j'ai un problème avec l'assistant IA de diagnostic.");
    fabWa.classList.add("visible");
    fabWa.addEventListener("click", function(e){ e.preventDefault(); window.location.href = fabWa.href; });
  }

  function generateResult(){
    finished = true;
    inputBar.style.display = "none";

    showTyping();
    setTimeout(function(){
      hideTyping();
      addMessage(T.msg_fin, "ai");

      var pistes = computePistes(answers);

      setTimeout(function(){
        resultArea.hidden = false;
        chatArea.style.display = "none";
        renderResult(pistes);
      }, 800);
    }, 800);
  }

  function computePistes(a){
    var pistes = [];

    // Piste 1: Paiements / Créances
    if (a.paiements === "cahier" || a.paiements === "telephone" || a.paiements === "aucun" || a.souci === "creances") {
      pistes.push({
        titre: "Suivi des paiements et créances",
        priorite: "Priorité 1",
        texte: "Vos paiements sont suivis " + (a.paiements === "cahier" ? "sur papier" : a.paiements === "telephone" ? "sur téléphone" : a.paiements === "aucun" ? "sans suivi" : "manuellement") + ". Cela peut entraîner des pertes et des oublis. Un carnet numérique simple vous permettrait de savoir en temps réel qui vous doit quoi, avec des rappels automatiques.",
        lebia: "LEBIATECH peut vous mettre en place un outil de suivi des créances adapté à votre activité, sur votre téléphone, sans abonnement."
      });
    }

    // Piste 2: Visibilité en ligne
    if (a.web === "non" || a.web === "pas_encore" || a.clients === "bouche") {
      pistes.push({
        titre: "Visibilité en ligne",
        priorite: "Priorité 2",
        texte: "Vos clients vous trouvent surtout par " + (a.clients === "bouche" ? "le bouche-à-oreille" : a.clients === "passage" ? "le passage" : "les réseaux sociaux") + " et vous n'avez " + (a.web === "non" ? "pas de site web" : a.web === "pas_encore" ? "pas encore de site web" : "peu de présence en ligne") + ". Une page simple et rapide sur mobile vous permettrait d'être trouvé sur Google et de recevoir des demandes par WhatsApp.",
        lebia: "LEBIATECH crée des pages vitrines légères et rapides, optimisées pour les téléphones et le référencement local."
      });
    }

    // Piste 3: Organisation / Temps
    if (a.admin === "beaucoup" || a.admin === "trop" || a.admin === "moyen" || a.souci === "orga") {
      pistes.push({
        titre: "Gain de temps et organisation",
        priorite: "Priorité 3",
        texte: "Vous passez " + (a.admin === "peu" ? "peu de temps" : a.admin === "moyen" ? "1 à 3 heures" : a.admin === "beaucoup" ? "3 à 5 heures" : "plus de 5 heures") + " par semaine sur l'administratif. Simplifier ces tâches vous libérerait du temps pour votre cœur de métier.",
        lebia: "LEBIATECH automatise les tâches répétitives (relances, suivi, organisation) pour vous faire gagner du temps."
      });
    }

    // Piste 4: Acquisition clients (si pas déjà ajouté)
    if (pistes.length < 3 && (a.souci === "clients" || a.clients === "bouche")) {
      pistes.push({
        titre: "Acquisition de nouveaux clients",
        priorite: "Priorité " + (pistes.length + 1),
        texte: "Votre principale difficulté est de trouver de nouveaux clients. Le bouche-à-oreille est efficace mais limité. Une présence en ligne combinée à un système de réservation simple peut attirer de nouveaux clients.",
        lebia: "LEBIATECH met en place des outils de réservation et de présence en ligne pour attirer et fidéliser vos clients."
      });
    }

    // Piste 5: Équipe (si pas déjà ajouté)
    if (pistes.length < 3 && (a.equipe === "moyen" || a.equipe === "grand")) {
      pistes.push({
        titre: "Coordination d'équipe",
        priorite: "Priorité " + (pistes.length + 1),
        texte: "Avec " + (a.equipe === "moyen" ? "6 à 10" : "plus de 10") + " personnes, la coordination devient un enjeu. Un outil partagé permettrait à toute l'équipe d'avoir la même information.",
        lebia: "LEBIATECH propose des outils collaboratifs simples pour coordonner votre équipe."
      });
    }

    // Ensure at least 3 pistes
    if (pistes.length < 3) {
      pistes.push({
        titre: "Digitalisation progressive",
        priorite: "Priorité " + (pistes.length + 1),
        texte: "Votre activité fonctionne bien. Pour la faire grandir, la digitalisation progressive (suivi, visibilité, organisation) vous permettra de gagner en efficacité sans tout changer d'un coup.",
        lebia: "LEBIATECH vous accompagne étape par étape, en commençant par ce qui vous apporte le plus de valeur."
      });
    }

    // Limit to 3
    pistes = pistes.slice(0, 3);

    // Renumber priorities
    pistes.forEach(function(p, i){
      p.priorite = "Priorité " + (i + 1);
    });

    return pistes;
  }

  function renderResult(pistes){
    var html = '<h2 class="result-title"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> ' + T.msg_fin + '</h2>';
    pistes.forEach(function(p, i){
      html += '<div class="result-piste">';
      html += '<h3><span class="piste-num">' + (i + 1) + '</span> ' + esc(p.titre) + ' <span style="font-size:11px;color:var(--gold);font-weight:600">' + esc(p.priorite) + '</span></h3>';
      html += '<p>' + esc(p.texte) + '</p>';
      html += '<div class="lebia"><strong>LEBIATECH :</strong> ' + esc(p.lebia) + '</div>';
      html += '</div>';
    });
    resultContent.innerHTML = html;

    $("btn-reserver").href = C.contact_url;
    $("btn-reserver").addEventListener("click", function(e){ e.preventDefault(); window.location.href = C.contact_url; });
    $("btn-whatsapp").href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent("Bonjour, j'ai fait le diagnostic IA sur votre site. Voici mes résultats : " + pistes.map(function(p){ return p.titre; }).join(", ") + ". Je souhaite en savoir plus.");
    $("btn-whatsapp").addEventListener("click", function(e){ e.preventDefault(); window.location.href = $("btn-whatsapp").href; });
    $("btn-recommencer").addEventListener("click", function(){ location.reload(); });
  }

  function showResultButtons(){
    // Already handled in result area
  }

  // Init
  $("titre").textContent = T.titre;
  $("disclaimer").textContent = T.disclaimer;
  inputText.placeholder = T.placeholder;
  $("btn-reserver").innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ' + T.btn_reserver;
  $("btn-whatsapp").innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2z"/></svg> ' + T.btn_whatsapp;

  // Start conversation
  setTimeout(function(){
    addMessage(C.questions[0].texte, "ai");
    showQuickReplies(C.questions[0]);
  }, 500);

})();