$(document).ready(function() {
  $('textarea').on("input", function(event){
    this.form.lastElementChild.innerText = 140 - this.value.length;
    let color = 140 - this.value.length < 0 ? "red" : "";
    $(this.form.lastElementChild).css("background-color", color);
  });
});
