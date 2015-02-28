            var sphereShape, sphereBody, world, physicsMaterial, balls=[], ballMeshes=[], boxes=[];
            var dt = 1/60;
            var camera, scene, renderer;
            var geometry, material, mesh;
            var controls,time = Date.now();
            var rotWorldMatrix;
            var players = new Array();
            var ett ;
            var ett2 ;
            var animation;
            var myName;
            var clock = new THREE.Clock();
            INV_MAX_FPS = 1 / 60;
            frameDelta = 0;
            var socket = io();
            var rememberedTime =0;
            var jsonObjectLoader = new JsonObjects();

            raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(0,0,1), 0, 100 );

            
            var listeners = new Listeners(document);

            initCannon();
            init();
            animate();

