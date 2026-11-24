(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = document.documentElement.classList.contains('rm');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- sprayed waveforms ---------- */
  // Two nested layers slide in opposite directions, so the waveform is revealed with transforms only.
  $$('.clip').forEach((clip, n) => {
    let seed = 31 + n * 17;
    const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    outer.className = 'clip__w';
    inner.className = 'clip__i';
    for (let i = 0; i < 64; i++) {
      const b = document.createElement('i');
      const env = 0.55 + 0.45 * Math.sin((i / 64) * Math.PI * 3.2 + n);
      b.style.setProperty('--h', String(Math.round(18 + 82 * rand() * env)));
      inner.appendChild(b);
    }
    outer.appendChild(inner);
    clip.appendChild(outer);
  });

  /* ---------- equaliser ---------- */
  const eq = $('#eq');
  const bars = [];
  for (let i = 0; i < (innerWidth < 700 ? 28 : 64); i++) bars.push(eq.appendChild(document.createElement('i')));
  let eqVisible = true;
  let ticking = false;
  const drawEq = () => bars.forEach((b, i) => {
    const v = 0.22 + 0.78 * Math.abs(Math.sin(scrollY * 0.006 + i * 0.37) * Math.cos(scrollY * 0.0031 + i * 0.11));
    b.style.setProperty('--s', v.toFixed(3));
  });
  drawEq();
  new IntersectionObserver((e) => { eqVisible = e[0].isIntersecting; }, { rootMargin: '100px' }).observe(eq);
  if (!reduced) addEventListener('scroll', () => {
    if (ticking || !eqVisible) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; drawEq(); });
  }, { passive: true });

  /* ---------- discovery wall ---------- */
  const call = $('#call');
  const callSeen = new IntersectionObserver((e) => {
    if (!e[0].isIntersecting) return;
    call.classList.add('in');
    callSeen.disconnect();
  }, { threshold: 0.25 });
  callSeen.observe(call);

  /* ---------- menu ---------- */
  const menu = $('#menu');
  const nav = $('#nav');
  const setMenu = (open) => { nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); };
  menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  // Waits for scrolling to stop: measuring mid-scroll misplaces the pinned sections.
  const remeasure = () => { if (window.ScrollTrigger) ScrollTrigger.refresh(true); };

  /* ---------- pricing tabs ---------- */
  const tabs = $$('[role=tab]');
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    });
    if (focus) tab.focus();
    remeasure();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      selectTab(tabs[(to + tabs.length) % tabs.length], true);
    });
  });
  selectTab(tabs[0]);
  // Accordions change the page height, so pinned sections below must re-measure.
  $$('details').forEach((d) => d.addEventListener('toggle', () => { remeasure(); }));

  /* ---------- pinned sections ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width:1000px) and (min-height:720px) and (prefers-reduced-motion:no-preference)', () => {
      const stage = $('.svc');
      const lanesEl = $('#lanes');
      const can = $('.can');
      const lanes = $$('.lane', lanesEl).map((el) => ({
        el, s: Number(el.dataset.s), e: Number(el.dataset.e), outer: $('.clip__w', el), inner: $('.clip__i', el),
      }));
      stage.classList.add('is-scrub');
      let width = 0;
      const measure = () => { width = lanesEl.clientWidth - $('.lane__body', lanesEl).offsetLeft - 2; };
      const render = (p) => {
        can.style.transform = `translate3d(${(p * width).toFixed(1)}px,0,0)`;
        lanes.forEach((l) => {
          const hidden = (1 - clamp((p - l.s) / (l.e - l.s))) * 100;
          l.outer.style.transform = `translateX(${-hidden}%)`;
          l.inner.style.transform = `translateX(${hidden}%)`;
          l.el.classList.toggle('is-on', p >= l.s);
        });
      };
      measure();
      render(0);
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: '+=170%', pin: true,
        onRefresh: (self) => { measure(); render(self.progress); },
        onUpdate: (self) => render(self.progress),
      });
      return () => {
        st.kill();
        stage.classList.remove('is-scrub');
        can.style.transform = '';
        lanes.forEach((l) => { l.outer.style.transform = ''; l.inner.style.transform = ''; l.el.classList.add('is-on'); });
      };
    });

    mm.add('(min-width:1000px) and (min-height:720px) and (prefers-reduced-motion:no-preference)', () => {
      const shelf = $('#shelf');
      const track = $('#track');
      shelf.classList.add('is-pinned');
      shelf.scrollLeft = 0;
      const dist = () => Math.max(0, track.scrollWidth - shelf.clientWidth + 2 * parseFloat(getComputedStyle(shelf).paddingLeft));
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.artists', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true },
      });
      return () => shelf.classList.remove('is-pinned');
    });

    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- Spotify (loads on click only) ---------- */
  const player = $('#player');
  const frame = $('#player-frame');
  let lastTrigger = null;
  const closePlayer = () => {
    if (!player.classList.contains('open')) return;
    player.classList.remove('open');
    frame.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  };
  $$('[data-play]').forEach((b) => b.addEventListener('click', () => {
    lastTrigger = b;
    if (!frame.getAttribute('src')) frame.src = frame.dataset.src;
    player.classList.add('open');
    $('#player-close').focus({ preventScroll: true });
  }));
  $('#player-close').addEventListener('click', closePlayer);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); closePlayer(); } });

  /* ---------- booking form ---------- */
  const form = $('#form');
  const msg = $('#msg');
  const send = $('#send');
  $$('[data-service]').forEach((a) => a.addEventListener('click', () => { $('#sv').value = a.dataset.service; setBad('sv', false); }));

  const siteKey = $('meta[name="turnstile-sitekey"]').content;
  let token = '';
  form.addEventListener('focusin', () => {
    if (!siteKey) return;
    window.__tsReady = () => turnstile.render('#ts', { sitekey: siteKey, theme: 'dark', callback: (t) => { token = t; }, 'expired-callback': () => { token = ''; } });
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsReady';
    s.async = true;
    document.head.appendChild(s);
  }, { once: true });

  const ids = ['fn', 'ig', 'ph', 'em', 'sv', 'ms'];
  const value = (id) => $(`#${id}`).value.trim();
  function setBad(id, bad) {
    $(`#${id}`).closest('.f').classList.toggle('bad', bad);
    $(`#${id}`).setAttribute('aria-invalid', String(bad));
  }
  ids.forEach((id) => $(`#${id}`).addEventListener('input', () => setBad(id, false)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const bad = ids.filter((id) => {
      const wrong = id === 'em' ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value(id)) : !value(id);
      setBad(id, wrong);
      return wrong;
    });
    if (bad.length) { $(`#${bad[0]}`).focus(); return; }
    if (form.elements.website.value) return;
    const label = send.textContent;
    send.disabled = true;
    send.textContent = 'Sending…';
    const fallback = 'Your message did not send. Please try again or email create@levproductions.com.au.';
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: value('fn'), instagram: value('ig'), phone: value('ph'), email: value('em'), service: value('sv'), message: value('ms'), turnstileToken: token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || fallback);
      $('#slip').classList.add('is-done');
      $('#done').focus({ preventScroll: true });
      form.reset();
    } catch (err) {
      msg.textContent = err instanceof TypeError ? fallback : err.message;
      if (window.turnstile) { turnstile.reset(); token = ''; }
    } finally {
      send.disabled = false;
      send.textContent = label;
    }
  });
})();
