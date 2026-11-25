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
    document.getElementById("hero-nom").textContent = C.nom;
    document.getElementById("hero-slogan").textContent = C.slogan;
    document.getElementById("hero-baseline").textContent = C.baseline || "";
    document.title = C.nom + " — Avocat à " + C.ville + " — " + C.slogan;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content",
      C.nom + ", avocats à " + C.ville + ". " + C.slogan +
      " Consultation sur rendez-vous. Contactez-nous sur WhatsApp.");

    ["hero-wa","footer-wa","fab-wa"].forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      el.href = waUrl();
      el.addEventListener("click", function(e){ e.preventDefault(); window.location.href = waUrl(); });
    });
    document.getElementById("hero-tel").href = C.tel_href;
    document.getElementById("hero-tel").innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ' + T.cta_appeler;

    var grid = document.getElementById("services-grid");
    var svgIcons = [
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>',
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h.01M9 14h.01M15 10h.01M15 14h.01"/></svg>',
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    ];
    grid.innerHTML = C.services.map(function(s, i){
      return '<article class="card"><div class="card-icon">' + svgIcons[i % svgIcons.length] + '</div><h3>' + esc(s.titre) + '</h3><p>' + esc(s.desc) + '</p></article>';
    }).join("");

    var distList = document.getElementById("distinctions-list");
    if (distList && C.distinctions) {
      distList.innerHTML = C.distinctions.map(function(d){
        return '<li>' + esc(d) + '</li>';
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
    t.innerHTML = C.horaires.map(function(h){
      var v = (h.ouvre && h.ferme) ? (h.ouvre + " – " + h.ferme) : "Fermé";
      return '<tr><td>' + esc(h.jour) + '</td><td>' + esc(v) + '</td></tr>';
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
    if (footerAddr) footerAddr.textContent = C.adresse.rue + ", " + C.adresse.ville + ", " + C.adresse.code_postal;
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
})();