// ======================================
// Project Kestrel
// Ver.0.7
// ======================================

// ===== グリッド設定 =====

// グリッド間隔（秒）
const GRID_INTERVAL_SECONDS = 20;

// 度へ変換
const GRID_INTERVAL = GRID_INTERVAL_SECONDS / 3600;

// 小松空港滑走路中心（仮）
const GRID_CENTER = {
    lat: 36.3948,
    lng: 136.4076
};
// C-3の左下座標
const GRID_ORIGIN = {
    lat: GRID_CENTER.lat - (GRID_INTERVAL / 2),
    lng: GRID_CENTER.lng - (GRID_INTERVAL / 2)
};

// 中心マス
const CENTER_ROW = "C";
const CENTER_COL = 3;

// 選択中グリッド
let selectedGrid = null;

// ===== 地図 =====

const map = L.map("map").setView(
    [GRID_CENTER.lat, GRID_CENTER.lng],
    14
);

// 国土地理院
L.tileLayer(
    "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
    {
        attribution: "© 国土地理院",
        maxZoom: 18
    }
).addTo(map);

// グリッドレイヤー
const gridLayer = L.layerGroup().addTo(map);

// ======================================
// グリッド描画
// ======================================

function drawGrid() {

    gridLayer.clearLayers();

    const bounds = map.getBounds();

    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();

    // 基準から南北方向へ描画
    for (
        let lat = GRID_CENTER.lat;
        lat <= north;
        lat += GRID_INTERVAL
    ) {

        L.polyline(
            [
                [lat, west],
                [lat, east]
            ],
            {
                color: "#4da6ff",
                weight: 1
            }
        ).addTo(gridLayer);

    }

    for (
        let lat = GRID_CENTER.lat - GRID_INTERVAL;
        lat >= south;
        lat -= GRID_INTERVAL
    ) {

        L.polyline(
            [
                [lat, west],
                [lat, east]
            ],
            {
                color: "#4da6ff",
                weight: 1
            }
        ).addTo(gridLayer);

    }

    // 基準から東西方向へ描画
    for (
        let lng = GRID_CENTER.lng;
        lng <= east;
        lng += GRID_INTERVAL
    ) {

        L.polyline(
            [
                [south, lng],
                [north, lng]
            ],
            {
                color: "#4da6ff",
                weight: 1
            }
        ).addTo(gridLayer);

    }

    for (
        let lng = GRID_CENTER.lng - GRID_INTERVAL;
        lng >= west;
        lng -= GRID_INTERVAL
    ) {

        L.polyline(
            [
                [south, lng],
                [north, lng]
            ],
            {
                color: "#4da6ff",
                weight: 1
            }
        ).addTo(gridLayer);

    }

}

// ======================================
// グリッド選択
// ======================================

function drawSelectedGrid(lat, lng) {

    if (selectedGrid) {
        map.removeLayer(selectedGrid);
    }

    const row = Math.floor((lat - GRID_ORIGIN.lat) / GRID_INTERVAL);
const col = Math.floor((lng - GRID_ORIGIN.lng) / GRID_INTERVAL);

const south = GRID_ORIGIN.lat + row * GRID_INTERVAL;
const west = GRID_ORIGIN.lng + col * GRID_INTERVAL;

const north = south + GRID_INTERVAL;
const east = west + GRID_INTERVAL;

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
// マスID計算（仮版）
// ======================================

function getGridId(lat, lng) {

    const row =
        Math.round((GRID_CENTER.lat - lat) / GRID_INTERVAL);

    const col =
        Math.round((lng - GRID_CENTER.lng) / GRID_INTERVAL);

    const rowLetter =
        String.fromCharCode(
            CENTER_ROW.charCodeAt(0) + row
        );

    const colNumber =
        CENTER_COL + col;

    return rowLetter + "-" + colNumber;

}

// ======================================
// 初期表示
// ======================================

drawGrid();

map.on("moveend", drawGrid);

// ======================================
// 長押し
// ======================================

map.on("contextmenu", function (e) {

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    drawSelectedGrid(lat, lng);

    function getGridId(lat, lng) {

    const row = Math.floor((GRID_CENTER.lat - lat) / GRID_INTERVAL);
    const col = Math.floor((lng - GRID_CENTER.lng) / GRID_INTERVAL);

    const rowLetter = String.fromCharCode(
        CENTER_ROW.charCodeAt(0) + row
    );

    const colNumber = CENTER_COL + col;

    return rowLetter + "-" + colNumber;

    }





    
});
