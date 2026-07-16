// ======================================
// Project Kestrel
// Ver.1.0β
// E-5 Center Version
// Part1
// ======================================


// ================================
// グリッド設定
// ================================

// 20秒グリッド
const GRID_INTERVAL_SECONDS = 20;

const GRID_INTERVAL =
    GRID_INTERVAL_SECONDS / 3600;


// ================================
// 表示範囲
// ================================

// A〜I
const GRID_ROWS = 9;

// 1〜9
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

    lat: 36.394800,

    lng: 136.407600

};


// ================================
// レイヤー
// ================================

let gridLayer;

let labelLayer;

let selectedGrid = null;

let crossMarker = null;


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


// 国土地理院

L.tileLayer(

    "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",

    {

        attribution:
        "© 国土地理院",

        maxZoom:18

    }

).addTo(map);


// レイヤー

gridLayer =
    L.layerGroup()
    .addTo(map);


labelLayer =
    L.layerGroup()
    .addTo(map);



// ================================
// グリッド描画
// ================================

function drawGrid(){


    gridLayer.clearLayers();

    labelLayer.clearLayers();



    // E-5を中心に左上位置を計算


    const centerRowIndex =
        CENTER_ROW.charCodeAt(0) - 65;


    const startLat =
        GRID_CENTER.lat
        + centerRowIndex * GRID_INTERVAL;


    const startLng =
        GRID_CENTER.lng
        - (CENTER_COL - 1) * GRID_INTERVAL;



    // 横線

    for(
        let r = 0;
        r <= GRID_ROWS;
        r++
    ){

        const lat =
            startLat
            - r * GRID_INTERVAL;


        L.polyline(

            [

                [
                    lat,
                    startLng
                ],

                [
                    lat,
                    startLng
                    + GRID_COLS
                    * GRID_INTERVAL
                ]

            ],

            {

                color:"#4da6ff",

                weight:1.2

            }

        ).addTo(gridLayer);

    }



    // 縦線

    for(
        let c = 0;
        c <= GRID_COLS;
        c++
    ){

        const lng =
            startLng
            + c * GRID_INTERVAL;



        L.polyline(

            [

                [
                    startLat,
                    lng
                ],

                [
                    startLat
                    - GRID_ROWS
                    * GRID_INTERVAL,

                    lng
                ]

            ],

            {

                color:"#4da6ff",

                weight:1.2

            }

        ).addTo(gridLayer);

    }



    // 上側数字

    for(
        let c=0;
        c<GRID_COLS;
        c++
    ){

        addLabel(

            startLat
            + GRID_INTERVAL*0.25,

            startLng
            +(c+0.5)
            *GRID_INTERVAL,

            c+1

        );

    }



    // 左側アルファベット

    for(
        let r=0;
        r<GRID_ROWS;
        r++
    ){

        addLabel(

            startLat
            -(r+0.5)
            *GRID_INTERVAL,

            startLng
            -GRID_INTERVAL*0.25,

            String.fromCharCode(
                65+r
            )

        );

    }


}



// ラベル追加

function addLabel(lat,lng,text){


    L.marker(

        [
            lat,
            lng
        ],

        {

            interactive:false,

            icon:L.divIcon({

                className:
                "grid-label",

                html:
                "<b>"+text+"</b>"

            })

        }

    ).addTo(labelLayer);

        }
