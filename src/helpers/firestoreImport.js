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
