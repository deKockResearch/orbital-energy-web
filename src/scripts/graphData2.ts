import { Chart, type ScatterDataPoint } from "chart.js/auto";
import { conversions } from "./utils";

import { eLevels } from "./types";
import { elements, numElemsInPeriodicTableRows, startElemInPeriodicTableRows } from "./elements";


// https://doi.org/10.1016/j.cplett.2012.07.072
// https://doi.org/10.1002/chem.201602949
// const atomicSize =
// [1.00, 0.57, 3.10, 2.05, 1.54, 1.22, 1.00, 0.85, 0.73, 0.65, 3.39, 2.59, 2.29, 1.99, 1.74, 1.55, 1.40, 1.27];

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

const elemLabels = elements.map(el => el.symbol);

let chart: Chart;

let xGraphChoice = '';
let yGraphChoice = '';

const yradioInputs = document.querySelectorAll('.y-menu.radio-collection input');
for (let ri of yradioInputs) {
  ri.addEventListener('click', (event: Event) => {
    const targ: any = event.target!;
    console.log('y choice: ', targ.value);
    yGraphChoice = targ.value;
    drawGraph();
  });
}

const xradioInputs = document.querySelectorAll('.x-menu.radio-collection input');
for (let ri of xradioInputs) {
  ri.addEventListener('click', (event: Event) => {
    const targ: any = event.target!;
    console.log('x choice: ', targ.value);
    xGraphChoice = targ.value;
    drawGraph();
  });
}


export function drawGraph() {

  const startElem = 0
  const numElems = 70;

  if (chart) {
    chart.destroy();
  }

  const xdataAndLabel = getValuesAndLabel(xGraphChoice, startElem, numElems);
  const xData = xdataAndLabel.data;
  const xLabel = xdataAndLabel.label;

  const ydataAndLabel = getValuesAndLabel(yGraphChoice, startElem, numElems);
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

  const ctx = document.getElementById('chart2-canv')! as HTMLCanvasElement;
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

// export function drawGraphForElem() {

//   if (chart) {
//     chart.destroy();
//   }

//   let yLabel = '';
//   let data: XYpair[] = [];

//   switch (yValueChosen) {
//     case 'rad-prob-dist':
//       data = getRadProbDensityForElemAndOrbital(selectedElement$.get(), orbitalChosen);
//       yLabel = `Radial Probability Distribution for ${selectedElement$.get().selectedElementInfo!.symbol} ${eLevels[orbitalChosen]}`;
//       break;
//     case 'electron-density':
//       data = getWaveFunctionSquared(selectedElement$.get(), orbitalChosen);
//       yLabel = `Electron Density for ${selectedElement$.get().selectedElementInfo!.symbol} ${eLevels[orbitalChosen]}`;
//       break;
//     case 'wave-fcn':
//       data = getWaveFunction(selectedElement$.get(), orbitalChosen);
//       yLabel = `Wave Function for ${selectedElement$.get().selectedElementInfo!.symbol} ${eLevels[orbitalChosen]}`;
//       break;
//     default:
//       console.error("Unknown graph option choice: ", yValueChosen);
//       break;
//   }

//   const options = {
//     scales: {
//       x: {
//         title: {
//           text: 'r',
//           display: true,
//         },
//       },
//       y: {
//         title: {
//           text: yLabel,
//           display: true,
//         }
//       }
//     },

//   };


//   const ctx = document.getElementById('chart2-canv')! as HTMLCanvasElement;
//   chart = new Chart(ctx, {
//     type: 'scatter',
//     data: {
//       // labels: elemLabels.slice(startElem, startElem + numElems),
//       datasets: [{
//         data: [...data],
//         borderWidth: 1,
//         label: `r vs ${yLabel}`,
//       }]
//     },
//     options: {
//       ...options,
//       plugins: {
//         title: {
//           text: "chartInfo.bottomMaterial",
//           display: false,       // TODO
//           position: "bottom",
//         },
//       },
//     },
//     // plugins: [dataLabels],  // https://www.youtube.com/watch?v=PNbDrDI97Ng
//   });

// }



function getValuesAndLabel(valueChosenToGraph: string, startElem: number, numElems: number) {
  let data: number[] = [];
  let label: string = '';
  switch (valueChosenToGraph) {
    // case 'polarizability':
    //   data = polarizability.slice(startElem, startElem + numElems);
    //   label = `Polarizability (bohr)`;
    //   break;
    // case 'ionization-energy':
    //   data = unweightedIonizationEnergy.map(e => e * conversions.get(units)!).slice(startElem, startElem + numElems);
    //   label = `Ionization Energy (${unitsSelection$.get()})`;
    //   break;
    // case 'weighted-ionization-energy':
    //   data = weightedIonizationEnergy.map(e => e * conversions.get(units)!).slice(startElem, startElem + numElems);;
    //   label = `Weighted Ionization Energy (${unitsSelection$.get()})`;
    //   break;
    case 'z':  // nuclear charge
      data = Array.from({ length: numElems }, (_, i) => startElem + i + 1);
      label = `Nuclear Charge`;
      break;
    case 'amass': // atomic mass
      data = elements.map(el => el.aMass);
      label = "Atomic mass";
      break;
    // case 'Zi': // effective nuclear charge
    //   data = getZisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
    //   label = `Effective Nuclear Charge for ${eLevels[orbitalChosen]}`;
    //   break;
    // case 'ti': // kinetic energy
    //   data = getTisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
    //   label = `Kinetic Energy for ${eLevels[orbitalChosen]}`;
    //   break;
    // case 'ven': // effective nuclear charge / Z
    //   const Z = Array.from({ length: numElems }, (_, i) => startElem + i + 1);
    //   data = getVisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
    //   label = `Electron-nuclear attraction for ${eLevels[orbitalChosen]}`;
    //   break;
    // case 'vaoe': // orbital energy
    //   data = getVAOEsForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
    //   label = `Orbital Energy for ${eLevels[orbitalChosen]}`;
    //   break;
    // case 'rmax':
    //   data = getRmaxForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen);
    //   label = `Max Atomic Size for ${eLevels[orbitalChosen]}`;
    //   break;

    default:
      console.error("Unknown graph option choice: ", valueChosenToGraph);
      break;
  }
  return { data, label };
}

drawGraph();