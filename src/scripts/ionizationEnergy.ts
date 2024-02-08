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

  const selectedElemNum = selectedElement$.get().selectedElementInfo!.number;
  const selectedElemOrbitals = selectedElement$.get().selectedElemOrbitals!;
  const zLst = computeZis(selectedElemNum, selectedElemOrbitals, dynamic23Matrix);
  electrons.forEach((e, index) => {
    cell = document.createElement('td');
    cell.innerText = `${e === 0 ? "0.000" : zLst[index].toFixed(3)}`;
    leftTableZesRow.appendChild(cell);
  });

  const [totalOE, ...orbitalEnergies] = energies$.get()[0].totalEnergies;

  const leftTableVaoeRow = document.getElementsByClassName('ion-energy-vaoe-static-row')[0];
  leftTableVaoeRow.replaceChildren();

  cell = document.createElement('td');
  cell.innerHTML = "VAOE";
  leftTableVaoeRow.appendChild(cell);

  // console.log("orbitalEnergies is: ")
  // console.table(orbitalEnergies);
  electrons.forEach((e, index) => {
    cell = document.createElement('td');
    cell.innerText = `${e === 0 ? "0.000" : orbitalEnergies[index].toFixed(3)}`;
    leftTableVaoeRow.appendChild(cell);
  });

  const leftTableEtRow = document.getElementsByClassName('ion-energy-et-static-row')[0];
  leftTableEtRow.replaceChildren();
  cell = document.createElement('td');
  cell.innerHTML = "E<sub>t</sub>";
  leftTableEtRow.appendChild(cell);

  electrons.forEach((e, index) => {
    cell = document.createElement('td');
    cell.innerText = `${e === 0 ? "0.000" : (orbitalEnergies[index] * electrons[index]).toFixed(3)}`;
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
  // Do not show options which would make the total # of electrons be greater than
  // the number of protons (atomic number).
  electrons.forEach((eCount, index) => {
    cell = document.createElement('td');
    const selectCell = document.createElement('select');
    cell.appendChild(selectCell);
    for (let i = 0; i <= eCount; i++) {
      const optionCell = document.createElement('option');
      optionCell.innerText = optionCell.value = `${i}`;
      selectCell.appendChild(optionCell);
    }
    // set the default value for the dropdown
    selectCell.value = `${eCount}`;
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
    cell.innerText = newOrbitals[index].numElectrons === 0 ? "0.000" : `${z.toFixed(3)}`;
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
    cell.innerText = newOrbitals[index].numElectrons === 0 ? "0.000" : `${e.toFixed(3)}`;
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
    cell.innerText = `${(e * newOrbitals[index].numElectrons).toFixed(3)}`;
    rightTableEtRow.appendChild(cell);
  });

  const totalEnergyCell = document.getElementById('ion-energy-right-table-total-energy');
  totalEnergyCell!.innerText = `${totalOE!.toFixed(3)}`;

  const ionizationEnergyCell = document.getElementById('ion-energy-ionization-energy');
  const ionEnergy = Math.abs(groundStateTotalEnergy - totalOE!);
  ionizationEnergyCell!.innerText = `${ionEnergy.toFixed(3)}`;

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
      optionCell.innerText = optionCell.value = `${i}`;
      selCell.appendChild(optionCell);
    }
    selCell.value = `${newOrbitals[index].numElectrons}`;
  });

}

energies$.listen(() => populateIonEnergyTables());