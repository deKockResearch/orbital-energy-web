import { ElementType, elements } from "./elements";
import {
  faussurierMatrix,
  mendozaMatrix,
  dynamic23Matrix,
  customMatrix,
} from "./matrices.js";
import { drawDiagram } from "./energyDiagramsDisplay.js";
import { totalOrbitalEnergy, energyComponents } from "./orbitalEnergy.js";
/*
 * Gets element's data from element list based on atomic number
 * Input: atomic number
 * Output: element data with the atomic number given
 */

// Global variables
let selectedMatrix: number[][];
let selectedElement: ElementType;
let eConfigInput: HTMLInputElement;

function getElementByAtomicNumber(atomicNumber: number): ElementType {
  return elements.find((element) => element.number === atomicNumber)!;
}

window.addEventListener("load", () => {
  // periodic table interactions
  const pTableElements = document.querySelectorAll(".clickable > .element.ptable");
  for (let i = 0; i < pTableElements.length; i++) {
    pTableElements[i].addEventListener("click", toggleElement);
  }
  const matrixSelect = document.getElementById("matrixSelector")!;
  matrixSelect.addEventListener("change", () => {
    document.getElementById("matrix-grid")!.replaceChildren();
    drawMatrix("matrix-grid");
    calculateEnergy();
  });
  const unitSelect = document.getElementById(
    "unitSelector"
  ) as HTMLSelectElement;
  unitSelect.addEventListener("change", () => {
    calculateEnergy();
  });

  drawMatrix("matrix-grid");
  //drawMatrix("matrix-2", false);
});

/*
 * Main function
 * Check if element is already in display:
 *      Removes it if present
 *      Appends it if absent
 */
function toggleElement(e: Event): void {
  // Erase tables and values from previously selected element.
  document.getElementById("tvTable")!.replaceChildren();
  document.getElementById("vijTable")!.replaceChildren();
  document.getElementById("total-energy")!.textContent = "";

  const detailsElem = document.getElementById("details")!;

  const target =
    (e.target as HTMLElement).nodeName === "A"
      ? (e.target as HTMLElement)!
      : (e.target as HTMLElement).parentElement!;

  if (target.classList.contains("clicked")) {
    // remove selected element if already displayed
    target.classList.remove("clicked");

    detailsElem.replaceChildren();
    document.getElementById("energyLevels")!.replaceChildren();
    document.getElementById("eLevelsID")!.replaceChildren();

    // place instruction text in detailedView div
    const div = document.createElement("div");
    div.id = "tempText";
    const tempText = document.createElement("p");
    tempText.textContent =
      "Select an element from the periodic table for more details";
    div.appendChild(tempText);
    detailsElem.appendChild(div);
  } else {
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let i = 0; i < pTableElements.length; i++) {
      pTableElements[i].classList.remove("clicked");
    }
    detailsElem.replaceChildren();
    document.getElementById("energyLevels")?.replaceChildren();
    elementBox(target);
    calculateEnergy();
  }
}

/*
 * Displays a box with the element's data
 * Input: selected, object clicked on in HTML
 * Output: element data with thatomic number given
 */
function elementBox(selected: HTMLElement): void {
  // retrieve element information
  const elementID = selected.textContent!.replace(/\D/g, "");
  selectedElement = getElementByAtomicNumber(parseInt(elementID));

  // temporary spot to update eConfigInput
  eConfigInput = <HTMLInputElement>document.getElementById("eConfigInput");
  eConfigInput.value = selectedElement.eConfig;

  // add clicked class to element
  selected.classList.add("clicked");

  // create elements to populate
  const div = document.createElement("div");
  const aNumber = document.createElement("div");
  const aSymbol = document.createElement("div");
  const aName = document.createElement("div");
  const aMass = document.createElement("div");
  const textInput = document.createElement("div");

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
  document.getElementById("details")!.appendChild(div);
  //configParser(selectedElement.eConfig);
}

function drawMatrix(id: string): void {
  let tableLocation = document.getElementById(id)!;
  //const eLevels = ["1s", "2s", "2p", "3s", "3p", "3d", "4s"];
  const eLevels = ["1s", "2s", "2p", "3s", "3p"];

  const selectedMatrixName = (
    document.getElementById("matrixSelector") as HTMLSelectElement
  ).value;

  switch (selectedMatrixName) {
    case "dynamic23Matrix" :
      selectedMatrix = dynamic23Matrix;
      break;
    case "customMatrix" :
      selectedMatrix = customMatrix;
      break;
    case "faussurierMatrix":
      selectedMatrix = faussurierMatrix;
      break;
    case "mendozaMatrix":
      selectedMatrix = mendozaMatrix;
      break;
    default:
      console.log("Unknown selected matrix: ", selectedMatrixName);
  }

  const editable = selectedMatrix !== dynamic23Matrix;

  // use <= because always subtracting 1 from the indices, and
  // 0th column/row are headers.
  for (let i = 0; i <= eLevels.length; i++) {
    let tableRow = document.createElement("tr");
    for (let j = 0; j <= eLevels.length; j++) {
      let tableData = document.createElement("td");
      let tableHeader = document.createElement("th");
      if (j === 0 && i === 0) {
        tableRow.appendChild(tableData);
      } else if (i === 0) {
        tableHeader.textContent = eLevels[j - 1];
        tableRow.appendChild(tableHeader);
      } else if (j === 0) {
        tableHeader.textContent = eLevels[i - 1];
        tableRow.appendChild(tableHeader);
      } else {
        if (editable) {
          tableData.contentEditable = "true";
        } else {
          tableData.contentEditable = "false";
        }

        /*
        if (id === "matrix-1") {
          tableData.textContent = dynamic23Matrix[i - 1][j - 1].toString();

        } else if (id === "matrix-2") {
          tableData.textContent = mendozaMatrix[i - 1][j - 1].toString();
        } else {
          tableData.textContent = "0.01";
        }
        */
        tableData.textContent = selectedMatrix[i - 1][j - 1].toString();
        tableRow.appendChild(tableData);
      }
    }
    tableLocation.appendChild(tableRow);
  }
}

