const markdownInput = document.querySelector("#markdownInput");
const preview = document.querySelector("#preview");
const wordCount = document.querySelector("#wordCount");
const characterCount = document.querySelector("#characterCount");
const saveStatus = document.querySelector("#saveStatus");
const toast = document.querySelector("#toast");

const STORAGE_KEY = "markdown-live-previewer-draft";

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
