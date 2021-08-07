	//RENDERER
	var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), alpha: true });

	renderer.setClearColor(0xffffff, 0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//CAMERA
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 5, 100000);


	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 1500; //отвечает за приближение
	controls.maxDistance = 6000; //отвечает за отдаление
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	//controls.target.set(50, 50, -50);
	// controls.autoRotate = true;
	controls.rotateSpeed = 0.4;
	controls.zoomSpeed = 0.8;
	controls.enableZoom = true;

	//SCENE
	var scene = new THREE.Scene();
	var loader = new THREE.TextureLoader();

	//LIGHTS		#	
	//light = new THREE.DirectionalLight(0xffffff);
	//light.position.set(10, 0, -50);
	//scene.add(light);

	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .5);

	// Set the direction of the light  
	shadowLight.position.set(-10, -100, -100);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 5;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);

	var texture = loader.load('img/uran/uran/Uran_Map.jpg');
	var bumpmap = loader.load('img/uran/uran/bumpMap.jpg')
	//var lights = loader.load('mig.jpg');
	//var Spec = loader.load('earthspec1k.jpg');

	//OBJECT
	var geometry = new THREE.SphereGeometry(400, 60, 60);
	var material = new THREE.MeshPhongMaterial({
		map: texture,
		bumpMap: bumpmap,
		bumpScale: 5,
		//emissive: (new THREE.Color(0xFFFFFF), new THREE.Color(0xE7E896)),
		//emissiveMap: lights,
		//specularMap: Spec,
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = 100;
	scene.add(mesh);

	// jpg  png

	var texture = loader.load('img/uran/uran/Uranus-ring.png');
	//var bump = loader.load('img/uran/uran/Uranus-ring.png');
	var geometry = new THREE.TorusGeometry(-800, 150, 2, 150, 6.29);
	//var geometry = new THREE.RingGeometry(480, 700, 80, 50, 10, Math.PI * 2);
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		opacity: 0.1,
		specularMap: texture,
	});
	var Torus = new THREE.Mesh(geometry, material);
	Torus.rotation.y = 600;
	scene.add(Torus);
	camera.position.y = -3200;
	camera.position.x = 1000;
	camera.position.z = -600;
	//RENDER LOOP
	requestAnimationFrame(render);
	function render() {
		Torus.rotation.z -= -0.0005;
		Torus.rotation.x -= -0.0005;

		mesh.rotation.y -= 0.005;
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}