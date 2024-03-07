import { atom, computed } from 'nanostores';
import { dynamic23Matrix, faussurierMatrix, name2Matrix } from './matrices';
import { totalOrbitalEnergy, energyComponents } from './orbitalEnergies';
import type { ElementType, Orbital, EnergyComponents } from './types';


interface State {
  selectedHTMLElement: HTMLElement | null;
  selectedElementInfo: ElementType | null;
  selectedElemOrbitals: Orbital[] | null;
}


export const selectedElement$ = atom<State>({
  selectedHTMLElement: null,
  selectedElementInfo: null,
  selectedElemOrbitals: null,
});

export const matrixSelection$ = atom<string>('custom');
export const customMatrixVers$ = atom<number>(0);
export const unitsSelection$ = atom<string>('Ha');


export function computeEnergiesForDyn23OrFauss(matName: string, matrix: number[][], orbs: Orbital[]) {
  const selElemInfo = selectedElement$.get().selectedElementInfo!;
  // const orbs = selectedElement$.get().selectedElemOrbitals!;
  const totalEnergies = totalOrbitalEnergy(selElemInfo.number, orbs, matrix);
  const energyComps = energyComponents(selElemInfo.number, orbs, matrix);
  // console.log(`totalEnergies for ${matName} = ${totalEnergies}`);
  const result: EnergyComponents = {
    matrix: matName,
    t_i: energyComps.t_i,
    v_i: energyComps.v_i,
    v_ij: energyComps.v_ij,
    totalEnergies,
  };
  return result;
}

// The energy computations are based on basically everything in the state.
// Emit when:
// o element selection changes
// o unit selection changes
// o matrix selection changes
// o custom has been selected, and the custom matrix has been changed
//   since the last emission.
export const energies$ = computed(
  [selectedElement$, matrixSelection$, unitsSelection$, customMatrixVers$],
  (selElem, matrixSel, _unitsSel, _customMatrixVers) => {
    if (selectedElement$.get().selectedElementInfo === null) {
      return [];
    }
    // NOTE to self: using result.push() here screwed things up, for some reason. result.push
    // modifies the array, but doing it this new way creates a new array each time.
    let result: EnergyComponents[] = [];
    const orbs = selElem.selectedElemOrbitals!;
    result = [...result, computeEnergiesForDyn23OrFauss('dynamic23', dynamic23Matrix, orbs)];
    result = [...result, computeEnergiesForDyn23OrFauss('faussurier', faussurierMatrix, orbs)];
    // compute custom matrix values.
    const matrix = name2Matrix[matrixSel];
    const totalEnergies = totalOrbitalEnergy(selElem.selectedElementInfo!.number, orbs, matrix);
    const energyComps = energyComponents(selElem.selectedElementInfo!.number, orbs, matrix);
    result = [...result, {
      matrix: matrixSel,
      t_i: energyComps.t_i,
      v_i: energyComps.v_i,
      v_ij: energyComps.v_ij,
      totalEnergies,
    }];
    return result;
  });

