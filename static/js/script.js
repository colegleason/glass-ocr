// <div class="card white"></div>
// <span class="TLHdash"></span>
// <span class="TLVdash"></span>
// <span class="TRHdash"></span>
// <span class="TRVdash"></span>
// <span class="BLHdash"></span>
// <span class="BLVdash"></span>
// <span class="BRHdash"></span>
// <span class="BRVdash"></span>
var pictureCard = '<div class="card white"></div> <span class="TLHdash"></span> <span class="TLVdash"></span> <span class="TRHdash"></span> <span class="TRVdash"></span> <span class="BLHdash"></span> <span class="BLVdash"></span> <span class="BRHdash"></span> <span class="BRVdash"></span>';
var textCard = '<div class="card black"><div class="cardText">We automatically upload your snapped documents to Google Drive.</div></div>';

var pictureText = 'Simply snap a picture';
var textCardText = 'And the results are instantly saved';

var switchedCard = false;
$(function () {
	var cardClass = '.receipt';
	var cardDescription = '.description' + cardClass + ' .text';
	var cardArea = '.cardArea';

	$(cardClass).find(cardArea).html(pictureCard);
	$(cardDescription).html(pictureText);

	// Card switch
	$('.container').on('scroll', function(event) {
		var scrollTop = $(this).scrollTop();

		// Change card if scroll is past the card's position
		if (!switchedCard) {
			if (scrollTop > $(cardClass).position().top) {
				switchedCard = true;
				
				// Fade and remove
				var delayStart = 3000;
				var fadeTime = 1000;
				var delayShow = 1000;
				$(cardArea).delay(delayStart).animate({opacity: .1}, 50).animate({opacity: 1}, 200).delay(100).fadeOut(fadeTime, function() {
					// Fade in new card
					$(cardArea).delay(delayShow).html(textCard).fadeIn(fadeTime);
				});

				$(cardDescription).delay(delayStart).fadeTo(fadeTime, 0, function () {
					console.log('hi');
					$(cardDescription).delay(delayShow).html(textCardText).fadeTo(fadeTime, 1);
				});
			}
		}
	});

	// Nav buttons
function scrollToAnchor(aid){
    var aTag = $("*[name='"+ aid +"']");
    $('.container').animate({scrollTop: aTag.offset().top}, 2000, 'easeInOutSine');
}

$('a.nav').click(function(e) {
	scrollToAnchor($(this).attr('href').substring(1));
	return false;
});

	

});