				//RENDERER
				var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), alpha: true });

				renderer.setClearColor(0xffffff, 0);
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(window.innerWidth, window.innerHeight);
				document.body.appendChild(renderer.domElement);

				//CAMERA
				camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 5, 10000);
				camera.position.z = 3;

				var controls = new THREE.OrbitControls(camera, renderer.domElement);
				controls.minDistance = 2500; //отвечает за отдаление
				controls.maxDistance = 7500; //отвечает за приближение 
				controls.enableDamping = true;
				controls.dampingFactor = 0.08;
				//controls.target.set(50, 50, -50);
				// controls.autoRotate = true;
				controls.rotateSpeed = 0.4;
				controls.zoomSpeed = 0.8;
				controls.enableZoom = true;


				//SCENE
				var scene = new THREE.Scene();


				var loader = new THREE.TextureLoader(); // загрузка текстур

				//LIGHTS		#	

				//light = new THREE.DirectionalLight(0x3CFFF6, 1.5);
				//light.position.set(80, 0, 30);
				//scene.add(light);

				hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	
				// A directional light shines from a specific direction. 
				// It acts like the sun, that means that all the rays produced are parallel. 
				shadowLight = new THREE.DirectionalLight(0xffffff, .5);
			
				// Set the direction of the light  
				shadowLight.position.set(850, -280, -350);
				
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

				var texture = loader.load('img/neptun/neptun/texture.jpg');
				var bumpmap = loader.load('img/neptun/neptun/bump.jpg');
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
				mesh.position.set(0, 0, 0);
				scene.add(mesh);
		

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
				var ballGeometry = new THREE.SphereGeometry(425, 60, 60);
				var ball = new THREE.Mesh(ballGeometry, customMaterial);
				scene.add(ball);


				
			// jpg  png
			var texture = loader.load('img/neptun/neptun/neptun-ring.png');
			var geometry = new THREE.TorusGeometry(780, 150, 2, 120, 6.29);
			//var geometry = new THREE.RingGeometry(480, 700, 80, 50, 10, Math.PI * 2);
			var material = new THREE.MeshLambertMaterial({
				map: texture,
				opacity:0.001,
			});
			var Torus = new THREE.Mesh(geometry, material);
			scene.add(Torus);



			camera.position.y = -3000;
			camera.position.x = 1200;
			camera.position.z = -1000;


				//RENDER LOOP
				requestAnimationFrame(render);

				function render() {

					mesh.rotation.y -= 0.005;
					controls.update();
					renderer.render(scene, camera);
					requestAnimationFrame(render);
				}