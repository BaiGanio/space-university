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
          const items = []; // ← ТОВА ЛИПСВА
          snapshot.forEach(doc => {

            const data = doc.data();

            renderObjectCard(doc.id, data);
            items.push({ imageUrl: safeImageUrl(data.imageUrl), title: data.name || "Untitled", description: data.description || "", category: data.category || "" });
          });
          renderCarousel(items);
      });
}

function renderObjectCard(id, g) {
  const container = document.getElementById("uaoList");
  const card = document.createElement("div");

  card.className = "col-md-4 g-3";
  card.innerHTML = ` 
    <div class="card"> 
      <div class="card-image"> 
       <!-- LEFT ACTION: TRASH (visible only when logged in) -->
      
        <img src="${safeImageUrl(g.imageUrl)}" class="img-fluid border border-3 border-secondary shadow-lg modal-trigger" data-img="${g.imageUrl}" data-caption="${g.name}" style="height: 340px; width: 100%; object-fit: cover; cursor: pointer;">
        <a class="card-action requires-auth" 
        id="trash"
         href="#" 
         onclick="deleteObject('${id}')">
        <i class="fa fa-trash text-danger"> delete</i>
      </a> 
       <a class="card-action" id="star" href="#" disabled onclick="likeObject('${id}')"><i class="fa fa-star"> ${g.likes || 0} </i></a>
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



function safeImageUrl(url) {
  if (!url) return 'images/no-image.jpg';

  // filter out example.com or similar placeholders
  if (url.includes('example')) return 'images/no-image.jpg';

  // optional: check if URL looks valid
  try {
    new URL(url);
    return url;
  } catch {
    return 'images/no-image.jpg';
  }
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
//-----------------------------
//       START SEARCH UAOs
//-----------------------------
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
        container.innerHTML = `
          <div class="empty-message">
            <p class="text-center text-muted fs-2">No objects found.</p>
          </div>
        `;

        return;
      }

      snapshot.forEach(doc => {
        const g = doc.data();
        renderObjectCard(doc.id, g);
      });
    });
}
//-----------------------------
//       END SEARCH UAOs
//-----------------------------
//-----------------------------
// START IMAGE URL LIVE PREVIEW
//-----------------------------
const imageInput = document.getElementById("uacImageUrl");
const previewWrapper = document.getElementById("uacImagePreviewWrapper");
const previewImg = document.getElementById("uacImagePreview");

imageInput.addEventListener("input", () => {
    const url = imageInput.value.trim();

    if (!url) {
        previewWrapper.classList.add("d-none");
        previewImg.src = "";
        return;
    }

    previewImg.src = url;

    previewImg.onload = () => {
        previewWrapper.classList.remove("d-none");
    };

    previewImg.onerror = () => {
        previewImg.src = "";
        previewWrapper.classList.add("d-none");
    };
});
//-----------------------------
// END IMAGE URL LIVE PREVIEW
//-----------------------------

function renderCarousel(items) {
  if (!items || items.length === 0) {
    document.getElementById("carouselContainer").innerHTML = `
      <p class="text-center text-muted fs-4">No images available.</p>
    `;
    return;
  }

  let indicators = "";
  let slides = "";

  items.forEach((item, index) => {
    indicators += `
      <button 
        type="button" 
        data-bs-target="#carouselContainer" 
        data-bs-slide-to="${index}"
        class="${index === 0 ? 'active' : ''}" 
        aria-current="${index === 0 ? 'true' : 'false'}">
      </button>
    `;

    slides += `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="${item.imageUrl}" class="carousel-img">

        <div class="carousel-caption">
          <h5>${item.title || "Untitled"}</h5>
          <!-- <h4 class=cormorant>${item.description.split(/[.!?]/)[0] || ""}</h4> -->
        </div>
      </div>
    `;
  });
  document.getElementById("carouselContainer").innerHTML = `
    <div class="carousel-indicators">
      ${indicators}
    </div>

    <div class="carousel-inner">
      ${slides}
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#carouselContainer" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>

    <button class="carousel-control-next" type="button" data-bs-target="#carouselContainer" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  `;
  const el = document.querySelector('#carouselContainer'); 
  new bootstrap.Carousel(el);
}



