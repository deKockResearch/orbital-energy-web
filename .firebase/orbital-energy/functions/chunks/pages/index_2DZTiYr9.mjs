import { c as createAstro, d as createComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute, f as renderSlot, g as renderComponent, F as Fragment, h as renderHead } from '../astro_Bj9ZwRZq.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Astro$b = createAstro();
const $$TabLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$TabLayout;
  const { tabName, id, isActive = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["tab-panel", { "is-active": isActive }], "class:list")}${addAttribute(id, "id")}> <h2>${tabName}</h2> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/vtn2/src/orbital-energy-web/src/layouts/TabLayout.astro", void 0);

const $$Astro$a = createAstro();
const $$GraphsTab = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$GraphsTab;
  return renderTemplate`${renderComponent($$result, "TabLayout", $$TabLayout, { "tabName": "Graphs", "id": "tab2" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="charts-area"> <div id="charts-wrapper"> <canvas id="atomicSizeChartCanv"></canvas> <canvas id="electronAffinityChartCanv"></canvas> <canvas id="polarizabilityChartCanv"></canvas> <canvas id="ionizationEnergyChartCanv"></canvas> <canvas id="weightedIonizationEnergyChartCanv"></canvas> </div> <div id="energy-info-for-element"> <div id="energy-element-name"></div> <div id="energy-atomic-size"></div> <div id="energy-electron-affinity"></div> <div id="energy-polarizability"></div> <div id="energy-ionization-energy"></div> </div> </div> ` })} `;
}, "/Users/vtn2/src/orbital-energy-web/src/components/GraphsTab.astro", void 0);

const $$Astro$9 = createAstro();
const $$IntegralsTab = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$IntegralsTab;
  const items = await Astro2.glob(/* #__PURE__ */ Object.assign({"../scripts/integrals/01.md": () => import('../01_mlDBw5qZ.mjs'),"../scripts/integrals/02.md": () => import('../02_yW_ctHpc.mjs'),"../scripts/integrals/03.md": () => import('../03_arHHrO8w.mjs'),"../scripts/integrals/04.md": () => import('../04_cFjcVGRP.mjs'),"../scripts/integrals/05.md": () => import('../05_BjOMl-WI.mjs'),"../scripts/integrals/06.md": () => import('../06_f4IDAgwj.mjs'),"../scripts/integrals/07.md": () => import('../07_Wiudi0kH.mjs'),"../scripts/integrals/08.md": () => import('../08_ui_pUUsP.mjs'),"../scripts/integrals/09.md": () => import('../09_0uXrCBGG.mjs'),"../scripts/integrals/10.md": () => import('../10_zdc3m6hJ.mjs')}), () => "../scripts/integrals/*.md");
  return renderTemplate`${renderComponent($$result, "TabLayout", $$TabLayout, { "tabName": "Integrals", "id": "tab4", "data-astro-cid-ypizigle": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<button id="download-info" data-astro-cid-ypizigle> <a download href="integrals.xlsx" data-astro-cid-ypizigle>Download data for all elements (.xlsx)</a> </button> <div data-astro-cid-ypizigle> <!-- There is only one item in the items array. --> ${items.map(({ Content }) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-ypizigle": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Content", Content, { "data-astro-cid-ypizigle": true })} ` })}`)} <div style="display: none" id="no-integrals-tables-to-show" data-astro-cid-ypizigle>
No Integrals Info available.
</div> </div> <p data-astro-cid-ypizigle></p> ` })}  `;
}, "/Users/vtn2/src/orbital-energy-web/src/components/IntegralsTab.astro", void 0);

