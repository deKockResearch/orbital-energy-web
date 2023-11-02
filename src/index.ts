import { ElementType, elements } from "./elements";
import {
  faussurierMatrix,
  dynamic23Matrix,
  customMatrix,
  row23ArgonOnlyMatrix,
  row23FrozenMatrix,
} from "./matrices.js";
import { atomicSize, electronAffinity, polarizability, unweightedIonizationEnergy, weightedIonizationEnergy } from "./graphData.js";
import { drawDiagram } from "./energyDiagramsDisplay.js";
import {
  totalOrbitalEnergy,
  energyComponents,
  computeZis,
} from "./orbitalEnergy";
import { Chart } from "chart.js/auto";


// for an orbital like 1s2, break into parts.
export interface Orbital {
  level: number;
  sOrP: string;
  numElectrons: number;
}

// Global variables
let selectedElement: ElementType | null;
let selectedElemOrbitals: Orbital[] = [];
let eConfigInput: HTMLInputElement;

const eLevels = ["1s", "2s", "2p", "3s", "3p"];
// max # of electrons in each orbital.
const FULL_ORBITAL_CTS = [2, 2, 6, 2, 6];

// The user can select a 3rd matrix to display. We default to 'custom'.
let selectedMatrixName = 'custom';

let unitSelectValue: string = 'Ha';

function getElementByAtomicNumber(atomicNumber: number): ElementType {
  return elements.find((element) => element.number === atomicNumber)!;
}

window.addEventListener("load", () => {
  // periodic table interactions
  const pTableElements = document.querySelectorAll(".clickable > .element.ptable");
  for (let i = 0; i < pTableElements.length; i++) {
    pTableElements[i].addEventListener("click", toggleElement);
  }

  // handle switching tabs.  https://www.youtube.com/watch?v=Nestt4vagvM&t=56s
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {

      const target = document.querySelector((tab as any).dataset.target);

      // clear all is-active classes on tab-panels.
      tabContents.forEach(tc => tc.classList.remove('is-active'));
      // make the one selected tab-panel active.
      target.classList.add('is-active');

      // clear the coloring on the tabs
      tabs.forEach(t => t.classList.remove('is-active'));
      // make the selected tab colored
      tab.classList.add('is-active');
    });
  });



  const unitSelect = document.getElementById("unitSelector") as HTMLSelectElement;
  unitSelect.addEventListener("change", () => {
    unitSelectValue = unitSelect.value;   // update global variable
    calculateEnergies();
    updateChartScales();
    updateEnergiesBox();
  });

  const matrixSelect = (document.getElementById("matrixSelector") as HTMLSelectElement);
  matrixSelect.addEventListener("change", () => {
    // switched from some matrix to showing custom matrix, so start watching for
    // changes to it.
    if (selectedMatrixName !== 'custom' && matrixSelect.value === 'custom') {
      watchCustomMatrixForChanges();
    }
    selectedMatrixName = matrixSelect.value;
    drawMatrices();
    if (eConfigInput) {
      // element has been selected.
      calculateEnergies();
    }
  });

  drawMatrices();
  // assuming custom matrix is showing initially, watch changes to it.
  watchCustomMatrixForChanges();

  drawCharts();

});

function removeTableEntries() {
  document.getElementById("dynamic23TvTable")!.replaceChildren();
  document.getElementById("faussurierTvTable")!.replaceChildren();
  document.getElementById("selectableTvTable")!.replaceChildren();
  document.getElementById("dynamic23VijTable")!.replaceChildren();
  document.getElementById("faussurierVijTable")!.replaceChildren();
  document.getElementById("selectableVijTable")!.replaceChildren();
  document.getElementById("dynamic23TotalEnergy")!.replaceChildren();
  document.getElementById("faussurierTotalEnergy")!.replaceChildren();
  document.getElementById("selectableTotalEnergy")!.replaceChildren();
}

