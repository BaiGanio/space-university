/**
 * Created by Republic Of Gamers on 7/17/2016.
 */

const firebaseConfig = {
  apiKey: "AIzaSyA9oZaSIeUKeFJw-hieB3kN4b-J4xnSd_I",
  authDomain: "space-university-d04e9.firebaseapp.com",
  databaseURL: "https://space-university-d04e9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "space-university-d04e9",
  storageBucket: "space-university-d04e9.firebasestorage.app",
  messagingSenderId: "623940058530",
  appId: "1:623940058530:web:70fe0e7ed1c8df0ca706fb",
  measurementId: "G-JK7DJ4KF82"
};

firebase.initializeApp(firebaseConfig);


/* This function is loaded every time we refresh the page */
$(function () {

    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkListPosts').click(showListPostsView);
    $('#linkCreatePost').click(showCreatePostView);
    $('#linkLogout').click(logout);
    $('#linkJSONviaAJAX').click(showAJAXviaJSONView);
    $('#linkFoodCost').click(showFoodCostView);


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
        register();
    });
    $('#createPostForm').submit(function (e) {
        e.preventDefault();
        createPost();
    });

    $('#loginButton').click(login);
    $('#registerButton').click(register);
    $('#createPostButton').click(createPost);
    $('#listPosts').click(listPosts);

    /* Attach AJAX "loading" event listener*/
    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show();
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    });

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

function showInfo(msgText) {
    $('#infoBox').text(msgText).show().delay(3000).fadeOut(800);
}

/* Choose what links to be seen when user is logged or not */
function showHideNavLinks() {
    let loggedIn = sessionStorage.authToken != null;

    if(loggedIn){
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkCreatePost').show();
        $('#linkListPosts').show();
        $('#linkLogout').show();
        $('#linkJSONviaAJAX').show();
        $('#linkFoodCost').show();
    }else{
        /* if user is not logged */
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkListPosts').show();
        $('#linkFoodCost').show();
        $('#linkCreatePost').hide();
        $('#linkLogout').hide();
        $('#linkJSONviaAJAX').hide();
    }
};

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

function showCreatePostView() {
    showView('viewCreatePost');
}

function showAJAXviaJSONView() {
    showView('json-via-ajax');
}

function login() {
    let loginData = {
        username : $('#loginUsername').val(),
        password : $('#loginPassword').val()
    };
    // alert('IN LOGIN');
   firebase.auth().signInWithEmailAndPassword(loginData.username, loginData.password) 
       .then((userCredential) => { 
           const user = userCredential.user; 
           
           // mimic your old Kinvey session behavior 
           sessionStorage.username = user.email; 
           sessionStorage.authToken = user.accessToken || ""; // Firebase doesn't use authtoken the same way 
           
           loginSuccess(user); // call your existing success handler 
       }) 
       .catch((error) => { 
           showAJAXError(error); // call your existing error handler 
       });

    function loginSuccess(data, status) {
        showListPostsView();
        showHideNavLinks();
        showInfo('Login successful');
    }
}

function register() {
    let registerData = {
        username : $('#registerUsername').val(),
        password : $('#registerPassword').val()
    };
    // alert('IN LOGIN');


   firebase.auth().createUserWithEmailAndPassword(registerData.username, registerData.password) 
       .then((userCredential) => { 
           const user = userCredential.user; 
           console.log(user);
           // Firebase doesn't use authtoken the same way Kinvey did, 
           // but you can store the ID token if you need it later. 
           user.getIdToken().then((token) => { 
               sessionStorage.authToken = token; 
           }); 
           registerSuccess(user); 
       }) 
       .catch((error) => { 
           showAJAXError(error); 
       });

    function registerSuccess(data, status) {
        showListPostsView();
        showHideNavLinks();
        showInfo('Register completed successfully.');
    }
}

function createPost() {
    let postUrl = kinveyServiceBaseUrl + 'appdata/' + kinveyAppID + '/posts';
    let authHeaders =  {
        "Authorization": "Kinvey " + sessionStorage.authToken,
        "Content-Type": "application/json"
    };

    let newPostData = {
        Title: $('#title').val(),
        Description: $('#description').val(),
        ImgUrl: $('#imgUrl').val(),
        ArticleUrl: $('#articleUrl').val(),
        Username: sessionStorage.username
    };


    $.ajax({
        method: "POST",
        url:postUrl,
        data: JSON.stringify(newPostData),
        headers: authHeaders,
        success: postCreated,
        error: showBooksAjaxError
    });

    function postCreated(data, status) {
        showListPostsView();
        showInfo('Post created successfully.');
    }

}

let appended = false;
function showListPostsView() {
    showView('viewListPosts');
    $('#previevwHolder').text('');
    $('#post-title').text('');
    $.ajax({
        method: "GET",
        url:kinveyServiceBaseUrl + 'appdata/' + kinveyAppID + '/posts',
        headers: {
            "Authorization": "Kinvey " + sessionStorage.authToken
        },
        success: postsLoaded,
        error: showBooksAjaxError
    });

    function postsLoaded(data, status) {
        let counter = 0;
        if(!appended && sessionStorage.authToken != null){
            for(let book of data) {
                counter++;
                let bookTitle = book.Title.substring(0, 50);
                // alert(bookTitle);

                $('#previevwHolder')
                    .append($('<div class="" id="postHolder">')
                        .append($('<h2 class="guildof"></h2>').text(book.Title))
                        .append($('<h4 class="buxtonSketch"></h4>').text(book.Description))
                        .append($("<img>", {class: 'postImg', src: book.ImgUrl}))
                        .append($("<br>"))
                        .append($("<br>"))
                        .append($("<a>", { class: 'postUrl', href: book.ArticleUrl, target: "_blank"}).text("Read more..."))
                        .append($('<span style="float: right; font-family: Alsandra">').text("Delete..."))
                    );

                $('#post-title')
                    .append($('<span class="alsandra"></span>').text(bookTitle))
                    .append($("<a class='read-more' data-toggle='tooltip' title='read more :)'>").text(" [...]"))
                    .append($("<br>"))
                    .append($("<br>"));
            }

            $('#listPosts .top').text(counter);
        }

        showInfo('Posts loaded.');
    }
}

function listPosts() {
    $('#postsHolderRaw').text('');
    $.ajax({
        method: "GET",
        url:kinveyServiceBaseUrl + 'appdata/' + kinveyAppID + '/posts',
        headers: {
            "Authorization": "Kinvey " + sessionStorage.authToken
        },
        success: ajaxPostsLoaded,
        error: showBooksAjaxError
    });

    function ajaxPostsLoaded(data,status) {
        for(let post of data) {
            let items = [];

            $.each(post, function (key, val) {
                items.push('<h3 class="alsandra">Key: ' + key + ' <br/> Value: ' + val + "</h3>");
            });


            $('#postsHolderRaw')
                .append(items)
                .append('<br>')
                .append('<hr style="border: 3px dotted green; width: 60%;">')
        }
    }

}

function logout() {
    sessionStorage.clear();
    $('#previevwHolder').empty();
    $('#post-title').empty();
    $('#listPosts .top').text('Log in first');
    appended = false;
    showHideNavLinks();
    showHomeView();
}
