Listeners = function(document)
{
    this.blocker = document.getElementById( 'blocker' );
    this.instructions = document.getElementById( 'instructions' );
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    window.addEventListener( 'resize', this.onWindowResize, false );
    var element = document.body;
    if ( havePointerLock ) {
        
        this.hookLockStateChangeEvents();


        this.instructions.addEventListener( 'click', function ( event ) {
            this.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if ( /Firefox/i.test( navigator.userAgent ) ) 
            { 
                document.addEventListener( 'fullscreenchange', this.fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', this.fullscreenchange, false );
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();
            } else {
                element.requestPointerLock();
            }
        }, false );
    } else {
        this.instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
}

Listeners.prototype.fullscreenchange = function ( event ) {
    var element = document.body;
    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) 
    {
        document.removeEventListener( 'fullscreenchange', fullscreenchange );
        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
        element.requestPointerLock();
    }
}

Listeners.prototype.pointerlockchange = function ( event ) {
    var element = document.body;
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) 
        {
            controls.enabled = true;
            blocker.style.display = 'none';
            } else {
                controls.enabled = false;
                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';
                instructions.style.display = '';
            }
        }

Listeners.prototype.pointerlockerror = function ( event ) {
            instructions.style.display = '';
}

Listeners.prototype.hookLockStateChangeEvents = function()
{
    document.addEventListener( 'pointerlockchange', this.pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', this.pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', this.pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', this.pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', this.pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', this.pointerlockerror, false );

}

Listeners.prototype.onWindowResize = function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
            }


