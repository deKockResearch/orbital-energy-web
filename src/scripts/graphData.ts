import { Chart, type ScatterDataPoint } from "chart.js/auto";
import { selectedElement$, unitsSelection$ } from "./stores";
import { conversions } from "./utils";
import {
  getRmaxForRowOfElementsAndOrbital,
  getTisForRowOfElementsAndOrbital,
  getVAOEsForRowOfElementsAndOrbital,
  getVisForRowOfElementsAndOrbital,
  getZisForRowOfElementsAndOrbital
} from "./orbitalEnergies";
import { eLevels } from "./types";
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
  [0.49973, 0.967795, 0.198142, 0.337283, 0.437215, 0.543986, 0.654002, 0.757922, 0.864757, 0.973539, 0.188858, 0.277843, 0.326223, 0.379004, 0.433465, 0.48373, 0.536331, 0.589734];

// https://cccbdb.nist.gov/elecaff1x.asp
const electronAffinity =
  [0.027715971, 0, 0.022696014, 0, 0.010280366, 0.046381834, 0, 0.053726774, 0.124995102, 0, 0.020136828, 0, 0.015942444, 0.051063845, 0.027433736, 0.076332127, 0.132765158, 0];

const startElemInPeriodicTableRows = [0, 2, 10];
const numElemsInPeriodicTableRows = [2, 8, 8];
const elemLabels = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'];

function calcPointRadius(context: { dataIndex: number }) {
  if (selectedElement$.get().selectedElementInfo === null) {
    return 5;
  }
  return context.dataIndex === selectedElement$.get().selectedElementInfo!.number - 1 ? 10 : 5;
}

let atomicSizeChart: Chart;
let electronAffinityChart: Chart;
let polarizabilityChart: Chart;
let ionizationEnergyChart: Chart;
let weightedIonizationEnergyChart: Chart;

let chart: Chart;

interface ChartInfo {
  data: number[];
  title: string;
  bottomMaterial: string[];
}


export function drawSelectedRowOfElemsChart(chartName: string) {

  const rowSelected: number | null = selectedElement$.get().rowSelected;
  if (!rowSelected) {
    return;
  }

  const startElem = startElemInPeriodicTableRows[rowSelected - 1];
  const numElems = numElemsInPeriodicTableRows[rowSelected - 1];
  const labels = elemLabels.slice(startElem, startElem + numElems);

  if (chart) {
    chart.destroy();
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  let chartInfo: ChartInfo = {
    data: [],
    title: '',
    bottomMaterial: [],
  };

  const unitSelectValue = unitsSelection$.get();

  switch (chartName) {
    case 'polarizability':
      chartInfo = {
        data: polarizability,
        title: "Polarizability (bohr)",
        bottomMaterial: ['DeKock 2012'],
      };
      break;
    case 'ionization-energy':
      chartInfo = {
        // convert the values depending on unit selection.
        data: unweightedIonizationEnergy.map((e) => e * conversions.get(unitSelectValue)!),
        title: `Ionization Energy (${unitSelectValue})`,
        bottomMaterial: ["Kramida, A., Ralchenko, Yu., Reader, J., and NIST ASD Team (2014). NIST Atomic Spectra Database (ver. 5.2),", "[Online]. Available: http://physics.nist.gov/asd [2016, February 22]. National Institute of Standards and Technology, Gaithersburg, MD."]
      };
      break;
    case 'electron-affinity':
      chartInfo = {
        data: electronAffinity.map((e) => e * conversions.get(unitSelectValue)!),
        title: `Electron Affinity (${unitSelectValue})`,
        bottomMaterial: ["https://cccbdb.nist.gov/elecaff1x.asp"],
      }
      break;
    case 'weighted-ion-energy':
      chartInfo = {
        data: weightedIonizationEnergy.map((e) => e * conversions.get(unitSelectValue)!),
        title: `Weighted Ionization Energy (${unitSelectValue})`,
        bottomMaterial: [],
      };
      break;

    case 'z':     // nuclear charge
      break;
    default:
      console.error("Unknown chart name: ", chartName);
      break;
  }

  const data = chartInfo.data.slice(startElem, startElem + numElems);

  const ctx = document.getElementById('chart-canv')! as HTMLCanvasElement;
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: chartInfo.title,
        data: [...data],
        borderWidth: 1,
        pointRadius: calcPointRadius,
      }]
    },
    options: {
      ...options,
      plugins: {
        title: {
          text: chartInfo.bottomMaterial,
          display: true,
          position: "bottom",
        },
      },
    },
  });

}

