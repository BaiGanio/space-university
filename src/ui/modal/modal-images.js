/**
 * Created by Republic Of Gamers on 7/20/2016.
 */

export function showImageModal(url, title) { }

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-trigger")) {
    const imgSrc = e.target.getAttribute("data-img");
    const caption = e.target.getAttribute("data-caption") || "";

    document.getElementById("modalImage").src = imgSrc;
    document.getElementById("modalCaption").textContent = caption;

    const modal = new bootstrap.Modal(document.getElementById("imageModal"));
    modal.show();
  }
});