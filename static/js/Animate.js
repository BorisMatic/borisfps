function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if(controls.enabled){
        world.step(dt);
    }

    var position = new THREE.Vector3();
    position.setFromMatrixPosition( camera.matrixWorld );

    terrain.setSkyBoxPosition(position);

    controls.update( Date.now() - time );

    players.animate(delta);

//--------------------------------igranje sa menjanjem animacija------------------------

    frameDelta += clock.getDelta();
    while (frameDelta >= INV_MAX_FPS) {
        // update(INV_MAX_FPS); // calculate physics
        frameDelta -= INV_MAX_FPS;
    }
    controls.changeState(clock.getElapsedTime());

//---------------------------------------------------------------------------------------------
               

                //------igranje sa raycasterom---------------------------
               // raycaster.ray.origin.copy( position );
               // raycaster.ray.direction=controls.getRot();

                raycaster.set(position,controls.getRot());
                //document.getElementById("rotacija").innerHTML = raycaster.ray.origin.x;
                //console.log(scene.getObjectByName( "stub" ));
               // var boxDistance = raycaster.intersectObject(scene.getObjectByName( "chest" ));
             /*   if (boxDistance.length>0) 
                {
                   document.getElementById("rotacija").innerHTML = "true"; 
                }
                else
                {
                    document.getElementById("rotacija").innerHTML = "false";
                }*/
                ///document.getElementById("rotacija").innerHTML = chest;
                //console.log(controls.getRot());

                //document.getElementById("rotacija").innerHTML = controls.getRot().x + "<br>" +controls.getRot().y +"<br>"+controls.getRot().z;
                //-------------------------------------------------------
               // document.getElementById("rotacija").innerHTML = controls.getState();

                        // Update ball positions
                    for(var i=0; i<balls.length; i++){
                        ballMeshes[i].position.copy(balls[i].position);
                        ballMeshes[i].quaternion.copy(balls[i].quaternion);
                    }

    var statDat= 
    {
        pos:position,
        rot:(controls.getAngles()-3.14),
        state:controls.getState(),
        att:controls.getAttack(),
        weaponAttack :controls.getWeaponAttack()
    }
    renderer.render( scene, camera );
    socket.emit('moved', statDat);
    time = Date.now();

}