export function drawGraphForRowAndElem() {

  const rowSelected: number | null = selectedElement$.get().rowSelected;
  if (!rowSelected) {
    return;
  }

  const startElem = startElemInPeriodicTableRows[rowSelected - 1];
  const numElems = numElemsInPeriodicTableRows[rowSelected - 1];
  // const labels = elemLabels.slice(startElem, startElem + numElems);

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
    }
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
  });

}


function getValuesAndLabel(valueChosenToGraph: string, startElem: number, numElems: number) {
  let data: number[] = [];
  let label: string = '';
  switch (valueChosenToGraph) {
    case 'polarizability':
      data = polarizability;
      label = `Polarizability (bohr)`;
      break;
    case 'ionization-energy':
      data = unweightedIonizationEnergy;
      label = `Ionization Energy (${unitsSelection$.get()})`;
      break;
    case 'weighted-ionization-energy':
      data = weightedIonizationEnergy;
      label = `Weighted Ionization Energy (${unitsSelection$.get()})`;
      break;
    case 'Zi': // effective nuclear charge
      data = getZisForRowOfElementsAndOrbital(startElem, numElems, orbitalForRow);
      label = `Effective Nuclear Charge for ${eLevels[orbitalForRow]}`;
      break;
    case 'ti': // kinetic energy
      data = getTisForRowOfElementsAndOrbital(startElem, numElems, orbitalForRow);
      label = `Kinetic Energy for ${eLevels[orbitalForRow]}`;
      break;
    case 'ven': // effective nuclear charge
      data = getVisForRowOfElementsAndOrbital(startElem, numElems, orbitalForRow);
      label = `Effective Nuclear Charge for ${eLevels[orbitalForRow]}`;
      break;
    case 'vaoe': // orbital energy
      data = getVAOEsForRowOfElementsAndOrbital(startElem, numElems, orbitalForRow);
      label = `Orbital Energy for ${eLevels[orbitalForRow]}`;
      break;
    case 'rmax':
      data = getRmaxForRowOfElementsAndOrbital(startElem, numElems, orbitalForRow);
      label = `Max Atomic Size for ${eLevels[orbitalForRow]}`;
      break;
    default:
      console.error("Unknown xValueChosen: ", xValueChosen);
      break;
  }
  return { data, label };
}

// This is run once when the window loads (i.e., from "main").
export function drawCharts() {
}

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   };
//   const labels = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
//     'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'];

//   const ctx = document.getElementById('atomicSizeChartCanv')! as HTMLCanvasElement;
//   atomicSizeChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels,
//       datasets: [{
//         label: `Atomic Size (bohr)`,
//         data: [...atomicSize],
//         borderWidth: 1,
//         pointRadius: calcPointRadius,
//       }]
//     },
//     options: {
//       ...options,
//       plugins: {
//         title: {
//           text: "DeKock 2012",
//           display: true,
//           position: "bottom",
//         },
//       },
//     },
//   });

