const biliSearchBase = "https://search.bilibili.com/all";
const biliApiBase = "https://api.bilibili.com/x/web-interface/search/all/v2";
const storageKey = "bili-drama-shows";
const previewStorageKey = "bili-drama-previews";

const defaultShows = [
  { title: "想见你", type: "国剧" },
  { title: "去有风的地方", type: "国剧" },
  { title: "重启人生", type: "日剧" },
  { title: "神探夏洛克", type: "英剧" },
  { title: "怪奇物语", type: "美剧" },
  { title: "葬送的芙莉莲", type: "动漫" },
  { title: "孤独摇滚", type: "动漫" },
  { title: "生活大爆炸", type: "美剧" },
  { title: "胜者即是正义", type: "日剧" },
];

const state = {
  shows: [],
  previews: {},
  type: "all",
  query: "",
};

const grid = document.querySelector("#videoGrid");
const searchForm = document.querySelector("#biliSearchForm");
const searchInput = document.querySelector("#biliSearchInput");
const managerForm = document.querySelector("#showManagerForm");
const showTitleInput = document.querySelector("#showTitleInput");
const showTypeInput = document.querySelector("#showTypeInput");

function getBiliSearchUrl(keyword) {
  const params = new URLSearchParams({ keyword });
  return `${biliSearchBase}?${params.toString()}`;
}

function getBiliApiUrl(keyword) {
  const params = new URLSearchParams({ keyword });
  return `${biliApiBase}?${params.toString()}`;
}

function getBiliJsonpUrl(keyword, callbackName) {
  const params = new URLSearchParams({
    keyword,
    jsonp: "jsonp",
    callback: callbackName,
  });
  return `${biliApiBase}?${params.toString()}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  return template.content.textContent || "";
}

function normalizeImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  return url;
}

function getInitial(title) {
  return Array.from(title)[0] || "剧";
}

function loadPreviews() {
  try {
    const savedPreviews = JSON.parse(window.localStorage.getItem(previewStorageKey));
    return savedPreviews && typeof savedPreviews === "object" ? savedPreviews : {};
  } catch {
    return {};
  }
}

function savePreviews() {
  try {
    window.localStorage.setItem(previewStorageKey, JSON.stringify(state.previews));
  } catch {
    // Preview cache is optional.
  }
}

function getVideoResults(payload) {
  const groups = Array.isArray(payload?.data?.result) ? payload.data.result : [];
  const videoGroup = groups.find((group) => group.result_type === "video");
  return Array.isArray(videoGroup?.data) ? videoGroup.data : [];
}

function pickPreviewResult(results, keyword) {
  const normalizedKeyword = keyword.toLowerCase();
  return (
    results.find((item) => item.type === "video" && stripHtml(item.title).toLowerCase().includes(normalizedKeyword)) ||
    results.find((item) => item.type === "video" && item.pic) ||
    null
  );
}

function mapPreviewResult(result) {
  if (!result) return null;

  return {
    title: stripHtml(result.title),
    cover: normalizeImageUrl(result.pic || result.cover),
    description: stripHtml(result.description || result.desc || result.tag || result.typename || ""),
    author: result.author || result.uname || "",
    url: result.arcurl || (result.bvid ? `https://www.bilibili.com/video/${result.bvid}` : ""),
  };
}

