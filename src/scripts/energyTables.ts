import { energyToUnitsAsString } from "./utils";
import { matrixSelection$, energies$, unitsSelection$ } from "./stores";
import { type EnergyComponents, eLevels } from "./types";


export function updateEnergyTablesForMatrix(
  matrixName: string,
  compEnergies: EnergyComponents,
  overrideMatrixId = ''
) {

  // const tiValues = compEnergies.t_i;
  // const viValues = compEnergies.v_i;
  // const vijValues = compEnergies.v_ij;

  // const tvTableHTMLId = (overrideMatrixId || matrixName) + 'TvTable';
  // const vijTableHTMLId = (overrideMatrixId || matrixName) + 'VijTable';

  // const tvTableElem = document.getElementById(tvTableHTMLId)!;
  // tvTableElem.replaceChildren();
  // const vijTableElem = document.getElementById(vijTableHTMLId)!;
  // vijTableElem.replaceChildren();

  // const capElem = document.createElement("caption");
  // capElem.textContent = matrixName;
  // tvTableElem.appendChild(capElem);
  // const capElem2 = document.createElement("caption");
  // capElem2.textContent = matrixName;
  // vijTableElem.appendChild(capElem2);

  // t(i) and v(i) table

  // Use <= because the 1st row (not 0th row) uses 0th element in array,
  // 2nd rwo uses 1st element in array.
  // for (let i = 0; i <= tiValues.length; i++) {
  //   let tableRow = document.createElement("tr");

  //   for (let j = 0; j <= 2; j++) {
  //     const tableData = document.createElement("td");

  //     if (j === 0 && i === 0) {
  //       // Top left corner: empty cell
  //       tableRow.appendChild(tableData);
  //     } else if (i === 0) {
  //       // first row: headers.
  //       const tableHeader = document.createElement("th");
  //       tableHeader.textContent = j === 1 ? "t(i)" : "v(en)";
  //       tableRow.appendChild(tableHeader);
  //     } else if (j === 0) {
  //       // First column of each row: headers.
  //       const tableHeader = document.createElement("th");
  //       tableHeader.textContent = eLevels[i - 1];
  //       tableRow.appendChild(tableHeader);
  //     } else if (j === 1) {
  //       tableData.textContent = tiValues[i - 1].toFixed(3).toString();
  //       tableRow.appendChild(tableData);
  //     } else {
  //       tableData.textContent = viValues[i - 1].toFixed(3).toString();
  //       tableRow.appendChild(tableData);
  //     }
  //   }
  //   tvTableElem.appendChild(tableRow);
  // }

  // v(i, j) table
  // for (let i = 0; i <= vijValues.length; i++) {
  //   let tableRow = document.createElement("tr");

  //   for (let j = 0; j <= vijValues.length; j++) {
  //     let tableData = document.createElement("td");
  //     let tableHeader = document.createElement("th");

  //     if (j === 0 && i === 0) {
  //       tableRow.appendChild(tableData);
  //     } else if (i === 0) {
  //       tableHeader.textContent = eLevels[j - 1];
  //       tableRow.appendChild(tableHeader);
  //     } else if (j === 0) {
  //       tableHeader.textContent = eLevels[i - 1];
  //       tableRow.appendChild(tableHeader);
  //     } else {
  //       tableData.textContent = vijValues[i - 1][j - 1].toFixed(3).toString();
  //       tableRow.appendChild(tableData);
  //     }
  //   }
  //   vijTableElem.appendChild(tableRow);
  // }


  // Total Energies
  const totalEnergyElemId = (overrideMatrixId || matrixName) + "TotalEnergy";
  const totalEnergyBox = document.getElementById(totalEnergyElemId)!;
  totalEnergyBox.textContent = energyToUnitsAsString(compEnergies.totalEnergies[0], unitsSelection$.get());
}

export function updateEnergyTables() {
  if (energies$.get()[0] === undefined) {
    return;
  }
  updateEnergyTablesForMatrix("dynamic23", energies$.get()[0]);
  updateEnergyTablesForMatrix("faussurier", energies$.get()[1]);
  updateEnergyTablesForMatrix(matrixSelection$.get(), energies$.get()[2], 'selectable');
}
