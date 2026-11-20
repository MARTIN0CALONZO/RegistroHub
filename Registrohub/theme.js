(function () {
    try {
        document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "light");
    } catch (e) { }
})();

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;

    const icons = {
        light: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>`,
        dark: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>`
    };

    function apply(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        btn.innerHTML = icons[theme];
        btn.title = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

        if (theme === "light") {
            console.log("light mode on");
        } else {
            console.log("dark mode on");
        }
    }

    apply(document.documentElement.getAttribute("data-theme") || "light");

    btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        apply(next);
        try { localStorage.setItem("theme", next); } catch (e) { }
    });
});