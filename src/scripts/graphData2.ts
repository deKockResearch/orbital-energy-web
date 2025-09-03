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

// Helper to handle checkbox selection and set management
function setupCheckboxSet(className: string) {
  const checkboxes = Array.from(document.getElementsByClassName(className));
  const selectedSet = new Set<string>();
  let prevBtn: HTMLInputElement | null = null;
  function recordSelection(ch: HTMLInputElement) {
    // @ts-ignore
    if (ch.checked) {
      selectedSet.add(ch.id);
      // Radio btn change event fires when a radio button is clicked,
      // but not when it is unclicked when another radio button in
      // the group was selected. So, we have to check if we had another
      // button clicked previously and if so, remove that previous one from
      // our 'clicked' set.
      if (ch.type === 'radio' && prevBtn) {
        selectedSet.delete(prevBtn.id);
      }
    } else {
      selectedSet.delete(ch.id);
    }
    // remember the previous one.
    if (prevBtn !== ch) {
      prevBtn = ch;
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
    atomicRadSubchoiceCheckboxes: setupCheckboxSet("x-atomicrad-checkbox")
  },
  y: {
    methodAndOrbSubchoiceCheckboxes: setupCheckboxSet("y-method-and-orbital-subchoice-checkbox"),
    ionizationSubchoiceCheckboxes: setupCheckboxSet("y-ionization-checkbox"),
    electroNegSubchoiceCheckboxes: setupCheckboxSet("y-electro-neg-checkbox"),
    atomicRadSubchoiceCheckboxes: setupCheckboxSet("y-atomicrad-checkbox")
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
  const lowerBoundSlider = document.getElementById('fromInput')! as HTMLInputElement;
  const upperBoundSlider = document.getElementById('toInput')! as HTMLInputElement;

  const startElem = +lowerBoundSlider.value - 1;
  const numElems = +upperBoundSlider.value - startElem;

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

  // yData could be multiple arrays of values, e.g., if user chooses multiple Zeff's.
  const ydataAndLabel = getValuesAndLabel('y', yGraphChoice, startElem, numElems);
  if (ydataAndLabel.length === 0) {
    return;
  }

  function yChoice2yLabel(): string {
    switch (yGraphChoice) {
      case 'z':
        return "Nuclear Charge";
      case 'amass':
        return "Atomic mass";
      case 'effnuccharge':
        return "Effective Nuclear Charge";
      case 'orbrad':
        return "Orbital Radius";
        break;
      case 'atomrad':
        return "Atomic Radius";
      case 'ke':
        return "Kinetic Energy";
      case 'pe':
        return "Potential Energy";
      case 'te':
        return "Total Energy";
      case 'ie':
        return "Ionization Energy";
      case 'electroneg':
        return "Electronegativity";
      case 'density':
        return "Density";
      case 'melting':
        return "Melting Point";
      case 'boiling':
        return "Boiling Point";
      default:
        return "";
    }
  }

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
          text: yChoice2yLabel(),
          display: true,
        }
      }
    },
  };

  // Merge xData values and yData values.
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

  function getMethodAndOrbDataFromSpreadSheetData(labelPrefix: string, fieldNamePrefix: string) {
    checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.keys().forEach((checkbox: string, index: number) => {
      // checkbox has the format of <method>-<orbital>. Need to convert to:
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
      data = [Array.from({ length: 118 }, (_, i) => i + 1)];
      labels = [`Nuclear Charge`];
      break;
    case 'amass': // atomic mass
      data = [elements.map(el => el.aMass)];
      labels = ["Atomic mass"];
      break;
    case 'effnuccharge': // effective nuclear charge
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getMethodAndOrbDataFromSpreadSheetData('Effective Nuclear Charge', 'Zeff');
      break;

    case 'orbrad': // Orbital radius
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getMethodAndOrbDataFromSpreadSheetData('Orbital Radius', 'Rp');
      break;

    case 'atomrad': // Atomic radius
      if (checkboxElems[xOry].atomicRadSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      checkboxElems[xOry].atomicRadSubchoiceCheckboxes.keys().forEach((checkbox: string, index: number) => {

        // checkbox has the format 'Van der Walls-atomicrad-checkbox', etc. Everything before the - is
        // directly in the name of the field in the JSON structure.
        const checkboxValue = checkbox.split('-')[0];

        // In the JSON with the values, the fieldnames are like this:
        // Rp - R0.001/Rahm
        // Rp - Van der Waals
        // Rp - Metallic

        labels.push(`Atomic Radius: ${checkboxValue} (pm)`);

        // Name in the json structure extracted from the excel spreadsheeet
        const fieldname = `Rp - ${checkboxValue}`;

        // Push on an array of numbers
        data.push(dataFromExcelSheet.map((d: { [fieldname: string]: number }) => d[fieldname] || undefined));
      });
      break;

    case 'ke': // kinetic energy
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getMethodAndOrbDataFromSpreadSheetData('Kinetic Energy', 'KE');
      break;

    case 'pe': // potential energy
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getMethodAndOrbDataFromSpreadSheetData('Potential Energy', 'PE');
      break;
    case 'te': // total energy
      if (checkboxElems[xOry].methodAndOrbSubchoiceCheckboxes.size === 0) {
        return [{ data: [], label: '' }];
      }
      getMethodAndOrbDataFromSpreadSheetData('Total Energy', 'TE');
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





// -------------------------------------------------------
// Double-thumb slider in JavaScript:
// https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816

// Didn't get this to work, on my first try.
// https://medium.com/@code.sachin/making-sense-of-debouncing-in-javascript-input-change-9a91d02738b6

const debounce = (callback: any, waitTime: number) => {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, waitTime);
  };
}

function controlFromInput(fromSlider: HTMLInputElement, fromInput: HTMLInputElement, toInput: HTMLInputElement, controlSlider: HTMLInputElement) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
  if (from > to) {
    fromSlider.value = String(to);
    fromInput.value = String(to);
  } else {
    fromSlider.value = String(from);
  }
  drawGraph();
}

function controlToInput(toSlider: HTMLInputElement, fromInput: HTMLInputElement,
  toInput: HTMLInputElement, controlSlider: HTMLInputElement) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
  setToggleAccessible(toInput);
  if (from <= to) {
    toSlider.value = String(to);
    toInput.value = String(to);
  } else {
    toInput.value = String(from);
  }
  drawGraph();
}

function controlFromSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, fromInput: HTMLInputElement) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = String(to);
    fromInput.value = String(to);
  } else {
    fromInput.value = String(from);
  }
  drawGraph();
}

function controlToSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, toInput: HTMLInputElement) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, 'black', '#25daa5', toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = String(to);
    toInput.value = String(to);
  } else {
    toInput.value = String(from);
    toSlider.value = String(from);
  }
  drawGraph();
}

function getParsed(currentFrom: HTMLInputElement, currentTo: HTMLInputElement) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from: HTMLInputElement, to: HTMLInputElement,
  sliderColor: string, rangeColor: string, controlSlider: HTMLInputElement) {
  // @ts-ignore
  const rangeDistance = to.max - to.min;
  // @ts-ignore
  const fromPosition = from.value - to.min;
  // @ts-ignore
  const toPosition = to.value - to.min;
  controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%,
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%,
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget: HTMLInputElement) {
  const toSlider: HTMLInputElement = document.querySelector('#toSlider')!;
  if (Number(currentTarget.value) <= 0) {
    toSlider.style.zIndex = String(2);
  } else {
    toSlider.style.zIndex = String(0);
  }
}

const fromSlider = document.querySelector('#fromSlider')! as HTMLInputElement;
const toSlider = document.querySelector('#toSlider')! as HTMLInputElement;
const fromInput = document.querySelector('#fromInput')! as HTMLInputElement;
const toInput = document.querySelector('#toInput')! as HTMLInputElement;
fillSlider(fromSlider, toSlider, 'black', '#25daa5', toSlider)!;
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