//   const ctx2 = document.getElementById('electronAffinityChartCanv')! as HTMLCanvasElement;
//   electronAffinityChart = new Chart(ctx2, {
//     type: 'line',
//     data: {
//       labels,
//       datasets: [{
//         label: `Electron Affinity (${unitsSelection$.get()})`,
//         data: [...electronAffinity],
//         borderWidth: 1,
//         pointRadius: calcPointRadius,
//       }]
//     },
//     options: {
//       ...options,
//       plugins: {
//         title: {
//           text: "https://cccbdb.nist.gov/elecaff1x.asp",
//           display: true,
//           position: "bottom",
//         },
//       },
//     },
//   });
//   const ctx3 = document.getElementById('polarizabilityChartCanv')! as HTMLCanvasElement;
//   polarizabilityChart = new Chart(ctx3, {
//     type: 'line',
//     data: {
//       labels,
//       datasets: [{
//         label: `Polarizability (bohr)`,
//         data: [...polarizability],
//         borderWidth: 1,
//         pointRadius: calcPointRadius,
//       }]
//     },
//     options,
//   });
//   const ctx4 = document.getElementById('ionizationEnergyChartCanv')! as HTMLCanvasElement;
//   ionizationEnergyChart = new Chart(ctx4, {
//     type: 'line',
//     data: {
//       labels,
//       datasets: [
//         {
//           label: `Ionization Energy (${unitsSelection$.get()})`,
//           data: [...unweightedIonizationEnergy],
//           borderWidth: 1,
//           pointRadius: calcPointRadius,
//         },
//       ]
//     },
//     options: {
//       ...options,
//       plugins: {
//         title: {
//           text: ["Kramida, A., Ralchenko, Yu., Reader, J., and NIST ASD Team (2014). NIST Atomic Spectra Database (ver. 5.2),", "[Online]. Available: http://physics.nist.gov/asd [2016, February 22]. National Institute of Standards and Technology, Gaithersburg, MD."],
//           display: true,
//           position: "bottom",
//         },
//       },
//     },
//   });
//   const ctx5 = document.getElementById('weightedIonizationEnergyChartCanv')! as HTMLCanvasElement;
//   weightedIonizationEnergyChart = new Chart(ctx5, {
//     type: 'line',
//     data: {
//       labels,
//       datasets: [
//         {
//           label: `Weighted Ionization Energy (${unitsSelection$.get()})`,
//           data: [...weightedIonizationEnergy],
//           borderWidth: 1,
//           pointRadius: calcPointRadius,
//         },
//       ]
//     },
//     options,
//   });
// }

// The unit selector was changed so update the charts to show using the
// new scale (Ha, Ry, cal, etc.)
// function updateChartScales() {

//   const unitSelectValue = unitsSelection$.get();
//   for (let i = 0; i < electronAffinityChart.data.datasets[0].data.length; i++) {
//     electronAffinityChart.data.datasets[0].data[i] = electronAffinity[i] * conversions.get(unitSelectValue)!;
//   }
//   electronAffinityChart.data.datasets[0].label = `Electron Affinity (${unitSelectValue})`;
//   electronAffinityChart.update();

//   for (let i = 0; i < ionizationEnergyChart.data.datasets[0].data.length; i++) {
//     ionizationEnergyChart.data.datasets[0].data[i] = unweightedIonizationEnergy[i] * conversions.get(unitSelectValue)!;
//   }
//   ionizationEnergyChart.data.datasets[0].label = `Ionization Energy (${unitSelectValue})`;
//   ionizationEnergyChart.update();

//   for (let i = 0; i < weightedIonizationEnergyChart.data.datasets[0].data.length; i++) {
//     weightedIonizationEnergyChart.data.datasets[0].data[i] = weightedIonizationEnergy[i] * conversions.get(unitSelectValue)!;
//   }
//   weightedIonizationEnergyChart.data.datasets[0].label = `Weighted Ionization Energy (${unitSelectValue})`;
//   weightedIonizationEnergyChart.update();
// }

// function updateChartsPoints() {
//   atomicSizeChart.update();
//   electronAffinityChart.update();
//   polarizabilityChart.update();
//   ionizationEnergyChart.update();
//   weightedIonizationEnergyChart.update();
// }

// this box appears next to the charts and summarizes the energies
// for the element that has been selected.
// function updateEnergiesBox() {

//   const unitSelectValue = unitsSelection$.get();

