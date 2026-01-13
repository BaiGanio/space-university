/**
 * Created by Republic Of Gamers on 7/16/2016.
 */
// -----------------------------
// Създаваме глобален namespace:
// -----------------------------
const Controllers = {}; // 
/*  
    Единен DOMContentLoaded блок (централен entry point)
*/
document.addEventListener("DOMContentLoaded", () => {

    Controllers.AjaxInterceptor.init();
    Controllers.TermsModal.init();
    Controllers.Filters.init();
    Controllers.Search.init();
    Controllers.AuthUI.init(); // ако имаш auth логика
    Controllers.Theme.init();

});

// -----------------------------
//  THEMES
// -----------------------------
Controllers.Theme = {
    themes: ["dark", "light"],
    currentIndex: 0,
    defaultTheme: "light",

    init() {
        const btn = document.getElementById("themeSwitcher");
        if (!btn) return;

        // Load saved theme
        const saved = localStorage.getItem("theme");
        if (saved) {
            document.body.classList.add(saved);
            this.currentIndex = this.themes.indexOf(saved);
        }else { 
            document.body.classList.add(this.defaultTheme); 
            localStorage.setItem("theme", this.defaultTheme); 
            this.currentIndex = this.themes.indexOf(this.defaultTheme); 
        }

        // Update button text on load 
        this.updateThemeButtonLabel(btn);

        btn.addEventListener("click", () => {
            // Remove previous theme
            document.body.classList.remove(this.themes[this.currentIndex]); 
            // Move to next theme 
            this.currentIndex = (this.currentIndex + 1) % this.themes.length; 
            const newTheme = this.themes[this.currentIndex]; 
            document.body.classList.add(newTheme); 
            localStorage.setItem("theme", newTheme);
            this.updateThemeButtonLabel(btn);
        });
    },
    updateThemeButtonLabel(btn) { 
        const themeName = this.themes[this.currentIndex]; 
        const label = themeName.charAt(0).toUpperCase() + themeName.slice(1); 
        btn.innerHTML = `🌗 ${label}`;
    }
};

Controllers.Search = { 
    init() { 
        // -----------------------------
        //  SEARCH LOGIC
        // -----------------------------
        const searchInput = document.getElementById("searchInput"); 
        if (!searchInput) return; 
        
        searchInput.addEventListener("input", () => { 
            Controllers.Filters.applyFilters(); 
        });
    } 
};

Controllers.Filters = {
    allCheckbox: null,
    filters: {},
    cards: null,
    searchInput: null,

    init() {
        this.allCheckbox = document.getElementById("filterAll");
        this.filters = {
            filterGalaxies: document.getElementById("filterGalaxies"),
            filterNebulae: document.getElementById("filterNebulae"),
            filterClusters: document.getElementById("filterClusters"),
            filterStars: document.getElementById("filterStars"),
            filterExoplanets: document.getElementById("filterExoplanets"),
            filterSolarSystem: document.getElementById("filterSolarSystem"),
            filterExotic: document.getElementById("filterExotic")
        };


        this.cards = document.querySelectorAll(".uaoList");
        this.searchInput = document.getElementById("searchInput");
        Object.values(this.filters).forEach(cb => { 
            if (!cb) return; // skip missing elements 
            cb.addEventListener("change", () => { 
                this.allCheckbox.checked = false; 
                const allChecked = Object.values(this.filters).every(x => x && x.checked); 
                if (allChecked) 
                    this.allCheckbox.checked = true; 
                this.applyFilters(); 
            }); 
        });
        this.attachEvents();
        this.applyFilters();
    },

    // -----------------------------
    //  CHECKBOX LOGIC
    // -----------------------------
    attachEvents() {
        // ALL checkbox
        this.allCheckbox.addEventListener("change", () => {
            const isChecked = this.allCheckbox.checked;
            Object.values(this.filters).forEach(cb => cb.checked = isChecked);
            this.applyFilters();
        });

        // Other checkboxes
        Object.values(this.filters).forEach(cb => {
            cb.addEventListener("change", () => {
                this.allCheckbox.checked = false;

                const allChecked = Object.values(this.filters).every(x => x.checked);
                if (allChecked) this.allCheckbox.checked = true;

                this.applyFilters();
            });
        });

        // Search input
        this.searchInput.addEventListener("input", () => this.applyFilters());
    },
    
    // -----------------------------
    //  FILTER LOGIC
    // -----------------------------
    applyFilters() {
        const searchValue = this.searchInput.value.toLowerCase();

        const activeTypes = Object.entries(this.filters)
            .filter(([type, cb]) => cb.checked)
            .map(([type]) => type);

        this.cards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const type = card.dataset.type;

            const matchesSearch = name.includes(searchValue);
            const matchesType = activeTypes.includes(type);

            card.style.display = (matchesSearch && matchesType) ? "" : "none";
        });
    }

    
};

Controllers.TermsModal = {
    checkbox: null,
    modal: null,

    init() {
        this.checkbox = document.getElementById("terms");

        const modalElement = document.getElementById("termsModal");
        this.modal = new bootstrap.Modal(modalElement);

        document.getElementById("openTermsModal").addEventListener("click", (e) => {
            e.preventDefault();
            this.modal.show();
        });

        modalElement.addEventListener("hidden.bs.modal", () => {
            this.checkbox.checked = true;
        });
    }
};

Controllers.AuthUI = {
    init() {
        // show/hide buttons, roles, etc.
    }
};

Controllers.AjaxInterceptor = {
    activeRequests: 0,
    loadingBox: null,

    init() {
       // this.loadingBox = document.getElementById("loadingBox");
        this.interceptFetch();
        this.interceptXHR();
    },

    update() {
       // this.loadingBox.style.display = this.activeRequests > 0 ? "block" : "none";
    },

    interceptFetch() {
        const originalFetch = window.fetch;

        window.fetch = (...args) => {
            this.activeRequests++;
            this.update();

            return originalFetch(...args)
                .finally(() => {
                    this.activeRequests--;
                    this.update();
                });
        };
    },

    interceptXHR() {
        const originalXHR = window.XMLHttpRequest;

        window.XMLHttpRequest = function () {
            const xhr = new originalXHR();

            xhr.addEventListener("loadstart", () => {
                Controllers.AjaxInterceptor.activeRequests++;
                Controllers.AjaxInterceptor.update();
            });

            xhr.addEventListener("loadend", () => {
                Controllers.AjaxInterceptor.activeRequests--;
                Controllers.AjaxInterceptor.update();
            });

            return xhr;
        };
    }
};
