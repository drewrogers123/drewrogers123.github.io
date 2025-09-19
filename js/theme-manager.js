// Theme management system
class ThemeManager {
    constructor() {
        this.currentTheme = 'og';
        this.init();
    }

    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }

        // Apply the current theme
        this.applyTheme(this.currentTheme);

        // Set up the theme dropdown
        this.setupThemeDropdown();

        // Update dropdown to show current theme
        const dropdown = document.getElementById('theme-dropdown');
        if (dropdown) {
            dropdown.value = this.currentTheme;
        }
    }

    setupThemeDropdown() {
        const dropdown = document.getElementById('theme-dropdown');
        if (dropdown) {
            dropdown.addEventListener('change', (e) => {
                this.switchTheme(e.target.value);
            });
        }
    }

    switchTheme(themeName) {
        this.currentTheme = themeName;
        this.applyTheme(themeName);
        
        // Save theme preference
        localStorage.setItem('selectedTheme', themeName);
        
        // Add a smooth transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    applyTheme(themeName) {
        const body = document.body;
        
        // Remove any existing theme data attributes
        body.removeAttribute('data-theme');
        
        // Apply new theme (og theme uses default CSS variables)
        if (themeName !== 'og') {
            body.setAttribute('data-theme', themeName);
        }

        // Update any dynamic elements that might need theme-specific adjustments
        this.updateDynamicElements(themeName);
    }

    updateDynamicElements(themeName) {
        // Update any elements that need special handling for different themes
        const codeElements = document.querySelectorAll('code, pre, .katex');
        codeElements.forEach(element => {
            element.style.fontFamily = 'var(--code-font)';
        });

        // Update difficulty meter gradient based on theme
        const difficultyLevel = document.getElementById('difficulty-level');
        if (difficultyLevel) {
            if (themeName === 'og') {
                difficultyLevel.style.background = 'linear-gradient(90deg, #2ecc71, #f1c40f, #e74c3c)';
            } else {
                difficultyLevel.style.background = 'linear-gradient(90deg, var(--secondary-color), var(--primary-color), var(--error-color))';
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return [
            { value: 'og', name: 'OG Theme' },
            { value: 'one-dark-pro', name: 'One Dark Pro' },
            { value: 'dracula', name: 'Dracula Official' },
            { value: 'github-dark', name: 'GitHub Dark' },
            { value: 'monokai', name: 'Monokai' },
            { value: 'solarized-dark', name: 'Solarized Dark' },
            { value: 'material-theme', name: 'Material Theme' },
            { value: 'nord', name: 'Nord' }
        ];
    }
}

// Initialize theme manager when DOM is loaded
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});
