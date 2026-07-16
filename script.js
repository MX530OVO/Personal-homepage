const biliSearchBase = "https://search.bilibili.com/all";
const biliApiBase = "https://api.bilibili.com/x/web-interface/search/all/v2";
const biliTypeSearchBase = "https://api.bilibili.com/x/web-interface/search/type";
const storageKey = "personal-homepage-shows";
const previewStorageKey = "personal-homepage-show-previews";
const legacyStorageKey = "bili-drama-shows";
const legacyPreviewStorageKey = "bili-drama-previews";
const avatarStorageKey = "personal-homepage-avatar";
const defaultAvatarUrl = "./assets/avatar.svg";

const knownBiliMedia = [
  {
    aliases: ["疑犯追踪第二季", "疑犯追踪 第二季", "疑犯追踪 第2季", "Person of Interest Season 2"],
    title: "疑犯追踪 第二季",
    cover: "https://i0.hdslb.com/bfs/bangumi/image/1652686dffaefce6f4e01ba83091d6efc25eb26d.png",
    url: "https://www.bilibili.com/bangumi/media/md375978465",
    description: "全 22 集 / B 站剧集海报",
  },
];

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

const knownBiliEntries = {
  妙警贼探: {
    poster: "./assets/white-collar.jpg",
    biliTitle: "妙警贼探",
    description: "美剧 / White Collar",
    biliUrl: getBiliSearchUrl("妙警贼探"),
  },
  小白领: {
    poster: "./assets/white-collar.jpg",
    biliTitle: "妙警贼探",
    description: "美剧 / White Collar",
    biliUrl: getBiliSearchUrl("妙警贼探"),
  },
  WhiteCollar: {
    poster: "./assets/white-collar.jpg",
    biliTitle: "妙警贼探",
    description: "美剧 / White Collar",
    biliUrl: getBiliSearchUrl("妙警贼探"),
  },
  都市侠盗: {
    poster: "./assets/leverage.webp",
    biliTitle: "都市侠盗",
    description: "美剧 / Leverage",
    biliUrl: getBiliSearchUrl("都市侠盗"),
  },
  Leverage: {
    poster: "./assets/leverage.webp",
    biliTitle: "都市侠盗",
    description: "美剧 / Leverage",
    biliUrl: getBiliSearchUrl("都市侠盗"),
  },
  怪奇物语: {
    poster: "./assets/stranger-things.jpg",
    biliTitle: "怪奇物语",
    description: "美剧 / Stranger Things",
    biliUrl: getBiliSearchUrl("怪奇物语"),
  },
  StrangerThings: {
    poster: "./assets/stranger-things.jpg",
    biliTitle: "怪奇物语",
    description: "美剧 / Stranger Things",
    biliUrl: getBiliSearchUrl("怪奇物语"),
  },
  神探夏洛克: {
    poster: "https://i0.hdslb.com/bfs/bangumi/image/b9995b0d198657c97fc434491747da9f1dd5b54f.png",
    biliTitle: "神探夏洛克 第一季",
    description: "电视剧 已完结，全3集",
    biliUrl: "https://www.bilibili.com/bangumi/play/ep1420590",
  },
  神探夏洛克第一季: {
    poster: "https://i0.hdslb.com/bfs/bangumi/image/b9995b0d198657c97fc434491747da9f1dd5b54f.png",
    biliTitle: "神探夏洛克 第一季",
    description: "电视剧 已完结，全3集",
    biliUrl: "https://www.bilibili.com/bangumi/play/ep1420590",
  },
  疑犯追踪: {
    poster: "https://i0.hdslb.com/bfs/bangumi/image/7b126640093628543e589547429251762f817ddb.png",
    biliTitle: "疑犯追踪 第一季",
    description: "电视剧 已完结，全23集",
    biliUrl: "https://www.bilibili.com/bangumi/play/ss127402",
  },
  疑犯追踪第一季: {
    poster: "https://i0.hdslb.com/bfs/bangumi/image/7b126640093628543e589547429251762f817ddb.png",
    biliTitle: "疑犯追踪 第一季",
    description: "电视剧 已完结，全23集",
    biliUrl: "https://www.bilibili.com/bangumi/play/ss127402",
  },
  怪盗基德: {
    poster: "./assets/1412.jpg",
    biliTitle: "怪盗基德",
    description: "动漫 / KID",
    biliUrl: getBiliSearchUrl("怪盗基德"),
  },
  怪盗基德KID: {
    poster: "./assets/1412.jpg",
    biliTitle: "怪盗基德",
    description: "动漫 / KID",
    biliUrl: getBiliSearchUrl("怪盗基德"),
  },
  怪盗基德1412: {
    poster: "./assets/1412.jpg",
    biliTitle: "怪盗基德",
    description: "动漫 / KID",
    biliUrl: getBiliSearchUrl("怪盗基德"),
  },
  魔术快斗: {
    poster: "./assets/1412.jpg",
    biliTitle: "怪盗基德",
    description: "动漫 / KID",
    biliUrl: getBiliSearchUrl("怪盗基德"),
  },
  MagicKaito: {
    poster: "./assets/1412.jpg",
    biliTitle: "怪盗基德",
    description: "动漫 / KID",
    biliUrl: getBiliSearchUrl("怪盗基德"),
  },
};

