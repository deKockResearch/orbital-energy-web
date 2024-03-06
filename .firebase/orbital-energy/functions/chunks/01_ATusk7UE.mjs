import { d as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_ML8uDNy_.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<div class=\"grid-wrapper\" id=\"integrals-table-1\">\n<div id=\"table1\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>E GVB GAMESS</th><th>-0.49999928</th></tr></thead><tbody><tr><td>Virial</td><td>2.00</td></tr></tbody></table>\n</div>\n<div id=\"table2\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th></th><th>GVB</th><th>GAMESS</th><th>V</th><th>A*V</th></tr></thead><tbody><tr><td>CFTE</td><td>symbol</td><td>symbol</td><td>value</td><td>result</td></tr><tr><td>1</td><td>t1s</td><td></td><td>0.4999979</td><td>0.4999979000</td></tr><tr><td>1</td><td>v1s</td><td></td><td>-0.9999972</td><td>-0.9999972000</td></tr><tr><td>0</td><td>J1s, 1s</td><td>1 1 1 1</td><td>0.6249991203470000</td><td>0.0000000000</td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td>E GVB sum</td><td>-0.4999993000</td></tr></tbody></table>\n</div>\n</div>\n<style>\n  .grid-wrapper {\n    display: grid;\n    grid-row: auto auto;\n    grid-template-columns: 20% 80%;\n  }\n  td {\n    white-space: nowrap;\n  }\n</style>";

				const frontmatter = {};
				const file = "/Users/vtn2/src/orbital-energy-web/src/scripts/integrals/01.md";
				const url = undefined;
				function rawContent() {
					return "<div class=\"grid-wrapper\" id=\"integrals-table-1\">\n\n<div id=\"table1\">\n\n| E GVB GAMESS | -0.49999928 |\n| ------------ | ----------- |\n| Virial       | 2.00        |\n\n</div>\n\n<div id=\"table2\">\n\n|      | GVB     | GAMESS  | V                  | A\\*V          |\n| ---- | ------- | ------- | ------------------ | ------------- |\n| CFTE | symbol  | symbol  | value              | result        |\n| 1    | t1s     |         | 0.4999979          | 0.4999979000  |\n| 1    | v1s     |         | -0.9999972         | -0.9999972000 |\n| 0    | J1s, 1s | 1 1 1 1 | 0.6249991203470000 | 0.0000000000  |\n|      |         |         |                    |               |\n|      |         |         | E GVB sum          | -0.4999993000 |\n\n</div>\n\n</div>\n\n<style>\n  .grid-wrapper {\n    display: grid;\n    grid-row: auto auto;\n    grid-template-columns: 20% 80%;\n  }\n  td {\n    white-space: nowrap;\n  }\n</style>\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
