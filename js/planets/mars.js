	//RENDERER
	var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), antialias: true, alpha: true });
	renderer.setClearColor(0xffffff, 0);

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
			//renderer.setSize(880, 480);

	w = window.innerWidth;
	h = window.innerHeight;

	//CAMERA
	camera = new THREE.PerspectiveCamera(8, w / h, 25, 10000);
	camera.position.z = 3;

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 2500; //отвечает за приближение
	controls.maxDistance = 9500; //отвечает за отдаление
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

	//LIGHTS
	//light = new THREE.AmbientLight(0xF4CCCC);
	//scene.add(light);

	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .5);

	// Set the direction of the light  
	shadowLight.position.set(150, 350, 350);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);

	
	var texture = loader.load('img/mars/mars/mp.jpg');
	var geometry = new THREE.SphereGeometry(381, 60, 60)
	var material = new THREE.MeshLambertMaterial({
		map: texture,
		side: THREE.DoubleSide,

		opacity: .5,
		transparent: true,
	});
	var cloudMesh = new THREE.Mesh(geometry, material)
	scene.add(cloudMesh)

	//light = new THREE.HemisphereLight(0xF4CCCC, 0x080820, 1);
	//light.position.set(500, 500, 30);
	//scene.add(light);


	var texture = loader.load('img/mars/mars/map.jpg');
	var bumpMap = loader.load('img/mars/mars/map.jpg');
	var lights = loader.load('mig.jpg');
	var Spec = loader.load('img/mars/mars/normalMap.jpg');

	//OBJECT
	var geometry = new THREE.SphereGeometry(380, 60, 60);
	var material = new THREE.MeshPhongMaterial({
		map: texture,
		bumpMap: bumpMap,
		bumpScale: 5,
		emissive: (new THREE.Color(0xFFFFFF), new THREE.Color(0xE7E896)),
		emissiveMap: lights,
		specularMap: Spec,
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, 0);
	scene.add(mesh);

	camera.position.z = 6000;
	//Подсветка 
	var customMaterial = new THREE.ShaderMaterial(
		{
			uniforms: {},
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true

		});
	var ballGeometry = new THREE.SphereGeometry(399, 60, 60);
	var ball = new THREE.Mesh(ballGeometry, customMaterial);
	scene.add(ball);


		// частицы орбит 
	var Orbit = function (radius) {
		this.radius = radius;

		this.draw = function (scene) {
			var og = new THREE.Geometry();
			var om = new THREE.ParticleBasicMaterial({ color: 0xffffff, size: 1 });
			for (var p = 0; p < 50000; p++) {
				var v = new THREE.Vector3();
				v.x = Math.sin(Math.PI / 180 * p) * this.radius;
				v.z = Math.cos(Math.PI / 180 * p) * this.radius;
				og.vertices.push(v)
			}
			var obj = new THREE.ParticleSystem(og, om);
			scene.add(obj);
		};
	};


	
				//-----------------
						//спутник деймос
						var texture = loader.load('img/earth/earth/luna.jpg');
						var bumpMap = loader.load('img/earth/earth/luna.jpg');

						var geometry = new THREE.SphereGeometry(15, 30, 30);
						var material = new THREE.MeshPhongMaterial({
							map: texture,

						});
						var deimos = new THREE.Mesh(geometry, material);
						scene.add(deimos);

						// частицы орбит 
						var mercury_orbit = new Orbit(450);
						mercury_orbit.draw(scene);

						//спутник фобос
						var texture = loader.load('img/earth/earth/luna.jpg');
						var bumpMap = loader.load('img/earth/earth/luna.jpg');

						var geometry_f = new THREE.TorusKnotGeometry(6,15,30,35,1,2);
						var material_f = new THREE.MeshPhongMaterial({
							map: texture,
						});
						var fobos = new THREE.Mesh(geometry_f, material_f);
						scene.add(fobos);

						var mercury_orbit = new Orbit(600);
						mercury_orbit.draw(scene);
				//-----------------

				camera.position.z = 6000;
				camera.position.y = 4000;

	//RENDER LOOP
	requestAnimationFrame(render);

	var t = 0;
	var y = 0;
	document.addEventListener('mousemove', function (event) {
		y = parseInt(event.offsetY);
	});

	function render() {
	

		fobos.position.z = Math.cos(t * 0.5) * 600;
		fobos.position.x = Math.sin(t * 0.5) * 600;
		
		deimos.position.x = Math.cos(t * 0.5) * 450;
		deimos.position.z = Math.sin(t * 0.5) * 450;

		//mesh_.position.x = mesh.position.x;
		//mesh_.position.z = mesh.position.z;

		t += Math.PI / 180 * 2 * 0.1;

		cloudMesh.rotation.y -= 0.00150;
		mesh.rotation.y -= 0.001;
		controls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}


	function updateSphere(ev) {
		mesh.position.x = window.scrollY * .5;
		cloudMesh.position.x = window.scrollY * .5;
		ball.position.x = window.scrollY * .5;
		controls.position.y = window.scrollY * .5;
	  }
	  window.addEventListener("scroll", updateSphere);
