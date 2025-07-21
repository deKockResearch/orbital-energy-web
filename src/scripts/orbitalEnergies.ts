import { elements } from "./elements";
import { dynamic23Matrix } from "./matrices";
import { computeEnergiesForDyn23OrFauss } from "./stores";
import { type Orbital } from "./types";


export function computeOrbitals(eConfigStr: string): Orbital[] {
  const res: Orbital[] = [];
  const groups = eConfigStr.split(" ");
  for (const group of groups) {
    const re = /(\d+)([spdf])(\d+)/;
    const matches = group.match(re)!;
    res.push({
      level: Number(matches[1]),
      sOrP: matches[2],
      numElectrons: Number(matches[3]),
    });
  }
  return res;
}

// compute the orbital energies and the total. The result is an array of numbers:
// total energy, following by energies for each orbital.
export function totalOrbitalEnergy(atomicNumber: number, orbitalList: Orbital[], mx: number[][]) {

  let energy = 0;
  let energyArray = [];
  for (let i = 0; i < orbitalList.length; i++) {
    let n_i = orbitalList[i].level;
    let N_i = orbitalList[i].numElectrons;

    let Z_i = atomicNumber;
    for (let j = 0; j < orbitalList.length; j++) {
      Z_i -= (orbitalList[j].numElectrons - (i === j ? 1 : 0)) * mx[i][j];
    }
    energyArray.push(0 - (Z_i * Z_i) / (2 * n_i * n_i));
    energy -= N_i * ((Z_i * Z_i) / (2 * n_i * n_i));
  }

  energyArray = [energy, ...energyArray];
  return energyArray;
}

interface EnergyComponentsReturnType {
  t_i: number[],
  v_i: number[],
  v_ij: number[][],
  capV_ij: number[][]
}

export function energyComponents(atomicNumber: number, orbs: Orbital[], mx: number[][]) {
  let result: EnergyComponentsReturnType = {
    t_i: [],
    v_i: [],
    v_ij: [],
    capV_ij: []
  };

  const Zlst = computeZis(atomicNumber, orbs, mx);

  for (let i = 0; i < orbs.length; i++) {
    let n_i = orbs[i].level;
    result.t_i.push((Zlst[i] * Zlst[i]) / (2 * n_i * n_i));
    result.v_i.push(0 - (atomicNumber * Zlst[i]) / (n_i * n_i));
  }

  for (let i in Zlst) {
    const n_i = orbs[i].level;

    const capV_js: number[] = [];
    const v_js: number[] = [];
    for (let j in Zlst) {
      const n_j = orbs[j].level;
      v_js.push((Zlst[i] * mx[i][j]) / (n_i * n_i));
      capV_js.push(
        (Zlst[i] * mx[i][j]) / (n_i * n_i) + (Zlst[j] * mx[j][i]) / (n_j * n_j)
      );
    }
    result.v_ij.push(v_js);
    result.capV_ij.push(capV_js);
  }
  // console.log('energyCompoenonts: ');
  // console.table(result.v_ij);
  return result;
}

export function computeZis(atomicNumber: number, orbsList: Orbital[], mx: number[][]) {

  let Zlst = [];
  for (let i = 0; i < orbsList.length; i++) {
    let Z_i = atomicNumber;
    for (let j = 0; j < orbsList.length; j++) {
      Z_i -= (orbsList[j].numElectrons - (i === j ? 1 : 0)) * mx[i][j];
    }
    Zlst.push(Z_i);
  }
  return Zlst;
}


const factorials = [0, 1, 2, 6, 24, 120, 720];

// n will always be 1, 2, or 3.
function computeNormalizationConstant(ze: number, n: number) {
  return ((2 * ze / n) ** n) * Math.sqrt((2 * ze / n) / factorials[2 * n]);
}

// compute psi -- the wave function.
export function waveFunction(radius: number, n: number, ze: number) {
  return computeNormalizationConstant(ze, n) * (radius ** (n - 1)) * Math.E ** (-1 * ze * radius / n);
}


export function getValuesForRowOfElementsAndOrbital(startElem: number, numElems: number, orbIndex: number,
  func: (atomicNumber: number) => number[]) {
  let values = [];
  for (let i = startElem; i < startElem + numElems; i++) {
    values.push(func(i)[orbIndex]);
  }
  return values;
}

export function getZisForRowOfElementsAndOrbital(startElem: number, numElems: number, orbIndex: number) {
  return getValuesForRowOfElementsAndOrbital(startElem, numElems, orbIndex,
    (i) => {
      return computeZis(elements[i].number, computeOrbitals(elements[i].eConfig), dynamic23Matrix);
    });
}


