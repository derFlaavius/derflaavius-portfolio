// Zentrale, leicht editierbare Kanalwerte.
// Kalendertermine: Hier kannst du Streams, Events und Pausen eintragen.
// type: "stream", "event" oder "pause"
// date/endDate: YYYY-MM-DD | time ist optional
const calendarEntries = [
  { date: "2024-07-18", time: "19:00", type: "stream", title: "Community-Stream" },
  { date: "2026-08-28", time: "09:00", type: "event", title: "Gamescom" },
  { date: "2026-08-13", endDate: "2026-08-24", type: "pause", title: "Sommerpause" }
];

const channelData = {
  followers: 50,
  averageViewers: 5,
  affiliateYear: 2025
};

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  navToggle?.addEventListener("click", () => {
    const open = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle?.classList.remove("is-active");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.getElementById("current-year").textContent = new Date().getFullYear();
  applyChannelData();
  initRevealAnimation();
  initCounters();
  initTiltEffect();
  initSeamlessTicker();
  initCalendar();
});

function applyChannelData() {
  const counters = document.querySelectorAll(".stat-value[data-count]");
  if (counters[0]) counters[0].dataset.count = channelData.followers;
  if (counters[1]) counters[1].dataset.count = channelData.averageViewers;
  if (counters[2]) counters[2].dataset.count = channelData.affiliateYear;
}

function initRevealAnimation() {
  const items = document.querySelectorAll(".reveal");
  items.forEach((item) => {
    const delay = item.dataset.delay || 0;
    item.style.setProperty("--delay", `${delay}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: "0px 0px 80px 0px" });

  items.forEach((item) => observer.observe(item));
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-value[data-count]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (element) => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    if (!Number.isFinite(target)) return;

    if (reducedMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }

    const duration = target > 1000 ? 1000 : 850;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      element.textContent = `${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function initTiltEffect() {
  const card = document.querySelector(".tilt-card");
  if (!card || window.matchMedia("(pointer: coarse)").matches) return;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotate(3deg) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotate(3deg) rotateY(0deg) rotateX(0deg) translateY(0)";
  });
}



function initSeamlessTicker() {
  const ticker = document.querySelector(".ticker");
  const track = document.getElementById("ticker-track");
  const originalGroup = document.getElementById("ticker-group");
  if (!ticker || !track || !originalGroup) return;

  const baseMarkup = originalGroup.innerHTML;
  let resizeTimer;

  const buildTicker = () => {
    track.replaceChildren();

    const firstGroup = document.createElement("div");
    firstGroup.className = "ticker-group";
    firstGroup.innerHTML = baseMarkup;
    track.appendChild(firstGroup);

    // Ein kompletter Abschnitt muss breiter als der sichtbare Bereich sein.
    // Sonst erscheint auf großen Bildschirmen zwischen den Wiederholungen eine Lücke.
    while (firstGroup.scrollWidth < ticker.clientWidth + 120) {
      firstGroup.insertAdjacentHTML("beforeend", baseMarkup);
    }

    const secondGroup = firstGroup.cloneNode(true);
    secondGroup.setAttribute("aria-hidden", "true");
    track.appendChild(secondGroup);

    const distance = firstGroup.getBoundingClientRect().width;
    const pixelsPerSecond = 68;
    const duration = Math.max(14, distance / pixelsPerSecond);

    track.style.setProperty("--ticker-distance", `${distance}px`);
    track.style.setProperty("--ticker-duration", `${duration}s`);
  };

  buildTicker();

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(buildTicker, 160);
  });
}

function initCalendar() {
  const grid = document.getElementById("calendar-grid");
  const monthLabel = document.getElementById("calendar-month");
  const previousButton = document.getElementById("calendar-prev");
  const nextButton = document.getElementById("calendar-next");
  const todayButton = document.getElementById("calendar-today");

  if (!grid || !monthLabel) return;

  const today = startOfDay(new Date());
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const render = () => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    monthLabel.textContent = visibleMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
    grid.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();
    const totalCells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;

    for (let index = 0; index < totalCells; index += 1) {
      let cellDate;
      let outside = false;

      if (index < mondayOffset) {
        const day = previousMonthDays - mondayOffset + index + 1;
        cellDate = new Date(year, month - 1, day);
        outside = true;
      } else if (index >= mondayOffset + daysInMonth) {
        const day = index - mondayOffset - daysInMonth + 1;
        cellDate = new Date(year, month + 1, day);
        outside = true;
      } else {
        cellDate = new Date(year, month, index - mondayOffset + 1);
      }

      const dayCell = document.createElement("article");
      dayCell.className = "calendar-day";
      if (outside) dayCell.classList.add("is-outside");
      if (sameDay(cellDate, today)) dayCell.classList.add("is-today");
      dayCell.setAttribute("aria-label", cellDate.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));

      const number = document.createElement("span");
      number.className = "calendar-day-number";
      number.textContent = String(cellDate.getDate());
      dayCell.appendChild(number);

      const entries = entriesForDate(cellDate);
      const entryList = document.createElement("div");
      entryList.className = "calendar-day-entries";

      entries.forEach((entry) => {
        const item = document.createElement("div");
        item.className = `calendar-entry calendar-entry-${entry.type}`;
        item.title = `${entry.time ? `${entry.time} · ` : ""}${entry.title}`;

        if (entry.time) {
          const time = document.createElement("span");
          time.className = "calendar-entry-time";
          time.textContent = entry.time;
          item.appendChild(time);
        }

        const title = document.createElement("span");
        title.className = "calendar-entry-title";
        title.textContent = entry.title;
        item.appendChild(title);
        entryList.appendChild(item);
      });

      dayCell.appendChild(entryList);
      grid.appendChild(dayCell);
    }
  };

  previousButton?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    render();
  });

  nextButton?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    render();
  });

  todayButton?.addEventListener("click", () => {
    visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    render();
  });

  render();
}

function entriesForDate(date) {
  const day = startOfDay(date);
  return calendarEntries.filter((entry) => {
    const start = parseLocalDate(entry.date);
    const end = parseLocalDate(entry.endDate || entry.date);
    return day >= start && day <= end;
  });
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}
