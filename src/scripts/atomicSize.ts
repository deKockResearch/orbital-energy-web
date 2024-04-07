import { computeZis, waveFunction } from "../scripts/orbitalEnergies";
import { dynamic23Matrix } from "../scripts/matrices";
import { selectedElement$ } from "../scripts/stores";
import { Chart } from "chart.js/auto";
import annotationPlugin from 'chartjs-plugin-annotation';
import type { Orbital } from "./types";


Chart.register(annotationPlugin);

interface DataType {
  x: number;
  y: number;
}

interface CanvAndChart {
  chart: Chart;
  canv: HTMLCanvasElement;
}

let charts: CanvAndChart[] = [];
let allAtomicSizesInOneChart: CanvAndChart;
let showAllGraphsInOneChart = false;

// returns a list of lists of pairs of values, (r, r * r * psi * psi)
function computeAtomicSizes(selElem: any): DataType[][] {
  const result: DataType[][] = [];
  const orbs: Orbital[] = selElem.selectedElemOrbitals;
  if (!orbs) {
    return [];
  }
  const atomicNumber = selElem.selectedElementInfo?.number!;
  const zes = computeZis(atomicNumber, orbs, dynamic23Matrix);
  zes.forEach((ze, index) => {
    const row = [];
    for (let r = 0.0; r < 10.0; r += 0.005) {
      const w = waveFunction(r, orbs[index].level, ze);
      const val = r * r * w * w;
      // If value is basically 0 (and we are not at the beginning) then
      // stop the loop -- good enough.
      if (r > 3 && val < 1e-5) {
        break;
      }
      row.push({ x: r, y: val });
    }
    result.push(row);
  });
  return result;
}

const colors = ['blue', 'red', 'green', 'purple', 'black'];

// This is run once when this code first loads.
// It sets up the atomicSize charts without any data or labels.
export function setupAtomicSizesCharts() {

  const labelObj = {
    type: 'label',
    // color: colors[i],
    position: 'start',
    // Move the label over to the right and down a bit.
    xAdjust: 75,
    yAdjust: -30,
    callout: {
      display: true,
      side: 10,
    },
  };
  const datasetsObj = {
    // borderColor: colors[i],
    label: `select an element`,
    data: [],   // no data until element selected.
    showLine: true,
  };

  // get the canvases for the 5 charts, and create the charts for each.
  //   ** They are all hidden. **
  for (let i = 0; i < 5; i++) {
    const canv = document.getElementById(`atomicSize${i}Canv`)! as HTMLCanvasElement;
    const chart = new Chart(canv, {
      type: 'scatter',
      data: {
        datasets: [datasetsObj],
        // {
        //   // borderColor: colors[i],
        //   label: `select an element`,
        //   data: [],   // no data until element selected.
        //   showLine: true,
        // }],
      },
      options: {
        animation: false,
        plugins: {
          annotation: {
            // @ts-ignore
            annotations: {
              label1: labelObj,
            }
          }
        },
        scales: { y: { beginAtZero: true } }
      },
    });
    charts.push({ canv, chart });
    canv.style.display = 'none';
  }


  //
  // set up the chart where all data is shown, when the user selects that mode.
  //
  const canv = document.getElementById(`allAtomicSizesInOneChartCanv`)! as HTMLCanvasElement;
  allAtomicSizesInOneChart = {
    canv,
    chart: new Chart(canv, {
      type: 'scatter',
      data: {
        datasets: [datasetsObj, datasetsObj, datasetsObj, datasetsObj, datasetsObj],
      },
      options: {
        animation: false,
        plugins: {
          annotation: {
            // @ts-ignore
            annotations: {
              label1: labelObj,
              label2: labelObj,
              label3: labelObj,
              label4: labelObj,
              label5: labelObj,
            }
          }
        },
        scales: { y: { beginAtZero: true } }
      },
    })
  };

  // don't show anything, initially
  allAtomicSizesInOneChart.canv.style.display = 'none';
}

