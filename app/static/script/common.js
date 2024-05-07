const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const safe = (innerHtml) => innerHtml.replace(/</g, '&lt;').replace(/>/g, '&gt;');