//
// Called when an element is selected
//
function toggleElement(e: Event): void {
  // Erase tables and values from previously selected element.
  removeTableEntries();

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

    selectedElement = null;

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

    // retrieve element information
    const elementID = target.textContent!.replace(/\D/g, "");
    selectedElement = getElementByAtomicNumber(parseInt(elementID));

    eConfigInput = <HTMLInputElement>document.getElementById("eConfigInput");
    eConfigInput.value = selectedElement!.eConfig;

    selectedElemOrbitals = computeOrbitals(eConfigInput.value);

    elementBox(target);
    calculateEnergies();
    updateChartsPoints();
    updateEnergiesBox();

    populateIonEnergyTables();
  }
}

/*
 * Displays a box with the element's data
 * Input: selected, object clicked on in HTML
 * Output: element data with thatomic number given
 */
function elementBox(selected: HTMLElement): void {

  if (!selectedElement) {
    return;
  }

  // add clicked class to element
  selected.classList.add("clicked");

  // create elements to populate
  const div = document.createElement("div");
  const aNumber = document.createElement("div");
  const aSymbol = document.createElement("div");
  const aName = document.createElement("div");
  const aMass = document.createElement("div");
  const electronConfig = document.createElement("div");

  // assign classes to elements
  div.classList.add("showcase", selected.classList[2]);
  aNumber.classList.add("aNumber");
  aSymbol.classList.add("aSymbol");
  aName.classList.add("aName");
  aMass.classList.add("aMass");
  electronConfig.classList.add("textInput");

  // add text content
  aNumber.textContent = String(selectedElement.number);
  aSymbol.textContent = selectedElement.symbol;
  aName.textContent = selectedElement.name;
  aMass.textContent = String(selectedElement.aMass);
  electronConfig.innerHTML = convertElectronConfigToHTML();

  // append elements
  div.appendChild(aNumber);
  div.appendChild(aSymbol);
  div.appendChild(aName);
  div.appendChild(aMass);
  div.appendChild(electronConfig);
  document.getElementById("details")!.appendChild(div);
}

// draw the matrices in the middle of the screen. These are not
// based on the selected element, energy units selection, etc.
function drawMatrices(): void {

  // clean up previous elements
  document.getElementById("dynamic23Matrix")!.replaceChildren();
  document.getElementById("faussurierMatrix")!.replaceChildren();
  document.getElementById('selectableMatrix')!.replaceChildren();

  drawMatrix("dynamic23", dynamic23Matrix);
  drawMatrix("faussurier", faussurierMatrix);
  if (selectedMatrixName === 'custom') {
    drawMatrix("custom", customMatrix, 'selectableMatrix');
  } else if (selectedMatrixName === 'row23ArgonOnly') {
    drawMatrix("row23ArgonOnly", row23ArgonOnlyMatrix, 'selectableMatrix');
  } else if (selectedMatrixName === 'row23Frozen') {
    drawMatrix("row23Frozen", row23FrozenMatrix, 'selectableMatrix');
  }
}

function drawMatrix(id: string, matrix: number[][], overrideMatrixId = ''): void {
  const elemId = overrideMatrixId || (id + "Matrix");
  const tableElem = document.getElementById(elemId)!;

  const capElem = document.createElement("caption");
  if (id === 'faussurier') {
    capElem.innerHTML = `<a target="_blank" href='https://doi.org/10.1016/S0022-4073(97)00018-6'>Faussurier</a>`;
  } else {
    capElem.innerHTML = id;
  }
  // No caption on the selectable matrix, as the select/option make a good caption.
  if (overrideMatrixId !== 'selectableMatrix') {
    tableElem.appendChild(capElem);
  }

  // use <= because always subtracting 1 from the indices, and
  // 0th column/row are headers.
  for (let i = 0; i <= eLevels.length; i++) {
    const tableRow = document.createElement("tr");

    // label the customMatrix data rows so we can get the values out later
    if (id === 'custom' && i !== 0) {
      tableRow.classList.add('customMatrixDataRow');
    }
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
        const cellEditable = id === 'custom';
        tableData.contentEditable = String(cellEditable);   // "true" or "false"
        tableData.textContent = matrix[i - 1][j - 1].toString();
        tableRow.appendChild(tableData);
      }
    }
    tableElem.appendChild(tableRow);
  }

}

