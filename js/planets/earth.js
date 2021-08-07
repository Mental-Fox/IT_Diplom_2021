	//RENDERER
		var renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('myCanvas'),
			alpha: true
		});

		renderer.setClearColor(0xffffff, 0);

		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		w = window.innerWidth;
		h = window.innerHeight;

		//CAMERA
		camera = new THREE.PerspectiveCamera(8.1, w / h, 30, 10000);
		var controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.minDistance = 3000; //отвечает за отдаление
		controls.maxDistance = 8500; //отвечает за приближение 
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
		https: //www.youtube.com/watch?v=vamlC3r_3AM

		var texture = loader.load('img/earth/earth/clouds.png');
		var geometry = new THREE.SphereGeometry(351, 60, 60)
		var material = new THREE.MeshLambertMaterial({
			map: texture,
			side: THREE.DoubleSide,
			bumpMap: texture,
			opacity: .8,
			transparent: true,
			emissive: (new THREE.Color(0xFFFFFF), new THREE.Color(0xFFFFFF)),
		});
		var cloudMesh = new THREE.Mesh(geometry, material)
		scene.add(cloudMesh)


		//LIGHTS


		light = new THREE.DirectionalLight(0xCFE2F3);
		light.position.set(60, 0, 30);
		scene.add(light);


		var texture = loader.load('img/earth/earth/Earth1.jpg');
		var bumpMap = loader.load('img/earth/earth/bump.jpg');
		var lights = loader.load('img/earth/earth/mig.png');


		//OBJECT
		var geometry = new THREE.SphereGeometry(350, 60, 60);
		var material = new THREE.MeshPhongMaterial({
			map: texture,
			bumpMap: bumpMap,
			bumpScale: 5,

			emissive: (new THREE.Color(0xFFFFFF), new THREE.Color(0xE7E896)),
			emissiveMap: lights,
		
		});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, 0);
		scene.add(mesh);

		//Подсветка 
		var customMaterial = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true

		});

		var ballGeometry = new THREE.SphereGeometry(365, 60, 60);
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
						//OBJECT

						var texture = loader.load('img/earth/earth/luna.jpg');
						var bumpMap = loader.load('img/earth/earth/luna.jpg');

						var geometry = new THREE.SphereGeometry(35, 60, 60);
						var material = new THREE.MeshPhongMaterial({
							map: texture,
							bumpMap: bumpMap,
							bumpScale: 2,
						});
						var mesh_ = new THREE.Mesh(geometry, material);
						mesh_.position.set(0,0,150);
						scene.add(mesh_);

						var mercury_orbit = new Orbit(650);
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
			cloudMesh.rotation.y += 0.00150;

			mesh.rotation.y += 0.001;
			mesh_.rotation.y -= 0.001;

			mesh_.position.x = Math.cos(t * 0.5) * 650;
			mesh_.position.z = Math.sin(t * 0.5) * 650;

			//mesh_.position.x = mesh.position.x;
			//mesh_.position.z = mesh.position.z;

			t += Math.PI / 180 * 2 * 0.1;

			controls.update();
			renderer.render(scene, camera);
			requestAnimationFrame(render);
		}



