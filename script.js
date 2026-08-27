const markdownInput = document.querySelector("#markdownInput");
const preview = document.querySelector("#preview");
const wordCount = document.querySelector("#wordCount");
const characterCount = document.querySelector("#characterCount");
const saveStatus = document.querySelector("#saveStatus");
const toast = document.querySelector("#toast");

const STORAGE_KEY = "markdown-live-previewer-draft";
const THEME_KEY = "markdown-live-previewer-theme";
const MODE_KEY = "markdown-live-previewer-mode";
const themePresets = [
["minimalism","Minimalism","clean","#f4f4f0","#ffffff","#252525","✦"],
["bento-grid","Bento Grid","clean","#eef0f4","#ffffff","#4f46e5","▦"],
["maximalism","Maximalism","bold","#ff4d8d","#7b2cff","#fff36b","✺"],
["neo-brutalism","Neo-Brutalism","bold","#ffcad4","#bde0fe","#161616","◆"],
["liquid-glass","Liquid Glass","future","#17203c","#4fd1ff","#ffffff","◌"],
["cyberpunk","Cyberpunk","future","#080a18","#00f5ff","#ff2bd6","⌁"],
["retro-terminal","Retro Terminal","retro","#160f05","#ffb000","#ffe3a3",">_"],
["frutiger-aero","Frutiger Aero","nature","#79c7ff","#43c759","#ffffff","☁"],
["dark-fantasy","Dark Fantasy","fantasy","#0d0b12","#651c35","#dac6a8","♜"],
["medieval","Medieval","fantasy","#211a12","#9a6b2f","#f1dfb8","⚜"],
["arcane","Arcane","fantasy","#101a2a","#b78b49","#b9dfff","◇"],
["celestial","Celestial","fantasy","#090e2a","#6d7cff","#f2edff","✧"]
];
let activeCategory="all";

const starterMarkdown = `# Catatan Pertamaku

Selamat datang di **Markdown Live Previewer**!

## Apa yang bisa ditulis?

- Catatan belajar
- Dokumentasi proyek
- Daftar kegiatan
- README GitHub

> Tips: sorot sebuah teks, kemudian tekan tombol format di atas editor.

Kunjungi [GitHub](https://github.com) untuk melihat contoh penggunaan Markdown lainnya.
`;

let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateCounters(value) {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    wordCount.textContent = `${words} kata`;
    characterCount.textContent = `${value.length} karakter`;
}

function saveDraft(value) {
    try {
        localStorage.setItem(STORAGE_KEY, value);
        saveStatus.textContent = "Tersimpan otomatis";
    } catch {
        saveStatus.textContent = "Tidak dapat menyimpan";
    }
}

function renderMarkdown() {
    const value = markdownInput.value;
    updateCounters(value);
    saveDraft(value);

    if (!value.trim()) {
        preview.innerHTML = `
            <div class="empty-preview">
                <div>
                    <strong>Hasil tulisan akan muncul di sini</strong>
                    Mulai mengetik di kotak sebelah kiri.
                </div>
            </div>
        `;
        return;
    }

    const rawHtml = marked.parse(value);
    preview.innerHTML = DOMPurify.sanitize(rawHtml);
}

function replaceSelection(before, after, placeholder) {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selected = markdownInput.value.slice(start, end) || placeholder;
    const replacement = before + selected + after;

    markdownInput.setRangeText(replacement, start, end, "end");
    markdownInput.focus();
    markdownInput.setSelectionRange(start + before.length, start + before.length + selected.length);
    renderMarkdown();
}

function prefixSelectedLines(prefix, placeholder) {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selected = markdownInput.value.slice(start, end) || placeholder;
    const replacement = selected
        .split("\n")
        .map((line) => prefix + line)
        .join("\n");

    markdownInput.setRangeText(replacement, start, end, "end");
    markdownInput.focus();
    renderMarkdown();
}

function applyFormat(format) {
    const formats = {
        heading: () => prefixSelectedLines("# ", "Judul baru"),
        bold: () => replaceSelection("**", "**", "teks tebal"),
        italic: () => replaceSelection("*", "*", "teks miring"),
        list: () => prefixSelectedLines("- ", "item daftar"),
        link: () => replaceSelection("[", "](https://contoh.com)", "teks link"),
        quote: () => prefixSelectedLines("> ", "isi kutipan"),
        code: () => replaceSelection("`", "`", "kode")
    };

    formats[format]?.();
}

async function copyMarkdown() {
    const text = markdownInput.value;

    if (!text) {
        showToast("Belum ada tulisan yang bisa disalin.");
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showToast("Markdown berhasil disalin.");
    } catch {
        markdownInput.select();
        document.execCommand("copy");
        showToast("Markdown berhasil disalin.");
    }
}

function downloadMarkdown() {
    if (!markdownInput.value) {
        showToast("Tulis sesuatu sebelum mengunduh.");
        return;
    }

    const file = new Blob([markdownInput.value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "catatan-markdown.md";
    link.click();
    URL.revokeObjectURL(url);
    showToast("File Markdown berhasil diunduh.");
}

document.querySelector(".toolbar").addEventListener("click", (event) => {
    const button = event.target.closest("[data-format]");
    if (button) applyFormat(button.dataset.format);
});

document.querySelector("#exampleButton").addEventListener("click", () => {
    const hasDifferentContent = markdownInput.value.trim() && markdownInput.value !== starterMarkdown;

    if (hasDifferentContent && !window.confirm("Tulisan saat ini akan diganti dengan contoh. Lanjutkan?")) {
        return;
    }

    markdownInput.value = starterMarkdown;
    renderMarkdown();
    markdownInput.focus();
    showToast("Contoh berhasil dimuat.");
});

document.querySelector("#copyButton").addEventListener("click", copyMarkdown);
document.querySelector("#downloadButton").addEventListener("click", downloadMarkdown);

document.querySelector("#clearButton").addEventListener("click", () => {
    if (markdownInput.value && !window.confirm("Hapus seluruh tulisan di editor?")) {
        return;
    }

    markdownInput.value = "";
    renderMarkdown();
    markdownInput.focus();
    showToast("Editor sudah dibersihkan.");
});

markdownInput.addEventListener("input", renderMarkdown);

markdownInput.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;

    if (event.key.toLowerCase() === "b") {
        event.preventDefault();
        applyFormat("bold");
    }

    if (event.key.toLowerCase() === "i") {
        event.preventDefault();
        applyFormat("italic");
    }
});

