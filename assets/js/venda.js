/* ==========================================================================
   venda.js — Comportamentos das páginas de venda
   Carregado com `defer`, depois de site.js.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- Link de checkout: um lugar só ----------------------------------
     A página define window.CHECKOUT_URL no <head>. Todo botão de compra
     marcado com data-checkout recebe esse link aqui. Trocar de plataforma
     (Hotmart <-> Kiwify) é editar UMA linha por página de venda.        */

  var checkoutUrl = window.CHECKOUT_URL;
  var configurado = checkoutUrl && checkoutUrl.indexOf('COLE-SEU-CODIGO-AQUI') === -1;

  if (configurado) {
    document.querySelectorAll('a[data-checkout]').forEach(function (link) {
      link.setAttribute('href', checkoutUrl);
    });
  } else if (checkoutUrl) {
    // Página ainda não publicada: desabilita o botão em vez de mandar a
    // pessoa para um link quebrado.
    document.querySelectorAll('a[data-checkout]').forEach(function (link) {
      link.setAttribute('href', '#oferta');
      link.setAttribute('aria-disabled', 'true');
      link.style.opacity = '.5';
      link.style.pointerEvents = 'none';
    });
    console.warn('[venda.js] CHECKOUT_URL não configurado — botões de compra desativados.');
  }

  /* ---- Barra de CTA fixa no mobile ------------------------------------
     Aparece quando o hero sai da tela e some quando o bloco de oferta
     entra em cena (não faz sentido oferecer duas vezes ao mesmo tempo).  */

  var bar = document.querySelector('.v-sticky-cta');
  var hero = document.querySelector('.v-hero');
  var offer = document.querySelector('#oferta');

  if (bar && hero && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var offerVisible = false;

    var sync = function () {
      bar.classList.toggle('visible', !heroVisible && !offerVisible);
    };

    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(hero);

    if (offer) {
      new IntersectionObserver(function (entries) {
        offerVisible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(offer);
    }
  }

  /* ---- FAQ: fecha as outras perguntas ao abrir uma --------------------- */

  var faqItems = document.querySelectorAll('.v-faq details');

  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---- Repasse de parâmetros de campanha para o checkout ---------------
     Mantém utm_source, utm_medium, utm_campaign, utm_content, utm_term e
     src na URL do checkout, para a origem da venda não se perder.        */

  var KEEP = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src'];
  var incoming = new URLSearchParams(window.location.search);
  var carry = new URLSearchParams();

  KEEP.forEach(function (key) {
    var value = incoming.get(key);
    if (value) carry.set(key, value);
  });

  if (carry.toString()) {
    document.querySelectorAll('a[data-checkout]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;

      try {
        var url = new URL(href, window.location.href);
        carry.forEach(function (value, key) {
          if (!url.searchParams.has(key)) url.searchParams.set(key, value);
        });
        link.setAttribute('href', url.toString());
      } catch (e) {
        /* href relativo inválido — deixa como está */
      }
    });
  }
})();
