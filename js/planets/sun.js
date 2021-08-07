var starsMake = function (stars, radius, color, type, color2) {
	var renderer, scene, camera, containers, W, H, rotating, shaderTiming = 0;
	var loader = new THREE.TextureLoader();
	var sunTexture = loader.load('img/sun/sun/sun_surface.jpg');
	sunTexture.anisotropy = 20;
	sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
	var sunColorLookupTexture = loader.load('img/sun/sun/star_colorshift.png');
	var solarflareTexture = loader.load('img/sun/sun/solarflare.png');
	var sunHaloTexture = loader.load('img/sun/sun/sun_halo.png');
	var sunHaloColorTexture = loader.load('img/sun/sun/halo_colorshift.png');
	var sunCoronaTexture = loader.load('img/sun/sun/corona.png');

	var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), alpha: true });

	renderer.setClearColor(0xffffff, 0);

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	W = window.innerWidth;
	H = window.innerHeight;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, W / H, 10, 30000);
	scene.add(camera);
	camera.position.set(0, 0, 1200);

	scene.add(new THREE.AmbientLight(0xf1f1f1));
	rotating = new THREE.Object3D();
	scene.add(rotating);
	



	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 500;
	controls.maxDistance = 1500;
	controls.enableDamping = true;	
	controls.dampingFactor = 0.08;
	//controls.target.set(50, 50, -50);
	// controls.autoRotate = true;
	controls.rotateSpeed = 0.4;
	controls.zoomSpeed = 0.8;
	controls.enableZoom = true;


	if (type == 1 || type === undefined) {
		starModel = makeSun({ radius: 150, spectral: color }); rotating.add(starModel); starModel.position.set(0, 0, 0);
	} else {
		starModel = makeSun({ radius: 90, spectral: color }); rotating.add(starModel); starModel.position.set(-50, 50, 50);
		starModel = makeSun({ radius: 85, spectral: color2 }); rotating.add(starModel); starModel.position.set(60, -50, -50);
	}
	dtAnimate();
	function dtAnimate() {
		controls.update();
		shaderTiming += 0.04;
		rotating.traverse(function (mesh) { if (mesh.update !== undefined) { mesh.update(); } });
		for (var i = 0; i < scene.children[2].children.length; i++) {
			scene.children[2].children[i].children[2].lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
			scene.children[2].children[i].children[3].lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
			scene.children[2].children[i].children[3].rotation.z = 0.0001;
			scene.children[2].children[i].children[0].rotation.x += 0.0002;
			scene.children[2].children[i].children[0].rotation.y += 0.0003;
		}
		requestAnimationFrame(dtAnimate);
		
		renderer.render(scene, camera);
	}
	function makeStarSurface(radius, uniforms) {
		var surfaceGeo = new THREE.SphereGeometry(radius, 60, 30);
		var sunShaderMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: document.getElementById('dshaVsurf').textContent,
			fragmentShader: document.getElementById('dshaFsurf').textContent,
		});
		return new THREE.Mesh(surfaceGeo, sunShaderMaterial);
	}
	function makeSolarflare(radius, uniforms) {
		var solarflareGeometry = new THREE.TorusGeometry(radius * 0.3, radius * 0.03, 30, 90, 0.15 + Math.PI);
		var solarflareMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: document.getElementById('dshaVflare').textContent,
			fragmentShader: document.getElementById('dshaFflare').textContent,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -100,
			polygonOffsetUnits: 1000,
		});
		var solarflareMesh = new THREE.Object3D();
		var qty = Math.floor(Math.random() * (6)) + 5;
		for (var i = 0; i < qty; i++) {
			var solarflare = new THREE.Mesh(solarflareGeometry, solarflareMaterial);
			solarflare.rotation.y = Math.PI / 2;
			solarflare.speed = Math.random() * 0.01 + 0.005;
			solarflare.rotation.z = Math.PI * Math.random() * 2;
			solarflare.rotation.x = -Math.PI + Math.PI * 2;
			solarflare.update = function () { this.rotation.z += this.speed; }
			var solarflareContainer = new THREE.Object3D();
			solarflareContainer.position.x = -1 + Math.random() * 2;
			solarflareContainer.position.y = -1 + Math.random() * 2;
			solarflareContainer.position.z = -1 + Math.random() * 2;
			solarflareContainer.position.multiplyScalar(radius * 0.7);
			solarflareContainer.lookAt(new THREE.Vector3(0, 0, 0));
			solarflareContainer.add(solarflare);
			solarflareMesh.add(solarflareContainer);
		}
		return solarflareMesh;
	}
	function makeStarHalo(radius, uniforms) {
		var haloGeo = new THREE.PlaneGeometry(radius * 3.2, radius * 3.2);
		var sunHaloMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			fragmentShader: document.getElementById('dshaFhalo').textContent,
			vertexShader: document.getElementById('dshaVcorhalo').textContent,
			transparent: true,
			polygonOffset: true,
			polygonOffsetFactor: 1,
			polygonOffsetUnits: 100,
			depthWrite: false,
			blending: THREE.CustomBlending,
			blendEquation: THREE.AddEquation,
			blendSrc: THREE.OneFactor,
			blendDst: THREE.OneFactor
		});
		return new THREE.Mesh(haloGeo, sunHaloMaterial);
	}
	function makeStarGlow(radius, uniforms) {
		var glowGeo = new THREE.PlaneGeometry(radius * 18, radius * 18);
		var sunGlowMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			fragmentShader: document.getElementById('dshaFcor').textContent,
			vertexShader: document.getElementById('dshaVcorhalo').textContent,
			transparent: true,
			polygonOffset: true,
			polygonOffsetFactor: 1,
			polygonOffsetUnits: 100,
			depthWrite: false,
			blending: THREE.CustomBlending,
			blendEquation: THREE.AddEquation,
			blendSrc: THREE.OneFactor,
			blendDst: THREE.OneFactor
		});
		return new THREE.Mesh(glowGeo, sunGlowMaterial);
	}
	function makeSun(options) {
		var radius = options.radius;
		var spectral = options.spectral;
		var dColor = '0x8398f1';//0x9aafff,'голубой'
		if (spectral == 0.4) { var dColor = '0xbeccfd'; }//0xcad7ff,'бело-голубой'
		if (spectral == 0.5) { var dColor = '0xf1f3fe'; }//0xf8f7ff,'белый'
		if (spectral == 0.6) { var dColor = '0xfef5f5'; }//0xfff4ea,'желто-белый'
		if (spectral == 0.7) { var dColor = '0xfcecad'; }//0xfff2a1,'желтый'
		if (spectral == 0.8) { var dColor = '0xe4a10b'; }//0xffc46f,'оранжевый'
		if (spectral == 0.9) { var dColor = '0xcf5f09'; }//0xff6060,'красный'
		if (spectral == 0.0) { var dColor = '0xfdbdc9'; }//0xffc0cb,'розовый'
		if (spectral == 0.1) { var dColor = '0x800181'; }//0x800080,'фиолетовый'
		if (spectral == 0.2) { var dColor = '0xbd77ef'; }//0xbe78ef,'сиреневый'
		if (spectral == 1.0) { var dColor = '0x027f00'; }//0x008000,'зеленый'
		var cHexColor = new THREE.Color().setHex(dColor);
		var uniSurf = {
			texturePrimary: { type: "t", value: sunTexture },
			textureColor: { type: "t", value: sunColorLookupTexture },
			time: { type: "f", value: 0 },
			textR: { type: "f", value: cHexColor.r },
			textG: { type: "f", value: cHexColor.g },
			textB: { type: "f", value: cHexColor.b }
		};
		var uniFlare = {
			texturePrimary: { type: "t", value: solarflareTexture },
			time: { type: "f", value: 0 },
			textR: { type: "f", value: cHexColor.r },
			textG: { type: "f", value: cHexColor.g },
			textB: { type: "f", value: cHexColor.b }
		};
		var uniHalo = {
			texturePrimary: { type: "t", value: sunHaloTexture },
			textureColor: { type: "t", value: sunHaloColorTexture },
			time: { type: "f", value: 0 },
			textR: { type: "f", value: cHexColor.r },
			textG: { type: "f", value: cHexColor.g },
			textB: { type: "f", value: cHexColor.b }
		};
		var uniCorona = {
			texturePrimary: { type: "t", value: sunCoronaTexture },
			textR: { type: "f", value: cHexColor.r },
			textG: { type: "f", value: cHexColor.g },
			textB: { type: "f", value: cHexColor.b }
		};
		var sun = new THREE.Object3D();
		var starSurface = makeStarSurface(radius, uniSurf);
		sun.add(starSurface);
		var solarflare = makeSolarflare(radius, uniFlare);
		sun.solarflare = solarflare;
		sun.add(solarflare);
		var starHalo = makeStarHalo(radius, uniHalo);
		sun.add(starHalo);
		var starGlow = makeStarGlow(radius, uniCorona);
		sun.add(starGlow);
		sun.uniSurf = uniSurf;
		sun.uniFlare = uniFlare;
		sun.uniHalo = uniHalo;
		sun.uniCorona = uniCorona;
		sun.update = function () {
			this.uniSurf.time.value = this.uniHalo.time.value = this.uniFlare.time.value = shaderTiming;
		}
		return sun;
	}
}
