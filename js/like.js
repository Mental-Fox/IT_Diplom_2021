document.addEventListener('click', ({ target: t }) => {
	if (t.classList.contains('photos__like-icon')) {
	  const index = [...document.querySelectorAll('.photos__like-icon')].indexOf(t);
	  const count = document.querySelectorAll('.photos__like-count')[index];
	  count.classList.toggle('active');
	  count.textContent -= [ 1, -1 ][+count.classList.contains('active')];
	}
 });

