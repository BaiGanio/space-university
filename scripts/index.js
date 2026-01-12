/**
 * Created by Republic Of Gamers on 7/16/2016.
 */

/* Create loading animation */
$(window).on('load', function() { // makes sure the whole site is loaded
    setTimeout(function () {
        $('#status').fadeOut("slow");
    }, 2500); // will first fade out the loading animation
    $('#preloader').fadeOut(); // will fade out the white DIV that covers the website.
    // $('#status').fadeOut("slow");
    // $('body').css({'overflow':'visible'});
    setTimeout(showBody,500);
    function showBody(){
        $('body').css({'overflow':'visible'});
    }
});


/* Old layout content */
$('#ganio-info').click(function () {
    document.getElementById('main-content').style.display = 'inline-block';
    document.getElementById('bai-ganio').style.display = 'block';
    document.getElementById('bai-ganio').style.width = '65%';
    $('#bai-ganio').css('margin', '0 auto');
});

/* Flip card functionality */
$('.flip4o').click(function () {
    //        alert("here");
    $('#card').addClass('flipped');
    $("section").hide();
    $("#header").hide();
    $(".back").show();
    $('body').css("padding-top", "0px");
});

/* Flip blogs functionality */
$('.flipBlogs').click(function () {
    //        alert("here");
    $('#blogs-card').addClass('flipped');
    $(".blog-back").show();
    $('body').css("padding-top", "0px");
});

$('#arrLft').click(function () {
    //        alert("here");
    $('#card').removeClass('flipped');
    $("section").show();
    $("#header").show();
    $(".back").hide();
    $('body').css("padding-top","50px");
});




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
// function attachModalHandlers() { let triggers = document.querySelectorAll('.modal-trigger'); triggers.forEach(img => { img.onclick = function () { modal.style.display = "block"; modalImg.src = this.src; modalImg.alt = this.alt; captionText.innerHTML = this.alt; }; }); }

// document.addEventListener("click", function(e) { 
//   if (e.target.classList.contains("modal-trigger")) { 
//     const imgSrc = e.target.getAttribute("data-img"); 
//     const caption = e.target.getAttribute("data-caption") || "";
//     modal.style.display = "block"; 
//     modalImg.src = imgSrc; modalImg.alt = caption; captionText.innerHTML = caption; 
//   } 
// });