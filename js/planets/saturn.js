			// Создадим рендер
			var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), alpha: true });
			renderer.setClearColor(0xffffff, 0);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);
			
			// Создание сцены и загрузки
			var scene = new THREE.Scene();
			var loader = new THREE.TextureLoader();
			
			//CAMERA
			camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 5, 10000);
			camera.position.z = 3;

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




			//LIGHTS

			//light = new THREE.DirectionalLight(0xFFF2CC, 1);
			//light.position.set(80, 0, 100);
			//scene.add(light);

			//light = new THREE.HemisphereLight(0xFFF2CC, 0x080820, 1);
			//light.position.set(10, 0, 30);
			//scene.add(light);

			hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
			// Направленный свет светит с определенного направления.
			// Он действует как солнце, это означает, что все лучи параллельны.
			shadowLight = new THREE.DirectionalLight(0xffffff, .5);
		
			// Устанавливаем направление света
			shadowLight.position.set(-50, -60, 350);
			
			// Разрешить отбрасывание тени
			shadowLight.castShadow = true;
		
			// определяем видимую область проецируемой тени
			shadowLight.shadow.camera.left = -400;
			shadowLight.shadow.camera.right = 400;
			shadowLight.shadow.camera.top = 400;
			shadowLight.shadow.camera.bottom = -400;
			shadowLight.shadow.camera.near = 1;
			shadowLight.shadow.camera.far = 1000;
		
			// определяем разрешение тени; чем выше тем лучше,
			// но также более дорогой и менее производительный
			shadowLight.shadow.mapSize.width = 2048;
			shadowLight.shadow.mapSize.height = 2048;
			
			// чтобы активировать источники света, просто добавьте их на сцену
			scene.add(hemisphereLight);  
			scene.add(shadowLight);


			var texture = loader.load('img/saturn/saturn/saturnmap.jpg'); // текстура
			var bumpMap = loader.load('img/saturn/saturn/saturnmap.jpg');// рельеф текстуры
			//OBJECT
			var geometry = new THREE.SphereGeometry(420, 60, 60); // параметры текстуры
			var material = new THREE.MeshPhysicalMaterial({
				map: texture, // текстура
				emissiveMap: bumpMap, // рельеф текстуры
			});
			var mesh = new THREE.Mesh(geometry, material); // обьединяем geometry + material = mesh
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
				var ballGeometry = new THREE.SphereGeometry(460, 60, 60);
				var ball = new THREE.Mesh(ballGeometry, customMaterial);
				scene.add(ball);



			// jpg  png
			var texture = loader.load('img/saturn/saturn/123.png');
			var geometry = new THREE.TorusGeometry(780, 150, 2, 150, 6.29);
			//var geometry = new THREE.RingGeometry(480, 700, 80, 50, 10, Math.PI * 2);
			var material = new THREE.MeshLambertMaterial({
				map: texture,
				opacity: 0.1,
			});
			var Torus = new THREE.Mesh(geometry, material);
			scene.add(Torus);
			camera.position.y = -3000;
			camera.position.x = 1200;
			camera.position.z = 1000;

			//RENDER LOOP
			requestAnimationFrame(render);// Устанавливаем рендер во внеэкранную текстуру
			function render() {
				Torus.rotation.y += 0.0005; // анимация колец сатурна
				mesh.rotation.y -= 0.001; // анимация сатурна
				controls.update(); // обнова контроля
				renderer.render(scene, camera); //  И, наконец, отрисовываем результат на экране
				requestAnimationFrame(render);
			}