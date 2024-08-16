import { Chart, type ScatterDataPoint } from "chart.js/auto";
import { selectedElement$, unitsSelection$ } from "./stores";
import { conversions } from "./utils";
import {
  getRadProbDensityForElemAndOrbital,
  getRmaxForRowOfElementsAndOrbital,
  getTisForRowOfElementsAndOrbital,
  getVAOEsForRowOfElementsAndOrbital,
  getVisForRowOfElementsAndOrbital,
  getWaveFunction,
  getWaveFunctionSquared,
  getZisForRowOfElementsAndOrbital,
  type XYpair
} from "./orbitalEnergies";
import { eLevels } from "./types";
import { unSelectAllElements } from "./elementsTable";
// import { conversions, energyToUnitsAsString } from "./utils";


// https://doi.org/10.1016/j.cplett.2012.07.072
// https://doi.org/10.1002/chem.201602949
const atomicSize =
  [1.00, 0.57, 3.10, 2.05, 1.54, 1.22, 1.00, 0.85, 0.73, 0.65, 3.39, 2.59, 2.29, 1.99, 1.74, 1.55, 1.40, 1.27];

// https://cccbdb.nist.gov/pollistx.asp
const polarizability =
  [4.50, 1.41, 164.19, 37.79, 20.45, 11.88, 7.42, 5.41, 3.76, 2.57, 162.70, 71.53, 56.28, 36.31, 24.50, 19.57, 14.71, 11.23];

// https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html
const unweightedIonizationEnergy =
  [0.49973, 0.90357, 0.198142, 0.342603, 0.304947, 0.413808, 0.53412, 0.500454, 0.640277, 0.792482, 0.188858, 0.280994, 0.219973, 0.299569, 0.385379, 0.380723, 0.476552, 0.579155];

const weightedIonizationEnergy =
  [0.5, 1.452, 0.198, 0.506, 0.874, 1.36, 1.962, 2.653, 3.459, 4.381, 0.189, 0.417, 0.652, 0.948, 1.3, 1.693, 2.147, 2.654];


// https://cccbdb.nist.gov/elecaff1x.asp
const electronAffinity =
  [0.027715971, 0, 0.022696014, 0, 0.010280366, 0.046381834, 0, 0.053726774, 0.124995102, 0, 0.020136828, 0, 0.015942444, 0.051063845, 0.027433736, 0.076332127, 0.132765158, 0];

const startElemInPeriodicTableRows = [0, 2, 10];
const numElemsInPeriodicTableRows = [2, 8, 8];
const elemLabels = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'];


let chart: Chart;


export function drawGraphForRow() {

  const rowSelected: number | null = selectedElement$.get().rowSelected;
  if (!rowSelected) {
    return;
  }

  const startElem = startElemInPeriodicTableRows[rowSelected - 1];
  const numElems = numElemsInPeriodicTableRows[rowSelected - 1];

  if (chart) {
    chart.destroy();
  }

  const xdataAndLabel = getValuesAndLabel(xValueChosen, startElem, numElems);
  const xData = xdataAndLabel.data;
  const xLabel = xdataAndLabel.label;

  const ydataAndLabel = getValuesAndLabel(yValueChosen, startElem, numElems);
  const yData = ydataAndLabel.data;
  const yLabel = ydataAndLabel.label;

  const data: ScatterDataPoint[] = xData.map((x, i) => ({ x, y: yData[i] }));

  const options = {
    scales: {
      x: {
        title: {
          text: xLabel,
          display: true,
        },
      },
      y: {
        title: {
          text: yLabel,
          display: true,
        }
      }
    },

  };

  // https://www.youtube.com/watch?v=PNbDrDI97Ng
  const dataLabels = {
    id: 'dataLabels',
    afterDatasetsDraw: (chart: Chart) => {
      const { ctx } = chart;
      ctx.save();
      ctx.font = "12px sans-serif";
      for (let i = 0; i < data.length; i++) {
        ctx.fillText(((chart.config.data.labels!) as string[])[i],
          chart.getDatasetMeta(0).data[i].x + 10,
          chart.getDatasetMeta(0).data[i].y);
      }
      ctx.restore();
    },
  };

  const ctx = document.getElementById('chart-canv')! as HTMLCanvasElement;
  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels: elemLabels.slice(startElem, startElem + numElems),
      datasets: [{
        data: [...data],
        borderWidth: 1,
        label: `${xLabel} vs ${yLabel}`,
      }]
    },
    options: {
      ...options,
      plugins: {
        title: {
          text: "chartInfo.bottomMaterial",
          display: false,       // TODO
          position: "bottom",
        },
      },
    },
    plugins: [dataLabels],  // https://www.youtube.com/watch?v=PNbDrDI97Ng
  });

}