function calculateEnergy(): void {

  // remove table contents
  document.getElementById("tvTable")!.replaceChildren();
  document.getElementById("vijTable")!.replaceChildren();

  const sigfig = 3;
  const totalEnergyBox = document.getElementById("total-energy")!;
  let totalText: string = "";
  const energyResult = totalOrbitalEnergy(eConfigInput.value, selectedMatrix);
  const unitSelect = (
    document.getElementById("unitSelector") as HTMLSelectElement
  ).value;
  if (unitSelect === "hr") {
    totalText = `${String(energyResult[0].toFixed(sigfig))} hr`;
  } else if (unitSelect === "Ry") {
    totalText = `${String((energyResult[0] * 2).toFixed(sigfig))} Ry`;
  } else if (unitSelect === "eV") {
    totalText = `${String(
      (energyResult[0] * 27.211386245988).toFixed(sigfig)
    )} eV`;
  } else if (unitSelect === "J") {
    totalText = `${String(
      (((energyResult[0] * 4.3597447222071) / 10) ^ 18).toFixed(sigfig)
    )} J`;
  } else if (unitSelect === "Cal") {
    totalText = `${String(energyResult[0].toFixed(sigfig))} Cal`;
  } else {
    console.log(unitSelect);
  }
  totalEnergyBox.textContent = totalText;

  let convertedEnergy: string[] = [];
  for (let i = 1; i < energyResult.length; i++) {
    if (unitSelect === "hr") {
      convertedEnergy.push(`${String(energyResult[i].toFixed(sigfig))} hr`);
    } else if (unitSelect === "Ry") {
      convertedEnergy.push(
        `${String((energyResult[i] * 2).toFixed(sigfig))} Ry`
      );
    } else if (unitSelect === "eV") {
      convertedEnergy.push(
        `${String((energyResult[i] * 27.211386245988).toFixed(sigfig))} eV`
      );
    } else if (unitSelect === "J") {
      convertedEnergy.push(
        `${String(
          (((energyResult[i] * 4.3597447222071) / 10) ^ 18).toFixed(sigfig)
        )} J`
      );
    } else if (unitSelect === "Cal") {
      convertedEnergy.push(`${String(energyResult[i].toFixed(sigfig))} Cal`);
    }
  }

  drawDiagram(selectedElement.eConfig, convertedEnergy);

  energyComponentsTable();
}

function energyComponentsTable() {
  const energyDict = energyComponents(eConfigInput.value, selectedMatrix);

  const tiValues = energyDict["t_i"];
  const viValues = energyDict["v_i"];
  const vijValues = energyDict["v_ij"];

  let tvLocation = document.getElementById("tvTable")!;
  let vijLocation = document.getElementById("vijTable")!;

  const eLevels = ["1s", "2s", "2p", "3s", "3p"];

  // t(i) and v(i) table

  // Use <= because the 1st row (not 0th row) uses 0th element in array,
  // 2nd rwo uses 1st element in array.
  for (let i = 0; i <= tiValues.length; i++) {
    let tableRow = document.createElement("tr");

    for (let j = 0; j < 2; j++) {
      const tableData = document.createElement("td");

      if (j === 0 && i === 0) {
        // Top left corner: empty cell
        tableRow.appendChild(tableData);
      } else if (i === 0) {
        // first row, 2nd column
        const tableHeader = document.createElement("th");
        tableHeader.textContent = j === 1 ? "t(i)" : "v(en)";
        tableRow.appendChild(tableHeader);
      } else if (j === 0) {
        // First column of each row.
        const tableHeader = document.createElement("th");
        tableHeader.textContent = eLevels[i - 1];
        tableRow.appendChild(tableHeader);
      } else if (j === 1) {
        tableData.textContent = tiValues[i - 1].toFixed(3).toString();
        tableRow.appendChild(tableData);
      } else {
        tableData.textContent = viValues[i - 1].toFixed(3).toString();
        tableRow.appendChild(tableData);
      }
    }
    tvLocation.appendChild(tableRow);
  }

  // v(i, j) table
  for (let i = 0; i <= vijValues.length; i++) {
    let tableRow = document.createElement("tr");

    for (let j = 0; j <= vijValues.length; j++) {
      let tableData = document.createElement("td");
      let tableHeader = document.createElement("th");

      if (j === 0 && i === 0) {
        tableRow.appendChild(tableData);
      } else if (i === 0) {
        tableHeader.textContent = eLevels[j - 1];
        tableRow.appendChild(tableHeader);
      } else if (j === 0) {
        tableHeader.textContent = eLevels[i - 1];
        tableRow.appendChild(tableHeader);
      } else {
        tableData.textContent = vijValues[i - 1][j - 1].toFixed(3).toString();
        tableRow.appendChild(tableData);
      }
    }
    vijLocation.appendChild(tableRow);
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
