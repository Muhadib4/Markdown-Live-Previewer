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
["minimalism","Minimalism","clean","#f4f4f0","#fff","#252525"],["ultra-minimalism","Ultra Minimalism","clean","#fff","#f7f7f7","#111"],["maximalism","Maximalism","bold","#ff4d8d","#7b2cff","#fff36b"],["controlled-maximalism","Controlled Maximalism","bold","#17132f","#ff6b6b","#fff4d8"],["brutalism","Brutalism","bold","#fff100","#ff4b00","#090909"],["neo-brutalism","Neo-Brutalism","bold","#ffcad4","#bde0fe","#161616"],["bento-grid","Bento Grid","clean","#eef0f4","#fff","#4f46e5"],["masonry","Masonry","art","#efe7dc","#cf8f68","#332c29"],["swiss-style","Swiss Style","clean","#f5f4ef","#e31b23","#111"],["editorial","Editorial","clean","#f5f0e7","#1d1b19","#b02a2a"],["magazine","Magazine","art","#f8efe9","#ff3162","#161616"],["glassmorphism","Glassmorphism","future","#152042","#6f80ff","#fff"],["liquid-glass","Liquid Glass","future","#17203c","#4fd1ff","#fff"],["neumorphism","Neumorphism","clean","#e8edf3","#f5f8fb","#53657a"],["claymorphism","Claymorphism","art","#ffe6d7","#c89cff","#442f50"],["flat-design","Flat Design","clean","#eff6ff","#2563eb","#172554"],["material-design","Material Design","clean","#eceff1","#6750a4","#1c1b1f"],["aurora","Aurora","future","#071c2a","#00f5a0","#d8fff2"],["gradient-mesh","Gradient Mesh","future","#ff8ec7","#7c5cff","#fff"],["cyberpunk","Cyberpunk","future","#080a18","#00f5ff","#ff2bd6"],["sci-fi-hud","Sci-Fi HUD","future","#03131b","#00d9ff","#b9f6ff"],["holographic","Holographic","future","#101225","#82f7ff","#ff9af5"],["terminal","Terminal","retro","#07100a","#00ff66","#caffd8"],["retro-terminal","Retro Terminal","retro","#160f05","#ffb000","#ffe3a3"],["pixel-8-bit","Pixel / 8-bit","retro","#1a1535","#8b5cf6","#fdf45b"],["y2k","Y2K","retro","#d9f2ff","#ff7bd5","#233876"],["frutiger-aero","Frutiger Aero","nature","#79c7ff","#43c759","#fff"],["web-1-0","Web 1.0","retro","#c0c0c0","#0000ee","#000"],["vaporwave","Vaporwave","retro","#24103f","#ff71ce","#01cdfe"],["synthwave","Synthwave","retro","#12082a","#ff2a8a","#fee801"],["dark-fantasy","Dark Fantasy","fantasy","#0d0b12","#651c35","#dac6a8"],["medieval","Medieval","fantasy","#211a12","#9a6b2f","#f1dfb8"],["gothic","Gothic","fantasy","#100e12","#6c233f","#e4d9df"],["arcane","Arcane","fantasy","#101a2a","#b78b49","#b9dfff"],["celestial","Celestial","fantasy","#090e2a","#6d7cff","#f2edff"],["abyss","Abyss","fantasy","#02050d","#123a70","#8ac8ff"],["organic","Organic","nature","#eef0df","#78945a","#293622"],["biophilic","Biophilic","nature","#e5efe6","#2f7d4a","#193323"],["eco-futurism","Eco Futurism","nature","#061c19","#35e4a4","#d7fff2"],["paper-ui","Paper UI","art","#eee8db","#fffdf6","#3f392f"],["scrapbook","Scrapbook","art","#eadbc8","#db6b55","#3f2e28"],["hand-drawn","Hand-drawn","art","#f8f3e8","#4c74a7","#28231f"],["monochrome","Monochrome","clean","#eee","#333","#111"],["luxury","Luxury","art","#0b0a09","#c9a85c","#f4ead1"],["industrial","Industrial","bold","#242729","#ff8a00","#e9ecef"],["bauhaus","Bauhaus","art","#f2eadc","#e33126","#151515"],["memphis","Memphis","art","#fff5cf","#ff5e7e","#284b9b"],["art-deco","Art Deco","art","#101817","#d5b46b","#f3ead5"],["skeuomorphism","Skeuomorphism","art","#d4cab9","#8b5e3c","#28231d"],["spatial-3d-ui","Spatial / 3D UI","future","#0d1020","#806cff","#fff"]];
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
