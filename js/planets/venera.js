				//RENDERER
				var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), antialias: true, alpha: true });
				renderer.setClearColor(0xffffff, 0);

				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(window.innerWidth, window.innerHeight);
				document.body.appendChild(renderer.domElement);

				//CAMERA
				camera = new THREE.PerspectiveCamera(9.5, window.innerWidth / window.innerHeight, 0.1, 10000);
				camera.position.z = 3;

				var controls = new THREE.OrbitControls(camera, renderer.domElement);
				controls.minDistance = 2500; //отвечает за приближение
				controls.maxDistance = 8000; //отвечает за отдаление
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
				//light = new THREE.AmbientLight(0xFFF2CC);
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


				//light = new THREE.HemisphereLight(0xFFF2CC, 0x080820, 1.2);
				//light.position.set(660, 660, 30);
				//scene.add(light);

				var texture = loader.load('img/venus/venus/venusmap.jpg');
				var bumpmap = loader.load('img/venus/venus/venusbump.jpg');

				//OBJECT
				var geometry = new THREE.SphereGeometry(380, 60, 60);
				var material = new THREE.MeshPhongMaterial({
					map: texture,
					bumpMap: bumpmap,
					bumpScale: 5,

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

				//RENDER LOOP
				requestAnimationFrame(render);

				function render() {

					mesh.rotation.y -= 0.001;
					controls.update();
					renderer.render(scene, camera);
					requestAnimationFrame(render);
				}


