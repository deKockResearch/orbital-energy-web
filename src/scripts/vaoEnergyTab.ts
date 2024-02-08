import { drawDiagram } from "./energyDiagramsDisplay";
import { convert2Strings } from "./utils";
import { energies$, selectedElement$, matrixSelection$ } from "./stores";
import { updateEnergyTables } from "./energyTables";
import type { EnergyComponents } from "./types";

function updateDiagram(compEnergies: readonly EnergyComponents[]) {
  if (selectedElement$.get().selectedElementInfo === null) {
    // erase drawing of energy levels.
    document.getElementById("eLevelsID")!.replaceChildren();
    return;
  }

  const econfig = selectedElement$.get().selectedElementInfo!.eConfig;

  // Convert to strings with fixed digits after the decimal.
  // Slice off the first item in the array, as it is the total energy,
  // which is not used in the diagram.
  const energies: string[][] = compEnergies.map((c) => (
    convert2Strings(c.totalEnergies).slice(1)
  ));
  console.log('vaoEnergyTab.updateDiagram: energies = ', JSON.stringify(energies, null, 2));
  drawDiagram(econfig, energies, ["dynamic23", "faussurier", matrixSelection$.get()]);
}



// Trigger redraw when energy computation has emitted.
energies$.subscribe((e) => {
  updateDiagram(e);
  updateEnergyTables();
});
