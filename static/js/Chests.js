Chests = function()
{
    this.chests=[];
    this.counter =0;
    this.locations =
    [
        [-70,10,15],
        [58,5.6,-25],
        [76,5.6,0]

    ];

    //document.body.addEventListener( 'contextmenu', function(){console.log("adkjajdosjkdao")}, false );

}

Chests.prototype.addChests = function(object)
{
    for (var i = 0; i <3; i++) {
        this.chests[i]= new Chest(object.clone());
        this.chests[i].getObject().position.set(this.locations[i][0],this.locations[i][1],this.locations[i][2]);
        this.chests[i].id = i;
        scene.add(this.chests[i].getObject());
    };
    this.setChestsContent();
}

Chests.prototype.isEmpty = function()
{
    if (this.chests.length== 0) {
        return true;
    }
    return false;
}

Chests.prototype.getSelectedChest = function(stick)
{

    for (var i = this.chests.length - 1; i >= 0; i--) {
        var chestDistance = stick.intersectObject(this.chests[i].getObject());
        if (chestDistance.length>0) 
        {
            return this.chests[i];
        }
    }
}
Chests.prototype.setChestsContent= function()
{
    this.chests[0].addWeapon("middleSword",1);
    this.chests[0].addWeapon("longSword",1);
    this.chests[0].addWeapon("knife",2);
    this.chests[0].addWeapon("bow",1);
    this.chests[0].addWeapon("arrow",6);
    this.chests[1].addWeapon("bow",1);
    this.chests[1].addWeapon("arrow",6);
    this.chests[1].addWeapon("middleSword",1);
    this.chests[1].addWeapon("longSword",1);
    this.chests[2].addWeapon("longSword",1);
    this.chests[2].addWeapon("knife",3,1);
    this.chests[2].addWeapon("middleSword",1);
    this.chests[2].addWeapon("longSword",1);

}