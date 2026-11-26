(function () {
  "use strict";
  var C = window.CONFIG;
  if (!C) { document.body.innerHTML = "<p style='padding:20px;text-align:center'>Configuration manquante. Vérifiez config.js.</p>"; return; }
  var T = C.textes;

  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  }); }

  function waUrl(){
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(T.msg_wa);
  }

  function fill(){
    var h1 = document.getElementById("hero-nom");
    h1.setAttribute("aria-label", C.nom);
    h1.innerHTML = C.nom.split(" ").map(function(w, i){
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '"' + (w === "&" || w.indexOf("Associ") === 0 ? ' class="amp"' : '') + '>' + esc(w) + '</span></span>';
    }).join(" ");
    var brandNom = document.getElementById("brand-nom");
    if (brandNom) brandNom.textContent = C.nom.split(" & ")[0];
    var heroImg = document.getElementById("hero-img");
    if (heroImg && C.photos && C.photos[0]) { heroImg.src = C.photos[0].src; heroImg.alt = C.photos[0].alt; }
    document.getElementById("hero-slogan").textContent = C.slogan;
    document.getElementById("hero-baseline").textContent = C.baseline || "";
    document.title = C.nom + " — Avocat à " + C.ville + " — " + C.slogan;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content",
      C.nom + ", avocats à " + C.ville + ". " + C.slogan +
      " Consultation sur rendez-vous. Contactez-nous sur WhatsApp.");

    ["hero-wa","cta-wa","fab-wa"].forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      el.href = waUrl();
      el.addEventListener("click", function(e){ e.preventDefault(); window.location.href = waUrl(); });
    });
    document.getElementById("hero-tel").href = C.tel_href;
    document.getElementById("hero-tel").innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ' + T.cta_appeler;

    var grid = document.getElementById("services-grid");
    var ico = function(d){ return '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
    var icons = {
      affaires: ico('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>'),
      famille: ico('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 14.1c.5-.1 1-.1 1.5-.1 2.5 0 4 2 4 5"/>'),
      travail: ico('<path d="M3 18h18M5 18v-3a7 7 0 0 1 14 0v3M10 8.4V6h4v2.4"/>'),
      immobilier: ico('<path d="M4 21V5l8-3v19M12 9h8v12M2 21h20M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>'),
      civil: ico('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
      penal: ico('<path d="m14 4 6 6M11.5 6.5l6 6M12.8 5.2l-5 5 6 6 5-5zM10.3 12.7 3 20M13 21h8"/>')
    };
    var fallback = ico('<path d="M12 3v18M7 21h10M4 7h16M4 7l-3 7h6zM20 7l-3 7h6z"/>');
    grid.innerHTML = C.services.map(function(s, i){
      return '<article class="service" data-reveal><div class="ico">' + (icons[s.id] || fallback) + '</div><div><h3>' + esc(s.titre) + '</h3><p>' + esc(s.desc) + '</p></div></article>';
    }).join("");

    var distList = document.getElementById("distinctions-list");
    if (distList && C.distinctions) {
      distList.innerHTML = C.distinctions.map(function(d){
        return '<li><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg><span>' + esc(d) + '</span></li>';
      }).join("");
    }

    var fig = document.getElementById("chiffres");
    if (fig && C.chiffres) {
      fig.innerHTML = C.chiffres.map(function(c){
        var n = c.compteur === false ? esc(c.valeur) : '<span data-count="' + esc(c.valeur) + '">' + esc(c.valeur) + '</span>';
        return '<div><dt>' + esc(c.libelle) + '</dt><dd>' + n + esc(c.suffixe || "") + '</dd></div>';
      }).join("");
    }

    var pres = document.getElementById("presentation-texte");
    if (pres) pres.textContent = C.presentation || "";

    var gal = document.getElementById("galerie-grid");
    if (gal && C.photos) {
      gal.innerHTML = C.photos.map(function(p, i){
        return '<figure data-i="' + i + '"><img src="' + esc(p.src) + '" alt="' + esc(p.alt) +
          '" loading="lazy"><figcaption>' + esc(p.legende || "") + '</figcaption></figure>';
      }).join("");
      gal.querySelectorAll("[data-i]").forEach(function(fig){
        fig.addEventListener("click", function(){
          var i = +fig.dataset.i;
          openLightbox(C.photos[i]);
        });
      });
    }

    var t = document.getElementById("hours-table");
    var jourDuJour = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Porto-Novo" })).getDay()];
    t.innerHTML = C.horaires.map(function(h){
      var v = (h.ouvre && h.ferme) ? (h.ouvre + " – " + h.ferme) : "Fermé";
      return '<tr' + (h.jour === jourDuJour ? ' class="today"' : '') + '><td>' + esc(h.jour) + '</td><td>' + esc(v) + '</td></tr>';
    }).join("");
    document.getElementById("hours-note").textContent = C.horaires_note || "";

    // Cotonou time status
    var statusEl = document.getElementById("hours-status");
    if (statusEl) {
      var now = new Date();
      var cotonou = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Porto-Novo" }));
      var dayNames = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
      var todayName = dayNames[cotonou.getDay()];
      var todayHours = C.horaires.find(function(h){ return h.jour === todayName; });
      var hh = cotonou.getHours();
      var mm = cotonou.getMinutes();
      var nowMin = hh * 60 + mm;
      var status = "fermé";
      var statusText = "Fermé";
      var statusClass = "closed";
      if (todayHours && todayHours.ouvre && todayHours.ferme) {
        var openParts = todayHours.ouvre.split(":").map(Number);
        var closeParts = todayHours.ferme.split(":").map(Number);
        var openMin = openParts[0] * 60 + openParts[1];
        var closeMin = closeParts[0] * 60 + closeParts[1];
        if (nowMin >= openMin && nowMin < closeMin) {
          if (closeMin - nowMin <= 30) {
            status = "bientôt fermé";
            statusText = "Bientôt fermé";
            statusClass = "closing";
          } else {
            status = "ouvert";
            statusText = "Ouvert";
            statusClass = "open";
          }
        }
      }
      statusEl.innerHTML = '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
        '<span class="status-time">Heure de Cotonou : ' + (hh < 10 ? "0" + hh : hh) + ':' + (mm < 10 ? "0" + mm : mm) + '</span>';
    }

    document.getElementById("adresse-texte").innerHTML =
      esc(C.adresse.rue) + "<br>" + esc(C.adresse.ville) +
      (C.adresse.code_postal ? " " + esc(C.adresse.code_postal) : "") +
      ", " + esc(C.pays);
    document.getElementById("itineraire").href = C.adresse.lien_carte;
    document.getElementById("itineraire").innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + T.btn_itineraire;

    var contactTel = document.getElementById("contact-tel");
    if (contactTel) { contactTel.href = C.tel_href; }
    var contactTelText = document.getElementById("contact-tel-text");
    if (contactTelText) { contactTelText.textContent = C.telephone; }
    var contactEmail = document.getElementById("contact-email");
    if (contactEmail) { contactEmail.href = "mailto:" + C.email; }
    var contactEmailText = document.getElementById("contact-email-text");
    if (contactEmailText) { contactEmailText.textContent = C.email; }

    document.getElementById("footer-txt").textContent = C.footer_texte;

    var footerNom = document.getElementById("footer-nom");
    if (footerNom) footerNom.textContent = C.nom;
    var footerBaseline = document.getElementById("footer-baseline");
    if (footerBaseline) footerBaseline.textContent = C.baseline || C.slogan;
    var footerAddr = document.getElementById("footer-addr");
    if (footerAddr) footerAddr.textContent = C.adresse.rue + ", " + C.adresse.ville + (C.adresse.code_postal ? " " + C.adresse.code_postal : "") + ", " + C.pays;
    var footerMap = document.getElementById("footer-map");
    if (footerMap) { footerMap.href = C.adresse.lien_carte; }
    var footerTel = document.getElementById("footer-tel");
    if (footerTel) { footerTel.href = C.tel_href; footerTel.textContent = "Tél : " + C.telephone; }
    var footerEmail = document.getElementById("footer-email");
    if (footerEmail) { footerEmail.href = "mailto:" + C.email; footerEmail.textContent = C.email; }
    var footerWa = document.getElementById("footer-wa");
    if (footerWa) { footerWa.href = waUrl(); footerWa.textContent = "WhatsApp : " + C.telephone; footerWa.addEventListener("click", function(e){ e.preventDefault(); window.location.href = waUrl(); }); }
    var footerHours = document.getElementById("footer-hours");
    if (footerHours) {
      var openDays = C.horaires.filter(function(h){ return h.ouvre; });
      footerHours.textContent = openDays.length > 0 ? openDays[0].jour + " - " + openDays[openDays.length-1].jour + " : " + openDays[0].ouvre + " - " + openDays[0].ferme : "Sur rendez-vous";
    }
    var footerHoursNote = document.getElementById("footer-hours-note");
    if (footerHoursNote) footerHoursNote.textContent = C.horaires_note || "";
    var footerLegal = document.getElementById("footer-legal");
    if (footerLegal) footerLegal.textContent = C.legal;

    var jsonLd = {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": C.nom,
      "description": C.slogan,
      "telephone": C.telephone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": C.adresse.rue,
        "addressLocality": C.adresse.ville,
        "addressCountry": C.pays
      },
      "openingHoursSpecification": C.horaires.filter(function(h){ return h.ouvre && h.ferme; }).map(function(h){
        return { "@type": "OpeningHoursSpecification", "dayOfWeek": h.jour, "opens": h.ouvre, "closes": h.ferme };
      })
    };
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(ld);
  }

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  function openLightbox(p){
    lbImg.src = p.src; lbImg.alt = p.alt; lb.hidden = false;
  }
  function closeLightbox(){ lb.hidden = true; lbImg.src = ""; }
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  lb.addEventListener("click", function(e){ if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeLightbox(); });

  fill();

  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ root.classList.add("ready"); }); });

  function count(el){
    var end = +el.dataset.count;
    if (reduce || !(end > 1)) { el.textContent = el.dataset.count; return; }
    var t0 = performance.now(), dur = 1400;
    (function tick(now){
      var p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(end * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        en.target.querySelectorAll("[data-count]").forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function(el){ io.observe(el); });

    var links = document.querySelectorAll(".quicknav a");
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        links.forEach(function(a){ a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function(a){ var sec = document.querySelector(a.getAttribute("href")); if (sec) spy.observe(sec); });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function(el){ el.classList.add("in"); });
  }
})();