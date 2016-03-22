function addClickHandler(element, callback) {
 if (element.addEventListener) element.addEventListener(type, 'click');
 else if (element.attachEvent) element.attachEvent('on' + type, callback);
}

document.addEventListener("DOMContentLoaded", function() {
  links = document.getElementsByTagName('a');
  for(i=0,cnt=links.length;i<cnt;i++) {
    var element = links[i];
    var name = element.dataset.name || "otherLink";
    var category = element.dataset.category || "articleOrPage";
    addClickHandler(element, function() {
      ga('send', 'event', name, 'click', category);
    });
  }
});
