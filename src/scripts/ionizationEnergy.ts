import { computeSuperscriptLocation } from "./atomicSize";
import { dynamic23Matrix } from "./matrices";
import { computeZis, totalOrbitalEnergy } from "./orbitalEnergies";
import { computeEnergiesForDyn23OrFauss, energies$, selectedElement$, unitsSelection$ } from "./stores";
import { LEVELS, FULL_ORBITAL_CTS, type Orbital } from "./types";
import { convertEnergyFromHartrees } from "./utils";
import p5 from "p5";

/**
 * get number of electrons in each orbital. Pad the array with 0s out to 5 elements.
 */
function getElectronsFromOrbitals(orbitals: Orbital[]): number[] {
  const ret = orbitals.map(o => o.numElectrons);
  return ret.concat(Array(5 - ret.length).fill(0));
}

function getElectronsFromElectronConfig(): number[] {
  return getElectronsFromOrbitals(selectedElement$.get().selectedElemOrbitals!);
}

function getTotalElectronsFromOrbitals(orbitals: Orbital[]): number {
  return orbitals.reduce((acc, currVal) => acc + currVal.numElectrons, 0);
}


// Two global variables: easiest way to communicate values from the tables
// to the graph below...
let leftTableIonEnergy = 0;
let rightTableIonEnergy = 0;
let leftSuperscript = '0';
let rightSuperscript = '0';


export function populateIonEnergyTables() {

  if (selectedElement$.get().selectedElementInfo === null ||
    energies$.get().length === 0) {
    return;
  }

  // get array of occupancies for each orbital -- padded with 0s to 5 elements.
  const electrons = getElectronsFromElectronConfig();

  populateTable('left', electrons);
  populateTable('right', electrons);
}

function populateTable(leftOrRight: string, electrons: number[]) {

  const tableId = `ion-energy-${leftOrRight}-table`;
  const tableElem = document.querySelector(`#${tableId} table`)! as HTMLTableElement;

  // the table has dropdown selectors for electron #s.
  const numElectronsRow = tableElem.getElementsByClassName('ion-energy-econfig-row')[0];

  // clear the row.
  numElectronsRow.replaceChildren();

  // rebuild the row: starts with a th and then 5 td cells which are dropdown selectors.
  let cell = document.createElement('th');
  cell.innerText = "# of electrons";
  numElectronsRow.appendChild(cell);

  // add cells with # of electrons for selected element
  // allow user to choose the dropdown to change # of electrons in that orbital
  // Do not show options which would make the total # of electrons be greater than
  // the number of protons (atomic number).
  electrons.forEach((eCount, index) => {
    cell = document.createElement('td');
    const selectCell = document.createElement('select');
    cell.appendChild(selectCell);
    for (let i = 0; i <= eCount; i++) {
      const optionCell = document.createElement('option');
      optionCell.innerText = optionCell.value = `${i} `;
      selectCell.appendChild(optionCell);
    }
    // set the default value for the dropdown
    selectCell.value = `${eCount} `;
    const selectorName = `ion-energy-num-ions-selected-${leftOrRight}-${index}`;
    selectCell.setAttribute("id", selectorName);
    selectCell.setAttribute("name", selectorName);
    selectCell.setAttribute("autocomplete", "off");
    selectCell.setAttribute("class", "ion-energy-econfig-select");
    selectCell.addEventListener("change",
      () => handleNumElectronsChangedByUser(tableElem));

    numElectronsRow.appendChild(cell);
  });

  // Populate the tables rows with default values.
  handleNumElectronsChangedByUser(tableElem);
}

function computeOrbitalsFromSelects(tableElem: HTMLTableElement): Orbital[] {

  // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
  // const newOrbitals = selectedElem.selectedElemOrbitals!.map(a => ({ ...a }));
  const newOrbitals: Orbital[] = [];

  const selectors = Array.from(tableElem.querySelectorAll(".ion-energy-econfig-select"));
  selectors.forEach((cell: any) => {
    // cell.id is ion-energy-num-ions-selected-#. Lop off everything except the number
    const index = Number(cell.id.charAt(cell.id.length - 1));
    // add a new orbital record to the end with the # of electrons.
    newOrbitals.push({
      level: LEVELS[index],
      sOrP: 'p', // not used in the calculation, so value does not matter.
      numElectrons: Number(cell.value),
    });
  });
  return newOrbitals;
}

