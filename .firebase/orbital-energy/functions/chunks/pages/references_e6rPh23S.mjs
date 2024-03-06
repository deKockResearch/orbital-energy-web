import { d as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../astro_ML8uDNy_.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<h1 id=\"references-links-about-information-etc\">References, links, About information, etc.</h1>\n<h2 id=\"update-referencesmd-to-put-info-here\">Update references.md to put info here.</h2>";

				const frontmatter = {};
				const file = "/Users/vtn2/src/orbital-energy-web/src/pages/references.md";
				const url = "/references";
				function rawContent() {
					return "# References, links, About information, etc.\n\n## Update references.md to put info here.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"references-links-about-information-etc","text":"References, links, About information, etc."},{"depth":2,"slug":"update-referencesmd-to-put-info-here","text":"Update references.md to put info here."}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