export function drawGraphForElem() {

  if (chart) {
    chart.destroy();
  }

  let yLabel = '';
  let data: XYpair[] = [];

  switch (yValueChosen) {
    case 'rad-prob-dist':
      data = getRadProbDensityForElemAndOrbital(selectedElement$.get(), orbitalChosen);
      yLabel = `Radial Probability Distribution for ${selectedElement$.get().selectedElementInfo!.symbol} ${eLevels[orbitalChosen]}`;
      break;
    case 'electron-density':
      data = getWaveFunctionSquared(selectedElement$.get(), orbitalChosen);
      yLabel = `Electron Density for ${selectedElement$.get().selectedElementInfo!.symbol} ${eLevels[orbitalChosen]}`;
      break;
    case 'wave-fcn':
      data = getWaveFunction(selectedElement$.get(), orbitalChosen);
      yLabel = `Wave Function for ${selectedElement$.get().selectedElementInfo!.symbol} ${eLevels[orbitalChosen]}`;
      break;
    default:
      console.error("Unknown graph option choice: ", yValueChosen);
      break;
  }

  const options = {
    scales: {
      x: {
        title: {
          text: 'r',
          display: true,
        },
      },
      y: {
        title: {
          text: yLabel,
          display: true,
        }
      }
    },

  };


  const ctx = document.getElementById('chart-canv')! as HTMLCanvasElement;
  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      // labels: elemLabels.slice(startElem, startElem + numElems),
      datasets: [{
        data: [...data],
        borderWidth: 1,
        label: `r vs ${yLabel}`,
      }]
    },
    options: {
      ...options,
      plugins: {
        title: {
          text: "chartInfo.bottomMaterial",
          display: false,       // TODO
          position: "bottom",
        },
      },
    },
    // plugins: [dataLabels],  // https://www.youtube.com/watch?v=PNbDrDI97Ng
  });

}



function getValuesAndLabel(valueChosenToGraph: string, startElem: number, numElems: number) {
  const units = unitsSelection$.get();
  let data: number[] = [];
  let label: string = '';
  switch (valueChosenToGraph) {
    case 'polarizability':
      data = polarizability.slice(startElem, startElem + numElems);
      label = `Polarizability (bohr)`;
      break;
    case 'ionization-energy':
      data = unweightedIonizationEnergy.map(e => e * conversions.get(units)!).slice(startElem, startElem + numElems);
      label = `Ionization Energy (${unitsSelection$.get()})`;
      break;
    case 'weighted-ionization-energy':
      data = weightedIonizationEnergy.map(e => e * conversions.get(units)!).slice(startElem, startElem + numElems);;
      label = `Weighted Ionization Energy (${unitsSelection$.get()})`;
      break;
    case 'z':  // nuclear charge
      data = Array.from({ length: numElems }, (_, i) => startElem + i + 1);
      label = `Nuclear Charge`;
      break;
    case 'Zi': // effective nuclear charge
      data = getZisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
      label = `Effective Nuclear Charge for ${eLevels[orbitalChosen]}`;
      break;
    case 'ti': // kinetic energy
      data = getTisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
      label = `Kinetic Energy for ${eLevels[orbitalChosen]}`;
      break;
    case 'ven': // effective nuclear charge / Z
      const Z = Array.from({ length: numElems }, (_, i) => startElem + i + 1);
      data = getVisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
      label = `Electron-nuclear attraction for ${eLevels[orbitalChosen]}`;
      break;
    case 'vaoe': // orbital energy
      data = getVAOEsForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
      label = `Orbital Energy for ${eLevels[orbitalChosen]}`;
      break;
    case 'rmax':
      data = getRmaxForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen);
      label = `Max Atomic Size for ${eLevels[orbitalChosen]}`;
      break;

    default:
      console.error("Unknown graph option choice: ", valueChosenToGraph);
      break;
  }
  return { data, label };
}

type WizardSteps =
  | "waitingForRowOrElemToBeSelected"
  | "rowSelectedSoUserChoosesOrbitalOrElem"
  | "chooseOrbitalForRow"
  | "chooseXForRowAndOrbital"
  | "chooseYForRowAndOrbital"
  | "chooseXForRowAndElem"
  | "chooseYForRowAndElem"
  | "chooseOrbitalForElem"
  | "chooseYForElem"
  | "showingGraph";

