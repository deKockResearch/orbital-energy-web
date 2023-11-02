/* Script to select a single table value
 * Magic unicorn crap
 */

// global variables
let elements;

// import elements.json and store in elements
fetch("static/elements.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => (elements = data));

/*
 * Gets element's data from element list based on atomic number
 * Input: atomic number
 * Output: element data with thatomic number given
 */
function getElementByAtomicNumber(atomicNumber) {
  return elements.find((element) => element.number === atomicNumber);
}

/*
 * Displays a box with the element's data
 * Input: selected, object clicked on in HTML
 * Output: element data with thatomic number given
 */
function elementBox(selected) {
  const elementID = $(selected).text().replace(/\D/g, "");
  const selectedElement = getElementByAtomicNumber(parseInt(elementID));
  const classList = $(selected).attr("class").split(/\s+/);
  $(selected).addClass("clicked");
  $("<div></div>").attr("id", elementID).appendTo(".detailedView");
  $("#" + elementID).addClass(["element", classList[2]]);
  $("#" + elementID).append(
    "<span>" +
      '<div class="aNumber">' +
      selectedElement.number +
      "</div>" +
      '<div class="aSymbol">' +
      selectedElement.symbol +
      "</div>" +
      '<div class="aName">' +
      selectedElement.name +
      "</div>" +
      '<div class="aMass">' +
      selectedElement.aMass +
      "</div>" +
      '<input type="text" class="textInput" value="' +
      selectedElement.eConfig +
      '">' +
      "</span>"
  );
  configParser(selectedElement.eConfig);
}

/*
 * Main function
 * Check if element is already in display:
 *      Removes it if present
 *      Appends it if absent
 */
$(function () {
  $(".element.ptable").on("click", function () {
    const elementID = $(this).text().replace(/\D/g, "");

    if ($(this).hasClass("clicked")) {
      // remove selected element if already displayed
      $(this).removeClass("clicked");
      $("#" + elementID).remove();
      $(".energyLevels").empty();

      // place instruction text in detailedView div
      $("<div></div>").attr("id", "tempText").appendTo(".detailedView");
      $("#tempText").append(
        "<p>Select an element from the periodic table for more details</p>"
      );

      /* Checks if the selected element box is empty
            if (!$('.detailedView').html().trim().length) {
                $("<div></div>").attr('id', 'tempText').appendTo('.detailedView');
                $("#tempText").append('<p>Select an element from the periodic table for more details</p>');
            }
            */
    } else {
      $(".element.ptable").removeClass("clicked");
      $(".detailedView").empty();
      $(".energyLevels").empty();
      elementBox(this);
    }
  });
});

function configParser(eConfig) {
  // variables used in for loop
  let eCount;
  let orbital;
  let subShell;
  let imgCount;

  // change eConfig into a list
  const configList = eConfig.split(" ");

  // loop back to front
  for (let i = configList.length; i > 0; i--) {
    eCount = parseInt(configList[i - 1].substr(2));
    orbital = configList[i - 1].substr(0, 2);
    subShell = orbital.substr(1);
    switch (subShell) {
      case "s":
        imgCount = 1;
        break;
      case "p":
        imgCount = 3;
        break;
      case "d":
        imgCount = 5;
      case "f":
        break;
    }
    drawSZLevel(imgCount, eCount, orbital);
  }
}

function drawSZLevel(imgCount, eCount, orbital) {
  $("<div>", { class: "orbital", id: orbital }).appendTo(".energyLevels");

  for (let i = 0; i < imgCount; i++) {
    $("#" + orbital).append("<img src=/static/symbol.png ></img>");
  }
  $("#" + orbital).append("<p>" + orbital + "</p>");
}

$("#hide").on("click", function () {
  $(".energyLevels").toggle();
  drawMatrix("matrix1", false);
  drawMatrix("matrix2", false);
  drawMatrix("matrix3", true);
});

function drawMatrix(id, editable) {
  let content;
  const eLevels = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p"];
  for (let i = 0; i <= eLevels.length; i++) {
    $("#" + id).append("<tr>");
    for (let j = 0; j <= eLevels.length; j++) {
      if (j == 0 && i == 0) {
        $("#" + id).append("<td></td>");
      } else if (i == 0) {
        $("#" + id).append("<th>" + eLevels[j - 1] + "</th>");
      } else if (j == 0) {
        $("#" + id).append("<th>" + eLevels[i - 1] + "</th>");
      } else {
        if (editable) {
          content = '<td contenteditable="true"> 0.01 </td>';
        } else {
          content = "<td> 0.01 </td>";
        }
        //$("#matrix").append('<td contenteditable="true">matrix[' + i + '][' + j +  '] </td>');
        $("#" + id).append(content);
      }
    }
    $("#matrix").append("</tr>");
  }
}

$(".tablinks").click(function (e) {
  $(this).addClass("active");
  $(this).siblings().removeClass("active");
  let name = $(this).attr("name");

  $(".tabcontent").removeClass("active");
  $("[name='" + name + "']").addClass("active");
});
