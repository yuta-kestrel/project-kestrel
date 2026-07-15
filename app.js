// ===== グリッド設定 =====

// グリッド間隔（秒）
const GRID_INTERVAL_SECONDS = 20;

// 度へ変換
const GRID_INTERVAL = GRID_INTERVAL_SECONDS / 3600;

// 基準（小松空港滑走路中心）
const GRID_CENTER = {
    lat: 36.3948,
    lng: 136.4076
};

// 中心マス
const CENTER_ROW = "C";
const CENTER_COL = 3;
// グリッド基準（小松空港 滑走路中心）
const GRID_ORIGIN = {
    lat: 36.3948,
    lng: 136.4076
};

// 20秒
const GRID_INTERVAL = 20 / 3600;

const map = L.map('map').setView([36.3948, 136.4076], 14);

// 国土地理院
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: '© 国土地理院',
    maxZoom: 18
}).addTo(map);

// グリッドを保存するレイヤー
const gridLayer = L.layerGroup().addTo(map);

// 20秒（0.008333333°）
const interval = 20 / 3600;

// グリッド描画
function drawGrid() {

    // 前回のグリッドを削除
    gridLayer.clearLayers();

    const bounds = map.getBounds();

    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();

    // 横線
    for (
        let lat = Math.floor(south / interval) * interval;
        lat <= north;
        lat += interval
    ) {

        L.polyline(
            [
                [lat, west],
                [lat, east]
            ],
            {
                color: "#4da6ff",
                weight: 1,
                opacity: 0.8
            }
        ).addTo(gridLayer);

    }

    // 縦線
    for (
        let lon = Math.floor(west / interval) * interval;
        lon <= east;
        lon += interval
    ) {

        L.polyline(
            [
                [south, lon],
                [north, lon]
            ],
            {
                color: "#4da6ff",
                weight: 1,
                opacity: 0.8
            }
        ).addTo(gridLayer);

    }

}

// 最初に描画
drawGrid();

function getGridId(lat, lng) {

    const row = Math.floor((lat - GRID_ORIGIN.lat) / GRID_INTERVAL);
    const col = Math.floor((lng - GRID_ORIGIN.lng) / GRID_INTERVAL);

    const rowLetter = String.fromCharCode(67 - row);

    return rowLetter + "-" + (3 + col);

}

// 地図を動かしたら描き直す
map.on("moveend", drawGrid);

// 長押しイベント
map.on("contextmenu", function (e) {

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
const gridId = getGridId(lat, lng);

document.getElementById("info").innerHTML =
    "<b>Project Kestrel</b><br>" +
    "Grid : <b>" + gridId + "</b><br><br>" +
    "Latitude : " + lat.toFixed(6) + "<br>" +
    "Longitude : " + lng.toFixed(6);

});
