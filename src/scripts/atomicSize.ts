import { computeZis, waveFunction } from "../scripts/orbitalEnergies";
import { dynamic23Matrix } from "../scripts/matrices";
import { computeEnergiesForDyn23OrFauss, energies$, selectedElement$ } from "../scripts/stores";
import { Chart } from "chart.js/auto";
import annotationPlugin from 'chartjs-plugin-annotation';
import { eLevels, type Orbital } from "./types";


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
function computeAtomicSizes(selElem: any, orbs: Orbital[]): DataType[][] {
  const result: DataType[][] = [];
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

function computeMaxAtomicSizes(selElem: any, orbs: Orbital[]): number[] {
  // return array for each LEVEL (1, 2, 2, 3, 3), containing a value for each e_i.
  const energies = computeEnergiesForDyn23OrFauss('dynamic23', dynamic23Matrix, orbs)
  return orbs.map((orb, index) => {
    // remember 1st item in totalEnergies is the sum, which we don't want.
    // energies[0] uses dynamic23 matrix.
    const energs = energies.totalEnergies[index + 1];
    // just compute for n = 1.
    const rmax_level = orb.level * Math.sqrt(-0.5 / energs);
    return rmax_level;
  });
}

/*
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
            content: `Max value at (${maxVal.x.toFixed(5)}, ${maxVal.y.toFixed(5)})`,
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
            content: `Max value at (${maxVal.x.toFixed(5)}, ${maxVal.y.toFixed(5)})`,
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
            content: `Max value at (${maxVal.x.toFixed(5)}, ${maxVal.y.toFixed(5)})`,
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
            content: `Max value at (${maxVal.x.toFixed(5)}, ${maxVal.y.toFixed(5)})`,
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
            content: `Max value at (${maxVal.x.toFixed(5)}, ${maxVal.y.toFixed(5)})`,
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
            content: `Max value at (${maxVal.x.toFixed(5)}, ${maxVal.y.toFixed(5)})`,
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
*/


/*
// Run this on initial load of this code.
// setupAtomicSizesCharts();

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
    const orbs: Orbital[] | null = selElem.selectedElemOrbitals;
    const res = orbs ? computeAtomicSizes(selElem, orbs) : [];
    // updateAtomicSizeCharts(selElem.selectedElementInfo!.symbol, res);
    });
    });
*/


// When selected element changes...
selectedElement$.listen((selElem) => {
  if (!selElem || !selElem.selectedElementInfo) {
    return;
  }
  // const orbs: Orbital[] | null = selElem.selectedElemOrbitals;
  // const res = orbs ? computeAtomicSizes(selElem, orbs) : [];
  // updateAtomicSizeCharts(selElem.selectedElementInfo!.symbol, res);

  drawAtomicSizes();
});

import p5 from "p5";

function ionSpeciesSuffixes(numSpecies: number): string[] {
  const result = [''];
  for (let i = 1; i < numSpecies; i++) {
    if (i === 1) {
      result.push(`+`);
    } else {
      result.push(`${i}+`);
    }
  }
  return result;
}

// str comes before subStr, and will be written to the canvas at strx, stry. Compute the location
// where the superscript should be written and return that location.
export function computeSuperscriptLocation(p: p5, str: string, strx: number, stry: number, supStr: string): [number, number] {
  const strWidth = p.textWidth(str);
  const rightOfStr = strx + strWidth;
  const strHt = p.textAscent();
  return [rightOfStr, stry - strHt * 0.75];
}

export function drawAtomicSizes(): void {
  let sketch = (p: p5) => {

    // Basic p5 canvas setup
    const CANV_W = 800;
    const CANV_H = 600;
    const COLUMN_W = CANV_W / 5;
    const ROW_H = 120;
    const BOTTOM_OFFSET = 10;
    const LEFT_OFFSET = 50;
    const TOP_OFFSET = 20;
    // const SCALE_Y = (CANV_H - BOTTOM_OFFSET - TOP_OFFSET) / 13;
    const SCALE_Y = ROW_H / 4.0;    // scaling in the rows.

    p.setup = () => {
      p.createCanvas(CANV_W, CANV_H);
      p.noLoop();  // remove interactivity
    };

    const flipYAxis = (y: number) => {
      return CANV_H - y;
    }

    p.draw = () => {
      // draw for reference only.
      // draw axes: horizontal first, then vertical.
      // p.line(0, flipYAxis(0), CANV_W, flipYAxis(0));
      // p.line(0, flipYAxis(0), 0, flipYAxis(CANV_H));

      // draw a line just under the top labels.
      p.line(0, flipYAxis(CANV_H - TOP_OFFSET - 3), CANV_W, flipYAxis(CANV_H - TOP_OFFSET - 3));
      // draw a line just to the right of the left labels.
      p.line(30, flipYAxis(0), 30, flipYAxis(CANV_H));

      p.textStyle(p.BOLD);
      p.textSize(16);
      // draw 1s, 2s, 2p, etc. vertically along the y-axis.
      eLevels.forEach((e, index) => {
        p.text(e, 10, flipYAxis(BOTTOM_OFFSET + index * ROW_H));
      });

      // draw element species along the top.
      const elemSymbol = selectedElement$.get().selectedElementInfo?.symbol!;
      // only showing 5 ion species at most.
      const numSpecies = Math.min(5, selectedElement$.get().selectedElementInfo?.number!);

      // build list of species labels: you take away an eletron each time, so we
      // have B, B+, B2+, B3+, B4+ for Boron.
      const speciesSuffixes = ionSpeciesSuffixes(numSpecies);

      for (let i = 0; i < numSpecies; i++) {
        p.text(elemSymbol, LEFT_OFFSET + COLUMN_W * i, flipYAxis(CANV_H - TOP_OFFSET));
        const supLoc = computeSuperscriptLocation(p, elemSymbol, LEFT_OFFSET + COLUMN_W * i, flipYAxis(CANV_H - TOP_OFFSET), speciesSuffixes[i]);
        p.textSize(12);  // 75% of 16 pt font.
        p.text(speciesSuffixes[i], supLoc[0], supLoc[1]);
        p.textSize(16);
      }

      p.textStyle(p.NORMAL);

      // draw a line for each size, with the size value just above it.
      // the vertical location of the line must be to scale.
      // the vertical scale is 0 to 10. The CANV_H is 600.

      /* loop over the species, and for each species, loop over the orbitals. */
      const orbs: Orbital[] = selectedElement$.get().selectedElemOrbitals!;
      const newOrbitals = orbs.map(a => ({ ...a }));

      // 5 because there are most 5 orbitals: we store the values to
      // draw the dashed lines between the species, and the value to put
      // above the dashed line.
      let lastxs = [0, 0, 0, 0, 0];
      let lastys = [0, 0, 0, 0, 0];
      let lastVals = [0, 0, 0, 0, 0];

      // iterate over speciesSuffixes just cuz it indicates how many there are.
      speciesSuffixes.forEach((_, speciesIndex) => {

        // repeatedly subtract "speciesIndex" electrons from the atom, and then
        // compute the atomic sizes for that species
        if (speciesIndex > 0) {
          // find the last orbital with a non-zero number of electrons.
          let lastOrb = newOrbitals.length - 1;
          while (lastOrb >= 0 && newOrbitals[lastOrb].numElectrons === 0) {
            lastOrb--;
          }
          newOrbitals[lastOrb].numElectrons--;
          if (newOrbitals[lastOrb].numElectrons === 0) {
            newOrbitals.pop();
          }
        }
        // console.log('newOrbits: ', JSON.stringify(newOrbitals, null, 2));
        // const res = computeAtomicSizes(selectedElement$.get(), newOrbitals);
        const res = computeMaxAtomicSizes(selectedElement$.get(), newOrbitals);

        newOrbitals.forEach((orb, index) => {
          // for drawing dashed lines between the species.

          // Find the max y value in res, so we can label that value
          // on the chart, use it for scaling
          // const maxVal = res[index].reduce((acc: DataType, curr: DataType) => {
          //   return curr.y > acc.y ? curr : acc;
          // });
          const value = res[index];
          const label = `${orb.level}${orb.sOrP}`;
          const valueAsString = value.toFixed(3);
          const xloc = LEFT_OFFSET + COLUMN_W * speciesIndex;
          const yloc = (ROW_H * index) + (value * SCALE_Y) + BOTTOM_OFFSET;
          const text_width = p.textWidth(`${valueAsString}`);
          p.text(`${valueAsString}`, xloc, flipYAxis(yloc));
          // draw line under the text with a little space between the text and the line.
          p.line(xloc, flipYAxis(yloc - 4), xloc + text_width, flipYAxis(yloc - 4));

          if (speciesIndex !== 0) {
            // set dashed lines
            p.drawingContext.setLineDash([5, 5]);
            p.line(lastxs[index], lastys[index], xloc, flipYAxis(yloc - 4));
            // no dashed lines anymore
            p.drawingContext.setLineDash([]);
            // write the difference in values.
            const diffText = (lastVals[index] - value).toFixed(3);
            const diffTextWidth = p.textWidth(diffText);
            p.text(diffText, ((lastxs[index] + xloc) / 2) - diffTextWidth / 2, (lastys[index] + flipYAxis(yloc)) / 2 - 4);
          }
          // store ending of the line for the next iteration.
          lastxs[index] = xloc + text_width;
          lastys[index] = flipYAxis(yloc - 4);
          lastVals[index] = value;
        });
      });
    };
  }

  // Display canvas
  const atomicSizeCanvas = document.getElementById("atomicSizeCanvasAttachPoint")!;
  atomicSizeCanvas.replaceChildren();
  new p5(sketch, atomicSizeCanvas);

}

