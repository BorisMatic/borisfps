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

document.body.onclick = function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 

    if (canRightClick && isRightMB && !chests.isEmpty()) {
        var selectedChest=chests.getSelectedChest(controls.getStick());
        if (selectedChest!= undefined && !selectedChest.locked) {
            var lockedChestData={
                lock :true,
                chestId    : selectedChest.id
            };
            socket.emit('setLockChest', lockedChestData);
            document.getElementById('available-weapons').style.visibility = "visible";
            $( '#available-weapons' ).attr("data_chest", selectedChest.id);
            document.exitPointerLock();
            var innerHtml="";
            for (var i = 0; i < 6; i++) {
                if (selectedChest.getWeapons()[i]!= undefined) {
                    innerHtml = innerHtml + "<div class='weaponContainer' data_weapon='" + selectedChest.getWeapons()[i].weapon + "' data_chest='" + selectedChest.id + "' data_number='" + selectedChest.getWeapons()[i].number + "' id='" + selectedChest.getWeapons()[i].weapon + "' ><h3>" + selectedChest.getWeapons()[i].weapon + "</h3></div>";
                } else {
                    innerHtml = innerHtml + "<div class='weaponContainer'></div>";
                }         
            }
            $("#container").html(innerHtml);
        }
    }
} 

$( document ).ready(function(){
    $("#x").click(function(){
        var lockedChestData={
            lock :false,
            chestId    : $( '#available-weapons' ).attr("data_chest")
        };
        socket.emit('setLockChest', lockedChestData);
        document.getElementById('available-weapons').style.visibility = "hidden";
        document.body.requestPointerLock();
    });

    $("#container").on('click','.weaponContainer',function(){
        var added = controls.addWeapon(this.id,$( this ).attr("data_number"));
        if (added) {
            chests.chests[parseInt($( this ).attr("data_chest"))].removeWeapon($( this ).attr("data_weapon"));
            var removedData = {
                chestId    : parseInt($( this ).attr("data_chest")),
                weaponName : $( this ).attr("data_weapon")
            };
            socket.emit('removeChestWeapon', removedData);
            $( this ).attr("id","");
            $( this ).html("");
        }       
    });
});