let currSelectionType: "row" | "element" | "" = "";

const waitingForRowOrElem = document.getElementById('waiting-for-row-or-elem-to-be-selected')!;
const waitingForRowOrElemText = document.getElementById('selected-row-or-elem-text')!

const orbitalOrElemElem = document.getElementById('choose-orbital-or-elem')!;
const chooseOrbitalOrElemText = document.getElementById('choose-orbital-or-elem-text')!;
const chooseOrbitalOrElemForm = document.getElementById('choose-orbital-or-elem-form')!;

const chooseOrbitalForRow = document.getElementById('choose-orbital-for-row')!;
const chooseOrbitalForRowText = document.getElementById('choose-orbital-for-row-text')!;
const chooseOrbitalForRowForm = document.getElementById('choose-orbital-for-row-form')!;

const chooseXForRowAndElem = document.getElementById('choose-x-for-row-and-elem')!;
const chooseXForRowAndElemText = document.getElementById('choose-x-for-row-and-elem-text')!;
const chooseXForRowAndElemForm = document.getElementById('choose-x-for-row-and-elem-form')!;

const chooseYForRowAndElem = document.getElementById('choose-y-for-row-and-elem')!;
const chooseYForRowAndElemText = document.getElementById('choose-y-for-row-and-elem-text')!;
const chooseYForRowAndElemForm = document.getElementById('choose-y-for-row-and-elem-form')!;

const chooseXForRowAndOrbital = document.getElementById('choose-x-for-row-and-orbital')!;
const chooseXForRowAndOrbitalText = document.getElementById('choose-x-for-row-and-orbital-text')!;
const chooseXForRowAndOrbitalForm = document.getElementById('choose-x-for-row-and-orbital-form')!;

const chooseYForRowAndOrbital = document.getElementById('choose-y-for-row-and-orbital')!;
const chooseYForRowAndOrbitalText = document.getElementById('choose-y-for-row-and-orbital-text')!;
const chooseYForRowAndOrbitalForm = document.getElementById('choose-y-for-row-and-orbital-form')!;

const chooseOrbitalForElem = document.getElementById('choose-orbital-for-elem')!;
const chooseOrbitalForElemText = document.getElementById('choose-orbital-for-elem-text')!;
const chooseOrbitalForElemForm = document.getElementById('choose-orbital-for-elem-form')!;

const chooseYForElem = document.getElementById('choose-y-for-elem')!;
const chooseYForElemText = document.getElementById('choose-y-for-elem-text')!;
const chooseYForElemForm = document.getElementById('choose-y-for-elem-form')!;


let wizardStep: WizardSteps = "waitingForRowOrElemToBeSelected";
let orbitalOrWholeElemForARow = "";     // "orbital" or "element"
let orbitalChosen = -1;                 // index into ["1s", "2s", "2p", etc.]
let xValueChosen = "";                  // pick string to describe what to graph.
let yValueChosen = "";                  // pick string to describe what to graph.


