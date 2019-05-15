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
  let $span = $("<span>").text(content.text);
  $content.append($span);
  return $content;
}

const createTweetFooter = function(timeStamp){
  const diffTime = new Date().getTime() - timeStamp;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const $footer =
    `<footer> ${diffDays} days ago
            <img src="./../images/arrows.png"/>
            <img src="./../images/heart.png"/>
            <img src="./../images/flag.png"/>
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
    tweetsContainer.append(createTweetElement(tweet));
  };
}

const renderNewTweet = function(tweet) {
  const tweetsContainer = $('#tweets-container');
  tweetsContainer.prepend(createTweetElement(tweet));
}

const isValidTweet = function(text){
  if(!text){
    alert("Tweet content is not valid, add some text.");
  }else if(text.length > 140){
    alert("Tweet content is not valid, max length is 140.");
  }else{
    return true;
  }

}

const sendAjaxOnSubmit = function(){
  $( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    const text = this.querySelector('textarea').value;
    if(isValidTweet(text)){
      $.ajax({
        url : '/tweets',
        method: 'POST' ,
        data :  $('form').serialize(),
       success: (res ) => renderNewTweet(res)
      });
      this.querySelector('textarea').value = "";
    }
  });
}

$( document ).ready(function() {

  loadTweets();
  sendAjaxOnSubmit();
});




