export interface ElementType {
  name: string;
  symbol: string;
  number: number;
  aMass: number;
  eConfig: string; // e.g., "1s2 2s2 2p1"
  density: number;
  meltingPoint: number;
  boilingPoint: number;
  oxidationState: number;
  electronegativityPauling: number;
  electronegativityTandO: number;
  firstIonizationEnergy: number;
  valenceAtomicRadiusRDK: number | null;
  valenceAtomicRadiusClement: number | null;
  valenceAtomicRadiusRahm: number;
  R001AtomicRadius: number;
  vanderWallRadius: number;
  metallicRadius: number;
  covalentRadius: number;
  valenceEffectiveNuclearChargeRDK: number | null;
  valenceEffectiveNuclearChargeGuerra: number;
  electricalConductivity: number;
  thermalConductivity: number;
}

// Holds information calculated from element, matrix,
// values in matrix (if custom). Units are in hartrees.
export interface EnergyComponents {
  matrix: string;
  v_i: number[];
  t_i: number[];
  v_ij: number[][];
  capV_ij: number[][];
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
