//-----------------------------
//          START SAVE UAOs
//-----------------------------
async function saveUniversalObject() {
    const name = document.getElementById("objectName").value.trim();
    const category = document.getElementById("objectCategory").value.trim(); // galaxy, nebula, star, etc.
    const subcategory = document.getElementById("objectSubcategory").value.trim();
    const description = document.getElementById("objectDescription").value.trim();
    const nasaQuery = document.getElementById("nasaQuery").value.trim();
    const imageUrl = document.getElementById("nasaPreview").src || "";

    if (!name || !description) {
        alert("Name and description are required.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to add an object.");
        return;
    }

    const obj = createUniversalAstronomicalObject({
        name,
        nameLower: name.toLowerCase(),
        aliases: [],
        category,
        subcategory,
        catalogSource: ["manual"],
        description,
        notes: "",
        imageUrl,
        tags: [],
        createdBy: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    db.collection("uao").doc(obj.id).set(obj)
        .then(() => {
            alert("Object saved!");
            document.getElementById("objectForm").reset();
            document.getElementById("nasaPreview").src = "";
        })
        .catch(err => {
            console.error("Error saving object:", err);
        });
}
//-----------------------------
//          END SAVE UAOs
//-----------------------------
//-----------------------------
//     START LOAD/FETCH UAOs
//-----------------------------
function loadUniversalObjects() {
    const container = document.getElementById("uaoList");
    container.innerHTML = "";

    db.collection("uao")
      .orderBy("createdAt", "desc")
      .limit(12)
      .get()
      .then(snapshot => {
          snapshot.forEach(doc => {
            renderObjectCard(doc.id, doc.data());
          });
      });
}


function renderObjectCard(id, g) {
  const container = document.getElementById("uaoList");
  const card = document.createElement("div");

  card.className = "col-md-4 g-3";
  card.innerHTML = ` 
    <div class="card"> 
      <div class="card-image"> 
        <img src="${g.imageUrl || 'images/satellite.png'}" class="img-fluid border border-3 border-secondary shadow-lg modal-trigger" data-img="${g.imageUrl}" data-caption="${g.name}" style="height: 340px; width: 100%; object-fit: cover; cursor: pointer;"> 
       <a class="card-action" href="#" disabled onclick="likeGalaxy('${id}')"><i class="fa fa-star"> ${g.likes || 0} </i></a>
      <div class="card-body"> 
        <div class="card-heading">${g.name}</div> 
        <hr/>
        <div class="card-text">${g.type || "Unknown type"}</div> 
        <div class="card-text">${g.category || ""}</div> 
  
        <button data-img="${g.imageUrl}" data-caption="${g.description}" class="btn btn-primary modal-trigger"> more... </button> 
      </div> 
    </div> `;

  container.appendChild(card);
}
//-----------------------------
//     END LOAD/FETCH UAOs
//-----------------------------

function likeObject(id) { 
  const user = auth.currentUser; 
  if (!user) return; 
  const ref = db.collection("uao").doc(id); 
  ref.update({ 
    likes: firebase.firestore.FieldValue.increment(1),
    likedBy: firebase.firestore.FieldValue.arrayUnion(user.uid) 
  }); 
}

function searchUniversalObjects() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const container = document.getElementById("uaoList");
  container.innerHTML = "";

  if (query.length === 0) {
    loadUniversalObjects();
    return;
  }

  db.collection("uao")
    .orderBy("nameLower")
    .startAt(query)
    .endAt(query + "\uf8ff")
    .limit(20)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
          container.innerHTML = `<p class="text-center text-muted fs-4">No objects found.</p>`;
          return;
      }

      snapshot.forEach(doc => {
        const g = doc.data();
        renderObjectCard(doc.id, g);
      });
    });
}