function calculateEnergies(): void {
  // no element has been selected yet.
  if (!eConfigInput) {
    return;
  }
  // remove table contents
  removeTableEntries();

  const energies: string[][] = [];
  energies.push(calculateEnergy("dynamic23", dynamic23Matrix));
  energies.push(calculateEnergy("faussurier", faussurierMatrix));

  if (selectedMatrixName === 'custom') {
    energies.push(calculateEnergy("custom", customMatrix, 'selectable'));
  } else if (selectedMatrixName === 'row23ArgonOnly') {
    energies.push(calculateEnergy("row23ArgonOnly", row23ArgonOnlyMatrix, 'selectable'));
  } else if (selectedMatrixName === 'row23Frozen') {
    energies.push(calculateEnergy("row23Frozen", row23FrozenMatrix, 'selectable'));
  }

  drawDiagram(selectedElement!.eConfig, energies, ["dynamic23", "faussurier", selectedMatrixName]);
}


// return the computed total energies in strings
function calculateEnergy(matrixName: string, matrix: number[][], overrideMatrixId = ''): string[] {

  const totalEnergyElemId = (overrideMatrixId || matrixName) + "TotalEnergy";
  const totalEnergyBox = document.getElementById(totalEnergyElemId)!;

  const energyResult = totalOrbitalEnergy(selectedElement!.number, selectedElemOrbitals, matrix);
  totalEnergyBox.textContent = energyToUnitsAsString(energyResult[0], unitSelectValue);

  let convertedEnergy: string[] = [];
  for (let i = 1; i < energyResult.length; i++) {
    convertedEnergy.push(energyToUnitsAsString(energyResult[i], unitSelectValue));
  }

  energyComponentsTable(matrixName, matrix, overrideMatrixId);

  return convertedEnergy;
}