const state = {
  shows: [],
  previews: {},
  pendingPreviews: new Set(),
  draggedTitle: "",
  type: "all",
  query: "",
};

const elements = {};

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

function getBiliTypeSearchUrl(keyword, searchType) {
  const params = new URLSearchParams({
    search_type: searchType,
    keyword,
  });
  return `${biliTypeSearchBase}?${params.toString()}`;
}

function getBiliTypeJsonpUrl(keyword, searchType, callbackName) {
  const params = new URLSearchParams({
    search_type: searchType,
    keyword,
    jsonp: "jsonp",
    callback: callbackName,
  });
  return `${biliTypeSearchBase}?${params.toString()}`;
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

function normalizePosterInput(value) {
  const poster = String(value || "").trim();
  if (!poster) return "";
  return normalizeImageUrl(poster);
}

function normalizeSearchText(value) {
  return stripHtml(value)
    .toLowerCase()
    .replaceAll(/\s+/g, "")
    .replaceAll(/[·・:：,，.。!！?？《》<>()（）\[\]【】_-]/g, "");
}

function chineseNumberToValue(value) {
  const text = String(value || "").trim();
  if (/^\d+$/.test(text)) return Number(text);

  const map = {
    一: 1,
    二: 2,
    两: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };

  if (text === "十") return 10;
  if (text.startsWith("十")) return 10 + (map[text.slice(1)] || 0);
  if (text.includes("十")) {
    const [tens, ones] = text.split("十");
    return (map[tens] || 1) * 10 + (map[ones] || 0);
  }

  return map[text] || null;
}

function getSeasonInfo(title) {
  const match = String(title).match(/第\s*([一二两三四五六七八九十\d]+)\s*季|season\s*(\d+)/i);
  if (!match) return null;

  const raw = match[1] || match[2];
  const number = chineseNumberToValue(raw);
  if (!number) return null;

  return {
    raw,
    number,
    chinese: ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][number] || String(number),
  };
}

function getBaseShowTitle(title) {
  return String(title)
    .replace(/第\s*[一二两三四五六七八九十\d]+\s*季/gi, "")
    .replace(/season\s*\d+/gi, "")
    .trim();
}

function getBiliQueryCandidates(show) {
  const title = show.title.trim();
  const baseTitle = getBaseShowTitle(title);
  const season = getSeasonInfo(title);
  const candidates = [title];

  if (season && baseTitle) {
    candidates.push(`${baseTitle} 第${season.chinese}季`);
    candidates.push(`${baseTitle} 第${season.number}季`);
    candidates.push(`${baseTitle}${season.number}`);
    candidates.push(baseTitle);
  }

  return [...new Set(candidates.filter(Boolean))];
}

