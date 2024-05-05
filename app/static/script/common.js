const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// function handleFormSubmit(form, onSubmit) {
// 	form.addEventListener('submit', function (event) {
// 		event.preventDefault();
// 		let data = this;
// 		let promise = fetch(data.getAttribute('action'), {
// 			method: data.getAttribute('method'),
// 			body: new FormData(data),
// 		});
// 		onSubmit(promise);
// 	});
// }