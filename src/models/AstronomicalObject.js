/**
 * AstronomicalObject Model
 * ------------------------
 * This model represents a single entry from the SAC (Saguaro Astronomy Club) database.
 * It is normalized and Firestore‑friendly, and works perfectly with your SPA controllers.
 */

export default class AstronomicalObject {

    /**
     * @param {Object} data - Raw object data
     */
    constructor(data = {}) {

        /** 
         * Primary identifier (NGC, IC, M, etc.)
         * SAC Field #1
         */
        this.object = data.object || "";

        /**
         * Alternate catalog names (Messier, IC, UGC, etc.)
         * SAC Field #2
         */
        this.other = data.other || [];

        /**
         * Object type (GALXY, OPNCL, PLNNB, etc.)
         * SAC Field #3
         */
        this.type = data.type || "";

        /**
         * Constellation (IAU 3‑letter code)
         * SAC Field #4
         */
        this.constellation = data.constellation || "";

        /**
         * Right Ascension (string format "HH MM.M")
         * SAC Field #5
         */
        this.ra = data.ra || "";

        /**
         * Declination (string format "+DD MM")
         * SAC Field #6
         */
        this.dec = data.dec || "";

        /**
         * Visual magnitude (99.9 = unknown, 79.9 = dark nebula)
         * SAC Field #7
         */
        this.magnitude = data.magnitude ?? null;

        /**
         * Surface brightness (galaxies only)
         * SAC Field #8
         */
        this.surfaceBrightness = data.surfaceBrightness ?? null;

        /**
         * Uranometria 2000 chart number
         * SAC Field #9
         */
        this.u2k = data.u2k ?? null;

        /**
         * Tirion Sky Atlas chart number
         * SAC Field #10
         */
        this.tirion = data.tirion ?? null;

        /**
         * Maximum size (e.g., "5.2m", "45s", "1.2d")
         * SAC Field #11
         */
        this.sizeMax = data.sizeMax || "";

        /**
         * Minimum size (same units as sizeMax)
         * SAC Field #12
         */
        this.sizeMin = data.sizeMin || "";

        /**
         * Position angle (0–180 degrees)
         * SAC Field #13
         */
        this.positionAngle = data.positionAngle ?? null;

        /**
         * Classification (Trumpler, Hubble, etc.)
         * SAC Field #14
         */
        this.classification = data.classification || "";

        /**
         * Number of stars (clusters only)
         * SAC Field #15
         */
        this.starCount = data.starCount ?? null;

        /**
         * Magnitude of brightest star (clusters/planetary nebulae)
         * SAC Field #16
         */
        this.brightestStarMag = data.brightestStarMag ?? null;

        /**
         * Catalog membership (B=Best NGC, C=Caldwell, H=Herschel, M=Messier)
         * SAC Field #17
         */
        this.catalogs = data.catalogs || [];

        /**
         * Visual description (NGC-style)
         * SAC Field #18
         */
        this.description = data.description || "";

        /**
         * Additional notes (common names, companions, etc.)
         * SAC Field #19
         */
        this.notes = data.notes || "";

        /**
         * Optional: NASA or custom image URL
         */
        this.imageUrl = data.imageUrl || null;

        /**
         * Optional: user interactions
         */
        this.likedBy = data.likedBy || [];

        /**
         * Optional: metadata
         */
        this.createdBy = data.createdBy || null;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }
}
