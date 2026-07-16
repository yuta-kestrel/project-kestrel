// ======================================
// Project Kestrel
// Ver.1.0β
// E-5 Center Version
// app.js
// ======================================



// ================================
// グリッド設定
// ================================

const GRID_INTERVAL_SECONDS = 20;

const GRID_INTERVAL =
    GRID_INTERVAL_SECONDS / 3600;



// ================================
// 表示範囲
// ================================

const GRID_ROWS = 9;

const GRID_COLS = 9;



// ================================
// 基準マス
// ================================

// 小松空港滑走路中心 = E-5

const CENTER_ROW = "E";

const CENTER_COL = 5;



// ================================
// 小松空港滑走路中心座標
// ================================

const GRID_CENTER = {

    lat:36.394800,

    lng:136.407600

};



// ================================
// レイヤー
// ================================

let droneLayer;

let gridLayer;

let labelLayer;


let selectedGrid = null;

let crossMarker = null;



// ================================
// Leaflet Pane設定
// ================================


// 飛行禁止区域

map.createPane("dronePane");

map.getPane("dronePane").style.zIndex = 350;


// グリッド

map.createPane("gridPane");

map.getPane("gridPane").style.zIndex = 450;


// ラベル

map.createPane("labelPane");

map.getPane("labelPane").style.zIndex = 500;


// マーカー

map.createPane("markerPane");

map.getPane("markerPane").style.zIndex = 600;





// ================================
// 地図初期化
// ================================

const map = L.map("map")

.setView(

    [

        GRID_CENTER.lat,

        GRID_CENTER.lng

    ],

    14

);





// ================================
// 国土地理院 標準地図
// ================================


L.tileLayer(

    "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",

{

    attribution:
    "© 国土地理院",

    maxZoom:18

}

)

.addTo(map);






// ================================
// 小型無人機等飛行禁止区域
// 警察庁
// 常時表示
// ================================


droneLayer = L.tileLayer(

    "https://cyberjapandata.gsi.go.jp/xyz/uav/{z}/{x}/{y}.png",

{

    pane:"dronePane",

    opacity:0.55,

    maxZoom:18,


    attribution:
    "小型無人機等飛行禁止法（警察庁）"


}

);


droneLayer.addTo(map);






// ================================
// 自作レイヤー
// ================================


gridLayer = L.layerGroup();

gridLayer.addTo(map);



labelLayer = L.layerGroup();

labelLayer.addTo(map);








// ================================
// グリッド描画
// ================================


function drawGrid(){


gridLayer.clearLayers();

labelLayer.clearLayers();




const centerRowIndex =
CENTER_ROW.charCodeAt(0)-65;



const startLat =
GRID_CENTER.lat
+
centerRowIndex
*
GRID_INTERVAL;



const startLng =
GRID_CENTER.lng
-
(CENTER_COL-1)
*
GRID_INTERVAL;





// 横線

for(
let r=0;
r<=GRID_ROWS;
r++
){


const lat =
startLat
-
r*GRID_INTERVAL;



L.polyline(

[

[lat,startLng],

[
lat,
startLng+
GRID_COLS*
GRID_INTERVAL
]

],

{

color:"#4da6ff",

weight:1.2,

pane:"gridPane"

}

)

.addTo(gridLayer);


}






// 縦線

for(
let c=0;
c<=GRID_COLS;
c++
){



const lng =
startLng+
c*
GRID_INTERVAL;




L.polyline(

[

[
startLat,
lng
],

[
startLat-
GRID_ROWS*
GRID_INTERVAL,

lng
]

],

{

color:"#4da6ff",

weight:1.2,

pane:"gridPane"

}

)

.addTo(gridLayer);



}







// 数字

for(
let c=0;
c<GRID_COLS;
c++
){


addLabel(

startLat+
GRID_INTERVAL*0.25,

startLng+
(c+0.5)
*
GRID_INTERVAL,

c+1

);


}






// アルファベット

for(
let r=0;
r<GRID_ROWS;
r++
){


addLabel(

startLat-
(r+0.5)
*
GRID_INTERVAL,

startLng-
GRID_INTERVAL*0.25,

String.fromCharCode(
65+r
)

);


}


}






// ================================
// ラベル
// ================================


function addLabel(lat,lng,text){


L.marker(

[lat,lng],

{

pane:"labelPane",

interactive:false,


icon:L.divIcon({

className:"grid-label",

html:
"<b>"+text+"</b>"

})


}

)

.addTo(labelLayer);


}








// ================================
// Grid ID
// ================================


function getGridId(lat,lng){


const row =
Math.floor(

(GRID_CENTER.lat-lat)
/GRID_INTERVAL

);



const col =
Math.floor(

(lng-GRID_CENTER.lng)
/GRID_INTERVAL

);



return (

String.fromCharCode(
CENTER_ROW.charCodeAt(0)+row
)

+

"-"

+

(
CENTER_COL+col
)

);


}







// ================================
// マス中心
// ================================


function getGridCenter(lat,lng){


const row =
Math.floor(

(GRID_CENTER.lat-lat)
/GRID_INTERVAL

);



const col =
Math.floor(

(lng-GRID_CENTER.lng)
/GRID_INTERVAL

);




return {


lat:
GRID_CENTER.lat
-
(row+0.5)
*
GRID_INTERVAL,



lng:
GRID_CENTER.lng
+
(col+0.5)
*
GRID_INTERVAL


};


}







// ================================
// 選択マス
// ================================


function drawSelectedGrid(lat,lng){


if(selectedGrid){

map.removeLayer(selectedGrid);

}



const center =
getGridCenter(lat,lng);



selectedGrid =
L.rectangle(

[

[
center.lat-GRID_INTERVAL/2,
center.lng-GRID_INTERVAL/2
],

[
center.lat+GRID_INTERVAL/2,
center.lng+GRID_INTERVAL/2
]

],

{

color:"#0066ff",

weight:3,

fillColor:"#66b3ff",

fillOpacity:0.35

}

)

.addTo(map);



}







// ================================
// 十字表示
// ================================


function drawCross(lat,lng){


if(crossMarker){

map.removeLayer(crossMarker);

}



crossMarker =

L.marker(

[lat,lng],

{

pane:"markerPane",

interactive:false,


icon:L.divIcon({

className:"cross-marker",

html:"✚",

iconSize:[
30,
30
]

})


}

)

.addTo(map);



}







// ================================
// 初期表示
// ================================


drawGrid();






// ================================
// 地図移動
// ================================


map.on(

"moveend",

function(){

drawGrid();

}

);








// ================================
// 長押し
// ================================


map.on(

"contextmenu",

function(e){



const lat =
e.latlng.lat;


const lng =
e.latlng.lng;




drawSelectedGrid(
lat,
lng
);



drawCross(
lat,
lng
);





const gridId =
getGridId(
lat,
lng
);





const center =
getGridCenter(
lat,
lng
);





document
.getElementById("info")
.innerHTML =



"<b>Project Kestrel</b><br><br>"+


"<b>Grid ID</b><br>"+
gridId+


"<br><br>"+


"<b>Grid Center</b><br>"+
center.lat.toFixed(6)+
"<br>"+
center.lng.toFixed(6)+


"<br><br>"+


"<b>Selected Point</b><br>"+
lat.toFixed(6)+
"<br>"+
lng.toFixed(6);



}

);
