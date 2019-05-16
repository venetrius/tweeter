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

const isValidTweet = function(errorObj, text){
  console.log(errorObj.errorMessage.slideToggle());
  console.log("is valid?");
  /*if(errorObj.visible){
    visible = false;
    errorObj.errorMessage.slideUp();
  }*/
  if(!text){
    errorObj.errorMessage.text("Tweet content is not valid, add some text.");
    console.log(errorObj.errorMessage);
  }else if(text.length > 140){
    errorObj.errorMessage.text("Tweet content is not valid, max length is 140.");
  }else{
    return true;
  }
  errorObj.errorMessage.slideDown();
  errorObj.visible = true;
}


const sendAjaxOnSubmit = function(errorObj){
  $( "form" ).on( "submit", function( event ) {
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
  let newTweet = $(".container .new-tweet");
  let textarea = $('textarea');
  const callback = function(event){
    newTweet.slideToggle();
    textarea.focus();
  }

  $("nav button").click(callback);
}

$( document ).ready(function() {
  let errorObj ={ errorMessage : $("#errorMessage"),
                  visible : false};
  errorObj.errorMessage.slideUp(10);
  loadTweets();
  sendAjaxOnSubmit(errorObj);
  addToggleFuncionalityToComposeBtn();
});




