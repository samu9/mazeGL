/*
var direction = 1;
function moveBox(){
    var boxW = box.geometry.parameters.width;
    
    //if((box.position.x - boxW/2) > -halfBlock && (box.position.x + boxW/2) < halfBlock)
        
    if((box.position.x + boxW/2) == halfBlock)
        direction = -1;
    else if((box.position.x - boxW/2) == -halfBlock)
        direction = 1;

    box.position.x += direction;
}
*/
function animate() {
    requestAnimationFrame( animate ); 
    stats.begin();

    position = [(controls.getObject().position.x - halfBlock)/blockDim,(controls.getObject().position.z - halfBlock)/blockDim];
    newGridPos = [Math.floor(position[0]) + 1, Math.floor(position[1]) + 1];
    //console.log(newGridPos);

    //wallMaterial.uniforms.effect.value = lightEffect;

    var direction;
    if((gridPos[0] != newGridPos[0]) || (gridPos[1] != newGridPos[1])){
        
        direction = [newGridPos[0] - gridPos[0], newGridPos[1] - gridPos[1]];
        
        //console.clear();

        /* GESTISCO IL LABIRINTO */
        buildGrid(newGridPos,direction); //ricostruisco la mappa già generata che è in griglia
        reorderBlocks(); //riordino i blocchi da cui generare in base alla distanza
        while(closestBlocks.length > 0){ 
            labyrinth(); //genero il labirinto
            reorderBlocks(); //riordino
        }   
        //clearGrid(newGridPos,direction); //rimuovo i blocchi fuori griglia
    
        
        if(wallsId.length > 0){
            var object = scene.getObjectById(parseInt(wallsId[0]));
            console.log([object.position.x,object.position.z] );
        }
        else
            console.log("no walls");
        
        /* AGGIORNO POSIZIONE */
        gridPos[0] = newGridPos[0];
        gridPos[1] = newGridPos[1];
        
        wallsId = (newGridPos[0] + "-" + newGridPos[1] in meshMap)? meshMap[newGridPos[0] + "-" + newGridPos[1]].split("-").slice(2) : false;

        /* stampo posizione e lista dei blocchi */
        var temp = "closestBlocks:<br>";
        for(var i = 0; i < closestBlocks.length; i++)
            temp += closestBlocks[i] + "<br>";

        temp += "nextBlocks:<br>";
        for(var i = 0; i < nextBlocks.length; i++)
            temp += nextBlocks[i] + "<br>"; 
        paramBox.innerHTML = "gridX: " + newGridPos[0] + "<br>" + "gridZ: " + newGridPos[1] + "<br>" + temp;
    }
    checkCollision();

    renderer.render( scene, camera );

    stats.end();
}