const map = L.map('map').setView([36.3948, 136.4076], 14);

L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: '© 国土地理院',
    maxZoom: 18
}).addTo(map);
// テスト用グリッド
const bounds = [
    [36.385, 136.395],
    [36.405, 136.415]
];

L.rectangle(bounds, {
    color: "#4da6ff",
    weight: 2,
    fill: false
}).addTo(map);
