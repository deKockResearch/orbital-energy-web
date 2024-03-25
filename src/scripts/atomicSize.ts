import { computeZis, waveFunction } from "../scripts/orbitalEnergies";
import { dynamic23Matrix } from "../scripts/matrices";
import { selectedElement$ } from "../scripts/stores";
import { Chart } from "chart.js/auto";
import { atom } from "nanostores";

interface DataType {
  x: number;
  y: number;
}


let atomicSize1Chart: Chart;
let atomicSize2Chart: Chart;
let atomicSize3Chart: Chart;

// returns a list of pairs of values, (r, r * r * psi * psi)
function computeAtomicSizes(selElem: any): DataType[] {
  const result: DataType[] = [];
  const orbs = selElem.selectedElemOrbitals;
  if (!orbs) {
    return [];
  }
  const atomicNumber = selElem.selectedElementInfo?.number!;
  const zes = computeZis(atomicNumber, orbs, dynamic23Matrix);
  for (let r = 0.0; r < 10.0; r += 0.005) {
    const w = waveFunction(r, 1, zes[0]);
    result.push({
      x: r,
      y: r * r * w * w,
    });
  }
  return result;
}

// This is run once when the window loads (i.e., from "main").
// It sets up the atomicSize charts without any data or labels.
export function drawAtomicSizesCharts() {

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const ctx = document.getElementById('atomicSize1Canv')! as HTMLCanvasElement;
  atomicSize1Chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: `select an element`,
        data: [],   // no data until element selected.
        // borderWidth: 1,
      }],
    },
    // // options: {
    //   ...options,
    //   plugins: {
    //     title: {
    //       text: "DeKock 2012",
    //       display: true,
    //       position: "bottom",
    //     },
    //   },
    // },
  });

  // const ctx2 = document.getElementById('atomicSize2Canv')! as HTMLCanvasElement;
  // electronAffinityChart = new Chart(ctx2, {
  //   type: 'line',
  //   data: {
  //     labels,
  //     datasets: [{
  //       label: `Electron Affinity (${unitsSelection$.get()})`,
  //       data: [...electronAffinity],
  //       borderWidth: 1,
  //       pointRadius: calcPointRadius,
  //     }]
  //   },
  //   options: {
  //     ...options,
  //     plugins: {
  //       title: {
  //         text: "https://cccbdb.nist.gov/elecaff1x.asp",
  //         display: true,
  //         position: "bottom",
  //       },
  //     },
  //   },
  // });
}

function updateAtomicSizeCharts(symbol: string, res: DataType[]) {
  atomicSize1Chart.data.datasets[0].data = res;
  atomicSize1Chart.data.datasets[0].label = `${symbol} 1s`;
  atomicSize1Chart.update();
}

selectedElement$.listen((selElem) => {
  if (!selElem || !selElem.selectedElementInfo) {
    return;
  }

  const res = computeAtomicSizes(selElem);
  updateAtomicSizeCharts(selElem.selectedElementInfo!.symbol, res);
});

