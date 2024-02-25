export function handleTabSwitching() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {

      const target = document.querySelector((tab as any).dataset.target);

      // clear all is-active classes on tab-panels.
      tabContents.forEach(tc => tc.classList.remove('is-active'));
      // make the one selected tab-panel active.
      target.classList.add('is-active');

      // clear the coloring on the tabs
      tabs.forEach(t => t.classList.remove('is-active'));
      // make the selected tab colored
      tab.classList.add('is-active');

    });
  });
}