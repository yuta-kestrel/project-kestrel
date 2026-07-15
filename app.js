const map = L.map('map').setView([36.3948, 136.4076], 14);

L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: '© 国土地理院',
    maxZoom: 18
}).addTo(map);

// テスト用グリッドライン

// 横線
L.polyline([
    [36.395, 136.39],
    [36.395, 136.43]
], {
    color: "#4da6ff",
    weight: 2
}).addTo(map);

// 縦線
L.polyline([
    [36.37, 136.41],
    [36.42, 136.41]
], {
    color: "#4da6ff",
    weight: 2
}).addTo(map);