// get the t_i's for a row of elements and a given orbital.
export function getTisForRowOfElementsAndOrbital(startElem: number, numElems: number, orbIndex: number) {
  return getValuesForRowOfElementsAndOrbital(startElem, numElems, orbIndex,
    (i) => {
      const energyComps = energyComponents(elements[i].number, computeOrbitals(elements[i].eConfig), dynamic23Matrix);
      return energyComps.t_i;
    });
}


// get the v_i's for a row of elements and a given orbital.
export function getVisForRowOfElementsAndOrbital(startElem: number, numElems: number, orbIndex: number) {
  return getValuesForRowOfElementsAndOrbital(startElem, numElems, orbIndex,
    (i) => {
      const energyComps = energyComponents(elements[i].number, computeOrbitals(elements[i].eConfig), dynamic23Matrix);
      return energyComps.v_i;
    });
}

// get the vaoe's for a row of elements and a given orbital.
export function getVAOEsForRowOfElementsAndOrbital(startElem: number, numElems: number, orbIndex: number) {
  return getValuesForRowOfElementsAndOrbital(startElem, numElems, orbIndex,
    (i) => {
      const [totalOE, ...orbitalEnergies] = totalOrbitalEnergy(elements[i].number, computeOrbitals(elements[i].eConfig), dynamic23Matrix);
      return orbitalEnergies;
    });
}

export function computeMaxAtomicSizes(atomicNumber: number, orbs: Orbital[]): number[] {
  // return array for each LEVEL (1, 2, 2, 3, 3), containing a value for each e_i.
  const energies = computeEnergiesForDyn23OrFauss('dynamic23', dynamic23Matrix, orbs, atomicNumber);
  return orbs.map((orb, index) => {
    // remember 1st item in totalEnergies is the sum, which we don't want.
    const energs = energies.totalEnergies[index + 1];

    const rmax_level = orb.level * Math.sqrt(-0.5 / energs);
    return rmax_level;
  });
}

export function getRmaxForRowOfElementsAndOrbital(startElem: number, numElems: number, orbIndex: number): number[] {
  return getValuesForRowOfElementsAndOrbital(startElem, numElems, orbIndex,
    (i) => {
      return computeMaxAtomicSizes(elements[i].number, computeOrbitals(elements[i].eConfig));
    });
}

export function getRadProbDensityForElemAndOrbital(selElem: any, orbIndex: number): XYpair[] {
  const orbs = computeOrbitals(selElem.selectedElementInfo.eConfig);
  if (orbIndex >= orbs.length) {
    return [];
  }
  return computeAtomicSizes(selElem, orbs)[orbIndex];
}


export interface XYpair {
  x: number;
  y: number;
}

// returns a list of lists of pairs of values, (r, r * r * psi * psi)
export function computeAtomicSizes(selElem: any, orbs: Orbital[]): XYpair[][] {
  const result: XYpair[][] = [];
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

export function getWaveFunctionSquared(selElem: any, orbIndex: number): XYpair[] {
  const result: XYpair[] = [];
  const atomicNumber = selElem.selectedElementInfo?.number!;
  const orbs = computeOrbitals(selElem.selectedElementInfo.eConfig);
  if (orbIndex >= orbs.length) {
    return [];
  }
  const zes = computeZis(atomicNumber, orbs, dynamic23Matrix);
  for (let r = 0.0; r < 10.0; r += 0.005) {
    const w = waveFunction(r, orbs[orbIndex].level, zes[orbIndex]);
    // If w * w is basically 0 (and we are not at the beginning) then
    // stop the loop -- good enough.
    if (r > 3 && w * w < 1e-5) {
      break;
    }
    result.push({ x: r, y: w * w });
  }
  return result;
}

export function getWaveFunction(selElem: any, orbIndex: number): XYpair[] {
  const result: XYpair[] = [];
  const atomicNumber = selElem.selectedElementInfo?.number!;
  const orbs = computeOrbitals(selElem.selectedElementInfo.eConfig);
  if (orbIndex >= orbs.length) {
    return [];
  }
  const zes = computeZis(atomicNumber, orbs, dynamic23Matrix);
  for (let r = 0.0; r < 10.0; r += 0.005) {
    const w = waveFunction(r, orbs[orbIndex].level, zes[orbIndex]);
    // If w * w is basically 0 (and we are not at the beginning) then
    // stop the loop -- good enough.
    if (r > 3 && w < 1e-5) {
      break;
    }
    result.push({ x: r, y: w });
  }
  return result;
}