//   const atomicNumIndex = selectedElement$.get().selectedElementInfo!.number - 1;
//   const een = document.getElementById('energy-element-name')! as HTMLCanvasElement;
//   een.innerHTML = "Name: " + selectedElement$.get().selectedElementInfo!.name;
//   const eas = document.getElementById('energy-atomic-size')! as HTMLCanvasElement;
//   eas.innerHTML = "Atomic Size: " + atomicSize[atomicNumIndex] + " bohr";
//   const eea = document.getElementById('energy-electron-affinity')! as HTMLCanvasElement;
//   eea.innerHTML = "Electron Affinity: " + energyToUnitsAsString(electronAffinity[atomicNumIndex], unitSelectValue);
//   const ep = document.getElementById('energy-polarizability')! as HTMLCanvasElement;
//   ep.innerHTML = "Polarizability: " + polarizability[atomicNumIndex] + " bohr";
//   const eie = document.getElementById('energy-ionization-energy')! as HTMLCanvasElement;
//   eie.innerHTML = "Weighted Ionization: " + energyToUnitsAsString(weightedIonizationEnergy[atomicNumIndex], unitSelectValue);

// }

function updateEverything() {
  if (selectedElement$.get().selectedElementInfo === null) {
    return;
  }
  // updateChartsPoints();
  // updateChartScales();
  // updateEnergiesBox();
}

// // listen for user changing which graph to show.
// const graphSelFormElem = document.getElementById('graph-selection-form')! as HTMLFormElement;
// graphSelFormElem.addEventListener('change', (e: Event) => {
//   const target = e.target as HTMLSelectElement;
//   const graphToShow = target.value;   // electronAffinity, polarizability, ionizationEnergy, weightedIonizationEnergy
//   drawSelectedRowOfElemsChart(graphToShow);
// });

function updateGraphOnAnyChange() {

  // When the user selects an element or a row of elements, disable or enable
  // the fieldset of single-element graph options or the fieldset of
  // row-based graph options.
  const selElem = selectedElement$.get();
  const fieldSetOfSingleElemGraphs = document.getElementById('single-elem-graphs');
  const fieldSetOfRowOfElemGraphs = document.getElementById('row-of-elem-graphs');

  if (selElem.selectedHTMLElement === null) {
    fieldSetOfSingleElemGraphs?.setAttribute('disabled', 'true');
  } else {
    fieldSetOfSingleElemGraphs?.removeAttribute('disabled');
  }
  if (selElem.rowSelected === null) {
    fieldSetOfRowOfElemGraphs?.setAttribute('disabled', 'true');
  } else {
    fieldSetOfRowOfElemGraphs?.removeAttribute('disabled');
  }

  // get the value of the form -- to see which radio button has been selected.
  const graphSelFormElem = document.getElementById('graph-selection-form')! as HTMLFormElement;
  const fd = new FormData(graphSelFormElem);
  const graphType = fd.get('graph-type');

  if (graphType !== null) {
    drawSelectedRowOfElemsChart(graphType as string);
  }
}


// listen for user changing the selection or the units.
// selectedElement$.subscribe(() => updateGraphOnAnyChange());
// unitsSelection$.subscribe(() => updateGraphOnAnyChange());

type WizardSteps =
  | "waitingForRowOrElemToBeSelected"
  | "rowSelectedSoUserChoosesOrbitalOrElem"

  | "chooseWhichOrbitalToGraph"

  | "chooseXForRowAndOrbital"
  | "chooseYForRowAndOrbital"

  | "chooseXForRowAndElem"
  | "chooseYForRowAndElem"

  | "chooseXForElem"
  | "chooseYForElem"

  | "showingGraph";


let wizardStep: WizardSteps = "waitingForRowOrElemToBeSelected";
let orbitalOrWholeElemForARow = "";     // "orbital" or "element"
let orbitalForRow = -1;                  // index into ["1s", "2s", "2p", etc.]
let xValueChosen = "";                  // pick string to describe what to graph.
let yValueChosen = "";                  // pick string to describe what to graph.


