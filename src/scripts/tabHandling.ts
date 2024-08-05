import { unSelectAllElements } from "./elementsTable";
import { selectedElement$ } from "./stores";

export function handleTabSwitching() {
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const parent = tab.parentElement;
      const siblingTabs = parent!.children;

      // get all tabPanels for siblingTabs.
      const siblingTabPanels = [];
      for (let s of siblingTabs) {
        siblingTabPanels.push(document.querySelector((s as any).dataset.target));
      }
      // clear all is-active classes on sibling tab-panels.
      siblingTabPanels.forEach(stp => stp.classList.remove('is-active'));

      // make the one selected tab-panel active.
      // get the target panel that corresponds to the clicked tab.
      const target = document.querySelector((tab as any).dataset.target);
      target.classList.add('is-active');

      // clear the coloring on the tabs
      for (let s of siblingTabs) {
        s.classList.remove('is-active');
      }
      // make the selected tab colored
      tab.classList.add('is-active');

      // If we are switching from Graphs tab to another tab where one cannot select a row,
      // and a row has been selected, then unselect the row.
      if (target.id !== 'graphs-tab' && selectedElement$.get().rowSelected !== null) {
        unSelectAllElements();

        // clear the values changed when changing elements.
        selectedElement$.set({
          selectedHTMLElement: null,
          selectedElementInfo: null,
          selectedElemOrbitals: null,
          rowSelected: null,
        });
      }
    });
  });
}