function energyComponentsTable(matrixName: string, matrix: number[][], overrideMatrixId: string) {
  const energyDict = energyComponents(selectedElement!.number, selectedElemOrbitals, matrix);

  const tiValues = energyDict["t_i"];
  const viValues = energyDict["v_i"];
  const vijValues = energyDict["v_ij"];

  const tvTableHTMLId = (overrideMatrixId || matrixName) + 'TvTable';
  const vijTableHTMLId = (overrideMatrixId || matrixName) + 'VijTable';

  const tvTableElem = document.getElementById(tvTableHTMLId)!;
  const vijTableElem = document.getElementById(vijTableHTMLId)!;

  const capElem = document.createElement("caption");
  capElem.textContent = matrixName;
  tvTableElem.appendChild(capElem);
  const capElem2 = document.createElement("caption");
  capElem2.textContent = matrixName;
  vijTableElem.appendChild(capElem2);

  // t(i) and v(i) table

  // Use <= because the 1st row (not 0th row) uses 0th element in array,
  // 2nd rwo uses 1st element in array.
  for (let i = 0; i <= tiValues.length; i++) {
    let tableRow = document.createElement("tr");

    for (let j = 0; j <= 2; j++) {
      const tableData = document.createElement("td");

      if (j === 0 && i === 0) {
        // Top left corner: empty cell
        tableRow.appendChild(tableData);
      } else if (i === 0) {
        // first row: headers.
        const tableHeader = document.createElement("th");
        tableHeader.textContent = j === 1 ? "t(i)" : "v(en)";
        tableRow.appendChild(tableHeader);
      } else if (j === 0) {
        // First column of each row: headers.
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
    tvTableElem.appendChild(tableRow);
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
    vijTableElem.appendChild(tableRow);
  }
}

let prevCustomMatrixChanged = false;
let customMatrixChanged = false;
let intervalHandle: NodeJS.Timeout;

// Every 1 second, check if the user is still changing the matrix contents.
// When the user stops changing it, then recompute energies, etc.
function checkIfChangesHaveStopped() {
  // user switched away from showing the custom matrix, so stop watching it.
  if (selectedMatrixName !== 'custom') {
    clearInterval(intervalHandle);
    return;
  }
  // User was changing value but didn't in the last 1 second...
  if (prevCustomMatrixChanged && !customMatrixChanged) {
    if (selectedElement) {
      getCustomMatrixValuesFromDOM();
      calculateEnergies();
    }
  }

  prevCustomMatrixChanged = customMatrixChanged;
  customMatrixChanged = false;
}

function watchCustomMatrixForChanges() {

  intervalHandle = setInterval(checkIfChangesHaveStopped, 1000);

  let custMatTableElem = document.getElementById('selectableMatrix')!;

  const mutationOptions: MutationObserverInit = {
    childList: true,
    subtree: true,
    characterData: true
  };

  function callback(_mutations: MutationRecord[]) {
    customMatrixChanged = true;
  }

  const observer = new MutationObserver(callback);
  observer.observe(custMatTableElem, mutationOptions);
}

function getCustomMatrixValuesFromDOM() {
  const dataRowElems = document.getElementsByClassName('customMatrixDataRow');
  let row = 0;
  for (const rowElem of dataRowElems) {
    let col = 0;
    for (const child of rowElem.children) {
      if (child.tagName === 'TD') {   // skip th elements
        customMatrix[row][col] = Number(child.textContent);
        col++;
      }
    }
    row++;
  }
}

// Take the electron configuration, e.g., '1s2, 2s2 2p6', and convert to
// HTML with the number after the s or p a superscript.
function convertElectronConfigToHTML(): string {
  let htmlRes = '';
  for (const orb of selectedElemOrbitals) {
    htmlRes += `${orb.level}${orb.sOrP}<sup>${orb.numElectrons}</sup> `;
  }
  return htmlRes;
}

// convert 1 hartree to the given unit -- Ry, eV, etc.
// the 2nd value is the conversion factor.
const conversions = new Map([
  ['Ha', 1],
  ['Ry', 2],
  ['eV', 27.211386245988],
  ['J', 4.3597447222071E-18],
  ['cal', 1.042E-18],
  ['kJ/mol', 2625.5],
  ['kcal/mol', 627.5],
  ['cm-1', 219474.6],
]);

function energyToUnitsAsString(energy: number, units: string): string {
  const res = energy * conversions.get(units)!;
  if (Math.abs(res) < 0.0001) {   // if number is really small.
    return `${res.toExponential(3)} ${units}`;
  } else {
    return `${res.toFixed(3)} ${units}`;  // 3 sigfigs
  }
}


function calcPointRadius(context: { dataIndex: number }) {
  if (!selectedElement) {
    return 5;
  }
  return context.dataIndex === selectedElement!.number - 1 ? 10 : 5;
}

let atomicSizeChart: Chart;
let electronAffinityChart: Chart;
let polarizabilityChart: Chart;
let ionizationEnergyChart: Chart;

function drawCharts() {

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  const labels = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'];

  const ctx = document.getElementById('atomicSizeChartCanv')! as HTMLCanvasElement;
  atomicSizeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Atomic Size (bohr)`,
        data: [...atomicSize],
        borderWidth: 1,
        pointRadius: calcPointRadius,
      }]
    },
    options,
  });

  const ctx2 = document.getElementById('electronAffinityChartCanv')! as HTMLCanvasElement;
  electronAffinityChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Electron Affinity (${unitSelectValue})`,
        data: [...electronAffinity],
        borderWidth: 1,
        pointRadius: calcPointRadius,
      }]
    },
    options,
  });
  const ctx3 = document.getElementById('polarizabilityChartCanv')! as HTMLCanvasElement;
  polarizabilityChart = new Chart(ctx3, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Polarizability (bohr)`,
        data: [...polarizability],
        borderWidth: 1,
        pointRadius: calcPointRadius,
      }]
    },
    options,
  });
  const ctx4 = document.getElementById('ionizationEnergyChartCanv')! as HTMLCanvasElement;
  ionizationEnergyChart = new Chart(ctx4, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: `Unweighted Ionization Energy (${unitSelectValue})`,
          data: [...unweightedIonizationEnergy],
          borderWidth: 1,
          pointRadius: calcPointRadius,
        },
        {
          label: `Weighted Ionization Energy (${unitSelectValue})`,
          data: [...weightedIonizationEnergy],
          borderWidth: 1,
          pointRadius: calcPointRadius,
        },
      ]
    },
    options,
  });
}

// The unit selector was changed so update the charts to show using the
// new scale (Ha, Ry, cal, etc.)
function updateChartScales() {
  // for (let i = 0; i < atomicSizeChart.data.datasets[0].data.length; i++) {
  //   atomicSizeChart.data.datasets[0].data[i] = atomicSize[i] * conversions.get(unitSelectValue)!;
  // }
  // atomicSizeChart.data.datasets[0].label = `Atomic Size (${unitSelectValue})`;
  // atomicSizeChart.update();

  for (let i = 0; i < electronAffinityChart.data.datasets[0].data.length; i++) {
    electronAffinityChart.data.datasets[0].data[i] = electronAffinity[i] * conversions.get(unitSelectValue)!;
  }
  electronAffinityChart.data.datasets[0].label = `Electron Affinity (${unitSelectValue})`;
  electronAffinityChart.update();

  // for (let i = 0; i < polarizabilityChart.data.datasets[0].data.length; i++) {
  //   polarizabilityChart.data.datasets[0].data[i] = polarizability[i];
  // }
  // polarizabilityChart.data.datasets[0].label = `Polarizability (bohr)`;
  // polarizabilityChart.update();

  for (let i = 0; i < ionizationEnergyChart.data.datasets[0].data.length; i++) {
    ionizationEnergyChart.data.datasets[0].data[i] = unweightedIonizationEnergy[i] * conversions.get(unitSelectValue)!;
    ionizationEnergyChart.data.datasets[1].data[i] = weightedIonizationEnergy[i] * conversions.get(unitSelectValue)!;
  }
  ionizationEnergyChart.data.datasets[0].label = `Unweighted Ionization Energy (${unitSelectValue})`;
  ionizationEnergyChart.data.datasets[1].label = `Weighted Ionization Energy (${unitSelectValue})`;
  ionizationEnergyChart.update();
}

function updateChartsPoints() {
  atomicSizeChart.update();
  electronAffinityChart.update();
  polarizabilityChart.update();
  ionizationEnergyChart.update();
}

// this box appears next to the charts and summarizes the energies
// for the element that has been selected.
function updateEnergiesBox() {
  const atomicNumIndex = selectedElement!.number - 1;
  const een = document.getElementById('energy-element-name')! as HTMLCanvasElement;
  een.innerHTML = "Name: " + selectedElement!.name;
  const eas = document.getElementById('energy-atomic-size')! as HTMLCanvasElement;
  eas.innerHTML = "Atomic Size: " + atomicSize[atomicNumIndex] + " bohr";
  const eea = document.getElementById('energy-electron-affinity')! as HTMLCanvasElement;
  eea.innerHTML = "Electron Affinity: " + energyToUnitsAsString(electronAffinity[atomicNumIndex], unitSelectValue);
  const ep = document.getElementById('energy-polarizability')! as HTMLCanvasElement;
  ep.innerHTML = "Polarizability: " + polarizability[atomicNumIndex] + " bohr";
  const eie = document.getElementById('energy-ionization-energy')! as HTMLCanvasElement;
  eie.innerHTML = "Weighted Ionization: " + energyToUnitsAsString(weightedIonizationEnergy[atomicNumIndex], unitSelectValue);

}


function computeOrbitals(eConfigStr: string) {
  const res: Orbital[] = [];
  const groups = eConfigStr.split(" ");
  for (const group of groups) {
    const re = /(\d+)([sp])(\d+)/;
    const matches = group.match(re)!;
    res.push({
      level: Number(matches[1]),
      sOrP: matches[2],
      numElectrons: Number(matches[3]),
    });
  }
  return res;
}



/* Code for computing information in Ionization Energy Tab */



// Take the electron configuration, e.g., '1s2 2s2 2p6', and extract the number
// of electrons in each orbital. Pad the array with 0s out to 5 elements.
function getElectronsFromElectronConfig(): number[] {
  let ret = selectedElemOrbitals.map(o => o.numElectrons);
  return ret.concat(Array(5 - ret.length).fill(0));
}

function populateIonEnergyTables() {

  const leftTableNumElectronsRow = document.getElementsByClassName('ion-energy-econfig-static-row')[0];
  leftTableNumElectronsRow.replaceChildren();

  let cell = document.createElement('td');
  cell.innerText = "# of electrons";
  leftTableNumElectronsRow.appendChild(cell);

  // add cells with # of electrons for selected element
  let electrons = getElectronsFromElectronConfig();

  electrons.forEach((e) => {
    cell = document.createElement('td');
    cell.innerText = `${e}`;
    leftTableNumElectronsRow.appendChild(cell);
  });

  const leftTableZesRow = document.getElementsByClassName('ion-energy-z_es-static-row')[0];
  leftTableZesRow.replaceChildren();

  cell = document.createElement('td');
  cell.innerHTML = 'Z<sub>e</sub>';
  leftTableZesRow.appendChild(cell);

  const zLst = computeZis(selectedElement!.number, selectedElemOrbitals, dynamic23Matrix);
  electrons.forEach((e, index) => {
    cell = document.createElement('td');
    cell.innerText = `${e === 0 ? 0 : zLst[index].toFixed(3)}`;
    leftTableZesRow.appendChild(cell);
  });

  const orbitalEnergies = totalOrbitalEnergy(selectedElement!.number, selectedElemOrbitals, dynamic23Matrix);
  // remove total energy from beginning of array.
  const totalOE = orbitalEnergies.shift();

  const leftTableVaoeRow = document.getElementsByClassName('ion-energy-vaoe-static-row')[0];
  leftTableVaoeRow.replaceChildren();

  cell = document.createElement('td');
  cell.innerHTML = "VAOE";
  leftTableVaoeRow.appendChild(cell);

  electrons.forEach((e, index) => {
    cell = document.createElement('td');
    cell.innerText = `${e === 0 ? 0 : orbitalEnergies[index].toFixed(3)}`;
    leftTableVaoeRow.appendChild(cell);
  });

  const leftTableEtRow = document.getElementsByClassName('ion-energy-et-static-row')[0];
  leftTableEtRow.replaceChildren();
  cell = document.createElement('td');
  cell.innerHTML = "E<sub>t</sub>";
  leftTableEtRow.appendChild(cell);

  electrons.forEach((e, index) => {
    cell = document.createElement('td');
    cell.innerText = `${e === 0 ? 0 : (orbitalEnergies[index] * electrons[index]).toFixed(3)}`;
    leftTableEtRow.appendChild(cell);
  });

  const totalEnergyCell = document.getElementById('ion-energy-left-table-total-energy');
  totalEnergyCell!.innerText = `${totalOE!.toFixed(3)}`;

  // ------------------- now, right-hand side table ----------------

  // the right table has dropdown selectors for electron #s.
  const rightTableNumElectronsRow = document.getElementsByClassName('ion-energy-econfig-dyn-row')[0];

  rightTableNumElectronsRow.replaceChildren();

  cell = document.createElement('td');
  cell.innerText = "# of electrons";
  rightTableNumElectronsRow.appendChild(cell);

  // add cells with # of electrons for selected element
  // allow user to choose the dropdown to change # of electrons in that orbital
  electrons.forEach((eCount, index) => {
    cell = document.createElement('td');
    const selectCell = document.createElement('select');
    cell.appendChild(selectCell);
    for (let i = 0; i <= FULL_ORBITAL_CTS[index]; i++) {
      const optionCell = document.createElement('option');
      optionCell.value = `${i}`;
      optionCell.innerText = `${i}`;
      selectCell.appendChild(optionCell);
    }
    // set the default value for the dropdown
    selectCell.value = `${eCount}`;
    const selectorName = `ion-energy-num-ions-selected-${index}`;
    selectCell.setAttribute("id", selectorName);
    selectCell.setAttribute("name", selectorName);
    selectCell.setAttribute("class", "ion-energy-econfig-select");
    selectCell.addEventListener("change",
      () => handleNumElectronsChangedByUser(totalOE!));

    rightTableNumElectronsRow.appendChild(cell);
  });

  // Populate the right table rows with default values.
  handleNumElectronsChangedByUser(totalOE!);
}


function handleNumElectronsChangedByUser(groundStateTotalEnergy: number) {

  const rightTableZesRow = document.getElementsByClassName('ion-energy-z_es-dyn-row')[0];
  const rightTableVaoeRow = document.getElementsByClassName('ion-energy-vaoe-dyn-row')[0];
  const rightTableEtRow = document.getElementsByClassName('ion-energy-et-dyn-row')[0];

  rightTableZesRow.replaceChildren();
  let cell = document.createElement('td');
  cell.innerHTML = 'Z<sub>e</sub>';
  rightTableZesRow.appendChild(cell);

  // Iterate over all electron selectors and get their values. Build
  // a list of Orbitals from the default/original list.
  const newOrbitals = [...selectedElemOrbitals];
  const selectors = document.querySelectorAll(".ion-energy-econfig-select");
  selectors.forEach((cell: any) => {
    // cell.id is ion-energy-num-ions-selected-#. Lop off everything except the number
    const index = Number(cell.id.charAt(cell.id.length - 1));
    // newOrbitals may only be 1, 2, 3, etc. in length for low-numbered elements.
    // but we have 5 selectors. only update if necessary.
    if (index < newOrbitals.length) {
      newOrbitals[index].numElectrons = Number(cell.value);
    } else {
      // add a new orbital record to the end with the # of electrons.
      newOrbitals.push({
        level: index,     // does not matter
        sOrP: 'p',        // does not matter
        numElectrons: Number(cell.value),
      });
    }
  });


  // Update the values in the Z_i row in the right hand table.
  let Zlst = computeZis(selectedElement!.number, newOrbitals, dynamic23Matrix);
  Zlst.forEach((z) => {
    const cell = document.createElement('td');
    cell.innerText = `${z.toFixed(3)}`;
    rightTableZesRow.appendChild(cell);
  });

  // Update VAOE row
  rightTableVaoeRow.replaceChildren();

  const orbitalEnergies = totalOrbitalEnergy(selectedElement!.number, newOrbitals, dynamic23Matrix);
  // remove total energy from beginning of array.
  const totalOE = orbitalEnergies.shift();

  cell = document.createElement('td');
  cell.innerHTML = "VAOE";
  rightTableVaoeRow.appendChild(cell);

  orbitalEnergies.forEach((e) => {
    cell = document.createElement('td');
    cell.innerText = `${e.toFixed(3)}`;
    rightTableVaoeRow.appendChild(cell);
  });

  // Update Et row: each value is VAOE value * # of electrons
  rightTableEtRow.replaceChildren();

  cell = document.createElement('td');
  cell.innerHTML = "E<sub>t</sub>";
  rightTableEtRow.appendChild(cell);

  orbitalEnergies.forEach((e, index) => {
    cell = document.createElement('td');
    cell.innerText = `${(e * newOrbitals[index].numElectrons).toFixed(3)}`;
    rightTableEtRow.appendChild(cell);
  });

  const totalEnergyCell = document.getElementById('ion-energy-right-table-total-energy');
  totalEnergyCell!.innerText = `${totalOE!.toFixed(3)}`;

  const ionizationEnergyCell = document.getElementById('ion-energy-ionization-energy');
  const ionEnergy = Math.abs(groundStateTotalEnergy - totalOE!);
  ionizationEnergyCell!.innerText = `${ionEnergy.toFixed(3)}`;

}