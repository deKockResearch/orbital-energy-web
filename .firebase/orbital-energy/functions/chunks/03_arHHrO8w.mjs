import { d as createComponent, r as renderTemplate, m as maybeRenderHead, K as unescapeHTML } from './astro_Bj9ZwRZq.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<div class=\"grid-wrapper\" id=\"integrals-table-3\">\n<div id=\"table1\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>E GVB GAMESS</th><th>-7.4326821176</th></tr></thead><tbody><tr><td>Virial</td><td>2.00</td></tr></tbody></table>\n</div>\n<div id=\"table2\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th></th><th>GVB</th><th>GAMESS</th><th>V</th><th>A*V</th></tr></thead><tbody><tr><td>CFTE</td><td>symbol</td><td>symbol</td><td>value</td><td>result</td></tr><tr><td>2</td><td>t1s</td><td></td><td>3.6120</td><td>7.2239724</td></tr><tr><td>1</td><td>t2s</td><td></td><td>0.2087</td><td>0.2086935</td></tr><tr><td>2</td><td>v1s</td><td></td><td>-8.0551</td><td>-16.1102344</td></tr><tr><td>1</td><td>v2s</td><td></td><td>-1.0359</td><td>-1.0358876</td></tr><tr><td>1</td><td>J1s,1s</td><td>1 1 1 1</td><td>1.6499</td><td>1.649892423</td></tr><tr><td>2</td><td>J1s,2s</td><td>1 1 2 2</td><td>0.3226</td><td>0.645169962</td></tr><tr><td>-1</td><td>K1s,2s</td><td>1 2 1 2</td><td>0.0143</td><td>-0.014288371</td></tr><tr><td>0</td><td>J2s,2s</td><td>2 2 2 2</td><td>0.2339</td><td>0</td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td>E GVB sum</td><td>-7.432682087</td></tr></tbody></table>\n</div>\n</div>";

				const frontmatter = {};
				const file = "/Users/vtn2/src/orbital-energy-web/src/scripts/integrals/03.md";
				const url = undefined;
				function rawContent() {
					return "<div class=\"grid-wrapper\" id=\"integrals-table-3\">\n\n<div id=\"table1\">\n\n| E GVB GAMESS | -7.4326821176 |\n| ------------ | ------------- |\n| Virial       | 2.00          |\n\n</div>\n\n<div id=\"table2\">\n\n|      | GVB    | GAMESS  | V         | A\\*V         |\n| ---- | ------ | ------- | --------- | ------------ |\n| CFTE | symbol | symbol  | value     | result       |\n| 2    | t1s    |         | 3.6120    | 7.2239724    |\n| 1    | t2s    |         | 0.2087    | 0.2086935    |\n| 2    | v1s    |         | -8.0551   | -16.1102344  |\n| 1    | v2s    |         | -1.0359   | -1.0358876   |\n| 1    | J1s,1s | 1 1 1 1 | 1.6499    | 1.649892423  |\n| 2    | J1s,2s | 1 1 2 2 | 0.3226    | 0.645169962  |\n| -1   | K1s,2s | 1 2 1 2 | 0.0143    | -0.014288371 |\n| 0    | J2s,2s | 2 2 2 2 | 0.2339    | 0            |\n|      |        |         |           |              |\n|      |        |         | E GVB sum | -7.432682087 |\n\n</div>\n\n</div>\n";
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
