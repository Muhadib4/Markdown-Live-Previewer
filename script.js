const markdownInput = document.querySelector("#markdownInput");
const preview = document.querySelector("#preview");
const wordCount = document.querySelector("#wordCount");
const characterCount = document.querySelector("#characterCount");
const saveStatus = document.querySelector("#saveStatus");
const toast = document.querySelector("#toast");
const themeDialog = document.querySelector("#themeDialog");
const themeGrid = document.querySelector("#themeGrid");
const themeSearch = document.querySelector("#themeSearch");
const categoryFilters = document.querySelector("#categoryFilters");

const STORAGE_KEY = "markdown-live-previewer-draft";
const THEME_KEY = "markdown-live-previewer-theme";
const MODE_KEY = "markdown-live-previewer-mode";
const themes = window.MARKDOWN_THEMES || [];
const starterMarkdown = [
    "# Catatan Pertamaku",
    "",
    "Selamat datang di **Markdown Studio**! ✨",
    "",
    "## Yang bisa kamu buat",
    "",
    "- Catatan belajar",
    "- Dokumentasi proyek",
    "- Daftar kegiatan",
    "- README GitHub",
    "",
    "> Tips: sorot teks, kemudian tekan tombol format di atas editor.",
    "",
    "Kunjungi [GitHub](https://github.com) untuk mempelajari Markdown."
].join("\n");

let activeThemeId = readStorage(THEME_KEY) || "minimalism";
let activeMode = readStorage(MODE_KEY) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
let activeCategory = "Semua";
let toastTimer;

function readStorage(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}

function writeStorage(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
}

function hexBrightness(hex) {
    const clean = hex.replace("#", "");
    const value = clean.length === 3 ? clean.split("").map(function (x) { return x + x; }).join("") : clean;
    const number = parseInt(value, 16);
    const red = (number >> 16) & 255;
    const green = (number >> 8) & 255;
    const blue = number & 255;
    return (red * 299 + green * 587 + blue * 114) / 1000;
}

function fontStack(type) {
    const fonts = {
        system: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        rounded: '"Trebuchet MS", ui-rounded, system-ui, sans-serif',
        serif: 'Georgia, "Times New Roman", serif',
        mono: '"Cascadia Code", Consolas, ui-monospace, monospace',
        pixel: '"Courier New", ui-monospace, monospace',
        hand: '"Comic Sans MS", "Segoe Print", cursive'
    };
    return fonts[type] || fonts.system;
}

function applyTheme(themeId, showMessage) {
    const theme = themes.find(function (item) { return item.id === themeId; }) || themes[0];
    if (!theme) return;

    activeThemeId = theme.id;
    const root = document.documentElement;
    const bg = activeMode === "dark" ? theme.darkBg : theme.lightBg;
    const surfaceMix = activeMode === "dark" ? "white 7%" : "white 82%";
    const surface2Mix = activeMode === "dark" ? "white 11%" : theme.accent + " 5%";
    const text = activeMode === "dark" ? "#f1f5f9" : "#172033";

    root.style.setProperty("--bg", bg);
    root.style.setProperty("--surface", "color-mix(in srgb, " + bg + ", " + surfaceMix + ")");
    root.style.setProperty("--surface-2", "color-mix(in srgb, " + bg + ", " + surface2Mix + ")");
    root.style.setProperty("--text", text);
    root.style.setProperty("--muted", "color-mix(in srgb, " + text + ", " + bg + " 43%)");
    root.style.setProperty("--border", "color-mix(in srgb, " + text + ", transparent 84%)");
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-2", theme.accent2);
    root.style.setProperty("--on-accent", hexBrightness(theme.accent) > 160 ? "#111318" : "#ffffff");
    root.style.setProperty("--radius", theme.radius);
    root.style.setProperty("--font-ui", fontStack(theme.font));
    root.style.setProperty("--font-display", fontStack(theme.font));
    document.body.dataset.layout = theme.layout;
    root.dataset.mode = activeMode;
    document.querySelector("#currentThemeName").textContent = theme.name;
    document.querySelector(".theme-dot").style.background = "linear-gradient(135deg, " + theme.accent + " 50%, " + theme.accent2 + " 50%)";
    writeStorage(THEME_KEY, theme.id);
    updateModeButton();
    renderThemeCards();
    if (showMessage) showToast("Tema " + theme.name + " diterapkan.");
}