// manage the transitions between steps in the wizard.
function updateWizardState(selElem: any) {
  // console.log("updateWizardState selElem: ", selElem);
  // console.log("updateWizardStaet: wizardStep: ", wizardStep);

  // User has not selected row or element or has *unselected* a row or element.
  if (selElem.rowSelected === null && selElem.selectedHTMLElement === null) {
    wizardStep = "waitingForRowOrElemToBeSelected";
    resetAllSteps();
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }

  // Row-based state transitions.
  if (wizardStep === "waitingForRowOrElemToBeSelected" && selElem.rowSelected !== null) {
    wizardStep = "rowSelectedSoUserChoosesOrbitalOrElem";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  // User chose a row of elements and now must choose an orbital or an element.
  if (wizardStep === "rowSelectedSoUserChoosesOrbitalOrElem" && orbitalOrWholeElemForARow === "orbital") {
    wizardStep = "chooseOrbitalForRow";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseOrbitalForRow" && orbitalChosen !== -1) {
    wizardStep = "chooseXForRowAndOrbital";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseXForRowAndOrbital" && xValueChosen) {
    wizardStep = "chooseYForRowAndOrbital";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseYForRowAndOrbital" && yValueChosen) {
    wizardStep = "showingGraph";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }

  // User choose a row of elements but then selected to graph values for each of the whole elements.
  // (not the orbitals thereof).
  if (wizardStep === "rowSelectedSoUserChoosesOrbitalOrElem" && orbitalOrWholeElemForARow === "element") {
    wizardStep = "chooseXForRowAndElem";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseXForRowAndElem" && xValueChosen) {
    wizardStep = "chooseYForRowAndElem";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseYForRowAndElem" && yValueChosen) {
    wizardStep = "showingGraph";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }

  // Single-element state transitions.
  if (wizardStep === "waitingForRowOrElemToBeSelected" && selElem.selectedHTMLElement !== null) {
    wizardStep = "chooseOrbitalForElem";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseOrbitalForElem" && orbitalChosen !== -1) {
    wizardStep = "chooseYForElem";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseYForElem" && yValueChosen) {
    wizardStep = "showingGraph";
    // console.log("wizardStep is now: ", wizardStep);
    return;
  }
  // console.log("💩💩💩💩💩 Nothing matched when wizardStep = ", wizardStep);
}

function updateDisplayWhenLeavingAStep(step: WizardSteps) {
  switch (step) {
    case "waitingForRowOrElemToBeSelected":
      waitingForRowOrElem.dataset.wizardStep = "wizard-step-previous-selected";
      waitingForRowOrElemText.innerText = selectedElement$.get().rowSelected ? "row" : "element";
      return;
    case "rowSelectedSoUserChoosesOrbitalOrElem":
      orbitalOrElemElem.dataset.wizardStep = "wizard-step-previous-selected";
      // update the text to show which was chosen, and hide the form.
      chooseOrbitalOrElemText.innerText = orbitalOrWholeElemForARow;
      chooseOrbitalOrElemForm.style.display = 'none';
      return;
    case "chooseOrbitalForRow":
      chooseOrbitalForRow.dataset.wizardStep = "wizard-step-previous-selected";
      chooseOrbitalForRowText.innerText = eLevels[orbitalChosen];
      chooseOrbitalForRowForm.style.display = 'none';
      return;
    case "chooseXForRowAndElem":
      chooseXForRowAndElem.dataset.wizardStep = "wizard-step-previous-selected";
      chooseXForRowAndElemText.innerText = xValueChosen;
      chooseXForRowAndElemForm.style.display = 'none';
      return;
    case "chooseYForRowAndElem":
      chooseYForRowAndElem.dataset.wizardStep = "wizard-step-previous-selected";
      chooseYForRowAndElemText.innerText = yValueChosen;
      chooseYForRowAndElemForm.style.display = 'none';
      return;
    case "chooseOrbitalForElem":
      chooseOrbitalForElem.dataset.wizardStep = "wizard-step-previous-selected";
      chooseOrbitalForElemText.innerText = eLevels[orbitalChosen];
      chooseOrbitalForElemForm.style.display = 'none';
      return;

    case "chooseXForRowAndOrbital":
      chooseXForRowAndOrbital.dataset.wizardStep = "wizard-step-previous-selected";
      chooseXForRowAndOrbitalText.innerText = xValueChosen;
      chooseXForRowAndOrbitalForm.style.display = 'none';
      return;
    case "chooseYForRowAndOrbital":
      chooseYForRowAndOrbital.dataset.wizardStep = "wizard-step-previous-selected";
      chooseYForRowAndOrbitalText.innerText = yValueChosen;
      chooseYForRowAndOrbitalForm.style.display = 'none';
      return;
    case "chooseYForElem":
      chooseYForElem.dataset.wizardStep = "wizard-step-previous-selected";
      chooseYForElemText.innerText = yValueChosen;
      chooseYForElemForm.style.display = 'none';
      return;
    default:
      console.error("Unknown wizard step: ", step);
  }
}

function resetStep(step: HTMLElement, textElem: HTMLElement, formElem: HTMLElement) {
  step.dataset.wizardStep = "wizard-step-hidden";
  textElem.innerText = "";
  formElem.style.display = 'inherit';
}

function resetAllSteps() {
  resetStep(orbitalOrElemElem, chooseOrbitalOrElemText, chooseOrbitalOrElemForm);
  resetStep(chooseOrbitalForRow, chooseOrbitalForRowText, chooseOrbitalForRowForm);
  resetStep(chooseXForRowAndOrbital, chooseXForRowAndOrbitalText, chooseXForRowAndOrbitalForm);
  resetStep(chooseYForRowAndOrbital, chooseYForRowAndOrbitalText, chooseYForRowAndOrbitalForm);
  resetStep(chooseXForRowAndElem, chooseXForRowAndElemText, chooseXForRowAndElemForm);
  resetStep(chooseYForRowAndElem, chooseYForRowAndElemText, chooseYForRowAndElemForm);
  resetStep(chooseOrbitalForElem, chooseOrbitalForElemText, chooseOrbitalForElemForm);
  resetStep(chooseYForElem, chooseYForElemText, chooseYForElemForm);
  waitingForRowOrElemText.innerText = "";
  if (chart) {
    chart.destroy();
  }
  wizardStep = "waitingForRowOrElemToBeSelected";
}

// When the wizard state changes, we need to display different instructions
// based on which state we are in.
function updateDisplayForNextStep() {

  switch (wizardStep) {
    case "waitingForRowOrElemToBeSelected":
      // User could choose a new element or a row at any stage of
      // the process, so we have to hide all the other steps, reset displayed text, etc.
      resetAllSteps();
      waitingForRowOrElem.dataset.wizardStep = 'wizard-step-current';
      waitingForRowOrElemText.innerText = "";
      return;
    case "rowSelectedSoUserChoosesOrbitalOrElem":
      orbitalOrElemElem.dataset.wizardStep = 'wizard-step-current';
      chooseOrbitalOrElemText.innerText = "";
      return;
    case "chooseOrbitalForRow":
      chooseOrbitalForRow.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseXForRowAndOrbital":
      chooseXForRowAndOrbital.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseYForRowAndOrbital":
      chooseYForRowAndOrbital.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseOrbitalForElem":
      chooseOrbitalForElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseXForRowAndElem":
      chooseXForRowAndElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseYForRowAndElem":
      chooseYForRowAndElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseYForElem":
      chooseYForElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "showingGraph":
      if (selectedElement$.get().rowSelected) {
        drawGraphForRow();
      } else {
        drawGraphForElem();
      }
      return;
    default:
      console.error("Unknown wizard step: ", wizardStep);
  }
}

// for a given form, register a callback to process the user's selection.
function processWizardSelection(formElem: HTMLElement, radioValueName: string, callback: (val: string) => void) {
  formElem.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const val = new FormData(e.target as HTMLFormElement).get(radioValueName);
    if (val === null) {
      return;
    }
    callback(val as string);
    updateDisplayWhenLeavingAStep(wizardStep);
    updateWizardState(selectedElement$.get());
    updateDisplayForNextStep();
  });
}

