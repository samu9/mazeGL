var blockDim = 50; //dimensione del blocco
var halfBlock = blockDim/2;
var gridDim = 9; //dimensione della griglia di renderizzazione dei blocchi
var halfGrid = Math.floor(gridDim/2);
var lightColor = 0xffe66b; //colore delle luci nel shaderMaterial
var camSpeed = 1.5; //velocità di navigazione della camera
var wallEdge = 5; //distanza minima prima della collisione con una parete

var debug = true; 