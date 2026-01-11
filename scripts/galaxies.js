async function saveGalaxy() {
  const name = document.getElementById("galaxyName").value.trim();
  const catalogId = document.getElementById("galaxyCatalogId").value.trim();
  const type = document.getElementById("galaxyType").value.trim();
  const description = document.getElementById("galaxyDescription").value.trim();
  const nasaQuery = document.getElementById("nasaQuery").value.trim();
  const nasaImageUrl = document.getElementById("nasaPreview").src || "";

  if (!name || !description) {
    alert("Name and description are required.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to add a galaxy.");
    return;
  }

  db.collection("galaxies").add({
    name,
    nameLower: name.toLowerCase(),
    catalogId,
    type,
    description,
    nasaQuery,
    nasaImageUrl,
    likes: 0,
    createdBy: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Galaxy saved!");
    document.getElementById("galaxyForm").reset();
    document.getElementById("nasaPreview").src = "";
  })
  .catch(err => {
    console.error("Error saving galaxy:", err);
  });
}

function loadGalaxies() {
  const container = document.getElementById("galaxyList");
  container.innerHTML = "";

  db.collection("galaxies")
    .orderBy("createdAt", "desc")
    .limit(6)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        renderGalaxyCard(doc.id, doc.data());
      });
    });
}

function renderGalaxyCard(id, g) {
  const container = document.getElementById("galaxyList");

  const card = document.createElement("div");
  card.className = "col-md-4";

  card.innerHTML = `
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden galaxy-card">

      <div class="position-relative p-2 bg-dark">
        <img 
          src="${g.nasaImageUrl || 'images/satellite.png'}" 
          class="img-fluid rounded-4 border border-3 border-secondary shadow-lg"
          style="height: 220px; width: 100%; object-fit: cover;">

        <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2 fs-6 px-3 py-2">
          ⭐ ${g.likes || 0}
        </span>
      </div>

      <div class="card-body">
        <h4 class="card-title fw-bold">${g.name}</h4>
        <p class="text-secondary mb-1">${g.type || "Unknown type"}</p>
        <p class="text-muted small">${g.catalogId || ""}</p>

        ${
          auth.currentUser
            ? `<button class="btn btn-primary w-100 fw-bold" onclick="likeGalaxy('${id}')">❤️ Like</button>`
            : `<button class="btn btn-secondary w-100 fw-bold" disabled>Login to Like</button>`
        }
      </div>
    </div>
  `;

  container.appendChild(card);
}


function likeGalaxy(id) { 
  const user = auth.currentUser; 
  if (!user) return; 
  const ref = db.collection("galaxies").doc(id); 
  ref.update({ 
    likes: firebase.firestore.FieldValue.increment(1) 
  }); 
}

function searchGalaxies() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const container = document.getElementById("galaxyList");
  container.innerHTML = "";

  // If empty → load latest 6
  if (query.length === 0) {
    loadGalaxies();
    return;
  }

  // Firestore search by name
  db.collection("galaxies")
    .orderBy("nameLower")
    .startAt(query)
    .endAt(query + "\uf8ff")
    .limit(10)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = `<p class="text-center text-muted fs-4">No galaxies found.</p>`;
        return;
      }

      snapshot.forEach(doc => {
        const g = doc.data();
        renderGalaxyCard(doc.id, g);
      });
    });
}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim().length > 0) {
    searchInput.classList.add("typing");
  } else {
    searchInput.classList.remove("typing");
  }
});


