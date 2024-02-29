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
      // tabs.forEach(t => t.classList.remove('is-active'));
      for (let s of siblingTabs) {
        s.classList.remove('is-active');
      }
      // make the selected tab colored
      tab.classList.add('is-active');
    });
  });
}