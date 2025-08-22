import { Chart, type ScatterDataPoint } from "chart.js/auto";
// import { conversions } from "./utils";

import { eLevels } from "./types";
import { elements, numElemsInPeriodicTableRows, startElemInPeriodicTableRows } from "./elements";
import { getZisForRowOfElementsAndOrbital } from "./orbitalEnergies";

const dataFromExcelSheet = JSON.parse(document.getElementById('excel-data')!.dataset.excelsheet!);

// For some reason, in Firefox, if I don't explicitly uncheck the radio boxes, the selected
// values from previously are still displayed.
Array.from(document.getElementsByTagName('input')).forEach(x => {
  x.checked = false;
})


let chart: Chart;

let xGraphChoice = '';
let yGraphChoice = '';

const elemLabels = elements.map(el => el.symbol);

// This is for when the user has to pick Guerra or Slater or RDK sub-choices.
const ySubChoice = document.getElementById('y-subchoice')!;

const yradioInputs = document.querySelectorAll('.y-menu.radio-collection input');
for (let ri of yradioInputs) {
  ri.addEventListener('click', (event: Event) => {
    const targ: any = event.target!;
    yGraphChoice = targ.value;
    ySubChoice.style.display = (yGraphChoice === 'effnuccharge') ? 'block' : 'none';
    drawGraph();
  });
}

const xradioInputs = document.querySelectorAll('.x-menu.radio-collection input');
for (let ri of xradioInputs) {
  ri.addEventListener('click', (event: Event) => {
    const targ: any = event.target!;
    xGraphChoice = targ.value;
    drawGraph();
  });
}

const lowerBoundSelection = document.getElementById('lower-bound')! as HTMLSelectElement;
const upperBoundSelection = document.getElementById('upper-bound')! as HTMLSelectElement;

// Redraw the graph when user changes the range of values to be graphed.
lowerBoundSelection.addEventListener('change', () => {
  drawGraph();
});
upperBoundSelection.addEventListener('change', drawGraph);

const zeffCheckboxes = Array.from(document.getElementsByClassName("y-zeff-checkbox"));
zeffCheckboxes.forEach((ch) => {
  ch.addEventListener('change', () => updateChecked(ch as HTMLInputElement));
});

const selectedZeffCheckboxes = new Set<string>();

function updateChecked(ch: HTMLInputElement) {
  if (ch.checked) {
    selectedZeffCheckboxes.add(ch.id);
  } else {
    selectedZeffCheckboxes.delete(ch.id);
  }
  drawGraph();
}

function method2Formal(method: string) {
  switch (method) {
    case 'guerra': return 'Guerra';
    case 'slater': return 'Slater';
    case 'rdk': return 'DeKock';
  }
}


export function drawGraph() {

  // the + is a trick to convert string to number.
  const startElem = +lowerBoundSelection.value - 1;
  const numElems = +upperBoundSelection.value - startElem;
  console.log(`selction from ${startElem} for numElems: ${numElems}`);

  if (chart) {
    chart.destroy();
  }

  // xData will only be one array of values.
  const xdataAndLabel = getValuesAndLabel(xGraphChoice, startElem, numElems);
  if (xdataAndLabel.length === 0) {
    return;
  }
  const xData = xdataAndLabel[0].data;
  const xLabel = xdataAndLabel[0].label;

  // yData could be multiple arrays of values, e.g., if user chooses multiple Zeff's.
  const ydataAndLabel = getValuesAndLabel(yGraphChoice, startElem, numElems);

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
          text: ydataAndLabel[0].label,
          display: true,
        }
      }
    },
  };

  // Merge xData values and yData values.
  // console.log('ydata = ', ydataAndLabel);

  if (ydataAndLabel[0].data.length === 0) {
    return;
  }

  const data: ScatterDataPoint[][] = ydataAndLabel.map((ydAndL) => {
    return ydAndL.data.map((y, i) => ({ x: xData[i], y }));
  });
  const yLabels = ydataAndLabel.map(ydAndL => ydAndL.label);

  // https://www.youtube.com/watch?v=PNbDrDI97Ng
  const dataLabels = {
    id: 'dataLabels',
    afterDatasetsDraw: (chart: Chart) => {
      const { ctx } = chart;
      ctx.save();
      ctx.font = "12px sans-serif";
      for (let numDataSet = 0; numDataSet < chart.getVisibleDatasetCount(); numDataSet++) {
        for (let i = 0; i < data[0].length; i++) {
          // Add labels to each point, above and slightly to the right.
          ctx.fillText(((chart.config.data.labels!) as string[])[i],
            chart.getDatasetMeta(numDataSet).data[i].x,
            chart.getDatasetMeta(numDataSet).data[i].y - 10);
        }
      }
      ctx.restore();
    },
  };

  const ctx = document.getElementById('chart2-canv')! as HTMLCanvasElement;

  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels: elemLabels.slice(startElem, startElem + numElems),
      datasets:
        data.map((values: ScatterDataPoint[], index: number) => {
          return {
            data: [...values],
            borderWidth: 1,
            label: `${xLabel} vs ${yLabels[index]}`,
          };
        })
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

