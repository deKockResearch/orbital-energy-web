/* Script to select a single table value
 * Magic unicorn crap
 */

console.log(elements);

function getElementByAtomicNumber(atomicNumber) {
    return elements.find( ({ number }) => number === atomicNumber ); 
}

$(document).ready(function(){
    $('.element.ptable').click( function() {
        var elementID = $(this).text().replace(/\D/g,'');
        var selectedElement = getElementByAtomicNumber(parseInt(elementID));

        if ( $(this).hasClass('clicked')) {
            $(this).removeClass('clicked');
            $("#" + elementID).remove();

        } else {
            var classList = $(this).attr('class').split(/\s+/);
            console.log(classList);
            $(this).addClass('clicked');
            $("<div></div>").attr('id', elementID).appendTo('.detailedView');
            $("#" + elementID).addClass(['element', classList[2]]);
            $("#" + elementID).append('<span>' + selectedElement.number + '<br />' 
            + selectedElement.name + '<br />' 
            + selectedElement.symbol + '<br />' 
            + selectedElement.aMass + '<br />' 
            + '<input type="text" class="textInput" value="' + selectedElement.eConfig + '">' + '</span>');
        }
       
    });
});
