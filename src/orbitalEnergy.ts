import { Orbital } from ".";

export interface ZisAndVaoes {
  z_i: number;
  vaoe: number;
}

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
  energyArray.unshift(energy);
  return energyArray;
}

export function energyComponents(atomicNumber: number, orbs: Orbital[], mx: number[][]) {
  let returnDict: {
    t_i: number[],
    v_i: number[],
    v_ij: number[][]
  } = {
    t_i: [],
    v_i: [],
    v_ij: []
  };

  const Zlst = computeZisAndVaeos(atomicNumber, orbs, mx).map(x => x.z_i);

  for (let i = 0; i < orbs.length; i++) {
    let n_i = orbs[i].level;
    returnDict.t_i.push((Zlst[i] * Zlst[i]) / (2 * n_i * n_i));
    returnDict.v_i.push(0 - (atomicNumber * Zlst[i]) / (n_i * n_i));
  }

  for (let i in Zlst) {
    const n_i = orbs[i].level;

    const tempArray: number[] = [];
    for (let j in Zlst) {
      const n_j = orbs[j].level;
      tempArray.push(
        (Zlst[i] * mx[i][j]) / (n_i * n_i) + (Zlst[j] * mx[j][i]) / (n_j * n_j)
      )
    }
    returnDict.v_ij.push(tempArray);
  }
  return returnDict;
}


export function computeZisAndVaeos(atomicNumber: number, orbsList: Orbital[], mx: number[][]): ZisAndVaoes[] {

  // e -= (N_i * (Z_i * Z_i) / (2 * n_i * n_i))

  let resLst: ZisAndVaoes[] = [];
  let vaoe_i = 0;
  for (let i = 0; i < orbsList.length; i++) {
    const n_i = orbsList[i].level;
    const N_i = orbsList[i].numElectrons;
    let Z_i = atomicNumber;
    for (let j = 0; j < orbsList.length; j++) {
      Z_i -= (orbsList[j].numElectrons - (i === j ? 1 : 0)) * mx[i][j];
    }
    vaoe_i -= (N_i * (Z_i * Z_i) / (2 * n_i * n_i));
    resLst.push({
      z_i: Z_i,
      vaoe: vaoe_i,
    });
  }
  return resLst;
}