function getValuesAndLabel(valueChosenToGraph: string, startElem: number, numElems: number): { data: number[], label: string }[] {
  let data: number[][] = [];
  let labels: string[] = [];
  if (valueChosenToGraph === "") {
    return [{ data: [], label: '' }];
  }
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
      // Array containing 0, 1, 2, 3, 4, 5, ... , 118.
      data = [Array.from({ length: 118 }, (_, i) => i)];
      labels = [`Nuclear Charge`];
      break;
    case 'amass': // atomic mass
      data = [elements.map(el => el.aMass)];
      labels = ["Atomic mass"];
      break;
    case 'effnuccharge': // effective nuclear charge
      if (selectedZeffCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      selectedZeffCheckboxes.keys().forEach((checkbox: string, index: number) => {

        // checkbox has the format of <method>-<orbital>. Need to convert to
        // Zeff - method orbital
        const [method, orbital] = checkbox.split('-');
        const methodAndOrb = `${checkbox.split('-')[0]} ${checkbox.split('-')[1]}`;
        labels.push(`Effective Nuclear Charge for ${orbital} - ${method2Formal(method)}`);

        const fieldname = `Zeff - ${methodAndOrb}`;
        // Push on an array of numbers
        data.push(dataFromExcelSheet.map((d: { [fieldname: string]: number }) => d[fieldname] || undefined));
      });

      break;
    // case 'ti': // kinetic energy
    //   data = getTisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
    //   label = `Kinetic Energy for ${ eLevels[orbitalChosen]}`;
    //   break;
    // case 'ven': // effective nuclear charge / Z
    //   const Z = Array.from({ length: numElems }, (_, i) => startElem + i + 1);
    //   data = getVisForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
    //   label = `Electron - nuclear attraction for ${ eLevels[orbitalChosen]}`;
    //   break;
    // case 'vaoe': // orbital energy
    //   data = getVAOEsForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen).map(e => e * conversions.get(units)!);
    //   label = `Orbital Energy for ${ eLevels[orbitalChosen]}`;
    //   break;
    // case 'rmax':
    //   data = getRmaxForRowOfElementsAndOrbital(startElem, numElems, orbitalChosen);
    //   label = `Max Atomic Size for ${ eLevels[orbitalChosen]}`;
    //   break;
    case 'density':
      data = [elements.map(el => +el.density)];
      labels = ["Density"];
      break;
    case 'melting':
      data = [elements.map(el => +el.meltingPoint)];
      labels = ["Melting Point"];
      break;
    case 'boiling':
      data = [elements.map(el => +el.boilingPoint)];
      labels = ["Boiling Point"];
      break;

    default:
      console.error("Unknown graph option choice: ", valueChosenToGraph);
      break;
  }

  return data.map((valuesArr, i) => ({
    data: valuesArr.slice(startElem, startElem + numElems),
    label: labels[i],
  }));
}

drawGraph();