function getKnownBiliPreview(show) {
  const normalizedTitle = normalizeSearchText(show.title);
  const match = knownBiliMedia.find((item) =>
    item.aliases.some((alias) => normalizeSearchText(alias) === normalizedTitle)
  );

  if (!match) return null;

  return {
    title: match.title,
    cover: match.cover,
    description: match.description,
    author: "",
    badge: match.badge || "",
    url: match.url,
  };
}

function loadJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value || fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 本地存储不可用时，当前页面仍可正常使用。
  }
}

function loadShows() {
  const savedShows = normalizeShows(loadJson(storageKey, null));
  if (savedShows.length > 0) return savedShows;

  const legacyShows = normalizeShows(loadJson(legacyStorageKey, null));
  if (legacyShows.length > 0) {
    saveJson(storageKey, legacyShows);
    return legacyShows;
  }

  saveJson(storageKey, defaultShows);
  return defaultShows;
}

function loadPreviews() {
  const savedPreviews = loadJson(previewStorageKey, null);
  if (savedPreviews && typeof savedPreviews === "object") return stripPreviewBadges(savedPreviews);

  const legacyPreviews = loadJson(legacyPreviewStorageKey, null);
  if (legacyPreviews && typeof legacyPreviews === "object") {
    const cleanedPreviews = stripPreviewBadges(legacyPreviews);
    saveJson(previewStorageKey, cleanedPreviews);
    return cleanedPreviews;
  }

  return {};
}

function stripPreviewBadges(previews) {
  Object.values(previews).forEach((preview) => {
    if (preview && typeof preview === "object") {
      delete preview.badge;
    }
  });

  saveJson(previewStorageKey, previews);
  return previews;
}

function normalizeShows(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((show) => show && typeof show.title === "string" && show.title.trim())
    .map((show) => ({
      title: show.title.trim(),
      type: typeof show.type === "string" && show.type.trim() ? show.type.trim() : "剧集",
      poster: typeof show.poster === "string" ? show.poster : "",
      biliTitle: typeof show.biliTitle === "string" ? show.biliTitle : "",
      description: typeof show.description === "string" ? show.description : "",
      biliUrl: typeof show.biliUrl === "string" ? show.biliUrl : "",
    }));
}

function getVideoResults(payload) {
  const groups = Array.isArray(payload?.data?.result) ? payload.data.result : [];
  const videoGroup = groups.find((group) => group.result_type === "video");
  return Array.isArray(videoGroup?.data) ? videoGroup.data : [];
}

function getTypeResults(payload) {
  return Array.isArray(payload?.data?.result) ? payload.data.result : [];
}

