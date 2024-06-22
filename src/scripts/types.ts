export interface ElementType {
  name: string;
  symbol: string;
  number: number;
  aMass: number;
  eConfig: string;
}

// Holds information calculated from element, matrix,
// values in matrix (if custom). Units are in hartrees.
export interface EnergyComponents {
  matrix: string;
  v_i: number[];
  t_i: number[];
  v_ij: number[][];
  totalEnergies: number[];
}

export interface Orbital {
  level: number;
  sOrP: string;
  numElectrons: number;
}

export const eLevels = ["1s", "2s", "2p", "3s", "3p"];
// max # of electrons in each orbital.
export const FULL_ORBITAL_CTS = [2, 2, 6, 2, 6];
// just the first digits from the orbitals.
export const LEVELS = [1, 2, 2, 3, 3];
