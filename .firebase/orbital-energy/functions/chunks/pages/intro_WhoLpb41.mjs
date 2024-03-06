import { d as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../astro_ML8uDNy_.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<h2 id=\"lots-of-words-here-etc\">Lots of words here, etc.</h2>\n<h3 id=\"this-is-markdown-by-the-way\">This is markdown, by the way.</h3>\n<h3 id=\"edit-the-pagesintromd-to-update-this\">Edit the pages/intro.md to update this.</h3>";

				const frontmatter = {};
				const file = "/Users/vtn2/src/orbital-energy-web/src/pages/intro.md";
				const url = "/intro";
				function rawContent() {
					return "## Lots of words here, etc.\n\n### This is markdown, by the way.\n\n### Edit the pages/intro.md to update this.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"lots-of-words-here-etc","text":"Lots of words here, etc."},{"depth":3,"slug":"this-is-markdown-by-the-way","text":"This is markdown, by the way."},{"depth":3,"slug":"edit-the-pagesintromd-to-update-this","text":"Edit the pages/intro.md to update this."}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