processWizardSelection(chooseOrbitalOrElemForm, 'orb-or-elem', (val: string) => {
  orbitalOrWholeElemForARow = val;
});
processWizardSelection(chooseOrbitalForRowForm, 'orb-for-row', (val: string) => {
  orbitalChosen = Number(val);
});
processWizardSelection(chooseXForRowAndElemForm, 'x-for-row-and-elem', (val: string) => {
  xValueChosen = val;
});
processWizardSelection(chooseYForRowAndElemForm, 'y-for-row-and-elem', (val: string) => {
  yValueChosen = val;
});
processWizardSelection(chooseXForRowAndOrbitalForm, 'x-for-row-and-orbital', (val: string) => {
  xValueChosen = val;
});
processWizardSelection(chooseYForRowAndOrbitalForm, 'y-for-row-and-orbital', (val: string) => {
  yValueChosen = val;
});
processWizardSelection(chooseOrbitalForElemForm, 'orb-for-elem', (val: string) => {
  orbitalChosen = Number(val);
});
processWizardSelection(chooseYForElemForm, 'y-for-elem', (val: string) => {
  yValueChosen = val;
});

document.getElementById('reset-graphing')!.addEventListener('click', () => {
  wizardStep = "waitingForRowOrElemToBeSelected";
  orbitalOrWholeElemForARow = "";
  orbitalChosen = -1;
  xValueChosen = "";
  yValueChosen = "";
  unSelectAllElements();
  selectedElement$.set({
    selectedHTMLElement: null,
    selectedElementInfo: null,
    selectedElemOrbitals: null,
    rowSelected: null
  });
  updateDisplayForNextStep();
});

selectedElement$.listen((selElem) => {
  if (selElem.rowSelected) {
    // element or a different row was selected.
    if (currSelectionType === "element" || currSelectionType === "row") {
      resetAllSteps();
    }
    currSelectionType = "row";
  } else if (selElem.selectedHTMLElement) {
    if (currSelectionType === "row" || currSelectionType === "element") {
      resetAllSteps();
    }
    currSelectionType = "element";
  } else {      // nothing selected -- elem or row was unselected.
    resetAllSteps();
    currSelectionType = "";
    return;
  }

  updateDisplayWhenLeavingAStep(wizardStep);
  updateWizardState(selElem);
  updateDisplayForNextStep();
});

// When user changes the units, redraw the graph.
unitsSelection$.listen(() => drawGraphForRow());

