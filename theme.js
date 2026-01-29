// Theme Manager - Shared across all pages
(function() {
    const THEME_KEY = 'reufa_theme';

    // Get saved theme or default to dark
    function getTheme() {
        return localStorage.getItem(THEME_KEY) || 'dark';
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);

        // Update theme-color meta tag
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = theme === 'light' ? '#f5f5f5' : '#1a1d23';
        }
    }

    // Toggle between light and dark
    function toggleTheme() {
        const current = getTheme();
        const newTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        updateToggleButton(newTheme);
    }

    // Update toggle button icon
    function updateToggleButton(theme) {
        const btn = document.getElementById('themeToggle');
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // Initialize on page load
    function init() {
        const theme = getTheme();
        applyTheme(theme);
        updateToggleButton(theme);
    }

    // Apply theme immediately (before DOM ready) to prevent flash
    applyTheme(getTheme());

    // Expose functions globally
    window.ThemeManager = {
        toggle: toggleTheme,
        get: getTheme,
        set: applyTheme,
        init: init
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
