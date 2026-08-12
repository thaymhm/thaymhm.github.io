/* ==========================================================================
   site.js — Comportamentos comuns a todas as páginas
   Carregado com `defer` no <head>.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- Menu mobile ---------------------------------------------------- */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Ano no rodapé -------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- Formulário via Google Apps Script -------------------------------
     O Apps Script responde com um redirect que o navegador não deixa a
     página ler, então o envio vai em `no-cors`: a requisição chega no
     script, mas a resposta volta opaca. Consequência honesta — a gente
     confirma que o envio SAIU, não que ele foi gravado na planilha.
     Por isso o script precisa mandar um e-mail de aviso (veja o doc).    */

  document.querySelectorAll('form[data-gs-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var origem = form.querySelector('input[name="origem"]');

    if (origem && !origem.value) origem.value = window.location.pathname;

    var say = function (message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status is-' + kind;
    };

    form.addEventListener('submit', function (event) {
      var endpoint = form.getAttribute('action') || '';

      // Ainda não configurado: deixa o envio nativo falhar de forma visível
      // em vez de fingir sucesso.
      if (endpoint.indexOf('COLE-SEU-ID-AQUI') !== -1) {
        event.preventDefault();
        say('Formulário ainda não configurado. Me chama no LinkedIn por enquanto.', 'error');
        return;
      }

      event.preventDefault();

      // Campo-armadilha preenchido = robô. Finge que deu certo e descarta.
      var gotcha = form.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value) {
        say('Mensagem enviada. Respondo em breve.', 'success');
        form.reset();
        return;
      }

      var original = button ? button.textContent : '';
      if (button) { button.disabled = true; button.textContent = 'Enviando...'; }
      say('Enviando...', 'pending');

      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(new FormData(form))
      }).then(function () {
        form.reset();
        if (origem) origem.value = window.location.pathname;
        say('Recebi sua mensagem. Respondo no e-mail que você deixou.', 'success');
      }).catch(function () {
        say('Não consegui enviar. Tenta de novo ou me chama no LinkedIn.', 'error');
      }).then(function () {
        if (button) { button.disabled = false; button.textContent = original; }
      });
    });
  });
})();
