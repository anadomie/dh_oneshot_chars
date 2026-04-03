document.addEventListener("DOMContentLoaded", () => {
  const bookElement = document.getElementById("book");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const frame = document.querySelector(".book-frame");
  const scaler = document.getElementById("book-scale");

  const DESIGN_PAGE_WIDTH = 800;
  const DESIGN_PAGE_HEIGHT = 1000;
  const DESIGN_SPREAD_WIDTH = 1600;
  const DESIGN_SPREAD_HEIGHT = 1000;

  const ZOOM_STEP = 0.05;
  const MIN_ZOOM = 0.45;
  const MAX_ZOOM = 1.5;

const pageFlip = new St.PageFlip(bookElement, {
  width: DESIGN_PAGE_WIDTH,
  height: DESIGN_PAGE_HEIGHT,
  size: "fixed",
  minWidth: DESIGN_PAGE_WIDTH,
  maxWidth: DESIGN_PAGE_WIDTH,
  minHeight: DESIGN_PAGE_HEIGHT,
  maxHeight: DESIGN_PAGE_HEIGHT,
  startPage: 0,
  showCover: false,
  usePortrait: false,
  drawShadow: true,
  maxShadowOpacity: 0.35,
  flippingTime: 900,
  autoSize: false,
  mobileScrollSupport: false,
  clickEventForward: true,

  disableFlipByClick: true,
  showPageCorners: false,
  useMouseEvents: false
});

  pageFlip.loadFromHTML(document.querySelectorAll("#book .page"));

  function updateButtons() {
    const pageIndex = pageFlip.getCurrentPageIndex();
    const pageCount = pageFlip.getPageCount();
    const maxStartIndex = Math.max(0, pageCount - 2);

    prevBtn.disabled = pageIndex <= 0;
    nextBtn.disabled = pageIndex >= maxStartIndex;
  }

  function roundDownToStep(value, step) {
    return Math.floor(value / step) * step;
  }

  function resizeBookByZoom() {
    const availableWidth = frame.clientWidth;
    const availableHeight = frame.clientHeight;

    const rawZoom = Math.min(
      availableWidth / DESIGN_SPREAD_WIDTH,
      availableHeight / DESIGN_SPREAD_HEIGHT
    );

    const steppedZoom = roundDownToStep(rawZoom, ZOOM_STEP);
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, steppedZoom));

    scaler.style.zoom = String(zoom);
  }

  function setPortrait(groupName, portraitName) {
    const group = document.querySelector(`[data-portrait-group="${groupName}"]`);
    if (!group) return;

    const images = group.querySelectorAll("[data-portrait-image]");
    images.forEach((img) => {
      const isActive = img.getAttribute("data-portrait-image") === portraitName;
      img.classList.toggle("is-active", isActive);
    });

    const buttons = document.querySelectorAll(`[data-portrait-target="${groupName}"]`);
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-portrait") === portraitName;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  prevBtn.addEventListener("click", () => {
    if (!prevBtn.disabled) {
      pageFlip.flipPrev("top");
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!nextBtn.disabled) {
      pageFlip.flipNext("top");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && !prevBtn.disabled) {
      event.preventDefault();
      pageFlip.flipPrev("top");
    }

    if (event.key === "ArrowRight" && !nextBtn.disabled) {
      event.preventDefault();
      pageFlip.flipNext("top");
    }
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-portrait-target]");
    if (!button) return;

    const groupName = button.getAttribute("data-portrait-target");
    const portraitName = button.getAttribute("data-portrait");
    setPortrait(groupName, portraitName);
  });

  pageFlip.on("init", updateButtons);
  pageFlip.on("flip", updateButtons);
  pageFlip.on("update", updateButtons);

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeBookByZoom();
    }, 120);
  });

  updateButtons();
  setPortrait("harlekin", "male");
  resizeBookByZoom();
});