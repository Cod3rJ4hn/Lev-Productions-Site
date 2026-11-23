(() => {
  'use strict';
  window.__lev = 1;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = () => root.classList.contains('rm');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- seeded waveform bars ---------- */
  const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const bars = (el, count, seed, min = 14, max = 100) => {
    const rand = rng(seed);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const b = document.createElement('i');
      const env = 0.55 + 0.45 * Math.sin((i / count) * Math.PI * 3.2 + seed);
      b.style.setProperty('--h', String(Math.round(min + (max - min) * rand() * env)));
      b.style.setProperty('--i', String(i));
      frag.appendChild(b);
    }
    el.appendChild(frag);
  };
  const wave = $('#wave');
  if (wave) bars(wave, 120, 7);
  $$('.clip').forEach((c, i) => {
    const cover = $('.clip__cover', c);
    const holder = document.createDocumentFragment();
    const tmp = document.createElement('div');
    bars(tmp, 56, 31 + i * 17, 20, 100);
    while (tmp.firstChild) holder.appendChild(tmp.firstChild);
    c.insertBefore(holder, cover);
  });

  /* ---------- header: progress, timecode, reels ---------- */
  const progress = $('.progress');
  const tc = $('#tc');
  const reels = $$('[data-reel]');
  const SESSION = 222;
  const pad = (n) => String(n).padStart(2, '0');
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(scrollY / max) : 0;
    if (progress) progress.style.transform = `scaleX(${p.toFixed(4)})`;
    if (tc) {
      const t = p * SESSION;
      tc.textContent = `${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}:${pad(Math.floor((t % 1) * 30))}`;
    }
    if (!reduced()) reels.forEach((r, i) => { r.style.transform = `rotate(${(i ? -1 : 1) * scrollY * 0.32}deg)`; });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  update();

  /* ---------- menu ---------- */
  const menu = $('#menu');
  const nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMenu(); closePlayer(); } });

  /* ---------- reveals + counters ---------- */
  const counters = $$('[data-count]');
  const count = (el) => {
    const end = Number(el.dataset.count);
    if (reduced()) { el.textContent = String(end); return; }
    const t0 = performance.now();
    const dur = 1100;
    const tick = (t) => {
      const k = clamp((t - t0) / dur);
      el.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!reduced()) counters.forEach((c) => { c.textContent = '0'; });

  const targets = $$('[data-reveal], .wave, .plan, .fader');
  if ('IntersectionObserver' in window && !reduced()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('[data-count]', en.target).forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
    counters.forEach((c) => { c.textContent = c.dataset.count; });
  }

  /* ---------- scroll-driven sections (GSAP) ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // 03 services: pinned timeline, playhead sweeps the four tracks
    mm.add('(min-width:1000px) and (min-height:720px) and (prefers-reduced-motion:no-preference)', () => {
      const stage = $('.svc');
      const lanesEl = $('#lanes');
      const head = $('.playhead');
      const lanes = $$('.lane', lanesEl).map((el) => ({
        el,
        s: Number(el.dataset.s),
        e: Number(el.dataset.e),
        cover: $('.clip__cover', el),
        on: false,
      }));
      stage.classList.add('is-scrub');
      const trackW = () => lanesEl.clientWidth - $(".lane__body", lanesEl).offsetLeft - 2;
      let width = 0;
      const render = (p) => {
        head.style.transform = `translate3d(${(p * width).toFixed(1)}px,0,0)`;
        lanes.forEach((l) => {
          const f = clamp((p - l.s) / (l.e - l.s));
          l.cover.style.transform = `scaleX(${(1 - f).toFixed(4)})`;
          const on = p >= l.s;
          if (on !== l.on) { l.on = on; l.el.classList.toggle('is-on', on); }
        });
      };
      lanes.forEach((l) => l.el.classList.remove('is-on'));
      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: '+=170%',
        pin: true,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onRefresh: () => { width = trackW(); },
        onUpdate: (self) => render(self.progress),
      });
      width = trackW();
      render(0);
      return () => {
        st.kill();
        stage.classList.remove('is-scrub');
        head.style.transform = '';
        lanes.forEach((l) => { l.cover.style.transform = ''; l.el.classList.add('is-on'); });
      };
    });

    // 05 artists: pinned sideways scroll along the shelf
    mm.add('(min-width:1000px) and (min-height:640px) and (prefers-reduced-motion:no-preference)', () => {
      const stage = $('.artists');
      const shelf = $('#shelf');
      const track = $('#track');
      shelf.classList.add('is-pinned');
      shelf.scrollLeft = 0;
      const dist = () => Math.max(0, track.scrollWidth - shelf.clientWidth + 48);
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'transform' });
        shelf.classList.remove('is-pinned');
      };
    });

    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- ticker pause ---------- */
  const pause = $('#pause');
  const ticker = $('#marquee');
  pause.addEventListener('click', () => {
    const on = ticker.classList.toggle('paused');
    pause.setAttribute('aria-pressed', String(on));
    pause.textContent = on ? 'Play ticker' : 'Pause ticker';
  });

  /* ---------- FAQ take counter ---------- */
  const take = $('#take');
  $$('.q').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) take.textContent = d.dataset.n;
    else if (!$('.q[open]')) take.textContent = '00';
  }));

  /* ---------- Spotify (opt-in, loads on click) ---------- */
  const player = $('#player');
  const frame = $('#player-frame');
  let lastTrigger = null;
  function openPlayer(trigger) {
    lastTrigger = trigger || null;
    if (!frame.src || frame.src === 'about:blank' || !frame.getAttribute('src')) frame.src = frame.dataset.src;
    player.classList.add('open');
    $('#player-close').focus({ preventScroll: true });
  }
  function closePlayer() {
    if (!player.classList.contains('open')) return;
    player.classList.remove('open');
    frame.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }
  $$('[data-play]').forEach((b) => b.addEventListener('click', () => openPlayer(b)));
  $('#player-close').addEventListener('click', closePlayer);

  /* ---------- package chip ---------- */
  const pkg = $('#pkg');
  const pkgName = $('#pkg-name');
  let service = '';
  const setService = (name) => {
    service = name;
    pkg.classList.toggle('on', Boolean(name));
    pkgName.textContent = name;
  };
  $$('[data-package]').forEach((a) => a.addEventListener('click', () => setService(a.dataset.package)));
  $('#pkg-clear').addEventListener('click', () => setService(''));

  /* ---------- form ---------- */
  const form = $('#form');
  const msg = $('#msg');
  const send = $('#send');
  const slip = $('#slip');
  const siteKey = (document.querySelector('meta[name="turnstile-sitekey"]') || {}).content || '';
  let tsToken = '';
  let tsLoaded = false;
  const loadTurnstile = () => {
    if (tsLoaded || !siteKey) return;
    tsLoaded = true;
    window.__tsReady = () => {
      window.turnstile.render('#ts', { sitekey: siteKey, callback: (t) => { tsToken = t; }, 'expired-callback': () => { tsToken = ''; } });
    };
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsReady';
    s.async = true;
    document.head.appendChild(s);
  };
  form.addEventListener('focusin', loadTurnstile, { once: true });

  const field = (id) => $(`#${id}`).closest('.f');
  const setBad = (id, bad) => {
    field(id).classList.toggle('bad', bad);
    $(`#${id}`).setAttribute('aria-invalid', bad ? 'true' : 'false');
  };
  const validate = () => {
    const fn = $('#fn').value.trim();
    const em = $('#em').value.trim();
    const ms = $('#ms').value.trim();
    const okEm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    setBad('fn', !fn); setBad('em', !okEm); setBad('ms', !ms);
    const firstBad = !fn ? 'fn' : !okEm ? 'em' : !ms ? 'ms' : '';
    if (firstBad) $(`#${firstBad}`).focus();
    return !firstBad;
  };
  ['fn', 'em', 'ms'].forEach((id) => $(`#${id}`).addEventListener('input', () => setBad(id, false)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = ''; msg.classList.remove('err');
    if (!validate()) return;
    if ($('input[name="website"]').value) return; // honeypot
    send.disabled = true;
    const label = send.textContent;
    send.textContent = 'Sending…';
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: $('#fn').value,
          lastName: $('#ln').value,
          email: $('#em').value,
          message: $('#ms').value,
          service,
          turnstileToken: tsToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again or email create@levproductions.com.au.');
      slip.classList.add('is-done');
      form.reset();
      setService('');
    } catch (err) {
      msg.classList.add('err');
      msg.textContent = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      if (window.turnstile && tsLoaded) { try { window.turnstile.reset(); tsToken = ''; } catch (_) { /* noop */ } }
    } finally {
      send.disabled = false;
      send.textContent = label;
    }
  });

  const yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
