(function () {
    function t(id, name, category, layout, accent, accent2, lightBg, darkBg, font, radius) {
        return { id: id, name: name, category: category, layout: layout, accent: accent, accent2: accent2, lightBg: lightBg, darkBg: darkBg, font: font || "system", radius: radius || "16px" };
    }

    window.MARKDOWN_THEMES = [
        t("minimalism", "Minimalism", "Modern", "minimal", "#111827", "#64748b", "#f7f7f5", "#0f1115", "system", "14px"),
        t("ultra-minimalism", "Ultra Minimalism", "Modern", "ultra-minimal", "#000000", "#a3a3a3", "#ffffff", "#080808", "system", "0px"),
        t("maximalism", "Maximalism", "Modern", "maximal", "#ff3366", "#6c3cff", "#fff4dc", "#180d27", "rounded", "24px"),
        t("controlled-maximalism", "Controlled Maximalism", "Modern", "controlled", "#7c3aed", "#f97316", "#faf5ff", "#160f24", "rounded", "20px"),
        t("brutalism", "Brutalism", "Modern", "brutal", "#ffdd00", "#ff3b30", "#f5f1e8", "#111111", "mono", "0px"),
        t("neo-brutalism", "Neo-Brutalism", "Modern", "neo-brutal", "#8b5cf6", "#facc15", "#fffdf4", "#17151f", "rounded", "10px"),
        t("bento-grid", "Bento Grid", "Modern", "bento", "#2563eb", "#06b6d4", "#f1f5f9", "#0b1220", "system", "22px"),
        t("masonry", "Masonry", "Modern", "masonry", "#e11d48", "#fb7185", "#fff7f8", "#1c1015", "serif", "18px"),
        t("swiss-style", "Swiss Style", "Modern", "swiss", "#ef4444", "#111111", "#f7f7f2", "#101010", "system", "0px"),
        t("editorial", "Editorial", "Editorial", "editorial", "#9f1239", "#78716c", "#fbf8f1", "#171411", "serif", "4px"),
        t("magazine", "Magazine", "Editorial", "magazine", "#d60045", "#111827", "#fffdf8", "#151216", "serif", "8px"),

        t("glassmorphism", "Glassmorphism", "Glass & Soft", "glass", "#6366f1", "#22d3ee", "#e9efff", "#080d24", "system", "24px"),
        t("liquid-glass", "Liquid Glass", "Glass & Soft", "liquid", "#0ea5e9", "#a855f7", "#e7f8ff", "#071727", "rounded", "28px"),
        t("neumorphism", "Neumorphism", "Glass & Soft", "neumorph", "#64748b", "#3b82f6", "#e8edf4", "#202631", "system", "20px"),
        t("claymorphism", "Claymorphism", "Glass & Soft", "clay", "#8b5cf6", "#fb7185", "#f4edff", "#20152d", "rounded", "28px"),
        t("flat-design", "Flat Design", "Glass & Soft", "flat", "#2563eb", "#f97316", "#f8fafc", "#111827", "system", "8px"),
        t("material-design", "Material Design", "Glass & Soft", "material", "#6750a4", "#625b71", "#fffbfe", "#1c1b1f", "system", "18px"),

        t("aurora", "Aurora", "Future", "aurora", "#7c3aed", "#10b981", "#eefbf7", "#07131b", "rounded", "22px"),
        t("gradient-mesh", "Gradient Mesh", "Future", "mesh", "#ec4899", "#3b82f6", "#fff1f8", "#160c22", "rounded", "22px"),
        t("cyberpunk", "Cyberpunk", "Future", "cyber", "#f7ff00", "#ff00d4", "#f9ffd9", "#090413", "mono", "2px"),
        t("sci-fi-hud", "Sci-Fi HUD", "Future", "hud", "#00e5ff", "#22c55e", "#e6fbff", "#020b12", "mono", "4px"),
        t("holographic", "Holographic", "Future", "holo", "#8b5cf6", "#22d3ee", "#f5f3ff", "#0d1025", "rounded", "20px"),

        t("terminal", "Terminal", "Retro Tech", "terminal", "#22c55e", "#86efac", "#eaffef", "#020b05", "mono", "4px"),
        t("retro-terminal", "Retro Terminal", "Retro Tech", "retro-terminal", "#ffb000", "#ff6b00", "#fff6dc", "#120b00", "mono", "8px"),
        t("pixel-8-bit", "Pixel / 8-bit", "Retro Tech", "pixel", "#4f46e5", "#ef4444", "#fffbea", "#111127", "pixel", "0px"),
        t("y2k", "Y2K", "Retro Tech", "y2k", "#ff4fd8", "#55e7ff", "#f5f0ff", "#140b24", "rounded", "20px"),
        t("frutiger-aero", "Frutiger Aero", "Retro Tech", "aero", "#0ea5e9", "#65a30d", "#e8f9ff", "#082333", "rounded", "24px"),
        t("web-1", "Web 1.0", "Retro Tech", "web1", "#0000ee", "#ff0000", "#ffffff", "#000033", "serif", "0px"),
        t("vaporwave", "Vaporwave", "Retro Tech", "vaporwave", "#ff71ce", "#01cdfe", "#fcecff", "#170b2d", "mono", "6px"),
        t("synthwave", "Synthwave", "Retro Tech", "synthwave", "#ff2a6d", "#05d9e8", "#fff0f7", "#0d0221", "rounded", "10px"),

        t("dark-fantasy", "Dark Fantasy", "Fantasy", "dark-fantasy", "#9f7aea", "#b91c1c", "#f2edf5", "#0e0911", "serif", "10px"),
        t("medieval", "Medieval", "Fantasy", "medieval", "#a16207", "#7c2d12", "#f4ead0", "#181208", "serif", "3px"),
        t("gothic", "Gothic", "Fantasy", "gothic", "#be123c", "#71717a", "#f5f1f2", "#0b090b", "serif", "2px"),
        t("arcane", "Arcane", "Fantasy", "arcane", "#7c3aed", "#d97706", "#f8f1ff", "#10091d", "serif", "18px"),
        t("celestial", "Celestial", "Fantasy", "celestial", "#4f46e5", "#eab308", "#f0f4ff", "#070b20", "serif", "24px"),
        t("abyss", "Abyss", "Fantasy", "abyss", "#2563eb", "#7c3aed", "#eaf0ff", "#020617", "serif", "14px"),

        t("organic", "Organic", "Nature", "organic", "#4d7c0f", "#a16207", "#f3f5e9", "#131a0d", "rounded", "28px"),
        t("biophilic", "Biophilic", "Nature", "biophilic", "#15803d", "#0d9488", "#edf9ef", "#071a10", "rounded", "24px"),
        t("eco-futurism", "Eco Futurism", "Nature", "eco", "#10b981", "#0891b2", "#e8fff7", "#041b18", "system", "18px"),

        t("paper-ui", "Paper UI", "Crafted", "paper", "#b45309", "#475569", "#f8f0dc", "#1d1912", "serif", "2px"),
        t("scrapbook", "Scrapbook", "Crafted", "scrapbook", "#e11d48", "#0d9488", "#fff8e7", "#211717", "hand", "6px"),
        t("hand-drawn", "Hand-drawn", "Crafted", "handdrawn", "#2563eb", "#f97316", "#fffdf2", "#191813", "hand", "10px"),

        t("monochrome", "Monochrome", "Classic", "monochrome", "#171717", "#737373", "#f5f5f5", "#0a0a0a", "system", "6px"),
        t("luxury", "Luxury", "Classic", "luxury", "#b28a2e", "#7f1d1d", "#faf7ef", "#0d0b09", "serif", "3px"),
        t("industrial", "Industrial", "Classic", "industrial", "#f97316", "#52525b", "#eeeae3", "#151515", "mono", "2px"),
        t("bauhaus", "Bauhaus", "Classic", "bauhaus", "#ef2b2d", "#1455d9", "#f7f3e8", "#151515", "system", "0px"),
        t("memphis", "Memphis", "Classic", "memphis", "#ff4f7b", "#00b8a9", "#fff8dd", "#1c1831", "rounded", "12px"),
        t("art-deco", "Art Deco", "Classic", "art-deco", "#b8922f", "#134e4a", "#f8f3e6", "#0c1716", "serif", "0px"),
        t("skeuomorphism", "Skeuomorphism", "Classic", "skeuo", "#2563eb", "#92400e", "#e9e4dc", "#25211c", "system", "12px"),
        t("spatial-3d", "Spatial / 3D UI", "Spatial", "spatial", "#6366f1", "#06b6d4", "#edf3ff", "#080c18", "rounded", "28px")
    ];
}());
