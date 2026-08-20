const portfolioGrid =
  document.getElementById("portfolioGrid");

const emptyState =
  document.getElementById("emptyState");

const filterButtons =
  [...document.querySelectorAll(".filter-button")];

const lightbox =
  document.getElementById("lightbox");

const lightboxClose =
  document.querySelector(".lightbox-close");

const lightboxImage =
  document.getElementById("lightboxImage");

const lightboxMedium =
  document.getElementById("lightboxMedium");

const lightboxTitle =
  document.getElementById("lightboxTitle");

const lightboxDescription =
  document.getElementById("lightboxDescription");

let artworks = [];
let currentFilter = "all";

async function loadArtworks() {
  try {
    const response =
      await fetch("data/artworks.json");

    if (!response.ok) {
      throw new Error(
        "Could not load artwork data."
      );
    }

    artworks =
      await response.json();

    applyFilterFromUrl();
  }

  catch (error) {
    console.error(error);

    portfolioGrid.innerHTML = `
      <p class="empty-state">
        Artwork data could not be loaded.
        If you opened this file directly,
        preview it through a local server
        or GitHub Pages.
      </p>
    `;
  }
}

function applyFilterFromUrl() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const requestedFilter =
    params.get("medium");

  const validFilter =
    filterButtons.some(
      (button) =>
        button.dataset.filter ===
        requestedFilter
    );

  if (
    requestedFilter &&
    validFilter
  ) {
    currentFilter =
      requestedFilter;
  }

  setActiveFilter(
    currentFilter
  );

  renderArtworks();
}

function setActiveFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach(
    (button) => {
      button.classList.toggle(
        "active",
        button.dataset.filter === filter
      );
    }
  );
}

function renderArtworks() {
  const visibleArtworks =
    currentFilter === "all"
      ? artworks
      : artworks.filter(
          (artwork) =>
            artwork.medium === currentFilter
        );

  portfolioGrid.innerHTML = "";

  emptyState.hidden =
    visibleArtworks.length !== 0;

  visibleArtworks.forEach(
    (artwork) => {
      const article =
        document.createElement("article");

      article.className =
        "art-card portfolio-card";

      const button =
        document.createElement("button");

      button.type = "button";

      button.setAttribute(
        "aria-label",
        `View ${artwork.title}`
      );

      button.innerHTML = `
        <div class="image-placeholder">
          ${artwork.image}
        </div>

        <div class="art-card-copy">
          <h3>${artwork.title}</h3>

          <p>
            ${artwork.mediumLabel}
          </p>
        </div>
      `;

      button.addEventListener(
        "click",
        () => openLightbox(artwork)
      );

      article.appendChild(button);

      portfolioGrid.appendChild(article);
    }
  );
}

/* Category filter buttons */

filterButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        const filter =
          button.dataset.filter;

        setActiveFilter(filter);

        renderArtworks();

        const url =
          new URL(window.location);

        if (filter === "all") {
          url.searchParams.delete(
            "medium"
          );
        }

        else {
          url.searchParams.set(
            "medium",
            filter
          );
        }

        window.history.replaceState(
          {},
          "",
          url
        );
      }
    );
  }
);

/* Artwork popup */

function openLightbox(artwork) {
  lightboxImage.textContent =
    artwork.image;

  lightboxMedium.textContent =
    artwork.mediumLabel;

  lightboxTitle.textContent =
    artwork.title;

  lightboxDescription.textContent =
    artwork.description;

  lightbox.hidden = false;

  document.body.classList.add(
    "lightbox-open"
  );

  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;

  document.body.classList.remove(
    "lightbox-open"
  );
}

lightboxClose.addEventListener(
  "click",
  closeLightbox
);

lightbox.addEventListener(
  "click",
  (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      !lightbox.hidden
    ) {
      closeLightbox();
    }
  }
);

loadArtworks();