const $$Astro$8 = createAstro();
const $$IonizationEnergyTab = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$IonizationEnergyTab;
  return renderTemplate`${renderComponent($$result, "TabLayout", $$TabLayout, { "tabName": "Ionization Energy", "id": "tab3" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="ion-energy-area"> <div id="ion-energy-left-table">
Ground state
<table> <thead> <th></th> <th>1s</th> <th>2s</th> <th>2p</th> <th>3s</th> <th>3p</th> </thead> <tbody> <tr class="ion-energy-econfig-static-row"> <td># of electrons</td> <!-- Values in rows below will be based on selected element --> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr class="ion-energy-z_es-static-row"> <td>Z<sub>e</sub></td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr class="ion-energy-vaoe-static-row"> <td>VAOE</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr class="ion-energy-et-static-row"> <td>E<sub>t</sub></td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> </tbody> </table>
Total Energy: <span id="ion-energy-left-table-total-energy"></span> </div> <div id="ion-energy-right-table">
Modify to see energy changes
<table> <thead> <th></th> <th>1s</th> <th>2s</th> <th>2p</th> <th>3s</th> <th>3p</th> </thead> <tbody> <tr class="ion-energy-econfig-dyn-row"> <td># of electrons</td> <!-- Values in rows below will be based on selected element --> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr class="ion-energy-z_es-dyn-row"> <td>Z<sub>e</sub></td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr class="ion-energy-vaoe-dyn-row"> <td>VAOE</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr class="ion-energy-et-dyn-row"> <td>E<sub>t</sub> </td><td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> </tbody> </table>
Total Energy: <span id="ion-energy-right-table-total-energy"></span> <div style="color: red">
Ionization Energy: <span id="ion-energy-ionization-energy"></span> </div> </div> </div> ` })} `;
}, "/Users/vtn2/src/orbital-energy-web/src/components/IonizationEnergyTab.astro", void 0);

const eLevels = ["1s", "2s", "2p", "3s", "3p"];

const $$Astro$7 = createAstro();
const $$Matrix = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Matrix;
  const { id, matrix } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<table${addAttribute(id, "id")}> ${renderTemplate`<caption> ${id === "faussurier" ? renderTemplate`<a target="_blank" href="https://doi.org/10.1016/S0022-4073(97)00018-6">
Faussurier
</a>` : id} </caption>`} <tr> <th></th> ${eLevels.map((l) => renderTemplate`<th>${l}</th>`)} </tr> ${matrix.map((row, index) => renderTemplate`<tr> <th>${eLevels[index]}</th> ${row.map((val) => renderTemplate`<td>${val}</td>`)} </tr>`)} <tr></tr> </table>`;
}, "/Users/vtn2/src/orbital-energy-web/src/components/Matrix.astro", void 0);

const faussurierMatrix = [
  [0.31, 0.0135, 3e-4, 0, 0],
  // , 0.0, 0.0],
  [0.7388, 0.3082, 0.2522, 0, 0],
  // , 0.0, 0.0],
  [0.9461, 0.3481, 0.3495, 0.0392, 0.021],
  // , 0.0007, 0.0097],
  [0.9511, 0.8511, 0.648, 0.3106, 0.2496],
  //, 0.1676, 0.0477],
  [0.9696, 0.855, 0.7916, 0.3002, 0.3136]
  //, 0.3226, 0.0513],
  // [0.9987, 0.9865, 0.9413, 0.4847, 0.323, 0.3786, 0.0743],
  // [0.934, 0.7502, 0.85, 0.6718, 0.6068, 0.6547, 0.2983],
];
const dynamic23Matrix = [
  [0.31, 67e-4, 54e-4, 32e-4, 31e-4],
  [0.8139, 0.3128, 0.275, 61e-4, 61e-4],
  [0.9351, 0.3134, 0.3417, 0.0127, 0.0125],
  [0.9564, 0.8851, 0.757, 0.3616, 0.2076],
  [0.9627, 0.8608, 0.8357, 0.3457, 0.3107]
];
let customMatrix = Array(5).fill(0).map(() => Array(5).fill(0));

const $$Astro$6 = createAstro();
const $$SelectableMatrix = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$SelectableMatrix;
  return renderTemplate`${maybeRenderHead()}<div> <select name="matrixSelector" id="matrixSelector" autocomplete="off"> <option value="custom" id="custom" selected>custom</option> <option value="row23ArgonOnly" id="row23ArgonOnly">row23ArgonOnly</option> <option value="row23Frozen" id="row23Frozen">row23Frozen</option> </select> <table id="selectableMatrix"> <tr> <th></th> ${eLevels.map((l) => renderTemplate`<th>${l}</th>`)} </tr> ${// customMatrix is 5x5 matrix of 0s.
  customMatrix.map((row, index) => renderTemplate`<tr class="selectableMatrixRow"> <th>${eLevels[index]}</th> ${row.map((val) => renderTemplate`<td class="selectableMatrixCell" contenteditable="true"> ${val} </td>`)} </tr>`)} <tr></tr>  </table></div>`;
}, "/Users/vtn2/src/orbital-energy-web/src/components/SelectableMatrix.astro", void 0);