function pickPreviewResult(results, keyword) {
  const normalizedKeyword = normalizeSearchText(keyword);
  const baseKeyword = normalizeSearchText(getBaseShowTitle(keyword));
  const season = getSeasonInfo(keyword);
  const seasonTokens = season
    ? [`第${season.chinese}季`, `第${season.number}季`, `season${season.number}`].map(normalizeSearchText)
    : [];

  return (
    results.find((item) => {
      const title = normalizeSearchText(item.title);
      return item.type === "video" && title.includes(normalizedKeyword);
    }) ||
    results.find((item) => {
      if (!season || !baseKeyword) return false;
      const title = normalizeSearchText(item.title);
      return item.type === "video" && title.includes(baseKeyword) && seasonTokens.some((token) => title.includes(token));
    }) ||
    results.find((item) => {
      if (!baseKeyword) return false;
      const title = normalizeSearchText(item.title);
      return item.type === "video" && title.includes(baseKeyword) && item.pic;
    }) ||
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

function pickTypeResult(results, keyword) {
  const normalizedKeyword = normalizeSearchText(keyword);
  const baseKeyword = normalizeSearchText(getBaseShowTitle(keyword));
  const season = getSeasonInfo(keyword);
  const seasonTokens = season
    ? [`第${season.chinese}季`, `第${season.number}季`, `season${season.number}`].map(normalizeSearchText)
    : [];
  const coverResults = results.filter((item) => item.cover || item.pic);

  return (
    coverResults.find((item) => {
      const title = normalizeSearchText(item.title || item.org_title || item.name);
      return title.includes(normalizedKeyword);
    }) ||
    coverResults.find((item) => {
      if (!season || !baseKeyword) return false;
      const title = normalizeSearchText(item.title || item.org_title || item.name);
      return title.includes(baseKeyword) && seasonTokens.some((token) => title.includes(token));
    }) ||
    coverResults.find((item) => {
      if (!baseKeyword) return false;
      const title = normalizeSearchText(item.title || item.org_title || item.name);
      return title.includes(baseKeyword);
    }) ||
    coverResults[0] ||
    null
  );
}

function mapTypeResult(result) {
  if (!result) return null;

  const title = stripHtml(result.title || result.org_title || result.name || "");
  const description = stripHtml(
    result.desc ||
      result.description ||
      result.index_show ||
      result.cv ||
      result.staff ||
      result.typename ||
      ""
  );

  return {
    title,
    cover: normalizeImageUrl(result.cover || result.pic),
    description,
    author: result.author || result.uname || result.staff || "",
    badge: stripHtml(result.badge || result.badge_info?.text || result.corner || result.label || ""),
    url: result.url || result.arcurl || (result.bvid ? `https://www.bilibili.com/video/${result.bvid}` : ""),
  };
}

function getPosterFallbackMarkup(title) {
  return `
    <div class="poster-loading">
      <span>${escapeHtml(title)}</span>
      <small>自动海报被限制时，可粘贴海报链接</small>
    </div>
  `;
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

function requestBiliTypeJsonp(keyword, searchType) {
  return new Promise((resolve, reject) => {
    const callbackName = `__biliTypePreview_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Bilibili type preview request timed out"));
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

    script.src = getBiliTypeJsonpUrl(keyword, searchType, callbackName);
    script.onerror = () => {
      cleanup();
      reject(new Error("Bilibili type preview request failed"));
    };

    document.head.append(script);
  });
}

async function requestBiliTypeSearch(keyword, searchType) {
  try {
    const response = await fetch(getBiliTypeSearchUrl(keyword, searchType));
    if (response.ok) return response.json();
  } catch {
    // Local file pages often cannot use cross-origin fetch here.
  }

  return requestBiliTypeJsonp(keyword, searchType);
}

function getSearchTypesForShow(show) {
  if (show.type === "动漫") {
    return ["media_bangumi", "media_ft", "video"];
  }

  if (show.type === "电影") {
    return ["media_ft", "media_bangumi", "video"];
  }

  return ["media_ft", "media_bangumi", "video"];
}

function applyPreviewToShow(show, preview) {
  state.previews[show.title] = preview;
  show.poster = preview.cover || "";
  show.biliTitle = preview.title || show.title;
  show.description = preview.description || preview.author || "";
  show.biliUrl = preview.url || "";
  delete show.badge;
  saveJson(storageKey, state.shows);
  saveJson(previewStorageKey, state.previews);
}

async function fetchBiliPreview(show) {
  const knownPreview = getKnownBiliPreview(show);
  if (knownPreview?.cover) {
    if (show.poster === knownPreview.cover && state.previews[show.title]?.cover === knownPreview.cover) {
      return;
    }

    applyPreviewToShow(show, knownPreview);
    renderShows();
    return;
  }

  if (show.poster) return;
  if (state.previews[show.title]?.cover) {
    applyPreviewToShow(show, state.previews[show.title]);
    return;
  }
  if (state.pendingPreviews.has(show.title)) return;

  state.pendingPreviews.add(show.title);

  try {
    let preview = getKnownBiliPreview(show);
    const queryCandidates = getBiliQueryCandidates(show);

    if (!preview?.cover) {
      for (const query of queryCandidates) {
        for (const searchType of getSearchTypesForShow(show)) {
          try {
            const payload = await requestBiliTypeSearch(query, searchType);
            const result = pickTypeResult(getTypeResults(payload), show.title);
            preview = mapTypeResult(result);
            if (preview?.cover) break;
          } catch {
            // Try the next Bilibili category.
          }
        }

        if (preview?.cover) break;
      }
    }

    if (!preview?.cover) {
      for (const query of queryCandidates) {
        try {
          const payload = await requestBiliJsonp(query);
          const result = pickPreviewResult(getVideoResults(payload), show.title);
          preview = mapPreviewResult(result);
          if (preview?.cover) break;
        } catch {
          preview = null;
        }
      }
    }

    if (!preview) return;

    applyPreviewToShow(show, preview);
    renderShows();
  } catch {
    // B 站可能限制浏览器侧请求；保留搜索跳转作为稳定入口。
  } finally {
    state.pendingPreviews.delete(show.title);
  }
}

function getFilteredShows() {
  const query = state.query.trim().toLowerCase();

  return state.shows.filter((show) => {
    const matchesType = state.type === "all" || show.type === state.type;
    const matchesQuery =
      !query || show.title.toLowerCase().includes(query) || show.type.toLowerCase().includes(query);
    return matchesType && matchesQuery;
  });
}

function commitVisibleShowOrder(orderedShows) {
  const orderedTitles = new Set(orderedShows.map((show) => show.title));
  let cursor = 0;

  state.shows = state.shows.map((show) => {
    if (!orderedTitles.has(show.title)) return show;
    const nextShow = orderedShows[cursor];
    cursor += 1;
    return nextShow;
  });

  saveJson(storageKey, state.shows);
  renderShows();
}

function moveVisibleShow(title, offset) {
  const visibleShows = getFilteredShows();
  const currentIndex = visibleShows.findIndex((show) => show.title === title);
  const nextIndex = currentIndex + offset;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= visibleShows.length) return;

  const nextShows = [...visibleShows];
  [nextShows[currentIndex], nextShows[nextIndex]] = [nextShows[nextIndex], nextShows[currentIndex]];
  commitVisibleShowOrder(nextShows);
}

function dropVisibleShow(draggedTitle, targetTitle, placeAfter) {
  if (!draggedTitle || !targetTitle || draggedTitle === targetTitle) return;

  const visibleShows = getFilteredShows();
  const draggedIndex = visibleShows.findIndex((show) => show.title === draggedTitle);
  const targetIndex = visibleShows.findIndex((show) => show.title === targetTitle);

  if (draggedIndex < 0 || targetIndex < 0) return;

  const nextShows = [...visibleShows];
  const [draggedShow] = nextShows.splice(draggedIndex, 1);
  const updatedTargetIndex = nextShows.findIndex((show) => show.title === targetTitle);
  nextShows.splice(updatedTargetIndex + (placeAfter ? 1 : 0), 0, draggedShow);
  commitVisibleShowOrder(nextShows);
}

function clearDramaDragState() {
  state.draggedTitle = "";
  elements.grid?.querySelectorAll(".is-dragging, .is-drop-target").forEach((card) => {
    card.classList.remove("is-dragging", "is-drop-target");
  });
}

function getKnownBiliEntry(title) {
  const normalizedTitle = title.replace(/\s+/g, "");
  return knownBiliEntries[normalizedTitle] || null;
}

function applyKnownBiliEntry(show) {
  const knownEntry = getKnownBiliEntry(show.title);
  if (!knownEntry) return false;

  show.poster = knownEntry.poster;
  show.biliTitle = knownEntry.biliTitle;
  show.description = knownEntry.description;
  show.biliUrl = knownEntry.biliUrl;
  state.previews[show.title] = {
    title: knownEntry.biliTitle,
    cover: knownEntry.poster,
    description: knownEntry.description,
    url: knownEntry.biliUrl,
  };

  return true;
}

function migratePreviewCacheIntoShows() {
  let changed = false;

  state.shows.forEach((show) => {
    if (applyKnownBiliEntry(show)) {
      changed = true;
      return;
    }

    const preview = state.previews[show.title];
    if (!preview?.cover || show.poster) return;

    show.poster = preview.cover;
    show.biliTitle = preview.title || show.title;
    show.description = preview.description || preview.author || "";
    show.biliUrl = preview.url || "";
    changed = true;
  });

  if (changed) {
    saveJson(storageKey, state.shows);
    saveJson(previewStorageKey, state.previews);
  }
}

function renderShows() {
  if (!elements.grid) return;

  const filteredShows = getFilteredShows();

  if (filteredShows.length === 0) {
    elements.grid.innerHTML = '<div class="empty-state">没有匹配的剧名。</div>';
    return;
  }

  elements.grid.innerHTML = filteredShows
    .map((show, index) => {
      const searchUrl = getBiliSearchUrl(show.title);
      const preview = state.previews[show.title];
      const poster = show.poster || preview?.cover || "";
      const cover = poster
        ? `<img src="${escapeHtml(poster)}" alt="${escapeHtml(show.biliTitle || preview?.title || show.title)}" loading="lazy" data-fallback-title="${escapeHtml(show.title)}" />`
        : getPosterFallbackMarkup(show.title);
      const targetUrl = show.biliUrl || preview?.url || searchUrl;
      const cardTitle = show.biliTitle || preview?.title || show.title;
      const description = show.description || preview?.description || preview?.author || "点击可打开 B 站搜索结果";
      const coverClass = poster ? " has-bili-cover" : "";
      const isFirst = index === 0;
      const isLast = index === filteredShows.length - 1;

      return `
        <article class="video-card" data-title="${escapeHtml(show.title)}">
          <a class="video-cover cover-${index % 5}${coverClass}" href="${targetUrl}" target="_blank" rel="noreferrer" aria-label="在 B 站打开${escapeHtml(show.title)}">
            ${cover}
          </a>
          <div class="video-info">
            <h3>
              <a href="${targetUrl}" target="_blank" rel="noreferrer">${escapeHtml(cardTitle)}</a>
            </h3>
            <p>${escapeHtml(description)}</p>
            <div class="video-actions">
              <a class="search-link" href="${searchUrl}" target="_blank" rel="noreferrer">
                <i data-lucide="search" aria-hidden="true"></i>
                搜索
              </a>
              <div class="card-tools" aria-label="排序和删除">
                <button class="sort-control move-show" type="button" data-title="${escapeHtml(show.title)}" data-direction="-1" aria-label="上移${escapeHtml(show.title)}" title="上移" ${isFirst ? "disabled" : ""}>
                  <i data-lucide="arrow-up" aria-hidden="true"></i>
                </button>
                <button class="sort-control move-show" type="button" data-title="${escapeHtml(show.title)}" data-direction="1" aria-label="下移${escapeHtml(show.title)}" title="下移" ${isLast ? "disabled" : ""}>
                  <i data-lucide="arrow-down" aria-hidden="true"></i>
                </button>
                <button class="sort-control drag-show" type="button" draggable="true" data-title="${escapeHtml(show.title)}" aria-label="拖动排序${escapeHtml(show.title)}" title="拖动排序">
                  <i data-lucide="grip-vertical" aria-hidden="true"></i>
                </button>
                <button class="delete-show" type="button" data-title="${escapeHtml(show.title)}" aria-label="删除${escapeHtml(show.title)}" title="删除">
                  <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  refreshIcons();
  filteredShows.forEach(fetchBiliPreview);
}

function searchBili(keyword) {
  const value = keyword.trim();
  if (!value) return;
  window.open(getBiliSearchUrl(value), "_blank", "noreferrer");
}

function initDramaEvents() {
  elements.grid?.addEventListener(
    "error",
    (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || !image.dataset.fallbackTitle) return;

      image.closest(".video-cover")?.classList.remove("has-bili-cover");
      image.replaceWith(document.createRange().createContextualFragment(getPosterFallbackMarkup(image.dataset.fallbackTitle)));
      refreshIcons();
    },
    true
  );

  elements.searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBili(elements.searchInput.value);
  });

  elements.searchInput?.addEventListener("input", (event) => {
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

  elements.managerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = elements.showTitleInput.value.trim();
    const type = elements.showTypeInput.value;
    const poster = normalizePosterInput(elements.showPosterInput?.value);
    if (!title) return;

    const existing = state.shows.find((show) => show.title === title);
    if (existing) {
      existing.type = type;
      if (poster) {
        existing.poster = poster;
        existing.biliTitle = existing.biliTitle || title;
        state.previews[title] = {
          title,
          cover: poster,
          description: existing.description || "手动设置的 B 站海报",
          url: existing.biliUrl || getBiliSearchUrl(title),
        };
      }
      applyKnownBiliEntry(existing);
    } else {
      const nextShow = poster
        ? {
            title,
            type,
            poster,
            biliTitle: title,
            description: "手动设置的 B 站海报",
            biliUrl: getBiliSearchUrl(title),
          }
        : { title, type };
      applyKnownBiliEntry(nextShow);
      if (poster) {
        state.previews[title] = {
          title,
          cover: poster,
          description: "手动设置的 B 站海报",
          url: getBiliSearchUrl(title),
        };
      }
      state.shows.unshift(nextShow);
    }

    saveJson(storageKey, state.shows);
    saveJson(previewStorageKey, state.previews);
    elements.showTitleInput.value = "";
    if (elements.showPosterInput) {
      elements.showPosterInput.value = "";
    }
    elements.searchInput.value = "";
    state.query = "";
    renderShows();
  });

  elements.grid?.addEventListener("click", (event) => {
    const moveButton = event.target.closest(".move-show");
    if (moveButton) {
      event.preventDefault();
      event.stopPropagation();
      moveVisibleShow(moveButton.dataset.title, Number(moveButton.dataset.direction));
      return;
    }

    const deleteButton = event.target.closest(".delete-show");
    if (!deleteButton) return;

    event.preventDefault();
    event.stopPropagation();

    const title = deleteButton.dataset.title;
    state.shows = state.shows.filter((show) => show.title !== title);
    delete state.previews[title];
    saveJson(storageKey, state.shows);
    saveJson(previewStorageKey, state.previews);
    renderShows();
  });

  elements.grid?.addEventListener("dragstart", (event) => {
    const dragButton = event.target.closest(".drag-show");
    if (!dragButton) return;

    state.draggedTitle = dragButton.dataset.title || "";
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", state.draggedTitle);
    dragButton.closest(".video-card")?.classList.add("is-dragging");
  });

  elements.grid?.addEventListener("dragover", (event) => {
    if (!state.draggedTitle) return;

    const targetCard = event.target.closest(".video-card");
    if (!targetCard || targetCard.dataset.title === state.draggedTitle) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    elements.grid.querySelectorAll(".is-drop-target").forEach((card) => card.classList.remove("is-drop-target"));
    targetCard.classList.add("is-drop-target");
  });

  elements.grid?.addEventListener("drop", (event) => {
    if (!state.draggedTitle) return;

    const targetCard = event.target.closest(".video-card");
    if (!targetCard) {
      clearDramaDragState();
      return;
    }

    event.preventDefault();
    const rect = targetCard.getBoundingClientRect();
    const placeAfter = event.clientY > rect.top + rect.height / 2;
    dropVisibleShow(state.draggedTitle, targetCard.dataset.title, placeAfter);
    clearDramaDragState();
  });

  elements.grid?.addEventListener("dragend", clearDramaDragState);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function isHuaweiDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  const brands = navigator.userAgentData?.brands || [];
  const brandText = brands.map((brand) => brand.brand.toLowerCase()).join(" ");

  return (
    userAgent.includes("huawei") ||
    userAgent.includes("harmony") ||
    userAgent.includes("honor") ||
    brandText.includes("huawei") ||
    brandText.includes("honor")
  );
}

function getPreferredStoreUri(link) {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();

  if (isHuaweiDevice()) return link.dataset.huaweiUri;
  if (userAgent.includes("android")) return link.dataset.androidUri;
  if (/iphone|ipad|ipod/.test(userAgent)) return link.dataset.iosUri;
  if (platform.includes("win")) return link.dataset.windowsUri;

  return link.dataset.androidUri || link.href;
}

function getStoreFallbackUrl(link) {
  const keyword = link.dataset.storeKeyword || "";
  const encodedKeyword = encodeURIComponent(keyword);

  if (isHuaweiDevice()) {
    return `https://appgallery.huawei.com/search/${encodedKeyword}`;
  }

  const platform = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();

  if (platform.includes("win")) {
    return `https://appgallery.huawei.com/search/${encodedKeyword}`;
  }

  if (/iphone|ipad|ipod|macintosh/.test(userAgent)) {
    return `https://www.apple.com.cn/search/${encodedKeyword}?src=serp`;
  }

  return link.dataset.webFallback || `https://appgallery.huawei.com/search/${encodedKeyword}`;
}

function openSystemStore(link) {
  const storeUri = getPreferredStoreUri(link);
  const fallbackUrl = getStoreFallbackUrl(link);
  let didLeavePage = false;

  const markPageLeft = () => {
    didLeavePage = true;
  };

  window.addEventListener("blur", markPageLeft, { once: true });
  document.addEventListener("visibilitychange", markPageLeft, { once: true });

  window.location.href = storeUri;

  window.setTimeout(() => {
    window.removeEventListener("blur", markPageLeft);
    document.removeEventListener("visibilitychange", markPageLeft);

    if (!didLeavePage && document.visibilityState === "visible") {
      window.location.href = fallbackUrl;
    }
  }, 900);
}

function initStoreDownloads() {
  document.querySelectorAll(".store-download").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openSystemStore(link);
    });
  });
}

