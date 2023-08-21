export function totalOrbitalEnergy(eConfig: string, mx: number[][]) {
  const orbitalList = eConfig.split(" ");
  let atomicNumber = 0;
  for (let num = 0; num < orbitalList.length; num++) {
    atomicNumber += Number(orbitalList[num].slice(2));
  }

  let energy = 0;
  let energyArray = [];
  for (let i = 0; i < orbitalList.length; i++) {
    let n_i = Number(orbitalList[i].charAt(0));
    let N_i = Number(orbitalList[i].slice(2));

    let Z_i = atomicNumber;
    for (let j = 0; j < orbitalList.length; j++) {
      Z_i -= (Number(orbitalList[j].slice(2)) - (i === j ? 1 : 0)) * mx[i][j];
    }
    energyArray.push(0 - (Z_i * Z_i) / (2 * n_i * n_i));
    energy -= N_i * ((Z_i * Z_i) / (2 * n_i * n_i));
  }
  energyArray.unshift(energy);
  return energyArray;
}

export function energyComponents(eConfig: string, mx: number[][]) {
  const orbitalList = eConfig.split(" ");
  let atomicNumber = 0;
  for (let num = 0; num < orbitalList.length; num++) {
    atomicNumber += Number(orbitalList[num].slice(2));
  }
  let Zlst = [];
  let returnDict: {
    t_i: number[],
    v_i: number[],
    v_ij: number[][]
  } = {
    t_i: [],
    v_i: [],
    v_ij: []
  };

  for (let i = 0; i < orbitalList.length; i++) {
    let n_i = Number(orbitalList[i].charAt(0));
    // let N_i = Number(orbitalList[i].slice(2));

    let Z_i = atomicNumber;
    for (let j = 0; j < orbitalList.length; j++) {
      Z_i -= (Number(orbitalList[j].slice(2)) - (i === j ? 1 : 0)) * mx[i][j];
    }
    Zlst.push(Z_i);

    returnDict.t_i.push((Z_i * Z_i) / (2 * n_i * n_i));
    returnDict.v_i.push(0 - (atomicNumber * Z_i) / (n_i * n_i));
  }

  /*
  let i = 0;
  while (Zlst.length > 0) {
    let n_i = Number(orbitalList[i].charAt(0));
    let currZ_i = Zlst[0];
    for (let j = 0; j < Zlst.length; j++) {
      let n_j = Number(orbitalList[j].charAt(0));
      returnDict["v_ij"].push(
        ((currZ_i * mx[i][j]) / (n_i * n_i)) + ((Zlst[j] * mx[j][i]) / (n_j * n_j))
      );
    }
    Zlst.pop();
    i++;
  }
  */
  // let n_i = 0;
  // let n_j = 0;
  // let tempArray = [];

  for (let i in Zlst) {
    const n_i = Number(orbitalList[i].charAt(0));
    const tempArray: number[] = [];
    for (let j in Zlst) {
      const n_j = Number(orbitalList[j].charAt(0));
      tempArray.push(
        (Zlst[i] * mx[i][j]) / (n_i * n_i) + (Zlst[j] * mx[j][i]) / (n_j * n_j)
      )
    }
    returnDict.v_ij.push(tempArray);
  }
  return returnDict;
}
