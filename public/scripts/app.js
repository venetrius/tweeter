/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// TODO sort tweets newest should be the first to be rendered
const loadTweets = function() {
  $.ajax({
      url : '/tweets',
      method: 'GET'
    }).done(function(tweets) {
    renderTweets(tweets);
  })
}

const createTweetHeader = function(user){
  let $header =
    `<header>
      <img src=${user.avatars.small}>
      <span class="name"> ${user.name} </span>
      <span class="signature"> ${user.handle} </span>
    </header>`;
    return $header;
}

const createTweetContent = function(content){
  let $content = $("<div>");
  let $span = $("<span>").text(content.text).appendTo($content);
 // $content.append($span);
  return $content;
}

const createTweetFooter = function(timeStamp){
  const diffTime = new Date().getTime() - timeStamp;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const $footer =
    `<footer> ${diffDays} days ago
      <i class="fas fa-retweet"></i>
      <i class="far fa-heart"></i>
      <i class="fab fa-font-awesome-flag"></i>
    </footer>`
    return $footer;
}

const createTweetElement = function(tweet){
  let $header = createTweetHeader(tweet.user);
  let $content = createTweetContent(tweet.content);
  let $footer = createTweetFooter(tweet.created_at);
  let $tweet = $("<article>").append($header).append($content).append($footer);
  return $tweet;

 }

const renderTweets = function (tweets) {
  const tweetsContainer = $('#tweets-container');
  for(let tweet of tweets){
    tweetsContainer.prepend(createTweetElement(tweet));
  };
}

const renderNewTweet = function(tweet) {
  const tweetsContainer = $('#tweets-container');
  tweetsContainer.prepend(createTweetElement(tweet));
}

const isValidTweet = function(errorMessage, text){
  // if error message is shown, toggle it
  if(errorMessage.is( ":visible" )){
    errorMessage.slideUp();
  }
  if(!text){
    errorMessage.text("Tweet content is not valid, add some text.");
  }else if(text.length > 140){
    errorMessage.text("Tweet content is not valid, max length is 140.");
  }else{
    return true;
  }
  errorMessage.slideDown();
  // return false or ommit return statement, what is the best practice?
}


const sendAjaxOnSubmit = function(errorObj){
  $( "section form" ).on( "submit", function( event ) {
    event.preventDefault();
    const text = this.querySelector('textarea').value;
    if(isValidTweet(errorObj, text)){
      $.ajax({
        url : '/tweets',
        method: 'POST' ,
        data :  $('form').serialize(),
       success: (res ) => renderNewTweet(res)
      });
      this.querySelector('textarea').value = "";
      this.querySelector('output').value = "140";
    }
  });
}

const addToggleFuncionalityToComposeBtn = function(){
  let newTweet = $(".new-tweet");
  let textarea = $('textarea');
  const callback = function(event){
    newTweet.slideToggle();
    textarea.focus();
  }

  $("nav #compose").click(callback);
}

const loggedInCallBack = function(){
  $('.anAuth').hide();
  $('.auth').show();
  $('.error').text('');
}

//TODO implement server call
const loggedOutCallBack = function(){
  $('.anAuth').show();
  $('.auth').hide();
}

// TODO put it into HTML ?
const bindLogout = function(){
  $('#logout').click(loggedOutCallBack);
}

// TODO add error handling
const userRegistrationAjax = function(){
   $( "#register" ).on( "submit", function( event ) {
    event.preventDefault();
    $.ajax(
      {
        url     : 'users',
        method  : 'POST',
        data    : $(this).serialize(), //todo it send a lot of trash to the server
        success: function(res ){loggedInCallBack(); $( "#register" ).hide()},
        error: function(req, textStatus, errorThrown) {
          if(req.status < 500){
            $( "#register output" ).text(req.responseText);
          }else{
            alert("Opsz something went wrong. Please try it again later.");
          }
        }
      }
    );
  })
}

const userLoginAjax = function(){
     $( "#login" ).on( "submit", function( event ) {
    event.preventDefault();
    $.ajax(
      {
        url     : 'users/login',
        method  : 'POST',
        data    : $(this).serialize(),
        success:  function(res ){$( "#login" ).hide(); loggedInCallBack()},
        error: function(req, textStatus, errorThrown) {
          if(req.status < 500){
            $( "#login output" ).text("The email or password is incorrect.");
          }else{
            alert("Opsz something went wrong. Please try it again later.");
          }
        }
      }
    );
  })
}

$( document ).ready(function() {
  let errorMessage = $("#errorMessage");
  errorMessage.slideUp();
  loadTweets();
  sendAjaxOnSubmit(errorMessage);
  addToggleFuncionalityToComposeBtn();
  userRegistrationAjax();
  userLoginAjax();
  bindLogout();
});