// manage the transitions between steps in the wizard.
function updateWizardState(selElem: any) {
  console.log("selElem: ", selElem);
  console.log("wizardStep: ", wizardStep);
  if (selElem.rowSelected === null && selElem.selectedHTMLElement === null) {
    wizardStep = "waitingForRowOrElemToBeSelected";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }

  // Row-based state transitions.
  if (wizardStep === "waitingForRowOrElemToBeSelected" && selElem.rowSelected !== null) {
    wizardStep = "rowSelectedSoUserChoosesOrbitalOrElem";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  // User chose a row of elements and now must choose an orbital or an element.
  if (wizardStep === "rowSelectedSoUserChoosesOrbitalOrElem" && orbitalOrWholeElemForARow === "orbital") {
    wizardStep = "chooseWhichOrbitalToGraph";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseWhichOrbitalToGraph" && orbitalForRow !== -1) {
    wizardStep = "chooseXForRowAndOrbital";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseXForRowAndOrbital" && xValueChosen) {
    wizardStep = "chooseYForRowAndOrbital";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseYForRowAndOrbital" && yValueChosen) {
    wizardStep = "showingGraph";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }

  // User choose a row of elements but then selected to graph values for each of the whole elements.
  // (not the orbitals thereof).
  if (wizardStep === "rowSelectedSoUserChoosesOrbitalOrElem" && orbitalOrWholeElemForARow === "element") {
    wizardStep = "chooseXForRowAndElem";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseXForRowAndElem" && xValueChosen) {
    wizardStep = "chooseYForRowAndElem";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseYForRowAndElem" && yValueChosen) {
    wizardStep = "showingGraph";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }

  // Single-element state transitions.
  if (wizardStep === "waitingForRowOrElemToBeSelected" && selElem.selectedHTMLElement !== null) {
    wizardStep = "chooseXForElem";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseXForElem" && xValueChosen) {
    wizardStep = "chooseYForElem";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  if (wizardStep === "chooseYForElem" && yValueChosen) {
    wizardStep = "showingGraph";
    console.log("wizardStep is now: ", wizardStep);
    return;
  }
  console.log("💩💩💩💩💩Nothing matched!!!");
}

function updateDisplayWhenLeavingAStep(step: WizardSteps) {
  switch (step) {
    case "rowSelectedSoUserChoosesOrbitalOrElem":
      const orbitalOrElemElem = document.getElementById('row-selected-so-user-chooses-orbital-or-elem')!;
      orbitalOrElemElem.dataset.wizardStep = "wizard-step-previous-selected";
      // update the text to show which was chosen, and hide the form.
      const chooseOrbitalOrElemText = document.getElementById('choose-orbital-or-elem-text')!;
      chooseOrbitalOrElemText.innerText += " " + orbitalOrWholeElemForARow;
      const chooseOrbitalOrElemForm = document.getElementById('orb-or-elem-form')!;
      chooseOrbitalOrElemForm.style.display = 'none';
      return;
    case "chooseWhichOrbitalToGraph":
      const chooseWhichOrbitalToGraph = document.getElementById('choose-which-orbital-to-graph')!;
      chooseWhichOrbitalToGraph.dataset.wizardStep = "wizard-step-previous-selected";
      const chooseOrbitalText = document.getElementById('choose-which-orbital-text')!;
      chooseOrbitalText.innerText += " " + eLevels[orbitalForRow];
      const chooseOrbitalForm = document.getElementById('select-orbital-form')!;
      chooseOrbitalForm.style.display = 'none';
      return;
    case "chooseXForRowAndElem":
      const chooseXForRowAndElem = document.getElementById('choose-x-for-row-and-elem')!;
      chooseXForRowAndElem.dataset.wizardStep = "wizard-step-previous-selected";
      const chooseXForRowAndElemText = document.getElementById('choose-x-for-row-and-elem-text')!;
      chooseXForRowAndElemText.innerText += " " + xValueChosen;
      const chooseXForRowAndElemForm = document.getElementById('x-for-row-and-elem-form')!;
      chooseXForRowAndElemForm.style.display = 'none';
      return;
    case "chooseYForRowAndElem":
      const chooseYForRowAndElem = document.getElementById('choose-y-for-row-and-elem')!;
      chooseYForRowAndElem.dataset.wizardStep = "wizard-step-previous-selected";
      const chooseYForRowAndElemText = document.getElementById('choose-y-for-row-and-elem-text')!;
      chooseYForRowAndElemText.innerText += " " + yValueChosen;
      const chooseYForRowAndElemForm = document.getElementById('y-for-row-and-elem-form')!;
      chooseYForRowAndElemForm.style.display = 'none';
      return;
    case "chooseXForRowAndOrbital":
      const chooseXForRowAndOrbital = document.getElementById('choose-x-for-row-and-orbital')!;
      chooseXForRowAndOrbital.dataset.wizardStep = "wizard-step-previous-selected";
      const chooseXForRowAndOrbitalText = document.getElementById('x-for-row-and-orbital-text')!;
      chooseXForRowAndOrbitalText.innerText += " " + xValueChosen;
      const chooseXForRowAndOrbitalForm = document.getElementById('x-for-row-and-orbital-form')!;
      chooseXForRowAndOrbitalForm.style.display = 'none';
      return;
    case "chooseYForRowAndOrbital":
      const chooseYForRowAndOrbital = document.getElementById('choose-y-for-row-and-orbital')!;
      chooseYForRowAndOrbital.dataset.wizardStep = "wizard-step-previous-selected";
      const chooseYForRowAndOrbitalText = document.getElementById('y-for-row-and-orbital-text')!;
      chooseYForRowAndOrbitalText.innerText += " " + yValueChosen;
      const chooseYForRowAndOrbitalForm = document.getElementById('y-for-row-and-orbital-form')!;
      chooseYForRowAndOrbitalForm.style.display = 'none';
      return;
    default:
      console.error("Unknown wizard step: ", step);
  }
}

// When the wizard state changes, we need to display different instructions
// based on which state we are in.
function updateDisplayForNextStep() {
  const waitingForRowOrElem = document.getElementById('waiting-for-row-or-elem-to-be-selected')!;
  const rowSelectedSoUserChoosesOrbitalOrElem = document.getElementById('row-selected-so-user-chooses-orbital-or-elem')!;
  const chooseWhichOrbitalToGraph = document.getElementById('choose-which-orbital-to-graph')!;
  const chooseXForRowAndOrbital = document.getElementById('choose-x-for-row-and-orbital')!;
  const chooseYForRowAndOrbital = document.getElementById('choose-y-for-row-and-orbital')!;
  const chooseXForRowAndElem = document.getElementById('choose-x-for-row-and-elem')!;
  const chooseYForRowAndElem = document.getElementById('choose-y-for-row-and-elem')!;
  const chooseXForElem = document.getElementById('choose-x-for-elem')!;
  const chooseYForElem = document.getElementById('choose-y-for-elem')!;
  const showingGraph = document.getElementById('showing-graph')!;

  switch (wizardStep) {
    case "waitingForRowOrElemToBeSelected":
      // User could choose a new element or a row at any stage of
      // the process, so we have to hide all the other steps.
      rowSelectedSoUserChoosesOrbitalOrElem.dataset.wizardStep = "wizard-step-hidden";
      chooseWhichOrbitalToGraph.dataset.wizardStep = 'wizard-step-hidden';
      chooseXForRowAndOrbital.dataset.wizardStep = "wizard-step-hidden";
      chooseYForRowAndOrbital.dataset.wizardStep = "wizard-step-hidden";
      chooseXForRowAndElem.dataset.wizardStep = "wizard-step-hidden";
      chooseYForRowAndElem.dataset.wizardStep = "wizard-step-hidden";
      chooseXForElem.dataset.wizardStep = "wizard-step-hidden";
      chooseYForElem.dataset.wizardStep = "wizard-step-hidden";
      showingGraph.dataset.wizardStep = "wizard-step-hidden";
      return;
    case "rowSelectedSoUserChoosesOrbitalOrElem":
      // TODO: remove next line?
      waitingForRowOrElem.dataset.wizardStep = "wizard-step-previous-selected";
      rowSelectedSoUserChoosesOrbitalOrElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseXForElem":
      // TODO: remove next line?
      waitingForRowOrElem.dataset.wizardStep = "wizard-step-previous-selected";
      chooseXForElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseWhichOrbitalToGraph":
      chooseWhichOrbitalToGraph.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseXForRowAndOrbital":
      chooseXForRowAndOrbital.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseYForRowAndOrbital":
      chooseYForRowAndOrbital.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseXForRowAndElem":
      chooseXForRowAndElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "chooseYForRowAndElem":
      chooseYForRowAndElem.dataset.wizardStep = 'wizard-step-current';
      return;
    case "showingGraph":
      drawGraphForRowAndElem();
      return;
    default:
      console.error("Unknown wizard step: ", wizardStep);
  }
}


// listen for user changing which graph to show.
const orbOrElemFormElem = document.getElementById('orb-or-elem-form')! as HTMLFormElement;
orbOrElemFormElem.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const orbOrElem = new FormData(e.target as HTMLFormElement).get('orb-or-elem');
  if (orbOrElem === null) {
    return;
  }
  orbitalOrWholeElemForARow = orbOrElem as string;
  console.log('orbitalOrWholeElemForARow: ', orbitalOrWholeElemForARow);
  updateDisplayWhenLeavingAStep(wizardStep);
  updateWizardState(selectedElement$.get());
  updateDisplayForNextStep();
});

