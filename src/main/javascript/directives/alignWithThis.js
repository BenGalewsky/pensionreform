pensionApp.directive('alignWithThis', function() {
  function link($scope, element, attrs){
    window.setTimeout(
      function(){
        elementToBeAlignedTo = $(attrs.alignWithThis)
        if(elementToBeAlignedTo.length>0) element.css("top", elementToBeAlignedTo[0].offsetTop+"px")
      }, 100)
  }
  return {
    link: link, 
    restrict: 'A'
  }  
})