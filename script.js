const markdownInput = document.querySelector("#markdownInput");
const preview = document.querySelector("#preview");
const clearButton = document.querySelector("#clearButton");

const starterMarkdown = `# Halo, Markdown! 👋

Ketik sesuatu di panel **Editor**.

## Yang bisa dicoba

- Judul
- **Teks tebal**
- *Teks miring*
- [Tautan](https://github.com)
- \`kode singkat\`

> Preview akan berubah otomatis saat kamu mengetik.

\`\`\`javascript
console.log("Hello, Markdown!");
\`\`\`
`;

function renderMarkdown() {
    const rawHtml = marked.parse(markdownInput.value);
    preview.innerHTML = DOMPurify.sanitize(rawHtml);
}

markdownInput.value = starterMarkdown;
renderMarkdown();

markdownInput.addEventListener("input", renderMarkdown);

clearButton.addEventListener("click", () => {
    markdownInput.value = "";
    renderMarkdown();
    markdownInput.focus();
});
