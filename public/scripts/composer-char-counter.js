$(document).ready(function() {
  $('textarea').on("input", function(event){
    $(this.form.querySelector('output')).text(140 - this.value.length);
    if(140 - this.value.length < 0){
      $(this.form.querySelector('output')).addClass("overflow");
    }else{
      $(this.form.querySelector('output')).removeClass("overflow");
    }
  });
});