function setAvatar(src) {
  document.querySelectorAll("[data-avatar-image]").forEach((image) => {
    image.src = src;
  });
}

function initAvatarControls() {
  const avatarInput = document.querySelector("#avatarInput");
  const avatarReset = document.querySelector("#avatarReset");
  const savedAvatar = window.localStorage.getItem(avatarStorageKey);

  if (savedAvatar) {
    setAvatar(savedAvatar);
  }

  avatarInput?.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      avatarInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = String(reader.result || "");
      if (!result) return;

      setAvatar(result);
      try {
        window.localStorage.setItem(avatarStorageKey, result);
      } catch {
        // 图片过大时浏览器可能拒绝保存，当前页面仍会显示新头像。
      }
    });
    reader.readAsDataURL(file);
  });

  avatarReset?.addEventListener("click", () => {
    window.localStorage.removeItem(avatarStorageKey);
    setAvatar(defaultAvatarUrl);
    if (avatarInput) {
      avatarInput.value = "";
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  elements.grid = document.querySelector("#videoGrid");
  elements.searchForm = document.querySelector("#biliSearchForm");
  elements.searchInput = document.querySelector("#biliSearchInput");
  elements.managerForm = document.querySelector("#showManagerForm");
  elements.showTitleInput = document.querySelector("#showTitleInput");
  elements.showTypeInput = document.querySelector("#showTypeInput");
  elements.showPosterInput = document.querySelector("#showPosterInput");

  state.shows = loadShows();
  state.previews = loadPreviews();
  migratePreviewCacheIntoShows();

  refreshIcons();
  initStoreDownloads();
  initAvatarControls();
  initDramaEvents();
  renderShows();
});
