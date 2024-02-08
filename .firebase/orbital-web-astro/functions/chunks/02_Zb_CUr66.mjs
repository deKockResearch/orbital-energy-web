import { d as createComponent, r as renderTemplate, m as maybeRenderHead, K as unescapeHTML } from './astro_Bj9ZwRZq.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<div class=\"grid-wrapper\" id=\"integrals-table-2\">\n<div id=\"table1\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>E RHF GAMESS</th><th>-2.861673</th></tr></thead><tbody><tr><td>Virial</td><td>2.00</td></tr></tbody></table>\n</div>\n<div id=\"table2\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th></th><th>RHF</th><th>GAMESS</th><th>V</th><th>A*V</th></tr></thead><tbody><tr><td>CFTE</td><td>symbol</td><td>symbol</td><td>value</td><td>result</td></tr><tr><td>2</td><td>t1s</td><td></td><td>1.4308299</td><td>2.8616598000</td></tr><tr><td>2</td><td>v1s</td><td></td><td>-3.374549</td><td>-6.7490980000</td></tr><tr><td>1</td><td>J1s, 1s</td><td>1 1 1 1</td><td>1.0257650841900000</td><td>1.0257650842</td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td>E RHF sum</td><td>-2.8616731158</td></tr></tbody></table>\n</div>\n</div>";

				const frontmatter = {};
				const file = "/Users/vtn2/src/astro-orbital/src/scripts/integrals/02.md";
				const url = undefined;
				function rawContent() {
					return "<div class=\"grid-wrapper\" id=\"integrals-table-2\">\n\n<div id=\"table1\">\n\n| E RHF GAMESS | -2.861673 |\n| ------------ | --------- |\n| Virial       | 2.00      |\n\n</div>\n\n<div id=\"table2\">\n\n|      | RHF     | GAMESS  | V                  | A\\*V          |\n| ---- | ------- | ------- | ------------------ | ------------- |\n| CFTE | symbol  | symbol  | value              | result        |\n| 2    | t1s     |         | 1.4308299          | 2.8616598000  |\n| 2    | v1s     |         | -3.374549          | -6.7490980000 |\n| 1    | J1s, 1s | 1 1 1 1 | 1.0257650841900000 | 1.0257650842  |\n|      |         |         |                    |               |\n|      |         |         | E RHF sum          | -2.8616731158 |\n\n</div>\n\n</div>\n";
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
