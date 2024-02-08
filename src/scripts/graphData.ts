import { Chart } from "chart.js/auto";
import { selectedElement$, unitsSelection$ } from "./stores";
import { conversions, energyToUnitsAsString } from "./utils";

//https://doi.org/10.1016/j.cplett.2012.07.072
//https://doi.org/10.1002/chem.201602949
const atomicSize =
  [1.00, 0.57, 3.10, 2.05, 1.54, 1.22, 1.00, 0.85, 0.73, 0.65, 3.39, 2.59, 2.29, 1.99, 1.74, 1.55, 1.40, 1.27];

//https://cccbdb.nist.gov/pollistx.asp
const polarizability =
  [4.50, 1.41, 164.19, 37.79, 20.45, 11.88, 7.42, 5.41, 3.76, 2.57, 162.70, 71.53, 56.28, 36.31, 24.50, 19.57, 14.71, 11.23];

//https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html
const unweightedIonizationEnergy =
  [0.49973, 0.90357, 0.198142, 0.342603, 0.304947, 0.413808, 0.53412, 0.500454, 0.640277, 0.792482, 0.188858, 0.280994, 0.219973, 0.299569, 0.385379, 0.380723, 0.476552, 0.579155];

const weightedIonizationEnergy =
  [0.49973, 0.967795, 0.198142, 0.337283, 0.437215, 0.543986, 0.654002, 0.757922, 0.864757, 0.973539, 0.188858, 0.277843, 0.326223, 0.379004, 0.433465, 0.48373, 0.536331, 0.589734];

//https://cccbdb.nist.gov/elecaff1x.asp
const electronAffinity =
  [0.027715971, 0, 0.022696014, 0, 0.010280366, 0.046381834, 0, 0.053726774, 0.124995102, 0, 0.020136828, 0, 0.015942444, 0.051063845, 0.027433736, 0.076332127, 0.132765158, 0];


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

