/* Script to select a single table value
 * Magic unicorn crap
 */

// global variables
var elements;

// import elements.json and store in elements
fetch("static/elements.json")
    .then(response => {
        return response.json();
    }).then(data => elements = data);

/*
 * Gets element's data from element list based on atomic number
 * Input: atomic number
 * Output: element data with thatomic number given
 */
function getElementByAtomicNumber(atomicNumber) {
    return elements.find(element => element.number === atomicNumber);
}

/*
 * Displays a box with the element's data
 * Input: selected, object clicked on in HTML
 * Output: element data with thatomic number given
 */
function elementBox(selected) {
    const elementID = $(selected).text().replace(/\D/g, '');
    const selectedElement = getElementByAtomicNumber(parseInt(elementID));
    const classList = $(selected).attr('class').split(/\s+/);
    $(selected).addClass('clicked');
    $("<div></div>").attr('id', elementID).appendTo('.detailedView');
    $("#" + elementID).addClass(['element', classList[2]]);
    $("#" + elementID).append('<span>' +
        '<div class="aNumber">' + selectedElement.number + '</div>' +
        '<div class="aSymbol">' + selectedElement.symbol + '</div>' +
        '<div class="aName">' + selectedElement.name + '</div>' +
        '<div class="aMass">' + selectedElement.aMass + '</div>' +
        '<input type="text" class="textInput" value="' + selectedElement.eConfig + '">' +
        '</span>');
    drawSZLevels(selectedElement.eConfig);
}

/*
 * Main function
 * Check if element is already in display:
 *      Removes it if present
 *      Appends it if absent
 */
$(function () {
    $('.element.ptable').on("click", function () {
        const elementID = $(this).text().replace(/\D/g, '');

        if ($(this).hasClass('clicked')) {
            // remove selected element if already displayed
            $(this).removeClass('clicked');
            $("#" + elementID).remove();

            // place instruction text in detailedView div
            $("<div></div>").attr('id', 'tempText').appendTo('.detailedView');
            $("#tempText").append('<p>Select an element from the periodic table for more details</p>');

            /* Checks if the selected element box is empty
            if (!$('.detailedView').html().trim().length) {
                $("<div></div>").attr('id', 'tempText').appendTo('.detailedView');
                $("#tempText").append('<p>Select an element from the periodic table for more details</p>');
            }
            */
        } else {
            $('.element.ptable').removeClass('clicked');
            $('.detailedView').empty();
            elementBox(this);
        }
    });
});

function drawSZLevels(eConfig) {
    const configList = eConfig.split(' ');
    for (var i=0; i < configList.length; i++) {
        console.log(configList[i]);
    }
}
