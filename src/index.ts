/*
 *
 *
 */
import { elements } from "./elements.js";
import { faussurierMatrix, mendozaMatrix } from "./matrices.js";
import { drawDiagram } from "./energyDiagramsDisplay.js";
/*
 * Gets element's data from element list based on atomic number
 * Input: atomic number
 * Output: element data with the atomic number given
 */
function getElementByAtomicNumber(atomicNumber: number) {
  return elements.find((element) => element.number === atomicNumber);
}

window.addEventListener("load", () => {
  // periodic table interactions
  const pTableElements = document.getElementsByClassName("element ptable");
  for (let i = 0; i < pTableElements.length; i++) {
    pTableElements[i].addEventListener("click", toggleElement);
  }

  drawMatrix("matrix-1", false);
  drawMatrix("matrix-2", false);
  drawMatrix("matrix-3", true);
});

/*
 * Main function
 * Check if element is already in display:
 *      Removes it if present
 *      Appends it if absent
 */
function toggleElement(e: Event): void {
  let target =
    (e.target as HTMLElement).nodeName === "A"
      ? (e.target as HTMLElement)
      : (e.target as HTMLElement).parentElement;
  const elementID = target.textContent!.replace(/\D/g, "");

  if (target.classList.contains("clicked")) {
    // remove selected element if already displayed
    target.classList.remove("clicked");

    document.getElementById("details").replaceChildren();
    document.getElementById("energyLevels").replaceChildren();

    // place instruction text in detailedView div
    let div = document.createElement("div");
    div.id = "tempText";
    let tempText = document.createElement("p");
    tempText.textContent =
      "Select an element from the periodic table for more details";
    div.appendChild(tempText);
    document.getElementById("details").appendChild(div);

    /* Checks if the selected element box is empty
              if (!$('.detailedView').html().trim().length) {
                  $("<div></div>").attr('id', 'tempText').appendTo('.detailedView');
                  $("#tempText").append('<p>Select an element from the periodic table for more details</p>');
              }
              */
  } else {
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let i = 0; i < pTableElements.length; i++) {
      pTableElements[i].classList.remove("clicked");
    }
    document.getElementById("details").replaceChildren();
    document.getElementById("energyLevels")?.replaceChildren();
    elementBox(target);
  }
}

/*
 * Displays a box with the element's data
 * Input: selected, object clicked on in HTML
 * Output: element data with thatomic number given
 */
function elementBox(selected): void {
  // retrieve element information
  const elementID = selected.textContent.replace(/\D/g, "");
  const selectedElement = getElementByAtomicNumber(parseInt(elementID));

  // temporary spot to update eConfigInput
  const eConfigInput = <HTMLInputElement>(
    document.getElementById("eConfigInput")
  );
  eConfigInput.value = selectedElement.eConfig;

  // add clicked class to element
  selected.classList.add("clicked");

  // create elements to populate
  let div = document.createElement("div");
  let aNumber = document.createElement("div");
  let aSymbol = document.createElement("div");
  let aName = document.createElement("div");
  let aMass = document.createElement("div");
  let textInput = document.createElement("div");

  // assign classes to elements
  div.classList.add("showcase", selected.classList[2]);
  aNumber.classList.add("aNumber");
  aSymbol.classList.add("aSymbol");
  aName.classList.add("aName");
  aMass.classList.add("aMass");
  textInput.classList.add("textInput");

  // add text content
  aNumber.textContent = String(selectedElement.number);
  aSymbol.textContent = selectedElement.symbol;
  aName.textContent = selectedElement.name;
  aMass.textContent = String(selectedElement.aMass);
  textInput.textContent = selectedElement.eConfig;

  // append elements
  div.appendChild(aNumber);
  div.appendChild(aSymbol);
  div.appendChild(aName);
  div.appendChild(aMass);
  div.appendChild(textInput);
  document.getElementById("details").appendChild(div);
  //configParser(selectedElement.eConfig);
  drawDiagram(selectedElement.eConfig);
}

function drawMatrix(id, editable): void {
  let tableLocation = document.getElementById(id);
  const eLevels = ["1s", "2s", "2p", "3s", "3p", "3d", "4s"];

  for (let i = 0; i <= eLevels.length; i++) {
    let tableRow = document.createElement("tr");
    for (let j = 0; j <= eLevels.length; j++) {
      let tableData = document.createElement("td");
      let tableHeader = document.createElement("th");
      if (j == 0 && i == 0) {
        tableRow.appendChild(tableData);
      } else if (i == 0) {
        tableHeader.textContent = eLevels[j - 1];
        tableRow.appendChild(tableHeader);
      } else if (j == 0) {
        tableHeader.textContent = eLevels[i - 1];
        tableRow.appendChild(tableHeader);
      } else {
        if (editable) {
          tableData.contentEditable = "true";
        } else {
          tableData.contentEditable = "false";
        }
        console.log(id);
        if (id === "matrix-1") {
          tableData.textContent = faussurierMatrix[i - 1][j - 1].toString();
        } else if (id === "matrix-2") {
          tableData.textContent = mendozaMatrix[i - 1][j - 1].toString();
        } else {
          tableData.textContent = "0.01";
        }
        tableRow.appendChild(tableData);
      }
    }
    tableLocation.appendChild(tableRow);
  }
}

/* TO DO LIST!
 * Handle selecting elements after Kr
 * Handle selecting Transition metals
 * Figure out fractional electrons
 * Populate matrices with correct values
 * Unable to change electron config if matrix 1 or 2 is selected
 * Matrix beautification
 * Get num electrons in each orbital
 * Invalid electron configuration
 *
 * Questions for prof:
 * Clarification on equations - relationship btn J and K terms, and why they don't show up in total energy equation
 * alpha beta name?
 * Display canonical orbital energy?
 * Link to how the matrices were generated?
 */