function handleNumElectronsChangedByUser(tableElem: HTMLTableElement) {

  const selectedElem = selectedElement$.get();
  const newOrbitals = computeOrbitalsFromSelects(tableElem);
  const totalElectronsInNewOrbitals = getTotalElectronsFromOrbitals(newOrbitals);

  const leftOrRight = tableElem.id.includes('left') ? 'left' : 'right';

  // For the right table, its number of electrons needs to be <= the left table.
  // If the user changes the left table, then wipe out
  // what we have in the right table and set it to mimic the left table.
  // Otherwise, if the user changes the right table, only allow the user to set
  // the total # of electrons to be <= what is in the left table.
  let numElectronsBelowMax;
  if (leftOrRight === 'left') {
    // populate the right table with the left table's selectors' values.
    populateTable('right', getElectronsFromOrbitals(newOrbitals));
    // changing the left table: the max number of electrons is derived from the selected element.
    numElectronsBelowMax = selectedElem.selectedElementInfo!.number - totalElectronsInNewOrbitals;
  } else {
    // Changing the right table: the max number of electrons is limited by total # of electrons in the
    // left table.
    const leftTableOrbitals = computeOrbitalsFromSelects(document.getElementById('ion-energy-left-table')!.querySelector('table') as HTMLTableElement)
    const totalElectronsInLeftTableSelectors = getTotalElectronsFromOrbitals(leftTableOrbitals);
    numElectronsBelowMax = totalElectronsInLeftTableSelectors - totalElectronsInNewOrbitals;
  }

  // Change the selectors so that they do not allow the user to create anions --
  // the total # of electrons must be <= total # of protons (atomic number).
  // To do this, add options to selectors so that if the total number of selected electrons
  // is less than the max, selectors will allow the number to go back up to the max.
  const numElectronsRow = tableElem.getElementsByClassName('ion-energy-econfig-row')[0];
  const selectorCells = numElectronsRow.querySelectorAll('select');
  // const numElectronsBelowMax = selectedElem.selectedElementInfo!.number - totalElectronsInNewOrbitals;
  selectorCells.forEach((selCell, index) => {
    selCell.replaceChildren(); // remove all options (0, 1, 2, 3, ...)
    for (let i = 0; i <= Math.min(FULL_ORBITAL_CTS[index], newOrbitals[index].numElectrons + numElectronsBelowMax); i++) {
      const optionCell = document.createElement('option');
      optionCell.innerText = optionCell.value = `${i} `;
      selCell.appendChild(optionCell);
    }
    selCell.value = `${newOrbitals[index].numElectrons} `;
  });

  // Update the table's label
  const diffBtnGroundStateAndSelected = selectedElem.selectedElementInfo!.number - totalElectronsInNewOrbitals;
  const superscript = (diffBtnGroundStateAndSelected === 0) ? '0' : `+${diffBtnGroundStateAndSelected}`;
  // Save this info for use in the p5 sketch below.
  if (leftOrRight === 'left') {
    leftSuperscript = superscript
  } else {
    rightSuperscript = superscript;
  }
  // previous sibling is the label above the table.
  tableElem.previousElementSibling!.innerHTML = `${selectedElem.selectedElementInfo?.symbol}<sup>${superscript}</sup>`;

  populateTableDataRows(tableElem, newOrbitals);
}


function populateTableDataRows(tableElem: HTMLTableElement, orbs: Orbital[]) {

  const electrons = getElectronsFromOrbitals(orbs);
  const selectedElem = selectedElement$.get();

  // Update the values in the Z_e row in the right hand table.
  const zLst = computeZis(selectedElem!.selectedElementInfo!.number, orbs, dynamic23Matrix);
  // This row does not change with a units change.
  const row = tableElem.getElementsByClassName('ion-energy-z_e-row')[0]!;
  const cells: Element[] = [...row.getElementsByTagName('td')];
  electrons.forEach((e, index) => {
    cells[index].innerHTML = `${e === 0 ? "0.000" : zLst[index].toFixed(3)}`;
  });

  const energyComp = computeEnergiesForDyn23OrFauss('dynamic23', dynamic23Matrix, orbs);

  // t(i) row
  updateRow(tableElem, electrons, 'ion-energy-t_i-row', energyComp.t_i);

  // v(en) row
  updateRow(tableElem, electrons, 'ion-energy-v_en-row', energyComp.v_i);

  // vee rows
  updateVeeRows(tableElem, electrons, 'ion-energy-v_ee-row', energyComp.v_ij);

  // CapVee rows: true means skip the bottom half of the table.
  updateVeeRows(tableElem, electrons, 'ion-energy-capv_ee-row', energyComp.capV_ij, true);

  // Update VAOE row
  const [totalOE, ...orbitalEnergies] = totalOrbitalEnergy(selectedElem!.selectedElementInfo!.number, orbs, dynamic23Matrix);
  updateRow(tableElem, electrons, 'ion-energy-vaoe-row', orbitalEnergies);

  // Update Et row: each value is VAOE value * # of electrons
  const etValues = orbitalEnergies.map((val, index) => val * electrons[index]);
  updateRow(tableElem, electrons, 'ion-energy-et-row', etValues);

  // Summary information below the table
  const totalEnergyCell = tableElem.nextElementSibling as HTMLElement;
  totalEnergyCell!.innerText = `${convertEnergyFromHartrees(totalOE!)} ${unitsSelection$.get()}`;

  // const ionizationEnergyCell = document.getElementById('ion-energy-ionization-energy');
  // const groundStateTotalEnergy = energies$.get()[0].totalEnergies[0];
  // const ionEnergy = Math.abs(groundStateTotalEnergy - totalOE!);
  // ionizationEnergyCell!.innerText = `${convertEnergyFromHartrees(ionEnergy)} ${unitsSelection$.get()}`;
  const leftOrRight = tableElem.id.includes('left') ? 'left' : 'right';
  if (leftOrRight === 'left') {
    leftTableIonEnergy = totalOE;
  } else {
    rightTableIonEnergy = totalOE;
  }
  drawTotalIonizationEnergy();
}

