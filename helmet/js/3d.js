// init

// variables
var path = "./obj/nd/dome"
var designs = [
	path+"1.jpg",
	path+"2.jpg",
	path+"3.jpg",
	path+"4.jpg",
	path+"5.jpg"
];
var t1, t2, t3, t4, t5;
var textures;
var presets = [];
var currentD = 0;
var gun;

var pt1;
var pt2;

var normTexture; 
var normTexture2; 

var scene = new THREE.Scene();
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 5000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setFaceCulling(THREE.CullFaceNone);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls( camera );
controls.noPan = true;
controls.minDistance = 10;
controls.maxDistance = 55;
controls.minPolarAngle = Math.PI/4;
controls.maxPolarAngle = Math.PI*3/4;

var skyUrls = [
	'obj/env/wall3.jpg',
	'obj/env/wall3.jpg',
	'obj/env/ceiling.jpg', // ceiling
	'obj/env/floor.jpg', // floor
	'obj/env/wall2.jpg', // frontwall
	'obj/env/wall1.jpg'  // backwall

];


var cubeMap;


var shader; 

var skyBoxMaterial;

var skyBox;

camera.position.z = 35;


// Load Cube Map

var loadCubeMap = function(){

	cubeMap = THREE.ImageUtils.loadTextureCube(skyUrls);
	cubeMap.format = THREE.RGBFormat;
	shader = THREE.ShaderLib['cube'];
	shader.uniforms['tCube'].value = cubeMap;
	skyBoxMaterial = new THREE.ShaderMaterial({
		fragmentShader : shader.fragmentShader,
		vertexShader : shader.vertexShader,
		uniforms : shader.uniforms,
		depthWrite : false,
		side : THREE.BackSide
	});

	skyBox = new THREE.Mesh(
		new THREE.CubeGeometry(1000,1000,1000),
		skyBoxMaterial
	);

	scene.add(skyBox);
}
// File Loads
var loadFiles = function(){

	// Helmet Design Textures
	t1 = THREE.ImageUtils.loadTexture(designs[0]);
	t2 = THREE.ImageUtils.loadTexture(designs[1]);
	t3 = THREE.ImageUtils.loadTexture(designs[2]);
	t4 = THREE.ImageUtils.loadTexture(designs[3]);
	t5 = THREE.ImageUtils.loadTexture(designs[4]);

	textures = [t1, t2, t3, t4, t5];

	// Pad Textures
	pt1 = THREE.ImageUtils.loadTexture("obj/nd/pads.jpg");
	pt2 = THREE.ImageUtils.loadTexture("obj/nd/pads2.jpg");

	// Normals
	normTexture = THREE.ImageUtils.loadTexture("obj/nd/normal2.png");
	normTexture2 = THREE.ImageUtils.loadTexture("obj/nd/normal3.png"); 
}

var loadPresets = function(){
	for(var i = 0; i < 5; i++){

		if ( i != 4){
			presets[i] = 
				new THREE.MeshPhongMaterial({
					envMap: cubeMap,
					map: textures[i],
					reflectivity: 0.9,
					specular: new THREE.Color(1,1,1),
					shininess: 10,
				});
		}

		else{
			presets[i] = 
				new THREE.MeshPhongMaterial({
					envMap: cubeMap,
					map: textures[i],
					reflectivity: 0.9,
					specular: new THREE.Color(1,1,1),
					shininess: 10,
					normalMap: normTexture2
				});
		}
	}
}

var init = function(){
	loadFiles();
	loadLighting();
	loadCubeMap();
	loadPresets();
}

// Lighting

var loadLighting = function (){
	var ambientLight = new THREE.AmbientLight(0xdddddd);
	scene.add(ambientLight);


	var light1 = new THREE.DirectionalLight('white', 0.225)
	light1.position.set(2.6,1,3);
	scene.add(light1);

	var light2 = new THREE.DirectionalLight('white', 0.275)
	light2.position.set(-2,1,0);
	scene.add(light2);

	var light3 = new THREE.DirectionalLight('white', 0.75)
	light3.position.set(3,3,2);

	scene.add(light3);

	var light4 = new THREE.DirectionalLight('white', 0.05);
	light4.position.set(0, 2, 0);

	scene.add(light4);
}

// Object Loader

var loader = new THREE.JSONLoader();


