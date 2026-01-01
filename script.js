const CATEGORY_API = "https://acharyaprashant.org/api/v2/uni/category";
const VIDEO_API = "https://acharyaprashant.org/api/v2/uni/yt";

let videos = [];

const state = {
  language: "ALL",
  category: "ALL",
  sort: "latest",
  year: "ALL",
  limit: 30,
  offset: 0,
};

const yearBtn = document.getElementById("yearBtn");
const yearMenu = document.getElementById("yearMenu");

const years = ["ALL"];
for (let y = 2025; y >= 2011; y--) years.push(y);

years.forEach((y) => {
  const div = document.createElement("div");
  div.textContent = y === "ALL" ? "All" : y;

  div.onclick = () => {
    state.year = y;
    yearBtn.textContent = y === "ALL" ? "Year" : y;
    yearBtn.classList.remove("active");
    yearMenu.classList.remove("show");
    fetchVideos();
  };

  yearMenu.appendChild(div);
});

yearBtn.onclick = (e) => {
  e.stopPropagation();
  yearBtn.classList.toggle("active");
  yearMenu.classList.toggle("show");
};

document.addEventListener("click", () => {
  yearBtn.classList.remove("active");
  yearMenu.classList.remove("show");
});

async function fetchCategories() {
  const res = await fetch(CATEGORY_API);
  const data = (await res.json()).categories;

  const container = document.querySelector(".categories");
  container.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "All Videos";
  allBtn.dataset.cat = "ALL";
  allBtn.classList.add("active");

  allBtn.onclick = () => {
    state.category = "ALL";
    state.offset = 0;
    setActive(allBtn, ".categories button");
    fetchVideos();
  };

  container.appendChild(allBtn);

  data.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.title.english;
    btn.dataset.cat = cat.id;

    btn.onclick = () => {
      state.category = cat.id;
      state.offset = 0;
      setActive(btn, ".categories button");
      fetchVideos();
    };

    container.appendChild(btn);
  });
}

async function fetchVideos() {
  const params = new URLSearchParams({
    limit: state.limit,
    offset: state.offset,
    orderBy: state.sort === "latest" ? 1 : state.sort === "views" ? 2 : 3,
  });

  if (state.category !== "ALL") params.append("categoryId", state.category);
  if (state.language === "ENG") params.append("language", 2);
  if (state.language === "HINDI") params.append("language", 1);

  const res = await fetch(`${VIDEO_API}?${params}`);
  const json = await res.json();

  videos = json.data || [];

  if (videos.length > 50) videos = videos.slice(0, 50);

  if (state.year !== "ALL") {
    videos = videos.filter(
      (v) =>
        v.publishedAt && new Date(v.publishedAt).getFullYear() == state.year
    );
  }

  renderVideos();
}

function formatViews(count) {
  if (!count || count < 1000) return count || 0;

  if (count < 1_000_000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);

  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  }

  if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }

  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function renderVideos() {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  videos.forEach((v) => {
    const img =
      v.video?.thumbnailURL ||
      "https://via.placeholder.com/300x140?text=No+Image";

    const div = document.createElement("div");
    div.className = "video-card";

    const tagsContainer = document.createElement("div");
    tagsContainer.className = "tags-container";

    if (v.tags && v.tags.length > 0) {
      const firstTwo = v.tags.slice(0, 2);
      firstTwo.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag-box";
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      const remaining = v.tags.length - 2;
      if (remaining > 0) {
        const span = document.createElement("span");
        span.className = "tag-box";
        span.textContent = `+${remaining}`;
        tagsContainer.appendChild(span);
      }
    }

    const time = v.publishedAt ? timeAgo(v.publishedAt) : "";

    div.innerHTML = `
  <img class="thumbnail" src="${img}" />
  <div class="video-info">
    <div class="title">${v.title}</div>
    <div class="meta-line">
      <span>${formatViews(v.viewCount)} views</span>
      <span class="dot"></span>
      <span>${time}</span>
    </div>
  </div>
`;

    div.appendChild(tagsContainer);

    grid.appendChild(div);
  });
}

document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.onclick = () => {
    state.language = btn.dataset.lang;
    setActive(btn, "[data-lang]");
    fetchVideos();
  };
});

document.querySelectorAll("[data-sort]").forEach((btn) => {
  btn.onclick = () => {
    state.sort = btn.dataset.sort;
    setActive(btn, "[data-sort]");
    fetchVideos();
  };
});

function setActive(btn, selector) {
  document
    .querySelectorAll(selector)
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

fetchCategories();
fetchVideos();

const categories = document.querySelector(".categories");
const container = document.querySelector(".categories-container");
const leftBtn = document.querySelector(".cat-scroll-btn.left");
const rightBtn = document.querySelector(".cat-scroll-btn.right");

const scrollAmount = 200;

leftBtn.addEventListener("click", () => {
  categories.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
  categories.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

function updateScrollButtons() {
  const scrollLeft = categories.scrollLeft;
  const scrollWidth = categories.scrollWidth;
  const clientWidth = categories.clientWidth;

  const atStart = scrollLeft <= 1;
  const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

  if (container.dataset.hover === "true") {
    leftBtn.style.display = atStart ? "none" : "block";
    rightBtn.style.display = atEnd ? "none" : "block";
  } else {
    leftBtn.style.display = "none";
    rightBtn.style.display = "none";
  }
}

categories.addEventListener("scroll", updateScrollButtons);

window.addEventListener("resize", updateScrollButtons);

container.addEventListener("mouseenter", () => {
  container.dataset.hover = "true";
  updateScrollButtons();
});

container.addEventListener("mouseleave", () => {
  container.dataset.hover = "false";
  updateScrollButtons();
});

updateScrollButtons();
