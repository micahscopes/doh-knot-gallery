
			var container, stats;
			var camera, scene, projector, renderer;
			var mesh, referenceObject;
			var uniforms;

			var radius= 1000;
			var rotationSpeed = 0.3;
			var pauseSpeed = 1;

			var targetYRotation = targetXRotation = 0;
			var targetYRotationOnMouseDown = targetXRotationOnMouseDown = 0;

			var mouseX = 0, mouseY = 0;
			var mouseXOnMouseDown = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;


			window.onload = function(){
				init();
				setInterval( function () {
				    requestAnimationFrame( animate );
				}, 1000 / 40 );
				console.log("Loading");
			}


			function init() {

				// container = document.getElementById('gl-container');
				infoContainer = document.getElementsByTagName('main')[0];
				if(infoContainer == null){
					infoContainer = document.createElement( 'div' );
					infoContainer.id = 'info-container';
					document.body.appendChild(infoContainer);
				}
				container = document.createElement( 'div' );
				container.id = 'gl-container';
				document.body.appendChild(container);


				var infoTop = document.createElement( 'div' );
				infoTop.style.padding = "0 100px";
				infoTop.style.textAlign = 'center';

				infoTop.innerHTML = '<h4>The cube undergoes a Moebius transformation.  <br/>Dragging the mouse moves the camera. The left & right arrow keys decrement and increment rotation speed. Spacebar to pause.</h4>';

				var refs = document.createElement( 'div' );
				refs.style.position = 'absolute';
				refs.style.left = "0px";
				refs.style.bottom = '10px';
				refs.style.width = '98%';
				refs.style.padding = '0px 5px';
				refs.style.textAlign = 'justify';

				refs.innerHTML= '<h1 style = "text-align:center;">hyperspective cube</h1>' +
								'<p/>References: <a href="http://spacesymmetrystructure.wordpress.com/category/Inversion/" alt="Quite a coincidence that he also used a horse...">Daniel Piker\'s blog posts</a>, '+
								'<a href="http://www.youtube.com/watch?v=JX3VmDgiFnY" alt="youtube.com">Moebius Transformations Revealed</a>, '+
								'Wikipedia: <a href="http://wikipedia.org/wiki/Stereographic_projection">Stereographic projection</a>, <a href="http://wikipedia.org/wiki/Mobius_group">Möbius transformation</a>, <a href="http://en.wikipedia.org/wiki/Rotations_in_4-dimensional_Euclidean_space#Isoclinic_decomposition">Isoclinic decomposition.</a>' +
								'<p/>Credits: Built in <a href="http://github.com/mrdoob/three.js" target="_blank">three.js</a>. ' +
								'Horse model by <a href="http://mirada.com/">mirada</a> (as seen in <a href="http://ro.me">rome</a>). Hypertext,' +
								' composition & shaders by <a href="http://soundcloud.com/micahphones">micahphones</a>. ' +'<a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc/3.0/80x15.png" /></a>';

				infoContainer.appendChild( infoTop );
				infoContainer.appendChild( refs );

				//

				scene = new THREE.Scene();
				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 300, 100000 );
				scene.add( camera );

				camera.target = new THREE.Vector3( 0, 150, 3000 );
				camera.position.x = 2000;

				//

				var light = new THREE.DirectionalLight( 0xefefff, 2 );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );

				var light = new THREE.DirectionalLight( 0xffefef, 2 );
				light.position.set( -1, -1, -1 ).normalize();
				scene.add( light );

				uniforms = {
					leftIsoclinic: {
						type: 'fv1', // a float
						value: [1,0,0,0] // an empty Matrix4
					},
					rightIsoclinic: {
						type: 'fv1', // a float
						value: [1,0,0,0] // an empty Matrix4
					},
					radius: {
						type: 'f', // a float
						value: 200 // an empty Matrix4
					},
					offset: {
						type: 'fv1',
						value: [0,-110,0]
					}
				};
				//var modelLoader = new THREE.JSONLoader( true );

				$('#vertexshader').load('../shaders/moebiusVertex.glsl', function () {
					$('#fragmentshader').load('../shaders/spaceIceCream.glsl',function() {
							var geometry = new THREE.BoxGeometry(300,300,300,70,70,70);
							var shaderMaterial = new THREE.ShaderMaterial({
								uniforms:     	uniforms,
								vertexShader:   $('#vertexshader').text(),
								fragmentShader: $('#fragmentshader').text(),
								morphTargets: false,
								wireframe: false,
								side: THREE.DoubleSide
							});

							var referenceObjectMaterial = new THREE.MeshBasicMaterial({wireframe: false, color: "0x444444"})	;
							referenceObject = new THREE.Mesh( new THREE.BoxGeometry(350,0,350), referenceObjectMaterial);
							mesh = new THREE.Mesh( geometry, shaderMaterial );
							mesh.position.y = 0;
							scene.add( mesh );
							//scene.add( referenceObject);
							referenceObject.position.x += uniforms.offset.value[0];
							referenceObject.position.y += uniforms.offset.value[1];
							referenceObject.position.z += uniforms.offset.value[2];
					})
				});


				//

				renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
				renderer.sortObjects = false;
				function adjustSize(){
					renderer.setSize( window.innerWidth, window.innerHeight );
					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();
				}
				window.onresize = adjustSize;
				adjustSize();

				container.appendChild(renderer.domElement);

				//

				// stats = new Stats();
				// stats.domElement.style.position = 'absolute';
				// stats.domElement.style.top = '0px';
				// container.appendChild( stats.domElement );

				document.addEventListener( 'keyup', onKeypress, false );
				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
			}

						function onDocumentMouseDown( event ) {

				//event.preventDefault();

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mouseout', onDocumentMouseOut, false );

				mouseXOnMouseDown = event.clientX - windowHalfX;
				mouseYOnMouseDown = event.clientY - windowHalfY;
				targetYRotationOnMouseDown = targetYRotation;
				targetXRotationOnMouseDown = targetXRotation;
			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

				targetYRotation = targetYRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
				targetXRotation = Math.max(-4,Math.min(4,targetXRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.02));

			}

			function onDocumentMouseUp( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}

			function onDocumentMouseOut( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}

			function onKeypress (event) {
				console.log(event.keyCode)
				if (event) {
					switch (event.keyCode) {
						case 37:
							rotationSpeed -= 0.5;
							break;
						case 39:
							rotationSpeed += 0.5;
							break;
						case 27:
							c = renderer.domElement.style["z-index"];
							c = c == 0 ? 1 : c;
							renderer.domElement.style["z-index"] = c*-1;
							break;
						case 32:
							if (rotationSpeed == 0) {
								rotationSpeed = pauseSpeed;
							} else {
								pauseSpeed = rotationSpeed;
								rotationSpeed = 0;
							}
							break;
						}

				}
			}

			function animate() {
				render();
//				stats.update();

			}

			var q = new THREE.Quaternion();
			var rotationVector = new THREE.Vector3( 0.3,5,1);
			rotationVector.normalize();
			var theta = 2.5;
			var ms = Date.now();
			var duration = 1000;
			var keyframes = 15, interpolation = duration / keyframes;
			var lastKeyframe = 0, currentKeyframe = 0;

			function render() {
				theta += rotationSpeed*(Date.now()-ms)/800;
				ms = Date.now();
				var th = theta;
				q.setFromAxisAngle( rotationVector, th );
				uniforms.leftIsoclinic.value = [q.x,q.y,q.z,q.w];
				uniforms.rightIsoclinic.value = [q.x,q.y,q.z,q.w];

				camera.position.x = radius*Math.cos(targetYRotation);
				camera.position.z = radius*Math.sin(targetYRotation);
				camera.position.y = radius*(Math.pow(Math.E,targetXRotation)-Math.pow(Math.E,-targetXRotation))+1200
				if ( referenceObject ) {
					camera.lookAt(referenceObject.position.clone().add(new THREE.Vector3(0,80,0)));
					if (camera.position.distanceTo(referenceObject.position) >1800) {
						mesh.doubleSided = true;
					} else {
						mesh.doubleSided = false;
					}
				}

				if ( mesh ) {

					// Alternate morph targets

					var time = Date.now() % duration;

					var keyframe = Math.floor( time / interpolation );

					if ( mesh.morphTargetInfluences) {
						if ( keyframe != currentKeyframe ) {

							mesh.morphTargetInfluences[ lastKeyframe ] = 0;
							mesh.morphTargetInfluences[ currentKeyframe ] = 1;
							mesh.morphTargetInfluences[ keyframe ] = 0;

							lastKeyframe = currentKeyframe;
							currentKeyframe = keyframe;
						}

						mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
						mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];
					}

				}

				renderer.render( scene, camera );