loader.load("obj/nd/revo.json", function(geometry, materials){
	
	init();
	var texture2 = pt1;
	for(var i = 0; i < materials.length; i++){
		
		if(materials[i].name == "Helmet_Dome" || materials[i].name =="Face_Mask"){
			materials[i].envMap = cubeMap;
		}

		if(materials[i].name == "Helmet_Dome"){
			materials[i].map = textures[currentD];
			materials[i].reflectivity = 0.8;
		}

		if(materials[i].name =="Pads"){
			materials[i].map = texture2;
		}
	}


	var matface = new THREE.MeshFaceMaterial(materials);

	gun = new THREE.Mesh(geometry, matface);
	gun.scale.set(1,1,1);
	gun.translateY(-8);
	scene.add(gun);
	renderFunction();
} );


var $matbutton = $('.mat-buttons button');
	$matbutton.click( function(){
		var id = $(this).attr('id');
		console.log("click");
		//var tex = THREE.ImageUtils.loadTexture(currentD);
		if (id=="chrome"){

			
			var chromeMat = new THREE.MeshPhongMaterial({
				envMap: cubeMap,
				map: textures[currentD],
				reflectivity: 0.8,
				specular: new THREE.Color(1,1,1),
				shininess: 10
			});

			gun.material.materials[2] = chromeMat;


		}

		else if (id =="matte"){
			var matteMat = new THREE.MeshPhongMaterial({
				envMap: null,
				map: textures[currentD],
				specular: new THREE.Color(0.1,0.1,0.1),
				shininess: 15
			});

			gun.material.materials[2] = matteMat;
		}

		else if (id =="candy"){
			var candyMat = new THREE.MeshLambertMaterial({
				envMap: cubeMap,
				map:textures[currentD],
				reflectivity: 0.5,
				shininess: 20
			});

			gun.material.materials[2] = candyMat;
		}

		else if (id =="textured"){
			var texMat = new THREE.MeshPhongMaterial({
				envMap: cubeMap,
				map:textures[currentD],
				reflectivity: 0.9,
				shininess: 20,
				specular: new THREE.Color(1,1,1),
				normalMap: normTexture
			});

			gun.material.materials[2] = texMat;
		}
});

var $designButton = $('.design-buttons button');

$designButton.click(function(){
	var id = $(this).attr('id');
	currentD = id-1;
	
	var padTexture = pt1;

	if (id == "5"){
		var padTexture = pt2;
	}

	gun.material.materials[2] = presets[currentD];
	gun.material.materials[0].map = padTexture;

	if(id == "5"){
		var newFM = new THREE.MeshPhongMaterial({
			envMap: cubeMap,
			color: new THREE.Color("rgb(3, 88, 13)"),
			specular: new THREE.Color(1,1,1),
			shininess: 100,
			reflectivity: 1,
			refractionRatio: 1
		});
		gun.material.materials[6] = newFM;
	}

	else{
		var newFM = new THREE.MeshPhongMaterial({
			envMap: cubeMap,
			color: new THREE.Color(0xae9142),
			specular: new THREE.Color(1,1,1),
			shininess: 100
		});

		gun.material.materials[6] = newFM;
	}

});

var $faceMaskButton = $('.fm-buttons button');

$faceMaskButton.click(function(){
	var id = $(this).attr('id');
	var fmColor = new THREE.Color(0xae9142);

	if (id == "black"){
		fmColor = new THREE.Color(0x333333);	
	}

	else if (id == "blue"){
		fmColor = new THREE.Color(0x03133a);
	}

	else if (id == "green"){
		fmColor = new THREE.Color("rgb(3, 88, 13)");
	}

	else if (id == "white"){
		fmColor = new THREE.Color(0xeeeeee);
	}
		var newFM = new THREE.MeshPhongMaterial({
			envMap: cubeMap,
			color: fmColor,
			specular: new THREE.Color(0.8, 0.8, 0.8),
			shininess: 100
		});

		gun.material.materials[6] = newFM;
	
})

var resizeFunction = function(){
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

window.addEventListener('resize', resizeFunction, false);


// Animation Loop
var renderFunction = function(){
  requestAnimationFrame(renderFunction);
  controls.update();
  gun.rotation.y += 0.001;
  renderer.render(scene, camera);
}





