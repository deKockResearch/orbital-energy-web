import { dynamic23Matrix } from "./matrices";
import { computeZis, totalOrbitalEnergy } from "./orbitalEnergies";
import { computeEnergiesForDyn23OrFauss, energies$, selectedElement$, unitsSelection$ } from "./stores";
import { LEVELS, FULL_ORBITAL_CTS, type Orbital } from "./types";
import { convertEnergyFromHartrees } from "./utils";

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

export function populateIonEnergyTables() {

  if (selectedElement$.get().selectedElementInfo === null ||
    energies$.get().length === 0) {
    return;
  }

  // add cells with # of electrons for selected element
  const electrons = getElectronsFromElectronConfig();

  const leftTableNumElectronsRow = document.getElementsByClassName('ion-energy-econfig-static-row')[0];
  const cells: Element[] = [...leftTableNumElectronsRow.getElementsByTagName('TD')];

  electrons.forEach((e, index) => {
    cells[index].innerHTML = `${e}`;
  });

  populateLeftTableDataRows();
  populateRightTable(electrons);
}

function populateLeftTableDataRows() {
  if (selectedElement$.get().selectedElemOrbitals === null) {
    return;
  }
  const electrons = getElectronsFromElectronConfig();

  // Ze row
  const selectedElemNum = selectedElement$.get().selectedElementInfo!.number;
  const selectedElemOrbitals = selectedElement$.get().selectedElemOrbitals!;
  const zLst = computeZis(selectedElemNum, selectedElemOrbitals, dynamic23Matrix);
  // This row does not change with a units change.
  const row = document.getElementsByClassName('ion-energy-z_e-static-row')[0]!;
  const cells: Element[] = [...row.getElementsByTagName('td')];
  electrons.forEach((e, index) => {
    cells[index].innerHTML = `${e === 0 ? "0.000" : zLst[index].toFixed(3)}`;
  });

  // t(i) row
  updateRow(electrons, 'ion-energy-t_i-static-row', energies$.get()[0].t_i);

  // v(en) row
  updateRow(electrons, 'ion-energy-v_en-static-row', energies$.get()[0].v_i);

  // Vee rows
  updateVeeRows(electrons, 'ion-energy-v_ee-static-row', energies$.get()[0].v_ij);

  // CapVee rows: true means skip the bottom half of the table.
  updateVeeRows(electrons, 'ion-energy-capv_ee-static-row', energies$.get()[0].capV_ij, true);

  // VAOE row
  const [totalOE, ...orbitalEnergies] = energies$.get()[0].totalEnergies;
  updateRow(electrons, 'ion-energy-vaoe-static-row', orbitalEnergies);

  // Et row
  const etValues = orbitalEnergies.map((val, index) => val * electrons[index]);
  updateRow(electrons, 'ion-energy-et-static-row', etValues);

  // Summary information below the table
  const totalEnergyCell = document.getElementById('ion-energy-left-table-total-energy');
  totalEnergyCell!.innerText = `${convertEnergyFromHartrees(totalOE!)} ${unitsSelection$.get()}`;
}


function populateRightTable(electrons: number[]) {
  // the right table has dropdown selectors for electron #s.
  const rightTableNumElectronsRow = document.getElementsByClassName('ion-energy-econfig-dyn-row')[0];

  rightTableNumElectronsRow.replaceChildren();

  let cell = document.createElement('th');
  cell.innerText = "# of electrons";
  rightTableNumElectronsRow.appendChild(cell);

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
    const selectorName = `ion-energy-num-ions-selected-${index}`;
    selectCell.setAttribute("id", selectorName);
    selectCell.setAttribute("name", selectorName);
    selectCell.setAttribute("autocomplete", "off");
    selectCell.setAttribute("class", "ion-energy-econfig-select");
    selectCell.addEventListener("change",
      () => handleNumElectronsChangedByUser());

    rightTableNumElectronsRow.appendChild(cell);
  });

  // Populate the right table rows with default values.
  handleNumElectronsChangedByUser();
}

function computeOrbitalsFromSelects() {
  const selectedElem = selectedElement$.get();

  // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
  const newOrbitals = selectedElem.selectedElemOrbitals!.map(a => ({ ...a }));

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
        level: LEVELS[index],
        sOrP: 'p', // not used in the calculation, so value does not matter.
        numElectrons: Number(cell.value),
      });
    }
  });
  return newOrbitals;
}

