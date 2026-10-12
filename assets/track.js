// Meta Pixel events shared by every page (base code is in each page's <head>).
// Event names are case sensitive: see Meta's "Specifications for Meta Pixel standard events".
(function(){
  function fb(){ if(window.fbq) fbq.apply(null, arguments); }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a'); if(!a) return;
    var href = a.getAttribute('href') || '';
    // Contact: someone emails support
    if(href.indexOf('mailto:') === 0) fb('track', 'Contact', {content_name: 'Email support'});
    // Custom event: free sample downloads (no contact details are collected, so this is not a Lead)
    else if(href.indexOf('sample/') > -1 && /\.pdf$/i.test(href))
      fb('trackCustom', 'SampleDownload', {content_name: /marketing/.test(href) ? 'Marketing Research Pack sample' : 'Ebook sample'});
  });
})();
