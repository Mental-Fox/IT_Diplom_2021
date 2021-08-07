				//RENDERER
				var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), antialias: true, alpha: true });
				renderer.setClearColor(0xffffff, 0);

				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(window.innerWidth, window.innerHeight);
				document.body.appendChild(renderer.domElement);

				//CAMERA
				camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 5, 10000);
				camera.position.z = 3;

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

				//LIGHTS
				//light = new THREE.AmbientLight(0x181818);
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


				
				//light = new THREE.HemisphereLight(0xFCE5CD, 1);
				//light.position.set(-100, 50, -5);
				//scene.add(light);


				var texture = loader.load('img/jupiter/jupiter/jupiter.jpg');
				var bumpMap = loader.load('img/jupiter/jupiter/Jupiter_Bump.jpg');
				var lights = loader.load('img/jupiter/jupiter/jupiter.jpg');

				//OBJECT
				var geometry = new THREE.SphereGeometry(380, 60, 60);
				var material = new THREE.MeshPhongMaterial({
					map: texture,
					bumpMap: bumpMap,
					bumpScale: 0.15,
					emissiveMap: bumpMap,

				});
				var mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(0, 0, 0);
				scene.add(mesh);

				//поднятая камера
				camera.position.z = 6000;
				camera.position.y = 4000;


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
				//спутник каллисто
						var texture = loader.load('img/earth/earth/luna.jpg');
						var bumpMap = loader.load('img/earth/earth/luna.jpg');

						var geometry = new THREE.SphereGeometry(20, 30, 30);
						var material = new THREE.MeshPhongMaterial({
							map: texture,

						});
						var kallisto = new THREE.Mesh(geometry, material);
						scene.add(kallisto);

						// частицы орбит 
						var kallisto_orbit = new Orbit(450);
						kallisto_orbit.draw(scene);

				//спутник ио
						var texture = loader.load('img/earth/earth/luna.jpg');
						var bumpMap = loader.load('img/earth/earth/luna.jpg');

						var geometry_f = new THREE.SphereGeometry(6, 30, 30);
						var material_f = new THREE.MeshPhongMaterial({
							map: texture,
						});
						var io = new THREE.Mesh(geometry_f, material_f);
						scene.add(io);

						var io_orbit = new Orbit(550);
						io_orbit.draw(scene);

				//спутник европа
						var texture = loader.load('img/earth/earth/luna.jpg');
						var bumpMap = loader.load('img/earth/earth/luna.jpg');

						var geometry_f = new THREE.SphereGeometry(12, 30, 30);
						var material_f = new THREE.MeshPhongMaterial({
							map: texture,
						});
						var europa = new THREE.Mesh(geometry_f, material_f);
						scene.add(europa);

						var europa_orbit = new Orbit(600);
						europa_orbit.draw(scene);

				//спутник ганимед
						var texture = loader.load('img/earth/earth/luna.jpg');
						var bumpMap = loader.load('img/earth/earth/luna.jpg');

						var geometry_f = new THREE.SphereGeometry(8, 30, 30);
						var material_f = new THREE.MeshPhongMaterial({
							map: texture,
						});
						var ganimed = new THREE.Mesh(geometry_f, material_f);
						scene.add(ganimed);

						var ganimed_orbit = new Orbit(700);
						ganimed_orbit.draw(scene);
				//-----------------


				//RENDER LOOP
				requestAnimationFrame(render);

				var t = 0;
				var y = 0;
				document.addEventListener('mousemove', function (event) {
					y = parseInt(event.offsetY);
				});

				function render() {
					kallisto.position.x = Math.cos(t * 0.5) * 450;
					kallisto.position.z = Math.sin(t * 0.5) * 450;
		
					io.position.z = Math.cos(t * 0.35) * 550;
					io.position.x = Math.sin(t * 0.35) * 550;

					europa.position.x = Math.cos(t * 0.2) * 600;
					europa.position.z = Math.sin(t * 0.2) * 600;
		
					ganimed.position.z = Math.cos(t * 0.1) * 700;
					ganimed.position.x = Math.sin(t * 0.1) * 700;
					
					//mesh_.position.x = mesh.position.x;
					//mesh_.position.z = mesh.position.z;
			
					t += Math.PI / 180 * 2 * 0.1;

					mesh.rotation.y -= 0.001;
					controls.update();
					renderer.render(scene, camera);
					requestAnimationFrame(render);
				}

