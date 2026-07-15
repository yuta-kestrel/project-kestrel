// ======================================
// Project Kestrel
// Ver.1.0β
// Part 1
// ======================================


// ===== グリッド設定 =====

// グリッド間隔（秒）
const GRID_INTERVAL_SECONDS = 20;

// 度へ変換
const GRID_INTERVAL = GRID_INTERVAL_SECONDS / 3600;


// ===== 表示設定 =====

// 行数（A～I）
const GRID_ROWS = 9;

// 列数（1～9）
const GRID_COLS = 9;


// ===== 中心マス =====

const CENTER_ROW = "C";
const CENTER_COL = 3;


// ===== 小松空港滑走路中心 =====

const GRID_CENTER = {
    lat: 36.394800,
    lng: 136.407600
};


// C-3左下座標
const GRID_ORIGIN = {
    lat: GRID_CENTER.lat - GRID_INTERVAL / 2,
    lng: GRID_CENTER.lng - GRID_INTERVAL / 2
};


// ===== 選択マス =====

let selectedGrid = null;


// ===== レイヤー =====

let gridLayer;
let labelLayer;


// ======================================
// 地図初期化
// ======================================

const map = L.map("map", {

    zoomControl: true

}).setView(

    [GRID_CENTER.lat, GRID_CENTER.lng],

    14

);


// 国土地理院

L.tileLayer(

    "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",

    {

        attribution: "© 国土地理院",

        maxZoom:18

    }

).addTo(map);


// レイヤー作成

gridLayer = L.layerGroup().addTo(map);

labelLayer = L.layerGroup().addTo(map);



// ======================================
// グリッド描画
// ======================================

function drawGrid(){

    gridLayer.clearLayers();
    labelLayer.clearLayers();


    // 左上マス(A-1)

    const startLat =
        GRID_CENTER.lat + (CENTER_ROW.charCodeAt(0)-65) * GRID_INTERVAL;

    const startLng =
        GRID_CENTER.lng - (CENTER_COL-1) * GRID_INTERVAL;



    // ===== 横線 =====

    for(let r=0;r<=GRID_ROWS;r++){

        const lat = startLat - r*GRID_INTERVAL;

        L.polyline(

            [

                [lat,startLng],

                [lat,startLng + GRID_COLS*GRID_INTERVAL]

            ],

            {

                color:"#4da6ff",

                weight:1.2,

                opacity:0.9

            }

        ).addTo(gridLayer);

    }



    // ===== 縦線 =====

    for(let c=0;c<=GRID_COLS;c++){

        const lng = startLng + c*GRID_INTERVAL;

        L.polyline(

            [

                [startLat,lng],

                [startLat-GRID_ROWS*GRID_INTERVAL,lng]

            ],

            {

                color:"#4da6ff",

                weight:1.2,

                opacity:0.9

            }

        ).addTo(gridLayer);

    }



    // ===== 上側番号 =====

    for(let c=0;c<GRID_COLS;c++){

        L.marker(

            [

                startLat + GRID_INTERVAL*0.25,

                startLng + (c+0.5)*GRID_INTERVAL

            ],

            {

                interactive:false,

                icon:L.divIcon({

                    className:"grid-label",

                    html:"<b>"+(c+1)+"</b>"

                })

            }

        ).addTo(labelLayer);

    }



    // ===== 左側アルファベット =====

    for(let r=0;r<GRID_ROWS;r++){

        const letter =
            String.fromCharCode(65+r);

        L.marker(

            [

                startLat-(r+0.5)*GRID_INTERVAL,

                startLng-GRID_INTERVAL*0.25

            ],

            {

                interactive:false,

                icon:L.divIcon({

                    className:"grid-label",

                    html:"<b>"+letter+"</b>"

                })

            }

        ).addTo(labelLayer);

    }

}
// ======================================
// Part2
// グリッド計算・選択
// ======================================


// ===== マスID取得 =====

function getGridId(lat, lng) {

    const row =
        Math.floor((GRID_CENTER.lat - lat) / GRID_INTERVAL);

    const col =
        Math.floor((lng - GRID_CENTER.lng) / GRID_INTERVAL);

    const rowLetter =
        String.fromCharCode(
            CENTER_ROW.charCodeAt(0) + row
        );

    const colNumber =
        CENTER_COL + col;

    return rowLetter + "-" + colNumber;

}



// ===== マス中心取得 =====

function getGridCenter(lat, lng) {

    const row =
        Math.floor((GRID_CENTER.lat - lat) / GRID_INTERVAL);

    const col =
        Math.floor((lng - GRID_CENTER.lng) / GRID_INTERVAL);

    return {

        lat:
            GRID_CENTER.lat
            - (row + 0.5) * GRID_INTERVAL,

        lng:
            GRID_CENTER.lng
            + (col + 0.5) * GRID_INTERVAL

    };

}



// ===== マスを青く表示 =====

function drawSelectedGrid(lat, lng) {

    if (selectedGrid) {

        map.removeLayer(selectedGrid);

    }

    const center = getGridCenter(lat, lng);

    const south = center.lat - GRID_INTERVAL / 2;
    const north = center.lat + GRID_INTERVAL / 2;

    const west = center.lng - GRID_INTERVAL / 2;
    const east = center.lng + GRID_INTERVAL / 2;

    selectedGrid = L.rectangle(

        [

            [south, west],

            [north, east]

        ],

        {

            color: "#0066ff",

            weight: 2,

            fillColor: "#66b3ff",

            fillOpacity: 0.35

        }

    ).addTo(map);

}



// ======================================
// 初期描画
// ======================================

drawGrid();

map.on("moveend", function () {

    drawGrid();

});



// ======================================
// 長押し
// ======================================

map.on("contextmenu", function (e) {

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    drawSelectedGrid(lat, lng);

    const gridId = getGridId(lat, lng);

    const center = getGridCenter(lat, lng);

    document.getElementById("info").innerHTML =

        "<b>Project Kestrel</b><br><br>" +

        "<b>Grid ID</b><br>" +

        gridId +

        "<br><br>" +

        "<b>Grid Center</b><br>" +

        center.lat.toFixed(6) +

        "<br>" +

        center.lng.toFixed(6) +

        "<br><br>" +

        "<b>Selected Point</b><br>" +

        lat.toFixed(6) +

        "<br>" +

        lng.toFixed(6);

});
