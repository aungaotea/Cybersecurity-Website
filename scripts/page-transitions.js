(function () {
	const TRANSITION_MS = 100; // match CSS transition time in stylesheet.css

	// Fade in on load
	window.addEventListener('DOMContentLoaded', () => {
		requestAnimationFrame(() => document.body.classList.remove('preload'));
	});

	// Some browsers restore pages from BFCache — ensure visible
	window.addEventListener('pageshow', (e) => {
		if (e.persisted) document.body.classList.remove('preload');
	});

	// Intercept same-origin link clicks and fade out before navigating
	document.addEventListener('click', (e) => {
		const a = e.target.closest('a[href]');
		if (!a) return;

		const href = a.getAttribute('href');
		// Ignore links that should not trigger transition
		if (
			a.target === '_blank' ||
			a.hasAttribute('download') ||
			href.startsWith('mailto:') ||
			href.startsWith('tel:') ||
			href.startsWith('#') // in-page anchors
		) {
			return;
		}

		// Resolve URL and ensure same-origin
		let url;
		try {
			url = new URL(href, location.href);
		} catch {
			return;
		}
		if (url.origin !== location.origin) return;

		// If it's just a hash navigation on same page, allow default
		if (url.pathname === location.pathname && url.hash) return;

		e.preventDefault();
		document.body.classList.add('preload');
		setTimeout(() => {
			location.href = url.href;
		}, TRANSITION_MS);
	});
})();