const $$Astro$5 = createAstro();
const $$DetailedElemBox = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$DetailedElemBox;
  return renderTemplate`${maybeRenderHead()}<div class="detailedView" id="details" data-astro-cid-eq4mi4c2> <div id="detailsTempText" data-astro-cid-eq4mi4c2> <p data-astro-cid-eq4mi4c2>Select an element from the periodic table for more details</p> </div> <!-- the following is hidden until an element is selected --> <div id="detailsElemBox" class="showcase" style="display: none" data-astro-cid-eq4mi4c2> <div class="aNumber" data-astro-cid-eq4mi4c2></div> <div class="aSymbol" data-astro-cid-eq4mi4c2></div> <div class="aName" data-astro-cid-eq4mi4c2></div> <div class="aMass" data-astro-cid-eq4mi4c2></div> <div class="aEconfig" data-astro-cid-eq4mi4c2></div> </div> </div>  `;
}, "/Users/vtn2/src/orbital-energy-web/src/components/DetailedElemBox.astro", void 0);

const $$Astro$4 = createAstro();
const $$TopTable = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$TopTable;
  return renderTemplate`${maybeRenderHead()}<div class="wrapper"> <div class="innerTop"> <div class="elements"> <div class="row clickable"> <a class="element ptable group-12">H<br>1</a> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <a class="element ptable group-12">He<br>2</a> </div> <div class="row clickable"> <a class="element ptable group-12">Li<br>3</a> <a class="element ptable group-12">Be<br>4</a> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <a class="element ptable group-nm">B<br>5</a> <a class="element ptable group-nm">C<br>6</a> <a class="element ptable group-nm">N<br>7</a> <a class="element ptable group-nm">O<br>8</a> <a class="element ptable group-nm">F<br>9</a> <a class="element ptable group-nm">Ne<br>10</a> </div> <div class="row clickable"> <a class="element ptable group-12">Na<br>11</a> <a class="element ptable group-12">Mg<br>12</a> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <a class="element ptable group-nm">Al<br>13</a> <a class="element ptable group-nm">Si<br>14</a> <a class="element ptable group-nm">P<br>15</a> <a class="element ptable group-nm">S<br>16</a> <a class="element ptable group-nm">Cl<br>17</a> <a class="element ptable group-nm">Ar<br>18</a> </div> <div class="not-clickable"> <div class="row"> <a class="element ptable group-12">K<br>19</a> <a class="element ptable group-12">Ca<br>20</a> <a class="element ptable group-transition">Sc<br>21</a> <a class="element ptable group-transition">Ti<br>22</a> <a class="element ptable group-transition">V <br>23</a> <a class="element ptable group-transition">Cr<br>24</a> <a class="element ptable group-transition">Mn<br>25</a> <a class="element ptable group-transition">Fe<br>26</a> <a class="element ptable group-transition">Co<br>27</a> <a class="element ptable group-transition">Ni<br>28</a> <a class="element ptable group-transition">Cu<br>29</a> <a class="element ptable group-transition">Zn<br>30</a> <a class="element ptable group-nm">Ga<br>31</a> <a class="element ptable group-nm">Ge<br>32</a> <a class="element ptable group-nm">As<br>33</a> <a class="element ptable group-nm">Se<br>34</a> <a class="element ptable group-nm">Br<br>35</a> <a class="element ptable group-nm">Kr<br>36</a> </div> <div class="row"> <a class="element ptable group-12">Rb<br>37</a> <a class="element ptable group-12">Sr<br>38</a> <a class="element ptable group-transition">Y <br>39</a> <a class="element ptable group-transition">Zr<br>40</a> <a class="element ptable group-transition">Nb<br>41</a> <a class="element ptable group-transition">Mo<br>42</a> <a class="element ptable group-transition">Tc<br>43</a> <a class="element ptable group-transition">Ru<br>44</a> <a class="element ptable group-transition">Rh<br>45</a> <a class="element ptable group-transition">Pd<br>46</a> <a class="element ptable group-transition">Ag<br>47</a> <a class="element ptable group-transition">Cd<br>48</a> <a class="element ptable group-nm">In<br>49</a> <a class="element ptable group-nm">Sn<br>50</a> <a class="element ptable group-nm">Sb<br>51</a> <a class="element ptable group-nm">Te<br>52</a> <a class="element ptable group-nm">I<br>53</a> <a class="element ptable group-nm">Xe<br>54</a> </div> <div class="row"> <a class="element ptable group-12">Cs<br>55</a> <a class="element ptable group-12">Ba<br>56</a> <a class="element ptable group-transition">La<br>57</a> <a class="element ptable group-transition">Hf<br>72</a> <a class="element ptable group-transition">Ta<br>73</a> <a class="element ptable group-transition">W <br>74</a> <a class="element ptable group-transition">Re<br>75</a> <a class="element ptable group-transition">Os<br>76</a> <a class="element ptable group-transition">Ir<br>77</a> <a class="element ptable group-transition">Pt<br>78</a> <a class="element ptable group-transition">Au<br>79</a> <a class="element ptable group-transition">Hg<br>80</a> <a class="element ptable group-nm">Tl<br>81</a> <a class="element ptable group-nm">Pb<br>82</a> <a class="element ptable group-nm">Bi<br>83</a> <a class="element ptable group-nm">Po<br>84</a> <a class="element ptable group-nm">At<br>85</a> <a class="element ptable group-nm">Rn<br>86</a> </div> <div class="row"> <a class="element ptable group-12">Fr<br>87</a> <a class="element ptable group-12">Ra<br>88</a> <a class="element ptable group-transition">Ac<br>89</a> <a class="element ptable group-transition">Rf<br>104</a> <a class="element ptable group-transition">Db<br>105</a> <a class="element ptable group-transition">Sg<br>106</a> <a class="element ptable group-transition">Bh<br>107</a> <a class="element ptable group-transition">Hs<br>108</a> <a class="element ptable group-transition">Mt<br>109</a> <a class="element ptable group-transition">Ds<br>110</a> <a class="element ptable group-transition">Rg<br>111</a> <a class="element ptable group-transition">Cn<br>112</a> <a class="element ptable group-nm">Nh<br>113</a> <a class="element ptable group-nm">Fl<br>114</a> <a class="element ptable group-nm">Mc<br>115</a> <a class="element ptable group-nm">Lv<br>116</a> <a class="element ptable group-nm">Ts<br>117</a> <a class="element ptable group-nm">Og<br>118</a> </div> <div class="row"> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> </div> <div class="row"> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <a class="element ptable group-la">Ce<br>58</a> <a class="element ptable group-la">Pr<br>59</a> <a class="element ptable group-la">Nd<br>60</a> <a class="element ptable group-la">Pm<br>61</a> <a class="element ptable group-la">Sm<br>62</a> <a class="element ptable group-la">Eu<br>63</a> <a class="element ptable group-la">Gd<br>64</a> <a class="element ptable group-la">Tb<br>65</a> <a class="element ptable group-la">Dy<br>66</a> <a class="element ptable group-la">Ho<br>67</a> <a class="element ptable group-la">Er<br>68</a> <a class="element ptable group-la">Tm<br>69</a> <a class="element ptable group-la">Yb<br>70</a> <a class="element ptable group-la">Lu<br>71</a> <div class="element empty-element"></div> </div> <div class="row"> <div class="element empty-element"></div> <div class="element empty-element"></div> <div class="element empty-element"></div> <a class="element ptable group-la">Th<br>90</a> <a class="element ptable group-la">Pa<br>91</a> <a class="element ptable group-la">U <br>92</a> <a class="element ptable group-la">Np<br>93</a> <a class="element ptable group-la">Pu<br>94</a> <a class="element ptable group-la">Am<br>95</a> <a class="element ptable group-la">Cm<br>96</a> <a class="element ptable group-la">Bk<br>97</a> <a class="element ptable group-la">Cf<br>98</a> <a class="element ptable group-la">Es<br>99</a> <a class="element ptable group-la">Fm<br>100</a> <a class="element ptable group-la">Md<br>101</a> <a class="element ptable group-la">No<br>102</a> <a class="element ptable group-la">Lr<br>103</a> <div class="element empty-element"></div> </div> </div> </div> ${renderComponent($$result, "DetailedElemBox", $$DetailedElemBox, {})} </div> </div> `;
}, "/Users/vtn2/src/orbital-energy-web/src/components/TopTable.astro", void 0);

