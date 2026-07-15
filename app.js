const map = L.map('map').setView([36.3948, 136.4076], 14);

L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: '© 国土地理院',
    maxZoom: 18
}).addTo(map);