function requestBiliJsonp(keyword) {
  return new Promise((resolve, reject) => {
    const callbackName = `__biliPreview_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Bilibili preview request timed out"));
    }, 8000);

    function cleanup() {
      window.clearTimeout(timer);
      script.remove();
      delete window[callbackName];
    }

    window[callbackName] = (payload) => {
      cleanup();
      resolve(payload);
    };

    script.src = getBiliJsonpUrl(keyword, callbackName);
    script.onerror = () => {
      cleanup();
      reject(new Error("Bilibili preview request failed"));
    };

    document.head.append(script);
  });
}

async function fetchBiliPreview(show) {
  if (state.previews[show.title]) return;

  try {
    let payload = null;
    try {
      const response = await fetch(getBiliApiUrl(show.title));
      if (response.ok) {
        payload = await response.json();
      }
    } catch {
      payload = await requestBiliJsonp(show.title);
    }

    if (!payload) {
      payload = await requestBiliJsonp(show.title);
    }

    if (!payload) return;

    const result = pickPreviewResult(getVideoResults(payload), show.title);
    const preview = mapPreviewResult(result);
    if (!preview) return;

    state.previews[show.title] = preview;
    savePreviews();
    renderShows();
  } catch {
    // Bilibili may block browser-side requests; the search link remains available.
  }
}

function loadShows() {
  try {
    const savedShows = JSON.parse(window.localStorage.getItem(storageKey));
    return Array.isArray(savedShows) && savedShows.length > 0 ? savedShows : defaultShows;
  } catch {
    return defaultShows;
  }
}

function saveShows() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state.shows));
  } catch {
    // The page still works for the current visit when storage is unavailable.
  }
}

function getFilteredShows() {
  const query = state.query.trim().toLowerCase();

  return state.shows.filter((show) => {
    const matchesType = state.type === "all" || show.type === state.type;
    const matchesQuery = !query || show.title.toLowerCase().includes(query) || show.type.toLowerCase().includes(query);
    return matchesType && matchesQuery;
  });
}

function renderShows() {
  const filteredShows = getFilteredShows();

  if (filteredShows.length === 0) {
    grid.innerHTML = '<div class="empty-state">没有匹配的剧名。</div>';
    return;
  }

  grid.innerHTML = filteredShows
    .map((show, index) => {
      const searchUrl = getBiliSearchUrl(show.title);
      const preview = state.previews[show.title];
      const cover = preview?.cover
        ? `<img src="${escapeHtml(preview.cover)}" alt="${escapeHtml(preview.title || show.title)}" loading="lazy" referrerpolicy="no-referrer" />`
        : `<span class="cover-initial">${escapeHtml(getInitial(show.title))}</span>`;
      const targetUrl = preview?.url || searchUrl;
      const cardTitle = preview?.title || show.title;
      const description = preview?.description || preview?.author || "B站搜索预览";

      return `
        <article class="video-card">
          <a class="video-cover cover-${index % 5}" href="${targetUrl}" target="_blank" rel="noreferrer" aria-label="在哔哩哔哩打开${escapeHtml(show.title)}">
            ${cover}
            <span class="cover-badge">${escapeHtml(show.type)}</span>
            <span class="cover-play">
              <i data-lucide="play" aria-hidden="true"></i>
            </span>
            <div class="cover-meta">
              <span><i data-lucide="${preview ? "tv" : "search"}" aria-hidden="true"></i>${preview ? "B站预览" : "B站搜索"}</span>
            </div>
          </a>
          <div class="video-info">
            <h2>
              <a href="${targetUrl}" target="_blank" rel="noreferrer">${escapeHtml(cardTitle)}</a>
            </h2>
            <p>${escapeHtml(description)}</p>
            <div class="video-actions">
              <a class="search-link" href="${searchUrl}" target="_blank" rel="noreferrer">
                <i data-lucide="search" aria-hidden="true"></i>
                B站搜索
              </a>
              <button class="delete-show" type="button" data-title="${escapeHtml(show.title)}" aria-label="删除${escapeHtml(show.title)}">
                <i data-lucide="trash-2" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }

  filteredShows.forEach(fetchBiliPreview);
}

function searchBili(keyword) {
  const value = keyword.trim();
  if (!value) return;

  window.open(getBiliSearchUrl(value), "_blank", "noreferrer");
}

function initEvents() {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBili(searchInput.value);
  });

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderShows();
  });

  document.querySelectorAll(".quick-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(".quick-chip.is-active")?.classList.remove("is-active");
      button.classList.add("is-active");
      state.type = button.dataset.type || "all";
      renderShows();
    });
  });

  managerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = showTitleInput.value.trim();
    const type = showTypeInput.value;
    if (!title) return;

    const existing = state.shows.find((show) => show.title === title);
    if (existing) {
      existing.type = type;
      delete state.previews[title];
    } else {
      state.shows.unshift({ title, type });
    }

    saveShows();
    showTitleInput.value = "";
    state.query = "";
    searchInput.value = "";
    renderShows();
  });

  grid.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-show");
    if (!deleteButton) return;

    event.preventDefault();
    event.stopPropagation();

    const title = deleteButton.dataset.title;
    state.shows = state.shows.filter((show) => show.title !== title);
    delete state.previews[title];
    saveShows();
    savePreviews();
    renderShows();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  state.shows = loadShows();
  state.previews = loadPreviews();
  initEvents();
  renderShows();
});
