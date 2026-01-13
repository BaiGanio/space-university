/**
 * Created by Republic Of Gamers on 7/17/2016.
 */




/* This function is loaded every time we refresh the page */
$(function () {

    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
   
    $('#linkLogout').click(logout);
    $('#linkFoodCost').click(showFoodCostView);
    
    $('#linkAddGalaxy').click(showAddGalaxyView);
    $('#linkListGalaxies').click(showListGalaxiesView);
    /* Note that by default HTML forms submit their data as HTTP GET request.
     You should prevent this default action and replace it with JavaScript code.
     Use e.preventDefault() as shown above.
     Otherwise, the form will sometimes execute your JavaScript code,
     sometimes will post its data as HTTP GET request.
     */
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        login();
    });
    $('#registerForm').submit(function (e) {
        e.preventDefault();
        registerUser();
    });
   
    $('#loginButton').click(login);
    $('#registerButton').click(registerUser);

    
    $('#listPosts').click(listPosts);

    /* Attach AJAX "loading" event listener*/
    // $(document).on({
    //     ajaxStart: function () {
    //         $('#loadingBox').show();
    //     },
    //     ajaxStop: function () {
    //         $('#loadingBox').hide();
    //     }
    // });

    showHomeView();
    showHideNavLinks();
});

/* HANDLE THE ERRORS - ONCE FOR THE CREDENTIALS, ONCE FOR THE GET AND POST REQUESTS */
function showAJAXError (data, status) {
    let errorMsg = 'Error: ' + JSON.stringify(data) + " <br/> " +
        "Read this to know what's happening: User exist!!!Try another one.";
    showError(errorMsg);
}

function showBooksAjaxError(data, status) {
    let errorMsg = 'Error: ' + JSON.stringify(data);
    // or
    let errorMsgBk = "You need to be logged...";
    showError(errorMsgBk);
}

function showError(msgText) {
    $('#errorBox').text(msgText).show();
}

function showView(viewID) {
    /*
     * Clear all views before that.
     */
    $('#main-page-content > section').hide();
    $('#' + viewID).show();
};

function showHomeView() {
    showView('viewHome');
}
function showLoginView() {
    showView('viewLogin');
}
function showRegisterView() {
    showView('viewRegister');
}
function showFoodCostView() {
    showView('viewFoodCost');
}
function showAddGalaxyView() {
    showView('viewAddGalaxy');
}
function showListGalaxiesView() {
    showView('viewListGalaxies');
}







