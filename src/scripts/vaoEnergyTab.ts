import { drawDiagram } from "./energyDiagramsDisplay";
import { convert2Strings } from "./utils";
import { energies$, selectedElement$, matrixSelection$, unitsSelection$ } from "./stores";
import type { EnergyComponents } from "./types";

function updateDiagram(compEnergies: readonly EnergyComponents[]) {
  const selElemInfo = selectedElement$.get().selectedElementInfo;

  // erase existing drawing of energy levels.
  document.getElementById("eLevelsID")!.replaceChildren();

  const econfig = selElemInfo === null ? '' : selElemInfo.eConfig;

  // Convert to strings with fixed digits after the decimal.
  const energies: string[][] = selElemInfo === null ? [] : compEnergies.map((c) => convert2Strings(c.totalEnergies));
  drawDiagram(econfig, energies, ["Calvin University - Year", "Faussurier - 1997", matrixSelection$.get()]);
}

// Trigger redraw when energy computation has emitted.
energies$.subscribe((e) => {
  updateDiagram(e);
});

unitsSelection$.listen(() => {
  updateDiagram(energies$.get());
});