// This is run once when the window loads (i.e., from "main").
export function drawCharts() {

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  const labels = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'];

  const ctx = document.getElementById('atomicSizeChartCanv')! as HTMLCanvasElement;
  atomicSizeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Atomic Size (bohr)`,
        data: [...atomicSize],
        borderWidth: 1,
        pointRadius: calcPointRadius,
      }]
    },
    options,
  });

  const ctx2 = document.getElementById('electronAffinityChartCanv')! as HTMLCanvasElement;
  electronAffinityChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Electron Affinity (${unitsSelection$.get()})`,
        data: [...electronAffinity],
        borderWidth: 1,
        pointRadius: calcPointRadius,
      }]
    },
    options: {
      ...options,
      plugins: {
        title: {
          text: "https://cccbdb.nist.gov/elecaff1x.asp",
          display: true,
          position: "bottom",
        },
      },
    },
  });
  const ctx3 = document.getElementById('polarizabilityChartCanv')! as HTMLCanvasElement;
  polarizabilityChart = new Chart(ctx3, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Polarizability (bohr)`,
        data: [...polarizability],
        borderWidth: 1,
        pointRadius: calcPointRadius,
      }]
    },
    options,
  });
  const ctx4 = document.getElementById('ionizationEnergyChartCanv')! as HTMLCanvasElement;
  ionizationEnergyChart = new Chart(ctx4, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: `Ionization Energy (${unitsSelection$.get()})`,
          data: [...unweightedIonizationEnergy],
          borderWidth: 1,
          pointRadius: calcPointRadius,
        },
      ]
    },
    options: {
      ...options,
      plugins: {
        title: {
          text: ["Kramida, A., Ralchenko, Yu., Reader, J., and NIST ASD Team (2014). NIST Atomic Spectra Database (ver. 5.2),", "[Online]. Available: http://physics.nist.gov/asd [2016, February 22]. National Institute of Standards and Technology, Gaithersburg, MD."],
          display: true,
          position: "bottom",
        },
      },
    },
  });
  const ctx5 = document.getElementById('weightedIonizationEnergyChartCanv')! as HTMLCanvasElement;
  weightedIonizationEnergyChart = new Chart(ctx5, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: `Weighted Ionization Energy (${unitsSelection$.get()})`,
          data: [...weightedIonizationEnergy],
          borderWidth: 1,
          pointRadius: calcPointRadius,
        },
      ]
    },
    options: {
      ...options,
      plugins: {
        title: {
          text: ["Kramida, A., Ralchenko, Yu., Reader, J., and NIST ASD Team (2014). NIST Atomic Spectra Database (ver. 5.2),", "[Online]. Available: http://physics.nist.gov/asd [2016, February 22]. National Institute of Standards and Technology, Gaithersburg, MD."],
          display: true,
          position: "bottom",
        },
      },
    },
  });
}

// The unit selector was changed so update the charts to show using the
// new scale (Ha, Ry, cal, etc.)
function updateChartScales() {

  const unitSelectValue = unitsSelection$.get();
  for (let i = 0; i < electronAffinityChart.data.datasets[0].data.length; i++) {
    electronAffinityChart.data.datasets[0].data[i] = electronAffinity[i] * conversions.get(unitSelectValue)!;
  }
  electronAffinityChart.data.datasets[0].label = `Electron Affinity (${unitSelectValue})`;
  electronAffinityChart.update();

  for (let i = 0; i < ionizationEnergyChart.data.datasets[0].data.length; i++) {
    ionizationEnergyChart.data.datasets[0].data[i] = unweightedIonizationEnergy[i] * conversions.get(unitSelectValue)!;
  }
  ionizationEnergyChart.data.datasets[0].label = `Ionization Energy (${unitSelectValue})`;
  ionizationEnergyChart.update();

  for (let i = 0; i < weightedIonizationEnergyChart.data.datasets[0].data.length; i++) {
    weightedIonizationEnergyChart.data.datasets[1].data[i] = weightedIonizationEnergy[i] * conversions.get(unitSelectValue)!;
  }
  weightedIonizationEnergyChart.data.datasets[1].label = `Weighted Ionization Energy (${unitSelectValue})`;
  weightedIonizationEnergyChart.update();
}

function updateChartsPoints() {
  atomicSizeChart.update();
  electronAffinityChart.update();
  polarizabilityChart.update();
  ionizationEnergyChart.update();
  weightedIonizationEnergyChart.update();
}

// this box appears next to the charts and summarizes the energies
// for the element that has been selected.
function updateEnergiesBox() {

  const unitSelectValue = unitsSelection$.get();

  const atomicNumIndex = selectedElement$.get().selectedElementInfo!.number - 1;
  const een = document.getElementById('energy-element-name')! as HTMLCanvasElement;
  een.innerHTML = "Name: " + selectedElement$.get().selectedElementInfo!.name;
  const eas = document.getElementById('energy-atomic-size')! as HTMLCanvasElement;
  eas.innerHTML = "Atomic Size: " + atomicSize[atomicNumIndex] + " bohr";
  const eea = document.getElementById('energy-electron-affinity')! as HTMLCanvasElement;
  eea.innerHTML = "Electron Affinity: " + energyToUnitsAsString(electronAffinity[atomicNumIndex], unitSelectValue);
  const ep = document.getElementById('energy-polarizability')! as HTMLCanvasElement;
  ep.innerHTML = "Polarizability: " + polarizability[atomicNumIndex] + " bohr";
  const eie = document.getElementById('energy-ionization-energy')! as HTMLCanvasElement;
  eie.innerHTML = "Weighted Ionization: " + energyToUnitsAsString(weightedIonizationEnergy[atomicNumIndex], unitSelectValue);

}

function updateEverything() {
  if (selectedElement$.get().selectedElementInfo === null) {
    return;
  }
  updateChartsPoints();
  updateEnergiesBox();
}

selectedElement$.subscribe(() => updateEverything());
unitsSelection$.subscribe(() => updateEverything());