// update the row, when data changes.
function updateRow(tableElem: HTMLTableElement, electrons: number[], rowClass: string, data: number[]) {
  const row = tableElem.getElementsByClassName(rowClass)[0]!;
  const cells: Element[] = [...row.getElementsByTagName('td')];

  electrons.forEach((e, index) => {
    cells[index].innerHTML = `${e === 0 ? "0.000" : convertEnergyFromHartrees(data[index])}`;
  });
}

function updateVeeRows(tableElem: HTMLTableElement, electrons: number[], rowClass: string,
  data: number[][], skipBottomHalf = false) {

  const veeRows = tableElem.getElementsByClassName(rowClass);

  const veeCells: Element[][] = [];
  for (const row of veeRows) {
    const cells = [...row.getElementsByTagName('td')];
    veeCells.push(cells);
  }

  for (let row = 0; row < electrons.length; row++) {
    for (let col = 0; col < electrons.length; col++) {
      // We are iterating over a 5 x 5 matrix but the data will
      // be smaller for low-numbered elements, like a 1x1 or 2x2 matrix.
      // In that case, put 0.000 in the cell.
      if (row > col && skipBottomHalf) {
        // bottom half of the table has empty cells.
        veeCells[row][col].innerHTML = "";
      } else if (row > data.length - 1 || col > data[row].length - 1) {
        veeCells[row][col].innerHTML = "0.000";
      } else {
        // if occupancy is 0, then all values in the column are 0.
        if (electrons[col] === 0 || electrons[row] === 0) {
          veeCells[row][col].innerHTML = "0.000";
        } else if (electrons[col] === 1 && row === col) {
          // if occupancy is 1, then diagonal value is 0.
          veeCells[row][col].innerHTML = "0.000";
        } else {
          veeCells[row][col].innerHTML = `${convertEnergyFromHartrees(data[row][col])}`;
        }
      }
    }
  }
}

function updateIonEnergyTablesForUnitsChange(u: string) {
  if (selectedElement$.get().selectedElemOrbitals === null) {
    return;
  }
  const unitsLabel = document.getElementById('ion-energy-units')!;
  unitsLabel.innerHTML = `Energies shown in ${u}.`;

  let tableId = `ion-energy-left-table`;
  let tableElem = document.querySelector(`#${tableId} table`)! as HTMLTableElement;
  populateTableDataRows(tableElem, computeOrbitalsFromSelects(tableElem));
  tableId = `ion-energy-right-table`;
  tableElem = document.querySelector(`#${tableId} table`)! as HTMLTableElement;
  populateTableDataRows(tableElem, computeOrbitalsFromSelects(tableElem));
}


// Add click handler to ion-energy-toggle-details button.
const showDetailsButton = document.getElementById('ion-energy-toggle-details-btn')!;
showDetailsButton.addEventListener('click', toggleShowDetails);

let showDetails = false;

function toggleShowDetails() {
  showDetails = !showDetails;
  const detailsRowsElems = Array.from(document.getElementsByClassName('ion-energy-details-row')) as HTMLElement[];
  detailsRowsElems.forEach((elem) => {
    elem.style.display = showDetails ? 'table-row' : 'none';
  });
  showDetailsButton.innerText = (showDetails ? "Hide " : "Show") + " details in tables";

}

