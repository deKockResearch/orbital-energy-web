/* Script to select a single table value
 * Magic unicorn crap
 */
$(document).ready(function(){
    $('.element').click( function() {
        if ( $(this).hasClass('clicked')) {
            $(this).removeClass('clicked');
           // $(this).css('background-color', '');
        } else {
            $(this).addClass('clicked');
            // $(this).css('background-color', 'white');
        }
       
    });
});
