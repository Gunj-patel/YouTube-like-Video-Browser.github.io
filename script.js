const CATEGORY_API = "https://acharyaprashant.org/api/v2/uni/category";
const VIDEO_API = "https://acharyaprashant.org/api/v2/uni/yt";

let videos = [];
let visibleVideos = [];

const state = {
  language: "ALL",
  category: "ALL",
  sort: "latest",
  year: "ALL",
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
    applyClientSideFilters();
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
  allBtn.classList.add("active");
  allBtn.onclick = () => {
    state.category = "ALL";
    setActive(allBtn, ".categories button");
    fetchVideos();
  };
  container.appendChild(allBtn);

  data.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.title.english;
    btn.onclick = () => {
      state.category = cat.id;
      setActive(btn, ".categories button");
      fetchVideos();
    };
    container.appendChild(btn);
  });
}

async function fetchVideos() {
  const params = new URLSearchParams({
    limit: 30,
    offset: 0,
    orderBy: 1,
  });

  if (state.category !== "ALL") params.append("categoryId", state.category);
  if (state.language === "ENG") params.append("language", 2);
  if (state.language === "HINDI") params.append("language", 1);

  const res = await fetch(`${VIDEO_API}?${params}`);
  const json = await res.json();

  videos = json.data || [];
  applyClientSideFilters();
}

function applyClientSideFilters() {
  let list = [...videos];
  if (state.year !== "ALL") {
    list = list.filter(
      (v) =>
        v.publishedAt && new Date(v.publishedAt).getFullYear() == state.year
    );
  }
  if (state.sort === "views") {
    list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  }
  if (state.sort === "oldest") {
    list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  }
  visibleVideos = list;
  renderVideos();
}

function renderVideos() {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";

  visibleVideos.forEach((v) => {
    const img =
      v.video?.thumbnailURL ||
      "https://via.placeholder.com/300x140?text=No+Image";
    const time = v.publishedAt ? timeAgo(v.publishedAt) : "";

    const div = document.createElement("div");
    div.className = "video-card";
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

    if (v.tags && v.tags.length) {
      const tags = document.createElement("div");
      tags.className = "tags-container";
      v.tags.slice(0, 2).forEach((t) => {
        const span = document.createElement("span");
        span.className = "tag-box";
        span.textContent = t;
        tags.appendChild(span);
      });
      if (v.tags.length > 2) {
        const more = document.createElement("span");
        more.className = "tag-box";
        more.textContent = `+${v.tags.length - 2}`;
        tags.appendChild(more);
      }
      div.appendChild(tags);
    }

    grid.appendChild(div);
  });
}

function formatViews(count) {
  if (!count || count < 1000) return count || 0;
  if (count < 1_000_000)
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days >= 365) return `${Math.floor(days / 365)} years ago`;
  if (days >= 30) return `${Math.floor(days / 30)} months ago`;
  return `${days} days ago`;
}

function setActive(btn, selector) {
  document
    .querySelectorAll(selector)
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
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
    applyClientSideFilters();
  };
});

const categories = document.querySelector(".categories");
const container = document.querySelector(".categories-container");
const leftBtn = document.querySelector(".cat-scroll-btn.left");
const rightBtn = document.querySelector(".cat-scroll-btn.right");

leftBtn.onclick = () => categories.scrollBy({ left: -200, behavior: "smooth" });

rightBtn.onclick = () => categories.scrollBy({ left: 200, behavior: "smooth" });

fetchCategories();
fetchVideos();
