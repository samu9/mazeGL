function animate() {
    requestAnimationFrame( animate ); 
    stats.begin();

    position = [(controls.getObject().position.x - halfBlock)/blockDim,(controls.getObject().position.z - halfBlock)/blockDim];
    newGridPos = [Math.floor(position[0]) + 1, Math.floor(position[1]) + 1];

    var direction;

    /* ENTERING A NEW BLOCK */
    if((gridPos[0] != newGridPos[0]) || (gridPos[1] != newGridPos[1])){
        
        direction = [newGridPos[0] - gridPos[0], newGridPos[1] - gridPos[1]];

        /* MAZE MANAGMENT */
        buildGrid(newGridPos,direction);
        reorderBlocks();
        while(closestBlocks.length > 0){ 
            labyrinth();
            reorderBlocks();
        }   
        clearGrid(newGridPos,direction);
    
        
        /* UPDATING POSITION */
        gridPos[0] = newGridPos[0];
        gridPos[1] = newGridPos[1];
        
        wallsId = (newGridPos[0] + "-" + newGridPos[1] in meshMap)? meshMap[newGridPos[0] + "-" + newGridPos[1]].split("-").slice(2) : false;

        
        updateInfo(); 
    }
    
    checkCollision();

    renderer.render( scene, camera );

    stats.end();
}