function updateModeButton() {
    const isDark = activeMode === "dark";
    document.querySelector("#modeIcon").textContent = isDark ? "☀" : "☾";
    document.querySelector("#modeLabel").textContent = isDark ? "Light" : "Dark";
    document.querySelector("#modeButton").setAttribute("aria-label", isDark ? "Aktifkan light mode" : "Aktifkan dark mode");
}

function toggleMode() {
    activeMode = activeMode === "dark" ? "light" : "dark";
    writeStorage(MODE_KEY, activeMode);
    applyTheme(activeThemeId, false);
    showToast(activeMode === "dark" ? "Dark mode aktif." : "Light mode aktif.");
}

function renderCategories() {
    const categories = ["Semua"].concat(Array.from(new Set(themes.map(function (theme) { return theme.category; }))));
    categoryFilters.innerHTML = categories.map(function (category) {
        return '<button type="button" data-category="' + category + '" class="' + (category === activeCategory ? "active" : "") + '">' + category + "</button>";
    }).join("");
}

function renderThemeCards() {
    if (!themeGrid) return;
    const query = themeSearch.value.trim().toLowerCase();
    const filtered = themes.filter(function (theme) {
        const matchesSearch = theme.name.toLowerCase().includes(query) || theme.category.toLowerCase().includes(query);
        const matchesCategory = activeCategory === "Semua" || theme.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    document.querySelector("#themeResultCount").textContent = filtered.length + " tema";
    document.querySelector("#emptyThemes").hidden = filtered.length !== 0;
    themeGrid.innerHTML = filtered.map(function (theme) {
        const active = theme.id === activeThemeId;
        const cardBg = activeMode === "dark" ? theme.darkBg : theme.lightBg;
        return '<button type="button" class="theme-card ' + (active ? "active" : "") + '" data-theme="' + theme.id + '" aria-pressed="' + active + '">' +
            '<span class="theme-preview" style="--card-bg:' + cardBg + ';--card-accent:' + theme.accent + ';--card-accent2:' + theme.accent2 + '"></span>' +
            '<span class="theme-card-meta"><strong>' + theme.name + '</strong><span class="theme-check">✓</span></span>' +
            "</button>";
    }).join("");
}

function openThemePicker() {
    renderCategories();
    renderThemeCards();
    themeDialog.showModal();
    setTimeout(function () { themeSearch.focus(); }, 50);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
}

function updateCounters(value) {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    wordCount.textContent = words + " kata";
    characterCount.textContent = value.length + " karakter";
}

function saveDraft(value) {
    const saved = writeStorage(STORAGE_KEY, value);
    saveStatus.innerHTML = saved ? "<i></i> Tersimpan" : "Gagal menyimpan";
}

function renderMarkdown() {
    const value = markdownInput.value;
    updateCounters(value);
    saveDraft(value);

    if (!value.trim()) {
        preview.innerHTML = '<div class="empty-preview"><div><strong>Preview masih kosong</strong>Mulai mengetik di panel editor.</div></div>';
        return;
    }

    if (typeof marked === "undefined" || typeof DOMPurify === "undefined") {
        preview.innerHTML = '<div class="empty-preview"><div><strong>Library belum termuat</strong>Periksa koneksi internet, lalu muat ulang halaman.</div></div>';
        return;
    }

    preview.innerHTML = DOMPurify.sanitize(marked.parse(value));
}

function replaceSelection(before, after, placeholder) {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selected = markdownInput.value.slice(start, end) || placeholder;
    markdownInput.setRangeText(before + selected + after, start, end, "end");
    markdownInput.focus();
    markdownInput.setSelectionRange(start + before.length, start + before.length + selected.length);
    renderMarkdown();
}

function prefixSelectedLines(prefix, placeholder) {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selected = markdownInput.value.slice(start, end) || placeholder;
    const replacement = selected.split("\n").map(function (line) { return prefix + line; }).join("\n");
    markdownInput.setRangeText(replacement, start, end, "end");
    markdownInput.focus();
    renderMarkdown();
}

function applyFormat(format) {
    const formats = {
        heading: function () { prefixSelectedLines("# ", "Judul baru"); },
        bold: function () { replaceSelection("**", "**", "teks tebal"); },
        italic: function () { replaceSelection("*", "*", "teks miring"); },
        strike: function () { replaceSelection("~~", "~~", "teks dicoret"); },
        list: function () { prefixSelectedLines("- ", "item daftar"); },
        checklist: function () { prefixSelectedLines("- [ ] ", "tugas baru"); },
        link: function () { replaceSelection("[", "](https://contoh.com)", "teks link"); },
        quote: function () { prefixSelectedLines("> ", "isi kutipan"); },
        code: function () { replaceSelection(String.fromCharCode(96), String.fromCharCode(96), "kode"); }
    };
    if (formats[format]) formats[format]();
}

async function copyMarkdown() {
    if (!markdownInput.value) return showToast("Belum ada tulisan yang bisa disalin.");
    try {
        await navigator.clipboard.writeText(markdownInput.value);
    } catch {
        markdownInput.select();
        document.execCommand("copy");
    }
    showToast("Markdown berhasil disalin.");
}

function downloadMarkdown() {
    if (!markdownInput.value) return showToast("Tulis sesuatu sebelum mengunduh.");
    const file = new Blob([markdownInput.value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "catatan-markdown.md";
    link.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 100);
    showToast("File .md berhasil diunduh.");
}

document.querySelector("#themeButton").addEventListener("click", openThemePicker);
document.querySelector("#modeButton").addEventListener("click", toggleMode);
document.querySelector("#closeThemeButton").addEventListener("click", function () { themeDialog.close(); });
themeDialog.addEventListener("click", function (event) { if (event.target === themeDialog) themeDialog.close(); });
themeSearch.addEventListener("input", renderThemeCards);
categoryFilters.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderCategories();
    renderThemeCards();
});
themeGrid.addEventListener("click", function (event) {
    const card = event.target.closest("[data-theme]");
    if (!card) return;
    applyTheme(card.dataset.theme, true);
});

document.querySelector(".toolbar").addEventListener("click", function (event) {
    const button = event.target.closest("[data-format]");
    if (button) applyFormat(button.dataset.format);
});
document.querySelector("#exampleButton").addEventListener("click", function () {
    const changed = markdownInput.value.trim() && markdownInput.value !== starterMarkdown;
    if (changed && !window.confirm("Tulisan saat ini akan diganti dengan contoh. Lanjutkan?")) return;
    markdownInput.value = starterMarkdown;
    renderMarkdown();
    markdownInput.focus();
    showToast("Contoh berhasil dimuat.");
});
document.querySelector("#copyButton").addEventListener("click", copyMarkdown);
document.querySelector("#downloadButton").addEventListener("click", downloadMarkdown);
document.querySelector("#clearButton").addEventListener("click", function () {
    if (markdownInput.value && !window.confirm("Hapus seluruh tulisan di editor?")) return;
    markdownInput.value = "";
    renderMarkdown();
    markdownInput.focus();
    showToast("Editor sudah dibersihkan.");
});
markdownInput.addEventListener("input", renderMarkdown);
markdownInput.addEventListener("keydown", function (event) {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (key === "b" || key === "i") {
        event.preventDefault();
        applyFormat(key === "b" ? "bold" : "italic");
    }
});

try { markdownInput.value = localStorage.getItem(STORAGE_KEY) ?? starterMarkdown; }
catch { markdownInput.value = starterMarkdown; }

applyTheme(activeThemeId, false);
renderCategories();
renderMarkdown();
