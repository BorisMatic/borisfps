 function initCannon(){
                // Setup our world
                world = new CANNON.World();
                world.quatNormalizeSkip = 0;
                world.quatNormalizeFast = false;

                var solver = new CANNON.GSSolver();

                world.defaultContactMaterial.contactEquationStiffness = 1e9;
                world.defaultContactMaterial.contactEquationRegularizationTime = 4;

                solver.iterations = 7;
                solver.tolerance = 0.1;
                var split = true;
                if(split)
                    world.solver = new CANNON.SplitSolver(solver);
                else
                    world.solver = solver;

                world.gravity.set(0,-50,0);
                world.broadphase = new CANNON.NaiveBroadphase();
                        // Materials
        var groundMaterial = new CANNON.Material("groundMaterial");
        // Adjust constraint equation parameters for ground/ground contact
        var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
            friction: 0.9,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRegularizationTime: 3,
            frictionEquationStiffness: 1e8,
            frictionEquationRegularizationTime: 3,
        });

        // Add contact material to the world
                world.addContactMaterial(ground_ground_cm);
                //-------------------------------------

                // Create a sphere
                var mass = 5, radius = 1.4;
                sphereShape = new CANNON.Sphere(radius);
                sphereBody = new CANNON.Body({ mass: mass , material: groundMaterial});
                sphereBody.addShape(sphereShape);
                sphereBody.position.set(0,2,0);
                sphereBody.linearDamping = 0.3;
                world.add(sphereBody);

                // Create a plane
                var k = new CANNON.Vec3(1,1,1);
                var groundShape = new CANNON.Plane(k);
                var groundBody = new CANNON.Body({ mass: 0 , material: groundMaterial});
                groundBody.addShape(groundShape);
                groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
               // world.add(groundBody);
               // world.gravity.set(-3,0,-60);
            }

            function init() {

                camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

                scene = new THREE.Scene();

                terrain = new Terrain(jsonObjectLoader);
                terrain.addToScene(scene);
                terrain.setSkyBoxPosition(camera.position);
                
                controls = new PointerLockControls( camera , sphereBody );//dodao loptu koju je definisao  gore
                scene.add( controls.getObject() );

               // addAnimated();
                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.shadowMapEnabled = true;
                //renderer.shadowMapSoft = true;
                renderer.setSize( window.innerWidth, window.innerHeight );
               // renderer.setClearColor( scene.fog.color, 1 );

                document.body.appendChild( renderer.domElement );

                

                
                // Add box
                var halfExtents = new CANNON.Vec3(23,4,51.7);
                var boxShape = new CANNON.Box(halfExtents);
                var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
                    var boxBody = new CANNON.Body();
                    boxBody.addShape(boxShape);
                    var boxMesh = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial({color: 'red' }));
                    boxMesh.name = "box";
                    world.add(boxBody);
                  //  scene.add(boxMesh);
                    boxBody.position.set(67,1.6,-15.5);
                    boxMesh.position.set(67,1.6,-15.5);
                    boxMesh.castShadow = true;
                    boxMesh.receiveShadow = true;

                 

            }