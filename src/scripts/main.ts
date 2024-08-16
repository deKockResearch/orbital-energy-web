import { matrixSelection$, unitsSelection$ } from './stores';
import { updateSelectableMatrixContents, watchCustomMatrixForChanges } from './selectableMatrix';
import { handleTabSwitching } from './tabHandling';


/*
 * MAIN
 */
window.addEventListener("load", () => {

  const matrixSelect = (document.getElementById("matrixSelector") as HTMLSelectElement);
  matrixSelect.addEventListener("change", () => {
    matrixSelection$.set(matrixSelect.value);
  });

  matrixSelection$.subscribe((sel: string) => {
    updateSelectableMatrixContents(sel);
    if (sel === 'custom') {
      watchCustomMatrixForChanges();
    }
  });

  // We have the unitSelector drop down in multiple places. We'll register call listeners here.
  // A change to any changes the store.
  const unitSelectors = document.getElementsByClassName("unit-selector") as HTMLCollectionOf<HTMLSelectElement>;
  for (let unitSelect of unitSelectors) {
    unitSelect.addEventListener("change", () => {
      unitsSelection$.set(unitSelect.value);
    });
  };
  // When the store changes, update all the selectors to show the new value.
  unitsSelection$.listen(us => {
    for (let unitSelect of unitSelectors) {
      unitSelect.value = us;
    }
  });

  handleTabSwitching();
});