const whichOrbToGraph = document.getElementById('select-orbital-form')! as HTMLFormElement;
whichOrbToGraph.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const orbToGraph = new FormData(e.target as HTMLFormElement).get('orb-to-graph');
  if (orbToGraph === null) {
    return;
  }
  orbitalForRow = Number(orbToGraph as string); //  "1" -> 1, etc.
  updateDisplayWhenLeavingAStep(wizardStep);
  updateWizardState(selectedElement$.get());
  updateDisplayForNextStep();
});

const xValueToGraphForRowAndElemFormElem = document.getElementById('x-for-row-and-elem-form')! as HTMLFormElement;
xValueToGraphForRowAndElemFormElem.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const xValueToGraph = new FormData(e.target as HTMLFormElement).get('x-for-row-and-elem');
  if (xValueToGraph === null) {
    return;
  }
  xValueChosen = xValueToGraph as string;
  updateDisplayWhenLeavingAStep(wizardStep);
  updateWizardState(selectedElement$.get());
  updateDisplayForNextStep();
});

const yValueToGraphForRowAndElemFormElem = document.getElementById('y-for-row-and-elem-form')! as HTMLFormElement;
yValueToGraphForRowAndElemFormElem.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const yValueToGraph = new FormData(e.target as HTMLFormElement).get('y-for-row-and-elem');
  if (yValueToGraph === null) {
    return;
  }
  yValueChosen = yValueToGraph as string;
  updateDisplayWhenLeavingAStep(wizardStep);
  updateWizardState(selectedElement$.get());
  updateDisplayForNextStep();
});


const xValueToGraphForRowAndOrbFormElem = document.getElementById('x-for-row-and-orbital-form')! as HTMLFormElement;
xValueToGraphForRowAndOrbFormElem.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const xValueToGraph = new FormData(e.target as HTMLFormElement).get('x-for-row-and-orbital');
  if (xValueToGraph === null) {
    return;
  }
  xValueChosen = xValueToGraph as string;
  updateDisplayWhenLeavingAStep(wizardStep);
  updateWizardState(selectedElement$.get());
  updateDisplayForNextStep();
});

const yValueToGraphForRowAndOrbFormElem = document.getElementById('y-for-row-and-orbital-form')! as HTMLFormElement;
yValueToGraphForRowAndOrbFormElem.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const yValueToGraph = new FormData(e.target as HTMLFormElement).get('y-for-row-and-orbital');
  if (yValueToGraph === null) {
    return;
  }
  yValueChosen = yValueToGraph as string;
  updateDisplayWhenLeavingAStep(wizardStep);
  updateWizardState(selectedElement$.get());
  updateDisplayForNextStep();
});

selectedElement$.listen((selElem) => {
  updateWizardState(selElem);
  updateDisplayForNextStep();
});
