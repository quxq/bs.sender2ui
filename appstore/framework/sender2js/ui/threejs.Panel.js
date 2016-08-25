(function($){
	
	var treejs={url:document.corejspath+"/plugins/threejs/three.min.js"};
	var webglsuport={url:document.corejspath+"/plugins/threejs/Detector.js"};
	var jsonloader={url:document.corejspath+"/plugins/threejs/loader/AssimpJSONLoader.js"};
    var obbitcontrols={url:document.corejspath+"/plugins/threejs/controls/OrbitControls.js"};
    var TrackballControls={url:document.corejspath+"/plugins/threejs/controls/TrackballControls.js"};

	$.fn.extend({
		"threejs.Panel":function(){
			var self=this;
			
			self.scene;//场景
			self.renderer;
			var objects=[];
			var SELECTED,INTERSECTED;
			var offset;
			var intersection;
			self.doLayout=function(){
				
				var parent=self.parent();
				if(self.renderer){
					self.renderer.setSize(parent.width(),parent.height());
				
				self.camera.aspect = window.innerWidth / window.innerHeight;
				self.camera.updateProjectionMatrix();
					
				}
				
			}
			
			
			self.addJsonObject=function(){
				var onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
			};

			var onError = function ( xhr ) {
			};

			// Load jeep model using the AssimpJSONLoader
			var loader1 = new THREE.AssimpJSONLoader();
			loader1.load( '/model/jeep/jeep.assimp.json', function ( object ) {
                object.castShadow = true;
				object.receiveShadow = true;
				object.scale.multiplyScalar( 0.2 );
				
				var m=object.children[0];
                objects.push(m);
			    var geometry = new THREE.BoxGeometry(1,1,1 );
				var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
				var mesh = new THREE.Mesh( geometry, material );
				//console.log(m);
				mesh.position=m.position;
				
				mesh.position.y=m.geometry.boundingSphere.radius+1;
				mesh.visible=false;
				m.add( mesh );
				self.scene.add(object);
				console.log(m)
			}, onProgress, onError );

			// load interior model
			var loader2 = new THREE.AssimpJSONLoader();
			loader2.load( '/model/interior/interior.assimp.json', function ( object ) {
                object.castShadow = true;
					object.receiveShadow = true;
				self.scene.add( object );
                objects.push(object);
			}, onProgress, onError );

              animate();
			  self.doLayout();
			}
			var radius = 600;
			var theta = 0;

			function render(){
				var timer = Date.now() * 0.0005;

//				self.camera.position.x = Math.cos( timer ) * 10;
//				self.camera.position.y = 4;
//				self.camera.position.z = Math.sin( timer ) * 10;
                 theta += 0.1;

//				self.camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
//				self.camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
//				self.camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
//				self.camera.lookAt(self.scene.position );

				
                self.camera.updateMatrixWorld();
	// calculate objects intersecting the picking ray
		 
                //self.controls.update();
				self.camera.lookAt( self.scene.position );

				self.renderer.render(self.scene,self.camera );
			}
			
			
			var t = 0;
			function animate() {

				requestAnimationFrame( animate );

				render();
				//stats.update();
			}
			
			function iswebglsuport(){
				
				if (!Detector.webgl) {
				    Detector.addGetWebGLMessage();
			     }
			}
			
//			function onDocumentMouseMove( event ) {
//
//				event.preventDefault();
//
//				self.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//				self.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//			
//			}
			
			
			function onDocumentMouseMove( event ) {

				event.preventDefault();

				self.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				self.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				self.raycaster.setFromCamera( self.mouse, self.camera );

				if ( SELECTED ) {

					if ( self.raycaster.ray.intersectPlane( self.plane,intersection ) ) {

						SELECTED.position.copy(intersection.sub(offset) );

					}

					return;

				}

				var intersects = self.raycaster.intersectObjects(objects);
               // console.log(intersects);
				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[0].object ) {

						if ( INTERSECTED ){
							 INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
							
							 //alert(INTERSECTED.material);
						}
						

						INTERSECTED = intersects[0].object;
						INTERSECTED.material.transparent=true;
					    INTERSECTED.material.opacity=0.3;
						if(INTERSECTED.children.length>0){
							INTERSECTED.children[0].visible=true;
						}
						INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                       
						self.plane.setFromNormalAndCoplanarPoint(
							self.camera.getWorldDirection(self. plane.normal ),
							INTERSECTED.position );

					}

					self.get(0).style.cursor = 'pointer';

				} else {

					if ( INTERSECTED ) {
						INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                        INTERSECTED.material.transparent=false;
					    INTERSECTED.material.opacity=0;
						if(INTERSECTED.children.length>0){
							INTERSECTED.children[0].visible=false;
						}
					}
					INTERSECTED = null;

					self.get(0).style.cursor = 'auto';

				}

			}
			
			function onDocumentMouseDown( event ) {

				event.preventDefault();
				

				self.raycaster.setFromCamera(self.mouse, self.camera );

				var intersects = self.raycaster.intersectObjects( objects );

				if ( intersects.length > 0 ) {

					self.controls.enabled = false;

					SELECTED = intersects[ 0 ].object;
                    //SELECTED.parent.visible=false;
					SELECTED.material.transparent=true;
					SELECTED.material.opacity=0.3;
					//alert(SELECTED.name);
					console.log(SELECTED)
					if ( self.raycaster.ray.intersectPlane(self.plane, intersection ) ) {

						offset.copy(intersection ).sub( SELECTED.position );

					}

					self.get(0).style.cursor = 'move';

				}

			}

			function onDocumentMouseUp( event ) {

				event.preventDefault();

				self.controls.enabled = true;

				if ( INTERSECTED ) {
                    SELECTED.material.transparent=false;
					SELECTED.material.opacity=0;
					SELECTED = null;

				}

				//container.style.cursor = 'auto';

			}

			
			
			function Mouse_Down(event){
				 self.raycaster.setFromCamera(self.mouse,self.camera );	
               var intersects = self.raycaster.intersectObjects(objects);
               console.log( intersects.length );
               if ( intersects.length > 0 ) {

					self.controls.enabled = false;

					SELECTED = intersects[ 0 ].object;
                   alert(SELECTED);

				}
			}
			
			function loadjs_complet(){
				//$.jsImport("treejs.webglsuport",webglsuport,iswebglsuport);
				 offset = new THREE.Vector3(),
			    intersection = new THREE.Vector3()	
			   self.plane = new THREE.Plane();		
               self.raycaster = new THREE.Raycaster();
               self.mouse = new THREE.Vector2();				
				self.camera = new THREE.PerspectiveCamera( 50, self.width() / self.height(), 1, 2000 );
				self.camera.position.set( 2, 4, 5 );
//               self.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
//				self.camera.position.z = 1000;

				self.scene= new THREE.Scene();//初始化场景	
				
				self.scene.fog = new THREE.FogExp2( 0x000000, 0.035 );
				// Lights
				self.scene.add( new THREE.AmbientLight( 0xcccccc ) );
				var directionalLight = new THREE.DirectionalLight( 0xeeeeee );
				directionalLight.position.x = Math.random() - 0.5;
				directionalLight.position.y = Math.random();
				directionalLight.position.z = Math.random() - 0.5;
				directionalLight.position.normalize();
				self.scene.add( directionalLight );

				// Renderer
				self.renderer = new THREE.WebGLRenderer();
				self.renderer.physicallyCorrectLights = true;
				self.renderer.setPixelRatio( window.devicePixelRatio );
				self.renderer.setSize( window.innerWidth, window.innerHeight );
				self.renderer.gammaInput = true;
				self.renderer.gammaOutput = true;
				self.renderer.shadowMap.enabled = true;
				self.renderer.toneMapping = THREE.ReinhardToneMapping;
				self.append( self.renderer.domElement );

//               var geometry = new THREE.BoxGeometry( 40, 40, 40 );
//
//				for ( var i = 0; i < 200; i ++ ) {
//
//					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
//
//					object.position.x = Math.random() * 1000 - 500;
//					object.position.y = Math.random() * 600 - 300;
//					object.position.z = Math.random() * 800 - 400;
//
//					object.rotation.x = Math.random() * 2 * Math.PI;
//					object.rotation.y = Math.random() * 2 * Math.PI;
//					object.rotation.z = Math.random() * 2 * Math.PI;
//
//					object.scale.x = Math.random() * 2 + 1;
//					object.scale.y = Math.random() * 2 + 1;
//					object.scale.z = Math.random() * 2 + 1;
//
//					object.castShadow = true;
//					object.receiveShadow = true;
//
//					self.scene.add( object );
//
//					objects.push( object );
//
//				}

//                self.renderer = new THREE.WebGLRenderer( { antialias: true } );
//				self.renderer.setClearColor( 0xf0f0f0 );
//				self.renderer.setPixelRatio( window.devicePixelRatio );
//				self.renderer.setSize( window.innerWidth, window.innerHeight );
//				self.renderer.sortObjects = false;
//
//				self.renderer.shadowMap.enabled = true;
//				self.renderer.shadowMap.type = THREE.PCFShadowMap;
//				
//				self.append( self.renderer.domElement );
//				$.jsImport("treejs.TrackballControls",TrackballControls,function(){
//					
//					self.controls = new THREE.TrackballControls(self.camera );
//					self.controls.rotateSpeed = 1.0;
//					self.controls.zoomSpeed = 1.2;
//					self.controls.panSpeed = 0.8;
//					self.controls.noZoom = false;
//					self.controls.noPan = false;
//					self.controls.staticMoving = true;
//					self.controls.dynamicDampingFactor = 0.3;
//				});

                $.jsImport("treejs.oritcontrols",obbitcontrols,function(){
					self.controls = new THREE.OrbitControls(self.camera,self.renderer.domElement );
				//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
				self.controls.enableDamping = true;
				self.controls.dampingFactor = 0.25;
				self.controls.enableZoom = true;
					
				});
				
				
				self.renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
				self.renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
				self.renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );




				//self.on("mousedown",Mouse_Down);
				//self.on("mousemove",onDocumentMouseMove);
				
				$.jsImport("treejs.jsonloader",jsonloader,self.addJsonObject);
			}
			
			self.init=function(){
				$.jsImport("treejs",treejs,loadjs_complet);
				
			};
			
			self.data("comp", self);
			
			return self;
		}
	});
	
})(jQuery)