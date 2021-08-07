document.addEventListener('mousemove', e => {
	circles.style.left = e.pageX + "px";
	circles.style.top = e.pageY + "px";
	circles.style.right = e.pageY + "px";
	circles.style.bottom = e.pageY + "px";
});

