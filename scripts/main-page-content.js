/**
 * Created by Republic Of Gamers on 7/17/2016.
 */




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
    $('#linkCreateArticle').click(showCreateArticleView);
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
    $('#createPostForm').submit(function (e) {
        e.preventDefault();
        createPost();
    });

    $('#loginButton').click(login);
    $('#registerButton').click(registerUser);
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
        $('#linkListGalaxies').show();
    }else{
        /* if user is not logged */
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkListPosts').show();
        $('#linkFoodCost').show();
        $('#linkCreatePost').hide();
        $('#linkLogout').hide();
        $('#linkJSONviaAJAX').hide();
        $('#linkListGalaxies').show();
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
function showAddGalaxyView() {
    showView('viewAddGalaxy');
}
function showListGalaxiesView() {
    showView('viewListGalaxies');
}
function showCreateArticleView() {
    showView('viewCreateArticle');
}
function showCreatePostView() {
    showView('viewCreatePost');
}

function showAJAXviaJSONView() {
    showView('json-via-ajax');
}

/* START OF LOGIN VIEW */
function login() {
    let loginData = {
        email : $('#loginEmail').val(),
        password : $('#loginPassword').val()
    };
    // alert('IN LOGIN');
   firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password) 
       .then((userCredential) => { 
           const user = userCredential.user; 
           
           // mimic your old Kinvey session behavior 
           sessionStorage.username = user.email; 
           sessionStorage.authToken = user.accessToken || ""; // Firebase doesn't use authtoken the same way 
           console.log(user);
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
/* END OF LOGIN VIEW */

/* START OF REGISTRATION VIEW */
const emailInput = document.getElementById('email'); 
const passInput = document.getElementById('password'); 
const termsCheck = document.getElementById('terms'); 
const registerBtn = document.getElementById('registerBtn'); 

function updateRegisterButton() { 
    const ready = emailInput.value.trim() !== "" && passInput.value.trim() !== "" && terms.checked; 
    if (ready) { 
        registerBtn.disabled = false; 
        registerBtn.classList.remove('btn-primary'); 
        registerBtn.classList.add('btn-success'); 
    } else { 
        registerBtn.disabled = true; 
        registerBtn.classList.remove('btn-success'); 
        registerBtn.classList.add('btn-primary'); 
    } 
} 
emailInput.addEventListener('input', updateRegisterButton); 
passInput.addEventListener('input', updateRegisterButton); 
termsCheck.addEventListener('change', updateRegisterButton);


function registerUser() {
    let registerData = {
        username : $('#email').val(),
        password : $('#password').val()
    };

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
       // showListPostsView();
        showHideNavLinks();
        showInfo('Register completed successfully.');
    }
}
/* END OF REGISTRATION VIEW */

/* START OF SAVE ARTICLE VIEW */
function saveArticle() {
    const title = document.getElementById("articleTitle").value.trim();
    const content = document.getElementById("articleContent").value.trim();

    if (!title || !content) {
        alert("Please fill in both fields.");
        return;
    }

    const user = auth.currentUser;

    db.collection("Articles").add({
        title: title,
        content: content,
        author: user ? user.uid : "anonymous"
    })
    .then(() => {
        console.log("Article saved!");
        document.getElementById("articleForm").reset();
    })
    .catch(err => {
        console.log("Error saving article:", err);
        console.log("Error saving article.");
    });
}
/* END OF SAVE ARTICLE VIEW */

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