energies$.listen(() => populateIonEnergyTables());

unitsSelection$.listen((u) => updateIonEnergyTablesForUnitsChange(u));

let p5js: p5 | null = null;

export function drawTotalIonizationEnergy(): void {
  let sketch = (p: p5) => {

    // Basic p5 canvas setup
    const CANV_W = 800;
    const CANV_H = 300;
    const COLUMN_W = CANV_W / 4;
    const ROW_H = 20;
    const BOTTOM_OFFSET = 20;
    const LEFT_OFFSET = 50;
    // const SCALE_Y = (CANV_H - BOTTOM_OFFSET - TOP_OFFSET) / 13;
    const SCALE_Y = 3;

    p.setup = () => {
      p.createCanvas(CANV_W, CANV_H);
      p.noLoop();  // remove interactivity
    };

    const flipYAxis = (y: number) => {
      return CANV_H - y;
    }

    p.draw = () => {
      // draw x-axis near the bottom
      p.line(LEFT_OFFSET, flipYAxis(BOTTOM_OFFSET), CANV_W, flipYAxis(BOTTOM_OFFSET));
      // draw y-axis
      p.line(LEFT_OFFSET, flipYAxis(BOTTOM_OFFSET), LEFT_OFFSET, flipYAxis(CANV_H));

      const energyDiff = rightTableIonEnergy - leftTableIonEnergy;

      const xloc1 = LEFT_OFFSET + COLUMN_W;
      const yloc1 = BOTTOM_OFFSET + ROW_H;
      const s1 = leftTableIonEnergy.toFixed(3);
      const text_width1 = p.textWidth(s1);
      p.textSize(16);
      p.text(s1, xloc1, flipYAxis(yloc1));
      // draw line under the text with a little space between the text and the line.
      p.line(xloc1, flipYAxis(yloc1 - 4), xloc1 + text_width1, flipYAxis(yloc1 - 4));

      const xloc2 = LEFT_OFFSET + 3 * COLUMN_W;
      const yloc2 = BOTTOM_OFFSET + ROW_H + energyDiff * SCALE_Y;
      const s2 = rightTableIonEnergy.toFixed(3);
      const text_width2 = p.textWidth(s2);
      p.text(s2, xloc2, flipYAxis(yloc2));
      p.line(xloc2, flipYAxis(yloc2 - 4), xloc2 + text_width2, flipYAxis(yloc2 - 4));

      // set dashed lines
      p.drawingContext.setLineDash([5, 5]);
      p.line(xloc1 + text_width1, flipYAxis(yloc1 - 4), xloc2, flipYAxis(yloc2 - 4));
      // no dashed lines anymore
      p.drawingContext.setLineDash([]);
      // write the difference in values.

      // Write a descriptive string: El<sup>+n</sup>- El<sup>+m</sup> =
      const elem = `${selectedElement$.get().selectedElementInfo?.symbol}`;
      let [supX, supY] = computeSuperscriptLocation(p, elem, LEFT_OFFSET + COLUMN_W * 2 - 10, flipYAxis((yloc1 + yloc2) / 2 + 24), rightSuperscript);
      p.text(elem, LEFT_OFFSET + COLUMN_W * 2 - 10, flipYAxis((yloc1 + yloc2) / 2 + 24));
      p.textSize(12);
      p.text(rightSuperscript, supX, supY);
      p.textSize(16);
      [supX, supY] = computeSuperscriptLocation(p, `- ${elem}`, LEFT_OFFSET + COLUMN_W * 2 + 20, flipYAxis((yloc1 + yloc2) / 2 + 24), leftSuperscript);
      p.text(`- ${elem}`, LEFT_OFFSET + COLUMN_W * 2 + 20, flipYAxis((yloc1 + yloc2) / 2 + 24));
      p.textSize(12);
      p.text(leftSuperscript, supX, supY);
      p.textSize(16);
      p.text(" = ", LEFT_OFFSET + COLUMN_W * 2 + 55, flipYAxis((yloc1 + yloc2) / 2 + 24));
      // And finally write the energy difference.
      p.text(energyDiff.toFixed(3), LEFT_OFFSET + COLUMN_W * 2, flipYAxis((yloc1 + yloc2) / 2 + 10));
    }
  }

  const canvas = document.getElementById("ionizationTotalCanvasAttachPoint")!;
  // The following rigamarole is necessary to so that we don't recreate the canvas each time, which
  // causes the window to scroll up a bit.
  if (!p5js) {
    p5js = new p5(sketch, canvas);
  } else {
    p5js.clear();
    p5js.draw();
  }
}