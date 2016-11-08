/*
 * Super simple AJAX forms powered by Formspree -- http://jdp.org.uk/ajax/2015/05/20/ajax-forms-without-jquery.html
 */

var body = document.body || document.documentElement;

if (document.getElementById('js-cform')) {
	var message = {};
	message.loading = 'Laden ...';
	message.success = 'Vielen Dank!';
	message.failure = 'Fehlerhaft!';

	var form = document.getElementById('js-cform');
	var submitForm = document.getElementById('js-submit');

	// Set up the AJAX request
	var request = new XMLHttpRequest();
	request.open('POST', '//formspree.io/hello@twobrain.io', true);
	request.setRequestHeader('accept', 'application/json');

	// Listen for the form being submitted
	form.addEventListener('submit', function(evt) {
		evt.preventDefault();

		// Create a new FormData object passing in the form's key value pairs (that was easy!)
		var formData = new FormData(form);

		// Send the formData
		request.send(formData);

		// Watch for changes to request.readyState and update the statusMessage accordingly
		request.onreadystatechange = function () {

			// <4 =  waiting on response from server
			if (request.readyState < 4) {
				submitForm.classList.remove('transparent');
				submitForm.setAttribute('style','cursor: default');

				submitForm.classList.add('loading');
				submitForm.value = message.loading;

				// 4 = Response from server has been completely loaded.
			} else if (request.readyState === 4) {
				// 200 - 299 = successful
				if (request.status === 200 && request.status < 300) {
					submitForm.classList.remove('loading');
					submitForm.classList.add('btn--success');
					submitForm.value = message.success;
					form.reset();

				} else {
					submitForm.classList.remove('loading');
					submitForm.classList.remove('btn--loading');
					submitForm.classList.add('btn--error');
					submitForm.value = message.failure;
				}
			}
		};
	});
}
