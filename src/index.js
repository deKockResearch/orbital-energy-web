/*
 *
 *
 */
import { elements } from "./elements.js";
import { dynamic23Matrix, customMatrix, } from "./matrices.js";
import { drawDiagram } from "./energyDiagramsDisplay.js";
import { totalOrbitalEnergy, energyComponents } from "./orbitalEnergy.js";
/*
 * Gets element's data from element list based on atomic number
 * Input: atomic number
 * Output: element data with the atomic number given
 */
// Global variables
let selectedMatrix;
let selectedElement;
let eConfigInput;
function getElementByAtomicNumber(atomicNumber) {
    return elements.find((element) => element.number === atomicNumber);
}
window.addEventListener("load", () => {
    // periodic table interactions
    const pTableElements = document.getElementsByClassName("element ptable");
    for (let i = 0; i < pTableElements.length; i++) {
        pTableElements[i].addEventListener("click", toggleElement);
    }
    const matrixSelect = document.getElementById("matrixSelector");
    matrixSelect.addEventListener("change", () => {
        document.getElementById("matrix-grid").replaceChildren();
        drawMatrix("matrix-grid");
        calculateEnergy();
    });
    const unitSelect = document.getElementById("unitSelector");
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
function toggleElement(e) {
    var _a;
    document.getElementById("tvTable").replaceChildren();
    document.getElementById("total-energy").textContent = "";
    let target = e.target.nodeName === "A"
        ? e.target
        : e.target.parentElement;
    const elementID = target.textContent.replace(/\D/g, "");
    if (target.classList.contains("clicked")) {
        // remove selected element if already displayed
        target.classList.remove("clicked");
        document.getElementById("details").replaceChildren();
        document.getElementById("energyLevels").replaceChildren();
        document.getElementById("eLevelsID").replaceChildren();
        // place instruction text in detailedView div
        let div = document.createElement("div");
        div.id = "tempText";
        let tempText = document.createElement("p");
        tempText.textContent =
            "Select an element from the periodic table for more details";
        div.appendChild(tempText);
        document.getElementById("details").appendChild(div);
    }
    else {
        const pTableElements = document.getElementsByClassName("element ptable");
        for (let i = 0; i < pTableElements.length; i++) {
            pTableElements[i].classList.remove("clicked");
        }
        document.getElementById("details").replaceChildren();
        (_a = document.getElementById("energyLevels")) === null || _a === void 0 ? void 0 : _a.replaceChildren();
        elementBox(target);
        calculateEnergy();
    }
}
/*
 * Displays a box with the element's data
 * Input: selected, object clicked on in HTML
 * Output: element data with thatomic number given
 */
function elementBox(selected) {
    // retrieve element information
    const elementID = selected.textContent.replace(/\D/g, "");
    selectedElement = getElementByAtomicNumber(parseInt(elementID));
    // temporary spot to update eConfigInput
    eConfigInput = document.getElementById("eConfigInput");
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
}
function drawMatrix(id) {
    let tableLocation = document.getElementById(id);
    //const eLevels = ["1s", "2s", "2p", "3s", "3p", "3d", "4s"];
    const eLevels = ["1s", "2s", "2p", "3s", "3p"];
    const selectedMatrixName = document.getElementById("matrixSelector").value;
    selectedMatrix =
        selectedMatrixName === "dynamic23Matrix" ? dynamic23Matrix : customMatrix;
    const editable = selectedMatrix !== dynamic23Matrix;
    for (let i = 0; i < eLevels.length; i++) {
        let tableRow = document.createElement("tr");
        for (let j = 0; j < eLevels.length; j++) {
            let tableData = document.createElement("td");
            let tableHeader = document.createElement("th");
            if (j === 0 && i === 0) {
                tableRow.appendChild(tableData);
            }
            else if (i === 0) {
                tableHeader.textContent = eLevels[j - 1];
                tableRow.appendChild(tableHeader);
            }
            else if (j === 0) {
                tableHeader.textContent = eLevels[i - 1];
                tableRow.appendChild(tableHeader);
            }
            else {
                if (editable) {
                    tableData.contentEditable = "true";
                }
                else {
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
function calculateEnergy() {
    const sigfig = 3;
    const totalEnergyBox = document.getElementById("total-energy");
    let totalText = "";
    const energyResult = totalOrbitalEnergy(eConfigInput.value, selectedMatrix);
    const unitSelect = document.getElementById("unitSelector").value;
    if (unitSelect === "hr") {
        totalText = `${String(energyResult[0].toFixed(sigfig))} hr`;
    }
    else if (unitSelect === "Ry") {
        totalText = `${String((energyResult[0] * 2).toFixed(sigfig))} Ry`;
    }
    else if (unitSelect === "eV") {
        totalText = `${String((energyResult[0] * 27.211386245988).toFixed(sigfig))} eV`;
    }
    else if (unitSelect === "J") {
        totalText = `${String((((energyResult[0] * 4.3597447222071) / 10) ^ 18).toFixed(sigfig))} J`;
    }
    else if (unitSelect === "Cal") {
        totalText = `${String(energyResult[0].toFixed(sigfig))} Cal`;
    }
    else {
        console.log(unitSelect);
    }
    totalEnergyBox.textContent = totalText;
    let convertedEnergy = [];
    for (let i = 1; i < energyResult.length; i++) {
        if (unitSelect === "hr") {
            convertedEnergy.push(`${String(energyResult[i].toFixed(sigfig))} hr`);
        }
        else if (unitSelect === "Ry") {
            convertedEnergy.push(`${String((energyResult[i] * 2).toFixed(sigfig))} Ry`);
        }
        else if (unitSelect === "eV") {
            convertedEnergy.push(`${String((energyResult[i] * 27.211386245988).toFixed(sigfig))} eV`);
        }
        else if (unitSelect === "J") {
            convertedEnergy.push(`${String((((energyResult[i] * 4.3597447222071) / 10) ^ 18).toFixed(sigfig))} J`);
        }
        else if (unitSelect === "Cal") {
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
    let tvLocation = document.getElementById("tvTable");
    let vijLocation = document.getElementById("vijTable");
    const eLevels = ["1s", "2s", "2p", "3s", "3p"];
    // t(i) and v(i) table
    for (let i = 0; i < tiValues.length; i++) {
        let tableRow = document.createElement("tr");
        for (let j = 0; j < 2; j++) {
            let tableData = document.createElement("td");
            let tableHeader = document.createElement("th");
            if (j === 0 && i === 0) {
                tableRow.appendChild(tableData);
            }
            else if (j === 0) {
                tableHeader.textContent = eLevels[i - 1];
                tableRow.appendChild(tableHeader);
            }
            else if (i === 0) {
                tableHeader.textContent = j === 1 ? "t(i)" : "v(en)";
                tableRow.appendChild(tableHeader);
            }
            else if (j === 1) {
                // console.log(j);
                tableData.textContent = tiValues[i - 1].toFixed(3).toString();
                tableRow.appendChild(tableData);
            }
            else {
                tableData.textContent = viValues[i - 1].toFixed(3).toString();
                tableRow.appendChild(tableData);
            }
        }
        tvLocation.appendChild(tableRow);
    }
    // v(i, j) table
    for (let i = 0; i < vijValues.length; i++) {
        let tableRow = document.createElement("tr");
        for (let j = 0; j < vijValues.length; j++) {
            let tableData = document.createElement("td");
            let tableHeader = document.createElement("th");
            if (j === 0 && i === 0) {
                tableRow.appendChild(tableData);
            }
            else if (i === 0) {
                tableHeader.textContent = eLevels[j - 1];
                tableRow.appendChild(tableHeader);
            }
            else if (j === 0) {
                tableHeader.textContent = eLevels[i - 1];
                tableRow.appendChild(tableHeader);
            }
            else {
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
//# sourceMappingURL=index.js.map