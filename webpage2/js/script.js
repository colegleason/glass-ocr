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
var textCard = '<div class="card black"><div class="cardText">Welcome to a whole new experience. <br><br><br> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum, facere, ipsam officia suscipit qui dolorum aperiam quibusdam dolor recusandae vel placeat hic id unde? Magnam, ex, nam, hic ut obcaecati quo veniam atque consequatur magni tempore sunt culpa quod libero doloremque molestias beatae quasi! A, id ad dignissimos incidunt facere nisi quae accusamus odio in sunt atque alias nemo vitae perferendis quam sapiente exercitationem nulla nesciunt. Quae, omnis, tenetur, placeat iste aperiam rerum nihil quisquam dicta corporis enim odio quo iure temporibus quos cumque adipisci et repellat neque quas blanditiis facilis culpa voluptate perferendis sapiente doloremque optio facere veritatis qui non magni aspernatur autem</div></div>';

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