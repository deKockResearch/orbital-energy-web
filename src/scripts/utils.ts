////////// Utility Functions /////////////

import { unitsSelection$ } from "./stores";


// convert 1 hartree to the given unit -- Ry, eV, etc.
// the 2nd value is the conversion factor.
export const conversions = new Map([
  ['Ha', 1],
  ['Ry', 2],
  ['eV', 27.211386245988],
  ['J', 4.3597447222071E-18],
  ['cal', 1.042E-18],
  ['kJ/mol', 2625.5],
  ['kcal/mol', 627.5],
  ['cm-1', 219474.6],
]);


export function energyToUnitsAsString(energy: number, units: string): string {
  const res = energy * conversions.get(units)!;
  if (Math.abs(res) < 0.0001) {   // if number is really small.
    return `${res.toExponential(3)} ${units}`;
  } else {
    return `${res.toFixed(3)} ${units}`;  // 3 sigfigs
  }
}

export function convert2Strings(energies: number[]): string[] {
  return energies.map(e => energyToUnitsAsString(e, unitsSelection$.get()));
}