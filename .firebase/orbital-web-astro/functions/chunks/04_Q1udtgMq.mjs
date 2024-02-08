import { d as createComponent, r as renderTemplate, m as maybeRenderHead, K as unescapeHTML } from './astro_Bj9ZwRZq.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<div class=\"grid-wrapper\" id=\"integrals-table-4\">\n<div id=\"table1\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>E RHF GAMESS</th><th>-14.57287536</th></tr></thead><tbody><tr><td>Virial</td><td>2.00</td></tr></tbody></table>\n</div>\n<div id=\"table2\">\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th></th><th>RHF</th><th>GAMESS</th><th>V</th><th>A*V</th></tr></thead><tbody><tr><td>CFTE</td><td>symbol</td><td>symbol</td><td>value</td><td>result</td></tr><tr><td>2.00</td><td>t1s</td><td></td><td>6.7845476</td><td>13.5690952</td></tr><tr><td>2.00</td><td>t2s</td><td></td><td>0.5010141</td><td>1.0020282</td></tr><tr><td>2.00</td><td>v1s</td><td></td><td>-14.7265464</td><td>-29.4530928</td></tr><tr><td>2.00</td><td>v2s</td><td></td><td>-2.0899315</td><td>-4.179863</td></tr><tr><td>1.00</td><td>J1s, 1s</td><td>1 1 1 1</td><td>2.27287868829000000</td><td>2.272878688</td></tr><tr><td>4.00</td><td>J1s, 2s</td><td>1 1 2 2</td><td>0.48088995738600000</td><td>1.92355983</td></tr><tr><td>-2.00</td><td>K1s, 2s</td><td>1 2 1 2</td><td>0.02534137021730000</td><td>-0.05068274</td></tr><tr><td>1.00</td><td>J2s, 2s</td><td>2 2 2 2</td><td>0.34320118536100000</td><td>0.343201185</td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td>E RHF sum</td><td>-14.57287544</td></tr></tbody></table>\n</div>\n</div>";

				const frontmatter = {};
				const file = "/Users/vtn2/src/astro-orbital/src/scripts/integrals/04.md";
				const url = undefined;
				function rawContent() {
					return "<div class=\"grid-wrapper\" id=\"integrals-table-4\">\n\n<div id=\"table1\">\n\n| E RHF GAMESS | -14.57287536 |\n| ------------ | ------------ |\n| Virial       | 2.00         |\n\n</div>\n\n<div id=\"table2\">\n\n|       | RHF     | GAMESS  | V                   | A\\*V         |\n| ----- | ------- | ------- | ------------------- | ------------ |\n| CFTE  | symbol  | symbol  | value               | result       |\n| 2.00  | t1s     |         | 6.7845476           | 13.5690952   |\n| 2.00  | t2s     |         | 0.5010141           | 1.0020282    |\n| 2.00  | v1s     |         | -14.7265464         | -29.4530928  |\n| 2.00  | v2s     |         | -2.0899315          | -4.179863    |\n| 1.00  | J1s, 1s | 1 1 1 1 | 2.27287868829000000 | 2.272878688  |\n| 4.00  | J1s, 2s | 1 1 2 2 | 0.48088995738600000 | 1.92355983   |\n| -2.00 | K1s, 2s | 1 2 1 2 | 0.02534137021730000 | -0.05068274  |\n| 1.00  | J2s, 2s | 2 2 2 2 | 0.34320118536100000 | 0.343201185  |\n|       |         |         |                     |              |\n|       |         |         | E RHF sum           | -14.57287544 |\n\n</div>\n\n</div>\n";
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
