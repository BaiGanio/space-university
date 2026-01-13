/**
 * Created by Republic Of Gamers on 7/16/2016.
 */



/* MAIN APP LOGIC */
function startAppLogic() {

    let userID = sessionStorage.getItem("username");
    console.log("id" + userID);
    $("#linkLogout").click(logoutUser);

    if(userID){
        $('#loginLnk').text("");
        $("#linkLogin").hide();
        let username = sessionStorage.getItem("username");
        console.log("Welcome, " + username + "!");
        $('#userMsg').text("Welcome, " + username + "!");
        $("#loggedInUser").show();
        $("#linkLogout").show();
    }
    else{
        $('#loginLnk').text("Login");
        $("#linkLogin").show();
        $("#loggedInUser").hide();
        $("#linkLogout").hide();
    }

    function logoutUser() {
        $('#loginLnk').text("Login");
        $("#linkLogin").show();
        sessionStorage.clear();
        $("#user").hide();
        $("#linkLogout").hide();

        $('#userMsg').text("");
        showInfo("Logout successful.");

        function showInfo(message) {
            $('#infoBox').text(message);
            $('#infoBox').show();
            setTimeout(function () {
                $('#infoBox').fadeOut();
            }, 3000);
        }

    }

}



// -----------------------------
//  SEARCH LOGIC
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

const dummyObjects = getFullDummyDataset();
importToFirestore(dummyObjects, "uao", false);

/**
 * Factory function for creating a UniversalAstronomicalObject.
 * This avoids imports and modules and works anywhere in your SPA.
 */
function createUniversalAstronomicalObject(data = {}) {
    return {

        /** Stable internal ID */
        id: data.id || crypto.randomUUID(),

        /** Primary name or designation */
        name: data.name || "",
        nameLower: (data.name || "").toLowerCase(),

        /** Alternate identifiers */
        aliases: data.aliases || [],

        /** High-level category (galaxy, star, exoplanet, moon, etc.) */
        category: data.category || "",

        /** More specific classification */
        subcategory: data.subcategory || "",

        /** Catalog sources that contributed data */
        catalogSource: data.catalogSource || [],

        /** Source priority map for future merging logic */
        sourcePriority: data.sourcePriority || {},

        /** Data quality indicator */
        dataQuality: data.dataQuality || "unknown",

        /** Right Ascension */
        ra: data.ra || null,

        /** Declination */
        dec: data.dec || null,

        /** Coordinate epoch (J2000, J2015, ICRS) */
        coordinatesEpoch: data.coordinatesEpoch || "J2000",

        /** Distance (units depend on object type) */
        distance: data.distance || null,

        /** Apparent magnitude */
        magnitude: data.magnitude ?? null,

        /** Spectral type (stars only) */
        spectralType: data.spectralType || null,

        /** Physical properties */
        mass: data.mass ?? null,
        radius: data.radius ?? null,
        temperature: data.temperature ?? null,
        luminosity: data.luminosity ?? null,

        /** Exoplanet-specific fields */
        orbitalPeriod: data.orbitalPeriod ?? null,
        semiMajorAxis: data.semiMajorAxis ?? null,
        eccentricity: data.eccentricity ?? null,
        discoveryMethod: data.discoveryMethod || null,

        /** Solar System-specific fields */
        parentBody: data.parentBody || null,
        orbitalElements: data.orbitalElements || null,

        /** Deep-sky fields */
        sizeMax: data.sizeMax || null,
        sizeMin: data.sizeMin || null,
        positionAngle: data.positionAngle ?? null,
        surfaceBrightness: data.surfaceBrightness ?? null,

        /** UI tags */
        tags: data.tags || [],

        /** Human-readable description */
        description: data.description || "",

        /** Additional notes */
        notes: data.notes || "",

        /** Image URL */
        imageUrl: data.imageUrl || null,

        /** User interactions */
        likedBy: data.likedBy || [],

        /** Metadata */
        createdBy: data.createdBy || null,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null
    };
}