function handleNumElectronsChangedByUser() {

  const selectedElem = selectedElement$.get();
  const newOrbitals = computeOrbitalsFromSelects();

  // Change the selectors so that they do not allow the user to create anions --
  // the total # of electrons must be <= total # of protons (atomic number).
  // To do this, add options to selectors so that if the total number of selected electrons
  // is less than the max, selectors will allow the number to go back up to the max.
  const rightTableNumElectronsRow = document.getElementsByClassName('ion-energy-econfig-dyn-row')[0];
  const selectorCells = rightTableNumElectronsRow.querySelectorAll('select');
  const totalElectronsInNewOrbitals = newOrbitals.reduce((acc, currVal) => {
    return acc + currVal.numElectrons;
  }, 0);
  const numElectronsBelowMax = selectedElem.selectedElementInfo!.number - totalElectronsInNewOrbitals;
  selectorCells.forEach((selCell, index) => {
    selCell.replaceChildren(); // remove all options (0, 1, 2, 3, ...)
    for (let i = 0; i <= Math.min(FULL_ORBITAL_CTS[index], newOrbitals[index].numElectrons + numElectronsBelowMax); i++) {
      const optionCell = document.createElement('option');
      optionCell.innerText = optionCell.value = `${i} `;
      selCell.appendChild(optionCell);
    }
    selCell.value = `${newOrbitals[index].numElectrons} `;
  });

  populateRightTableDataRows(newOrbitals);
}

function populateRightTableDataRows(orbs: Orbital[]) {

  const electrons = getElectronsFromOrbitals(orbs);
  const selectedElem = selectedElement$.get();

  // Update the values in the Z_e row in the right hand table.
  const zLst = computeZis(selectedElem!.selectedElementInfo!.number, orbs, dynamic23Matrix);
  // This row does not change with a units change.
  const row = document.getElementsByClassName('ion-energy-z_e-dyn-row')[0]!;
  const cells: Element[] = [...row.getElementsByTagName('td')];
  electrons.forEach((e, index) => {
    cells[index].innerHTML = `${e === 0 ? "0.000" : zLst[index].toFixed(3)}`;
  });

  // t(i) row
  const energyComp = computeEnergiesForDyn23OrFauss('dynamic23', dynamic23Matrix, orbs);
  updateRow(electrons, 'ion-energy-t_i-dyn-row', energyComp.t_i);

  // v(en) row
  updateRow(electrons, 'ion-energy-v_en-dyn-row', energyComp.v_i);

  // vee rows
  updateVeeRows(electrons, 'ion-energy-v_ee-dyn-row', energyComp.v_ij);

  // CapVee rows: true means skip the bottom half of the table.
  updateVeeRows(electrons, 'ion-energy-capv_ee-dyn-row', energyComp.capV_ij, true);

  // Update VAOE row
  const [totalOE, ...orbitalEnergies] = totalOrbitalEnergy(selectedElem!.selectedElementInfo!.number, orbs, dynamic23Matrix);
  updateRow(electrons, 'ion-energy-vaoe-dyn-row', orbitalEnergies);

  // Update Et row: each value is VAOE value * # of electrons
  const etValues = orbitalEnergies.map((val, index) => val * electrons[index]);
  updateRow(electrons, 'ion-energy-et-dyn-row', etValues);

  // Summary information below the table
  const totalEnergyCell = document.getElementById('ion-energy-right-table-total-energy');
  totalEnergyCell!.innerText = `${convertEnergyFromHartrees(totalOE!)} ${unitsSelection$.get()}`;

  const ionizationEnergyCell = document.getElementById('ion-energy-ionization-energy');
  const groundStateTotalEnergy = energies$.get()[0].totalEnergies[0];
  const ionEnergy = Math.abs(groundStateTotalEnergy - totalOE!);
  ionizationEnergyCell!.innerText = `${convertEnergyFromHartrees(ionEnergy)} ${unitsSelection$.get()}`;
}

// update the row, when data changes.
function updateRow(electrons: number[], rowClass: string, data: number[]) {
  const row = document.getElementsByClassName(rowClass)[0]!;
  const cells: Element[] = [...row.getElementsByTagName('td')];

  electrons.forEach((e, index) => {
    cells[index].innerHTML = `${e === 0 ? "0.000" : convertEnergyFromHartrees(data[index])}`;
  });
}

function updateVeeRows(electrons: number[], rowClass: string, data: number[][], skipBottomHalf = false) {
  const veeRows = document.getElementsByClassName(rowClass);

  const veeCells: Element[][] = [];
  for (const row of veeRows) {
    const cells = [...row.getElementsByTagName('td')];
    veeCells.push(cells);
  }

  for (let row = 0; row < electrons.length; row++) {
    for (let col = 0; col < electrons.length; col++) {
      if (row > col && skipBottomHalf) {
        // bottom half of the table has empty cells.
        veeCells[row][col].innerHTML = "";
      } else {
        // if occupancy is 0, then all values in the column are 0.
        if (electrons[col] === 0) {
          veeCells[row][col].innerHTML = "0.000";
        } else if (electrons[col] === 1 && row === col) {
          // if occupancy is 1, then diagonal value is 0.
          veeCells[row][col].innerHTML = "0.000";
        } else {
          // value comes from capV_ij table.
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

  populateLeftTableDataRows();
  populateRightTableDataRows(computeOrbitalsFromSelects());
}

energies$.listen(() => populateIonEnergyTables());

unitsSelection$.listen((u) => updateIonEnergyTablesForUnitsChange(u));