// KCC Clinic homepage behaviour. Everything here is progressive: without scripts all content is visible
// (all works stacked, before/after side by side, menu works through <details>).
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- mobile menu: close on link, Escape and outside click ---------- */
const menu = document.querySelector<HTMLDetailsElement>("[data-menu]");
if (menu) {
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector<HTMLElement>("summary")?.focus();
    }
  });
  menu.addEventListener("toggle", () => {
    document.documentElement.style.overflow = menu.open ? "hidden" : "";
  });
  window.matchMedia("(min-width: 64rem)").addEventListener("change", (e) => { if (e.matches) menu.open = false; });
}

/* ---------- call bar: hidden only while the hero call button itself is on screen ---------- */
const callbar = document.querySelector<HTMLElement>("[data-callbar]");
const hero = document.querySelector<HTMLElement>("#hero .hero__actions");
if (callbar && hero && "IntersectionObserver" in window) {
  const setHidden = (hidden: boolean) => {
    callbar.classList.toggle("is-hidden", hidden);
    if (hidden) callbar.setAttribute("inert", ""); else callbar.removeAttribute("inert");
  };
  setHidden(true);
  new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0 }).observe(hero);
}

/* ---------- motion 3: the spine of #directions fills as the visitor passes the stops ---------- */
const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-stop-panel]"));
const spineLinks = Array.from(document.querySelectorAll<HTMLElement>("[data-spine-link]"));
const spineFill = document.querySelector<HTMLElement>("[data-spine-fill]");
if (panels.length && "IntersectionObserver" in window) {
  let current = -1;
  const apply = (idx: number) => {
    if (idx === current) return;
    current = idx;
    panels.forEach((p, i) => {
      p.classList.toggle("is-passed", i < idx);
      p.classList.toggle("is-current", i === idx);
    });
    spineLinks.forEach((l, i) => {
      l.classList.toggle("is-passed", i < idx);
      l.classList.toggle("is-current", i === idx);
      if (i === idx) l.setAttribute("aria-current", "step"); else l.removeAttribute("aria-current");
    });
    if (spineFill) spineFill.style.setProperty("--progress", String(idx < 0 ? 0 : idx / Math.max(1, panels.length - 1)));
  };
  const visible = new Set<number>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const i = panels.indexOf(e.target as HTMLElement);
      if (e.isIntersecting) visible.add(i); else visible.delete(i);
    }
    if (visible.size) apply(Math.min(...visible));
  }, { rootMargin: "-35% 0px -55% 0px" });
  panels.forEach((p) => io.observe(p));
}

/* ---------- motion 4: before / after ---------- */
document.querySelectorAll<HTMLElement>("[data-ba]").forEach((ba) => {
  const range = ba.querySelector<HTMLInputElement>("[data-ba-range]");
  const buttons = Array.from(ba.querySelectorAll<HTMLButtonElement>("[data-ba-show]"));
  if (!range) return;
  const set = (value: number, animate: boolean) => {
    ba.classList.toggle("is-animating", animate && !reduceMotion);
    ba.style.setProperty("--pos", `${value}%`);
    range.value = String(value);
    buttons.forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.baShow === "before" && value === 100) || (b.dataset.baShow === "after" && value === 0))));
  };
  range.addEventListener("input", () => set(Number(range.value), false));
  buttons.forEach((b) => b.addEventListener("click", () => set(b.dataset.baShow === "before" ? 100 : 0, true)));
  ba.addEventListener("transitionend", () => ba.classList.remove("is-animating"));
});

/* ---------- cases: tabs by route stop, several works inside one stop ---------- */
const tablist = document.querySelector<HTMLElement>("[data-tabs]");
if (tablist) {
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>("[role=tab]"));
  const tabPanels = Array.from(document.querySelectorAll<HTMLElement>("[data-panel]"));
  const select = (tab: HTMLButtonElement, focus: boolean) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    tabPanels.forEach((p) => {
      const on = p.dataset.panel === tab.dataset.tab;
      p.hidden = !on;
      if (on) p.querySelectorAll<HTMLElement>(".work:not([hidden])").forEach((w) => fadeIn(w));
    });
    if (focus) tab.focus();
  };
  tablist.hidden = false;
  const initial = tabs.find((t) => t.getAttribute("aria-selected") === "true") ?? tabs[0];
  tabPanels.forEach((p) => { p.hidden = p.dataset.panel !== initial.dataset.tab; p.tabIndex = 0; });
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t, false));
    t.addEventListener("keydown", (e) => {
      const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
    });
  });

  // works switcher inside one stop (e.g. whitening and veneers)
  tabPanels.forEach((panel) => {
    const works = Array.from(panel.querySelectorAll<HTMLElement>("[data-work]"));
    if (works.length < 2) return;
    const show = (idx: number) => {
      works.forEach((w, i) => { w.hidden = i !== idx; });
      fadeIn(works[idx]);
      works[idx].querySelectorAll<HTMLButtonElement>("[data-show-work]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.showWork) === idx)));
    };
    panel.querySelectorAll<HTMLButtonElement>("[data-show-work]").forEach((b) => b.addEventListener("click", () => {
      const idx = Number(b.dataset.showWork);
      show(idx);
      works[idx].querySelector<HTMLButtonElement>(`[data-show-work="${idx}"]`)?.focus();
    }));
    show(0);
  });
}

function fadeIn(el: HTMLElement) {
  if (reduceMotion) return;
  el.classList.remove("is-entering");
  void el.offsetWidth;
  el.classList.add("is-entering");
}

/* ---------- directions on phones: one stop open, the rest folded to their first price ---------- */
const folds = Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-fold]"));
const phone = window.matchMedia("(max-width: 63.99rem)");
const foldFor = (hash: string) => (hash.startsWith("#route-") ? document.querySelector(hash)?.querySelector<HTMLDetailsElement>("[data-fold]") : null) ?? null;
const openOnly = (target: HTMLDetailsElement) => folds.forEach((d) => { d.open = d === target; });
const setupFolds = () => {
  if (!folds.length) return;
  if (phone.matches) {
    openOnly(foldFor(location.hash) ?? folds[0]);
    folds.forEach((d) => d.querySelector("summary")?.removeAttribute("tabindex"));
  } else {
    folds.forEach((d) => { d.open = true; d.querySelector("summary")?.setAttribute("tabindex", "-1"); });
  }
};
setupFolds();
phone.addEventListener("change", setupFolds);
folds.forEach((d) => {
  d.addEventListener("toggle", () => {
    if (!phone.matches) { if (!d.open) d.open = true; return; }
    if (d.open) folds.forEach((o) => { if (o !== d) o.open = false; });
  });
});
// a route link opens its stop before the browser scrolls to it
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#route-"]');
  if (!a || !phone.matches) return;
  const f = foldFor(a.getAttribute("href") ?? "");
  if (f) openOnly(f);
}, true);
window.addEventListener("hashchange", () => { const f = foldFor(location.hash); if (f && phone.matches && !f.open) openOnly(f); });