try {
    markdownInput.value = localStorage.getItem(STORAGE_KEY) ?? starterMarkdown;
} catch {
    markdownInput.value = starterMarkdown;
}

renderMarkdown();

function applyTheme(id, notify = true) {
    const theme = themePresets.find((item) => item[0] === id) || themePresets[0];
    document.documentElement.dataset.theme = theme[0];
    document.documentElement.style.setProperty("--accent", theme[4]);
    document.documentElement.style.setProperty("--accent-2", theme[5]);
    document.documentElement.style.setProperty("--theme-radius", ["brutalism","neo-brutalism","terminal","web-1-0"].includes(id) ? "0px" : ["claymorphism","liquid-glass"].includes(id) ? "28px" : "16px");
    document.documentElement.style.setProperty("--display-font", ["editorial","magazine","medieval","gothic","arcane","luxury","art-deco"].includes(id) ? "Georgia,serif" : ["terminal","retro-terminal","pixel-8-bit","cyberpunk","sci-fi-hud"].includes(id) ? '"Cascadia Code",monospace' : "Inter,system-ui,sans-serif");
    document.querySelector("#activeThemeName").textContent = theme[1];
    document.querySelector(".brand-icon").textContent = theme[6];
    if (document.querySelector("#themeQuickSelect")) document.querySelector("#themeQuickSelect").value = theme[0];
    localStorage.setItem(THEME_KEY, id);
    drawThemes();
    if (notify) showToast(`Tema ${theme[1]} aktif.`);
}

function applyMode(mode, notify = true) {
    document.documentElement.dataset.colorMode = mode;
    const button = document.querySelector("#darkModeButton");
    button.innerHTML = mode === "dark" ? "☀️ <span>Terang</span>" : "🌙 <span>Gelap</span>";
    localStorage.setItem(MODE_KEY, mode);
    if (notify) showToast(mode === "dark" ? "Dark mode aktif." : "Light mode aktif.");
}

function drawThemes() {
    const query = document.querySelector("#themeSearch").value.toLowerCase();
    const current = document.documentElement.dataset.theme;
    document.querySelector("#themeGrid").innerHTML = themePresets
        .filter((theme) => (activeCategory === "all" || theme[2] === activeCategory) && theme[1].toLowerCase().includes(query))
        .map((theme) => `<button class="theme-card ${current === theme[0] ? "active" : ""}" data-theme-id="${theme[0]}"><div class="theme-mini" style="--c1:${theme[3]};--c2:${theme[4]};--c3:${theme[5]}"><i></i><i></i><span><b></b><b></b></span></div><span><b>${theme[1]}</b><small>${theme[2]}</small></span></button>`).join("");
}

function toggleThemes(open) {
    document.body.classList.toggle("themes-open", open);
    document.querySelector("#themeDrawer").setAttribute("aria-hidden", String(!open));
}

document.querySelector("#openThemesButton").addEventListener("click", () => toggleThemes(true));
document.querySelector("#closeThemesButton").addEventListener("click", () => toggleThemes(false));
document.querySelector("#themeOverlay").addEventListener("click", () => toggleThemes(false));
document.querySelector("#themeSearch").addEventListener("input", drawThemes);
document.querySelector("#themeQuickSelect").innerHTML = themePresets.map((theme) => `<option value="${theme[0]}">${theme[1]}</option>`).join("");
document.querySelector("#themeQuickSelect").addEventListener("change", (event) => applyTheme(event.target.value));
document.querySelector("#themeGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-theme-id]");
    if (card) applyTheme(card.dataset.themeId);
});
document.querySelector("#themeCategories").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    document.querySelectorAll("#themeCategories button").forEach((item) => item.classList.toggle("active", item === button));
    drawThemes();
});
document.querySelector("#darkModeButton").addEventListener("click", () => applyMode(document.documentElement.dataset.colorMode === "dark" ? "light" : "dark"));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") toggleThemes(false); });
applyMode(localStorage.getItem(MODE_KEY) || "dark", false);
applyTheme(localStorage.getItem(THEME_KEY) || "minimalism", false);

let sessionSeconds = 0;
let timerRunning = true;
const timerText = document.querySelector("#timerText");
setInterval(() => {
    if (!timerRunning) return;
    sessionSeconds += 1;
    const minutes = String(Math.floor(sessionSeconds / 60)).padStart(2, "0");
    const seconds = String(sessionSeconds % 60).padStart(2, "0");
    timerText.textContent = `${minutes}:${seconds}`;
}, 1000);
document.querySelector("#sessionTimer").addEventListener("click", () => {
    timerRunning = !timerRunning;
    document.querySelector("#sessionTimer").classList.toggle("paused", !timerRunning);
    showToast(timerRunning ? "Timer dilanjutkan." : "Timer dijeda.");
});