function getFullDummyDataset() {
    return [

        // 1 — Galaxy (Spiral)
        createUniversalAstronomicalObject({
            id: "DUMMY-GALAXY-001",
            name: "NGC 891",
            aliases: ["UGC 1831", "Caldwell 23"],
            category: "galaxy",
            subcategory: "edge_on_spiral",
            catalogSource: ["SAC", "SIMBAD"],
            sourcePriority: {
                coordinates: "SIMBAD",
                photometry: "SIMBAD",
                deepSky: "SAC"
            },
            dataQuality: "high",
            ra: "02 22 33",
            dec: "+42 21 00",
            coordinatesEpoch: "J2000",
            distance: "30 million ly",
            magnitude: 10.8,
            spectralType: null,
            mass: null,
            radius: null,
            temperature: null,
            luminosity: null,
            orbitalPeriod: null,
            semiMajorAxis: null,
            eccentricity: null,
            discoveryMethod: null,
            parentBody: null,
            orbitalElements: null,
            sizeMax: "13.5m",
            sizeMin: "2.5m",
            positionAngle: 45,
            surfaceBrightness: 13.5,
            tags: ["edge-on", "dust-lane"],
            description: "Bright, elongated edge-on spiral galaxy with a dust lane.",
            notes: "Often compared to the Milky Way seen edge-on.",
            imageUrl: "https://example.com/ngc891.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 2 — Nebula (Emission)
        createUniversalAstronomicalObject({
            id: "DUMMY-NEBULA-001",
            name: "M42",
            aliases: ["NGC 1976", "Orion Nebula"],
            category: "nebula",
            subcategory: "emission",
            catalogSource: ["SAC"],
            sourcePriority: { deepSky: "SAC" },
            dataQuality: "medium",
            ra: "05 35 17",
            dec: "-05 23 28",
            coordinatesEpoch: "J2000",
            distance: "1350 ly",
            magnitude: 4.0,
            spectralType: null,
            mass: null,
            radius: null,
            temperature: null,
            luminosity: null,
            orbitalPeriod: null,
            semiMajorAxis: null,
            eccentricity: null,
            discoveryMethod: null,
            parentBody: null,
            orbitalElements: null,
            sizeMax: "65m",
            sizeMin: "60m",
            positionAngle: 0,
            surfaceBrightness: 12.0,
            tags: ["star-forming", "emission"],
            description: "Massive star-forming region in Orion.",
            notes: "Contains the Trapezium cluster.",
            imageUrl: "https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2025/12/STScI-01KCA5NP86W9K3M53DHCQMKB3H.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 3 — Star (Red Supergiant)
        createUniversalAstronomicalObject({
            id: "DUMMY-STAR-001",
            name: "Betelgeuse",
            aliases: ["Alpha Orionis", "HD 39801"],
            category: "star",
            subcategory: "red_supergiant",
            catalogSource: ["SIMBAD"],
            sourcePriority: { coordinates: "SIMBAD", photometry: "SIMBAD" },
            dataQuality: "high",
            ra: "05 55 10",
            dec: "+07 24 25",
            coordinatesEpoch: "J2000",
            distance: "548 ly",
            magnitude: 0.42,
            spectralType: "M2Iab",
            mass: null,
            radius: null,
            temperature: 3500,
            luminosity: null,
            orbitalPeriod: null,
            semiMajorAxis: null,
            eccentricity: null,
            discoveryMethod: null,
            parentBody: null,
            orbitalElements: null,
            sizeMax: null,
            sizeMin: null,
            positionAngle: null,
            surfaceBrightness: null,
            tags: ["supergiant", "variable"],
            description: "Red supergiant nearing the end of its life.",
            notes: "Expected to go supernova within 100,000 years.",
            imageUrl: "https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2025/11/STScI-01K34EC16CKMDAPB54D4SWQ79V.png",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 4 — Exoplanet (Super Earth)
        createUniversalAstronomicalObject({
            id: "DUMMY-EXO-001",
            name: "Kepler-22b",
            aliases: ["KOI-087.01"],
            category: "exoplanet",
            subcategory: "super_earth",
            catalogSource: ["NASA"],
            sourcePriority: { exoplanet: "NASA" },
            dataQuality: "high",
            ra: "19 16 52",
            dec: "+47 53 04",
            coordinatesEpoch: "J2000",
            distance: "600 ly",
            magnitude: null,
            spectralType: null,
            mass: null,
            radius: null,
            temperature: null,
            luminosity: null,
            orbitalPeriod: 289.9,
            semiMajorAxis: 0.85,
            eccentricity: 0.02,
            discoveryMethod: "Transit",
            parentBody: "Kepler-22",
            orbitalElements: null,
            sizeMax: null,
            sizeMin: null,
            positionAngle: null,
            surfaceBrightness: null,
            tags: ["habitable-zone", "super-earth"],
            description: "First known potentially habitable exoplanet discovered by Kepler.",
            notes: "",
            imageUrl: "https://www.nasa.gov/wp-content/uploads/2025/12/54957843876-a1382275cd-o.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 5 — Moon (Europa)
        createUniversalAstronomicalObject({
            id: "DUMMY-MOON-001",
            name: "Europa",
            aliases: [],
            category: "moon",
            subcategory: "icy_moon",
            catalogSource: ["JPL"],
            sourcePriority: { solarSystem: "JPL" },
            dataQuality: "high",
            ra: null,
            dec: null,
            coordinatesEpoch: "J2000",
            distance: "4.2 AU",
            magnitude: 5.3,
            spectralType: null,
            mass: null,
            radius: 1560.8,
            temperature: null,
            luminosity: null,
            orbitalPeriod: 3.55,
            semiMajorAxis: null,
            eccentricity: 0.009,
            discoveryMethod: null,
            parentBody: "Jupiter",
            orbitalElements: {},
            sizeMax: null,
            sizeMin: null,
            positionAngle: null,
            surfaceBrightness: null,
            tags: ["icy-moon", "ocean-world"],
            description: "Icy moon with a subsurface ocean.",
            notes: "",
            imageUrl: "https://cdn.esahubble.org/archives/images/screen/heic0602a.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 6 — Galaxy (Andromeda)
        createUniversalAstronomicalObject({
            id: "DUMMY-GALAXY-002",
            name: "M31",
            aliases: ["NGC 224", "Andromeda Galaxy"],
            category: "galaxy",
            subcategory: "spiral",
            catalogSource: ["SAC"],
            sourcePriority: { deepSky: "SAC" },
            dataQuality: "medium",
            ra: "00 42 44",
            dec: "+41 16 09",
            coordinatesEpoch: "J2000",
            distance: "2.5 million ly",
            magnitude: 3.4,
            spectralType: null,
            mass: null,
            radius: null,
            temperature: null,
            luminosity: null,
            orbitalPeriod: null,
            semiMajorAxis: null,
            eccentricity: null,
            discoveryMethod: null,
            parentBody: null,
            orbitalElements: null,
            sizeMax: "190m",
            sizeMin: "60m",
            positionAngle: 35,
            surfaceBrightness: 13.0,
            tags: ["spiral", "local-group"],
            description: "Nearest major galaxy to the Milky Way.",
            notes: "",
            imageUrl: "https://cdn.esahubble.org/archives/images/screen/heic1501a.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 7 — Nebula (Planetary)
        createUniversalAstronomicalObject({
            id: "DUMMY-NEBULA-002",
            name: "M57",
            aliases: ["NGC 6720", "Ring Nebula"],
            category: "nebula",
            subcategory: "planetary",
            catalogSource: ["SAC"],
            sourcePriority: { deepSky: "SAC" },
            dataQuality: "medium",
            ra: "18 53 35",
            dec: "+33 01 45",
            coordinatesEpoch: "J2000",
            distance: "2300 ly",
            magnitude: 8.8,
            spectralType: null,
            mass: null,
            radius: null,
            temperature: null,
            luminosity: null,
            orbitalPeriod: null,
            semiMajorAxis: null,
            eccentricity: null,
            discoveryMethod: null,
            parentBody: null,
            orbitalElements: null,
            sizeMax: "1.4m",
            sizeMin: "1.0m",
            positionAngle: 0,
            surfaceBrightness: 12.5,
            tags: ["planetary-nebula"],
            description: "Famous planetary nebula in Lyra.",
            notes: "",
            imageUrl: "https://example.com/m57.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 8 — Star (Sun)
        createUniversalAstronomicalObject({
            id: "DUMMY-STAR-002",
            name: "Sun",
            aliases: ["Sol"],
            category: "star",
            subcategory: "G-type_main_sequence",
            catalogSource: ["SIMBAD"],
            sourcePriority: { coordinates: "SIMBAD", photometry: "SIMBAD" },
            dataQuality: "high",
            ra: null,
            dec: null,
            coordinatesEpoch: "J2000",
            distance: "0 ly",
            magnitude: -26.74,
            spectralType: "G2V",
            mass: 1,
            radius: 1,
            temperature: 5778,
            luminosity: 1,
            orbitalPeriod: null,
            semiMajorAxis: null,
            eccentricity: null,
            discoveryMethod: null,
            parentBody: null,
            orbitalElements: null,
            sizeMax: null,
            sizeMin: null,
            positionAngle: null,
            surfaceBrightness: null,
            tags: ["main-sequence"],
            description: "The star at the center of the Solar System.",
            notes: "",
            imageUrl: "https://example.com/sun.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 9 — Exoplanet (TRAPPIST-1e)
        createUniversalAstronomicalObject({
            id: "DUMMY-EXO-002",
            name: "TRAPPIST-1e",
            aliases: [],
            category: "exoplanet",
            subcategory: "terrestrial",
            catalogSource: ["NASA"],
            sourcePriority: { exoplanet: "NASA" },
            dataQuality: "high",
            ra: "23 06 29",
            dec: "-05 02 29",
            coordinatesEpoch: "J2000",
            distance: "39 ly",
            magnitude: null,
            spectralType: null,
            mass: null,
            radius: null,
            temperature: null,
            luminosity: null,
            orbitalPeriod: 6.1,
            semiMajorAxis: 0.029,
            eccentricity: 0.01,
            discoveryMethod: "Transit",
            parentBody: "TRAPPIST-1",
            orbitalElements: null,
            sizeMax: null,
            sizeMin: null,
            positionAngle: null,
            surfaceBrightness: null,
            tags: ["habitable-zone", "earth-sized"],
            description: "Earth-sized exoplanet in the habitable zone.",
            notes: "",
            imageUrl: "https://example.com/trappist1e.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }),

        // 10 — Moon (Titan)
        createUniversalAstronomicalObject({
            id: "DUMMY-MOON-002",
            name: "Titan",
            aliases: [],
            category: "moon",
            subcategory: "atmospheric_moon",
            catalogSource: ["JPL"],
            sourcePriority: { solarSystem: "JPL" },
            dataQuality: "high",
            ra: null,
            dec: null,
            coordinatesEpoch: "J2000",
            distance: "9.5 AU",
            magnitude: 8.4,
            spectralType: null,
            mass: null,
            radius: 2574.7,
            temperature: null,
            luminosity: null,
            orbitalPeriod: 15.95,
            semiMajorAxis: null,
            eccentricity: 0.0288,
            discoveryMethod: null,
            parentBody: "Saturn",
            orbitalElements: {},
            sizeMax: null,
            sizeMin: null,
            positionAngle: null,
            surfaceBrightness: null,
            tags: ["atmosphere", "methane-lakes"],
            description: "Moon with a thick atmosphere and methane lakes.",
            notes: "",
            imageUrl: "https://example.com/titan.jpg",
            likedBy: [],
            createdBy: "system",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
    ];
}

/**
 * Imports an array of UniversalAstronomicalObject objects into Firestore.
 * 
 * @param {Array} objects - Array of objects created by createUniversalAstronomicalObject()
 * @param {String} collectionName - Firestore collection name (e.g., "astronomy_objects")
 * @param {Boolean} overwrite - If true, existing docs with the same ID will be overwritten
 */
async function importToFirestore(objects, collectionName = "uao", overwrite = false) {
    if (!Array.isArray(objects) || objects.length === 0) {
        console.error("importToFirestore: No objects provided.");
        return;
    }

    const db = firebase.firestore();

    for (const obj of objects) {
        try {
            const docRef = db.collection(collectionName).doc(obj.id);

            if (overwrite) {
                await docRef.set(obj);
                console.log(`✔ Overwritten: ${obj.name} (${obj.id})`);
            } else {
                const existing = await docRef.get();
                if (existing.exists) {
                    console.log(`⚠ Skipped (already exists): ${obj.name} (${obj.id})`);
                    continue;
                }
                await docRef.set(obj);
                console.log(`✔ Added: ${obj.name} (${obj.id})`);
            }

        } catch (err) {
            console.error(`❌ Error importing ${obj.name} (${obj.id}):`, err);
        }
    }

    console.log("🚀 Firestore import complete.");
}