const $$Astro$3 = createAstro();
const $$UnitsSelector = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$UnitsSelector;
  return renderTemplate`${maybeRenderHead()}<h3>
Calculated energy in
<select name="unitSelector" id="unitSelector" autocomplete="off"> <option value="Ha">hartrees (Ha)</option> <option value="Ry">rydbergs (Ry)</option> <option value="eV">electron volts (eV)</option> <option value="J">joules (J)</option> <option value="cal">calories (cal)</option> <option value="kJ/mol">kJ/mol</option> <option value="kcal/mol">kcal/mol</option> <option value="cm-1">wavenumbers (cm-1)</option> </select> </h3> `;
}, "/Users/vtn2/src/orbital-energy-web/src/components/UnitsSelector.astro", void 0);

const $$Astro$2 = createAstro();
const $$VAOEnergyTab = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$VAOEnergyTab;
  return renderTemplate`${renderComponent($$result, "TabLayout", $$TabLayout, { "tabName": "VAO Energy", "id": "tab1", "isActive": "true", "data-astro-cid-v2w2apux": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="energy-box" data-astro-cid-v2w2apux> <!-- next element is where canvas gets attached --> <div id="eLevelsID" data-astro-cid-v2w2apux></div> <h4 data-astro-cid-v2w2apux>Total:</h4> <div id="totalEnergies" class="horizontal-flex" data-astro-cid-v2w2apux> <span id="dynamic23TotalEnergy" data-astro-cid-v2w2apux></span> <span id="faussurierTotalEnergy" data-astro-cid-v2w2apux></span> <span id="selectableTotalEnergy" data-astro-cid-v2w2apux></span> </div> <h4 data-astro-cid-v2w2apux>tvTable</h4> <div id="tvTables" class="horizontal-flex" data-astro-cid-v2w2apux> <table id="dynamic23TvTable" data-astro-cid-v2w2apux></table> <table id="faussurierTvTable" data-astro-cid-v2w2apux></table> <table id="selectableTvTable" data-astro-cid-v2w2apux></table> </div> <h4 data-astro-cid-v2w2apux>vijTable</h4> <div id="vijTables" class="horizontal-flex" data-astro-cid-v2w2apux> <table id="dynamic23VijTable" data-astro-cid-v2w2apux></table> <table id="faussurierVijTable" data-astro-cid-v2w2apux></table> <table id="selectableVijTable" data-astro-cid-v2w2apux></table> </div> </div> ` })}  `;
}, "/Users/vtn2/src/orbital-energy-web/src/components/VAOEnergyTab.astro", void 0);

const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])}  </body> </html>`;
}, "/Users/vtn2/src/orbital-energy-web/src/layouts/Layout.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Orbital Energy", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> <span class="version" data-astro-cid-j7pv25f6> Version 9 Feb 2024</span> <h1 data-astro-cid-j7pv25f6>Orbital Energy</h1> ${renderComponent($$result2, "TopTable", $$TopTable, { "data-astro-cid-j7pv25f6": true })} <div id="matrices" class="horizontal-flex" data-astro-cid-j7pv25f6> <!-- <table id="dynamic23Matrix"></table>
			 --> ${renderComponent($$result2, "Matrix", $$Matrix, { "id": "dynamic23", "matrix": dynamic23Matrix, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Matrix", $$Matrix, { "id": "faussurier", "matrix": faussurierMatrix, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "SelectableMatrix", $$SelectableMatrix, { "data-astro-cid-j7pv25f6": true })} </div> <!-- I think this is not used. <div class="energyLevels" id="energyLevels"></div> --> ${renderComponent($$result2, "UnitsSelector", $$UnitsSelector, { "data-astro-cid-j7pv25f6": true })} <div class="tabs-wrapper" data-astro-cid-j7pv25f6> <ul class="nav-tabs" data-astro-cid-j7pv25f6> <li class="tab is-active" data-target="#tab1" data-astro-cid-j7pv25f6>VAO Energy</li> <li class="tab" data-target="#tab2" data-astro-cid-j7pv25f6>Graphs</li> <li class="tab" data-target="#tab3" data-astro-cid-j7pv25f6>Ionization Energy</li> <li class="tab" data-target="#tab4" data-astro-cid-j7pv25f6>Integrals</li> </ul> ${renderComponent($$result2, "VAOEnergyTab", $$VAOEnergyTab, { "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "GraphsTab", $$GraphsTab, { "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "IonizationEnergyTab", $$IonizationEnergyTab, { "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "IntegralsTab", $$IntegralsTab, { "data-astro-cid-j7pv25f6": true })} </div> </main>  ` })}`;
}, "/Users/vtn2/src/orbital-energy-web/src/pages/index.astro", void 0);

const $$file = "/Users/vtn2/src/orbital-energy-web/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
