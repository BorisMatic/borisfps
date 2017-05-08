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
               
    controls.setStick();

    // Update ball positions
    controls.animateBalls();
    flyingObjects.animateObjects();

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