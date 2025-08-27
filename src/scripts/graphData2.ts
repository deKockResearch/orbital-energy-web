import { Chart, type ScatterDataPoint } from "chart.js/auto";
import { elements } from "./elements";
import { displaySubChoice } from "./graphSubChoice";

const dataFromExcelSheet = JSON.parse(document.getElementById('excel-data')!.dataset.excelsheet!);

// For some reason, in Firefox, if I don't explicitly uncheck the radio boxes, the selected
// values from previously are still displayed.
Array.from(document.getElementsByTagName('input')).forEach(x => {
  x.checked = false;
})


let chart: Chart;

export let xGraphChoice = '';
export let yGraphChoice = '';

const elemLabels = elements.map(el => el.symbol);

// This is for when the user has to pick Guerra or Slater or RDK sub-choices.
const ySubChoice = document.getElementById('y-method-and-orbital-subchoice')!;

const yradioInputs = document.querySelectorAll('.y-menu.radio-collection input');
for (let ri of yradioInputs) {
  ri.addEventListener('click', (event: Event) => {
    const targ: any = event.target!;
    yGraphChoice = targ.value;
    displaySubChoice("y", yGraphChoice);
    drawGraph();
  });
}

const xradioInputs = document.querySelectorAll('.x-menu.radio-collection input');
for (let ri of xradioInputs) {
  ri.addEventListener('click', (event: Event) => {
    const targ: any = event.target!;
    xGraphChoice = targ.value;
    displaySubChoice("x", xGraphChoice)
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

// Helper to handle checkbox selection and set management
function setupCheckboxSet(className: string) {
  const checkboxes = Array.from(document.getElementsByClassName(className));
  const selectedSet = new Set<string>();
  function recordSelection(ch: HTMLInputElement) {
    if (ch.checked) {
      selectedSet.add(ch.id);
    } else {
      selectedSet.delete(ch.id);
    }
    drawGraph();
  }
  checkboxes.forEach((ch) => {
    ch.addEventListener('change', () => recordSelection(ch as HTMLInputElement));
  });
  return selectedSet;
}

// Some of these are actually radio boxes... but... whatever!
const checkboxElems = {
  x: {
    methodAndOrbSubchoiceCheckboxes: setupCheckboxSet("x-method-and-orbital-subchoice-checkbox"),
    ionizationSubchoiceCheckboxes: setupCheckboxSet("x-ionization-checkbox"),
    electroNegSubchoiceCheckboxes: setupCheckboxSet("x-electro-neg-checkbox"),
  },
  y: {
    methodAndOrbSubchoiceCheckboxes: setupCheckboxSet("y-method-and-orbital-subchoice-checkbox"),
    ionizationSubchoiceCheckboxes: setupCheckboxSet("y-ionization-checkbox"),
    electroNegSubchoiceCheckboxes: setupCheckboxSet("y-electro-neg-checkbox"),
  }
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
  const xdataAndLabel = getValuesAndLabel('x', xGraphChoice, startElem, numElems);
  if (xdataAndLabel.length === 0) {
    return;
  }
  const xData = xdataAndLabel[0].data;
  const xLabel = xdataAndLabel[0].label;

  console.log('xdataAndLabel = ', xdataAndLabel);

  // yData could be multiple arrays of values, e.g., if user chooses multiple Zeff's.
  const ydataAndLabel = getValuesAndLabel('y', yGraphChoice, startElem, numElems);
  if (ydataAndLabel.length === 0) {
    return;
  }

  console.log('ydataAndLabel = ', ydataAndLabel);

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


function getValuesAndLabel(xOry: 'x' | 'y', valueChosenToGraph: string, startElem: number, numElems: number): { data: number[], label: string }[] {
  let data: number[][] = [];
  let labels: string[] = [];

  function getDataFromSpreadSheetData(labelPrefix: string, fieldNamePrefix: string) {
    checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.keys().forEach((checkbox: string, index: number) => {
      console.log('getting data for key ', checkbox);

      // checkbox has the format of <method>-<orbital>. Need to convert to
      // Rp - method orbital
      const [method, orbital] = checkbox.split('-');
      const methodAndOrb = `${checkbox.split('-')[0]} ${checkbox.split('-')[1]}`;
      labels.push(`${labelPrefix} for ${orbital} - ${method2Formal(method)}`);

      const fieldname = `${fieldNamePrefix} - ${methodAndOrb}`;
      // Push on an array of numbers
      data.push(dataFromExcelSheet.map((d: { [fieldname: string]: number }) => d[fieldname] || undefined));
    });
  }

  if (valueChosenToGraph === "") {
    return [{ data: [], label: '' }];
  }


  switch (valueChosenToGraph) {
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
      console.log('for effnuccharge: size of checkboxes set is ', checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size);
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getDataFromSpreadSheetData('Effective Nuclear Charge', 'Zeff');
      break;

    case 'atomrad': // Atomic radius (Rp)
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getDataFromSpreadSheetData('Atomic Radius', 'Rp');
      break;

    case 'ke': // kinetic energy
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getDataFromSpreadSheetData('Kinetic Energy', 'KE');
      break;

    case 'pe': // potential energy
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getDataFromSpreadSheetData('Potential Energy', 'PE');
      break;
    case 'te': // total energy
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getDataFromSpreadSheetData('Total Energy', 'TE');
      break;

    case 'ie':   // ionization energy
      if (checkboxElems[xOry].ionizationSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      checkboxElems[xOry].ionizationSubchoiceCheckboxes.keys().forEach((checkbox: string, index: number) => {
        // checkbox has the format '1st-ionization-checkbox', '2nd-ionization-checkbox', etc. Remove the latter part.
        const checkboxValue = checkbox.split('-')[0];

        // Name in the json structure extracted from the excel spreadsheeet
        const fieldname = `Ionization Energy: ${checkboxValue}`;
        labels.push(`${fieldname} Ionization (eV)`);

        // Push on an array of numbers
        data.push(dataFromExcelSheet.map((d: { [fieldname: string]: number }) => d[fieldname] || undefined));
      });
      break;
    case 'electroneg':
      if (checkboxElems[xOry].electroNegSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      checkboxElems[xOry].electroNegSubchoiceCheckboxes.keys().forEach((checkbox: string, index: number) => {
        // checkbox has the format 'y-<method>-electro-neg-checkbox'.
        const checkboxValue = checkbox.split('-')[1];
        const methodName = (checkboxValue === 'tAndO') ? 'Tantardini and Oganov' : 'Pauling\'s';

        // Name in the json structure extracted from the excel spreadsheeet
        const fieldname = methodName + ' Electronegativity';
        labels.push(`${methodName} Electronegativity`);

        // Push on an array of numbers
        data.push(dataFromExcelSheet.map((d: { [fieldname: string]: number }) => d[fieldname] || undefined));
      });
      break;
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
    case 'polarizability':


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