function updateAtomicSizeCharts(symbol: string, res: DataType[][]) {

  charts.forEach(c => {
    c.canv.style.display = 'none';
    c.chart.data.datasets = [];
    c.chart.update();
  });
  allAtomicSizesInOneChart.canv.style.display = 'none';
  allAtomicSizesInOneChart.chart.data.datasets = [];
  // @ts-ignore
  allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label1.display = false;
  // @ts-ignore
  allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label2.display = false;
  // @ts-ignore
  allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label3.display = false;
  // @ts-ignore
  allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label4.display = false;
  // @ts-ignore
  allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label5.display = false;
  allAtomicSizesInOneChart.chart.update();

  const orbs: Orbital[] = selectedElement$.get().selectedElemOrbitals!;

  // Save the max of the maxes when putting them on the same chart. We use that
  // to make the chart be 10% bigger than the max max, so that the label stays on the
  // chart.
  let maxOfAll5Graphs = -1;
  orbs.forEach((orb, index) => {
    const chartData = {
      data: res[index],
      label: `${symbol} ${orb.level}${orb.sOrP}`,
      borderColor: colors[index],
      showLine: true,
    };
    if (showAllGraphsInOneChart) {
      allAtomicSizesInOneChart.canv.style.display = 'block';
      allAtomicSizesInOneChart.chart.data.datasets[index] = chartData;
    } else {
      charts[index].canv.style.display = 'block';
      charts[index].chart.data.datasets.push(chartData);
    }

    // Find the max y value in res, so we can label that value
    // on the chart.
    const maxVal = res[index].reduce((acc: DataType, curr: DataType) => {
      return curr.y > acc.y ? curr : acc;
    });

    if (showAllGraphsInOneChart) {
      if (index === 0) {
        // @ts-ignore
        allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label1 = {
          // @ts-ignore
          ...allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label1,
          content: `Max value at (${maxVal.x.toFixed(3)}, ${maxVal.y.toFixed(5)})`,
          xValue: maxVal.x,
          yValue: maxVal.y,
          display: true,
          color: colors[index],
        };
      } else if (index === 1) {
        // @ts-ignore
        allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label2 = {
          // @ts-ignore
          ...allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label2,
          content: `Max value at (${maxVal.x.toFixed(3)}, ${maxVal.y.toFixed(5)})`,
          xValue: maxVal.x,
          yValue: maxVal.y,
          display: true,
          color: colors[index],
        };
      } else if (index === 2) {
        // @ts-ignore
        allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label3 = {
          // @ts-ignore
          ...allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label3,
          content: `Max value at (${maxVal.x.toFixed(3)}, ${maxVal.y.toFixed(5)})`,
          xValue: maxVal.x,
          yValue: maxVal.y,
          display: true,
          color: colors[index],
        };
      } else if (index === 3) {
        // @ts-ignore
        allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label4 = {
          // @ts-ignore
          ...allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label4,
          content: `Max value at (${maxVal.x.toFixed(3)}, ${maxVal.y.toFixed(5)})`,
          xValue: maxVal.x,
          yValue: maxVal.y,
          display: true,
          color: colors[index],
        };
      } else if (index === 4) {
        // @ts-ignore
        allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label5 = {
          // @ts-ignore
          ...allAtomicSizesInOneChart.chart.options.plugins!.annotation!.annotations!.label5,
          content: `Max value at (${maxVal.x.toFixed(3)}, ${maxVal.y.toFixed(5)})`,
          xValue: maxVal.x,
          yValue: maxVal.y,
          display: true,
          color: colors[index],
        };
      }
      if (maxVal.y > maxOfAll5Graphs) {
        maxOfAll5Graphs = maxVal.y;
        allAtomicSizesInOneChart.chart.options.scales!.y!.suggestedMax = maxVal.y * 1.1;  // 10%
      }
    } else {
      // show each graph in a separate chart.
      charts[index].chart.options.plugins!.annotation!.annotations! = {
        label1: {
          // @ts-ignore
          ...charts[index].chart.options.plugins!.annotation!.annotations!.label1,
          content: `Max value at (${maxVal.x.toFixed(3)}, ${maxVal.y.toFixed(5)})`,
          xValue: maxVal.x,
          yValue: maxVal.y,
          display: true,
        }
      };
      charts[index].chart.options.scales!.y!.suggestedMax = maxVal.y * 1.1;  // 10%
      charts[index].chart.update();
    }
  });
  allAtomicSizesInOneChart.chart.update();
}

// When selected element changes...
selectedElement$.listen((selElem) => {
  if (!selElem || !selElem.selectedElementInfo) {
    return;
  }
  const res = computeAtomicSizes(selElem);
  updateAtomicSizeCharts(selElem.selectedElementInfo!.symbol, res);
});

// Run this on initial load of this code.
setupAtomicSizesCharts();

// Set up handling of radio buttons for choosing whether to show all graphs in
// one chart or in multile charts.
const inputs = document.querySelectorAll('input[name=graph_display]');
inputs.forEach((i) => {
  i.addEventListener('change', (event) => {

    // @ts-ignore
    showAllGraphsInOneChart = event!.target!.value === 'together';

    const selElem = selectedElement$.get();
    if (!selElem || !selElem.selectedElementInfo) {
      return;
    }
    const res = computeAtomicSizes(selElem);
    updateAtomicSizeCharts(selElem.selectedElementInfo!.symbol, res);
  });
});
