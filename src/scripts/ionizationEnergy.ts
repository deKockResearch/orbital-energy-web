import { dynamic23Matrix } from "./matrices";
import { computeZis, totalOrbitalEnergy } from "./orbitalEnergies";
import { energies$, selectedElement$ } from "./stores";
import { LEVELS, FULL_ORBITAL_CTS } from "./types";

// of electrons in each orbital. Pad the array with 0s out to 5 elements.
function getElectronsFromElectronConfig(): number[] {
  const ret = selectedElement$.get().selectedElemOrbitals!.map(o => o.numElectrons);
  return ret.concat(Array(5 - ret.length).fill(0));
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

  // Ze row
  const selectedElemNum = selectedElement$.get().selectedElementInfo!.number;
  const selectedElemOrbitals = selectedElement$.get().selectedElemOrbitals!;
  const zLst = computeZis(selectedElemNum, selectedElemOrbitals, dynamic23Matrix);
  updateRow(electrons, 'ion-energy-z_e-static-row', zLst);

  // t(i) row
  updateRow(electrons, 'ion-energy-t_i-static-row', energies$.get()[0].t_i);

  // v(en) row
  updateRow(electrons, 'ion-energy-v_en-static-row', energies$.get()[0].v_i);

  // Vee rows
  // 5 vee rows, one for each orbital
  const veeRows = document.getElementsByClassName('ion-energy-v_ee-static-row');

  const veeCells: Element[][] = [];
  for (const row of veeRows) {
    const cells = [...row.getElementsByTagName('TD')];
    veeCells.push(cells);
  }
  const v_ij = energies$.get()[0].v_ij;

  for (let row = 0; row < electrons.length; row++) {
    for (let col = 0; col < electrons.length; col++) {
      if (row > col) {
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
          // value comes from v_ij table.
          veeCells[row][col].innerHTML = `${v_ij[row][col].toFixed(3)}`;
        }
      }
    }
  }

  // VAOE row
  const [totalOE, ...orbitalEnergies] = energies$.get()[0].totalEnergies;
  updateRow(electrons, 'ion-energy-vaoe-static-row', orbitalEnergies);

  // Et row
  const etValues = orbitalEnergies.map((val, index) => val * electrons[index]);
  updateRow(electrons, 'ion-energy-et-static-row', etValues);

  const totalEnergyCell = document.getElementById('ion-energy-left-table-total-energy');
  totalEnergyCell!.innerText = `${totalOE!.toFixed(3)} `;


  // ------------------- now, right-hand side table ----------------

  // the right table has dropdown selectors for electron #s.
  const rightTableNumElectronsRow = document.getElementsByClassName('ion-energy-econfig-dyn-row')[0];

  rightTableNumElectronsRow.replaceChildren();

  let cell = document.createElement('td');
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
      () => handleNumElectronsChangedByUser(totalOE!));

    rightTableNumElectronsRow.appendChild(cell);
  });

  // Populate the right table rows with default values.
  handleNumElectronsChangedByUser(totalOE!);
}

function handleNumElectronsChangedByUser(groundStateTotalEnergy: number) {

  const rightTableNumElectronsRow = document.getElementsByClassName('ion-energy-econfig-dyn-row')[0];
  const rightTableZesRow = document.getElementsByClassName('ion-energy-z_es-dyn-row')[0];
  const rightTableVaoeRow = document.getElementsByClassName('ion-energy-vaoe-dyn-row')[0];
  const rightTableEtRow = document.getElementsByClassName('ion-energy-et-dyn-row')[0];

  rightTableZesRow.replaceChildren();
  let cell = document.createElement('td');
  cell.innerHTML = 'Z<sub>e</sub>';
  rightTableZesRow.appendChild(cell);

  // Iterate over all electron selectors and get their values. Build
  // a list of Orbitals from the default/original list.
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

  // Update the values in the Z_i row in the right hand table.
  let Zlst = computeZis(selectedElem!.selectedElementInfo!.number, newOrbitals, dynamic23Matrix);
  Zlst.forEach((z, index) => {
    const cell = document.createElement('td');
    // if the occupancy of the orbital is 0, make the value 0 instead of the computed energy.
    cell.innerText = newOrbitals[index].numElectrons === 0 ? "0.000" : `${z.toFixed(3)} `;
    rightTableZesRow.appendChild(cell);
  });

  // Update VAOE row
  rightTableVaoeRow.replaceChildren();

  const [totalOE, ...orbitalEnergies] = totalOrbitalEnergy(selectedElem!.selectedElementInfo!.number, newOrbitals, dynamic23Matrix);

  cell = document.createElement('td');
  cell.innerHTML = "VAOE";
  rightTableVaoeRow.appendChild(cell);

  orbitalEnergies.forEach((e, index) => {
    cell = document.createElement('td');
    // if the occupancy of the orbital is 0, make the value 0 instead of the computed energy.
    cell.innerText = newOrbitals[index].numElectrons === 0 ? "0.000" : `${e.toFixed(3)} `;
    rightTableVaoeRow.appendChild(cell);
  });

  // Update Et row: each value is VAOE value * # of electrons
  rightTableEtRow.replaceChildren();

  cell = document.createElement('td');
  cell.innerHTML = "E<sub>t</sub>";
  rightTableEtRow.appendChild(cell);

  orbitalEnergies.forEach((e, index) => {
    cell = document.createElement('td');
    // if the occupancy of the orbital is 0, make the value 0 instead of the computed energy.
    cell.innerText = `${(e * newOrbitals[index].numElectrons).toFixed(3)} `;
    rightTableEtRow.appendChild(cell);
  });

  const totalEnergyCell = document.getElementById('ion-energy-right-table-total-energy');
  totalEnergyCell!.innerText = `${totalOE!.toFixed(3)} `;

  const ionizationEnergyCell = document.getElementById('ion-energy-ionization-energy');
  const ionEnergy = Math.abs(groundStateTotalEnergy - totalOE!);
  ionizationEnergyCell!.innerText = `${ionEnergy.toFixed(3)} `;

  // Change the selectors so that they do not allow the user to create anions --
  // the total # of electrons must be <= total # of protons (atomic number).
  // To do this, add options to selectors so that if the total number of selected electrons
  // is less than the max, selectors will allow the number to go back up to the max.
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

}

// update the row in the left-side table, when data changes.
function updateRow(electrons: number[], rowClass: string, data: number[]) {
  const row = document.getElementsByClassName(rowClass)[0]!;
  const cells: Element[] = [...row.getElementsByTagName('TD')];

  electrons.forEach((e, index) => {
    cells[index].innerHTML = `${e === 0 ? "0.000" : data[index].toFixed(3)}`;
  });
}


energies$.listen(() => populateIonEnergyTables());