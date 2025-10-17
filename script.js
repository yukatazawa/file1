function goToLink(search_url) {
  try {
    if (typeof search_url === "string" && search_url.startsWith("http")) {
      window.open(search_url, "_blank");
    } else {
      console.error("無効なurl:", search_url);
    }
  } catch(error) {
    console.error("リンク遷移エラー:", error);
  }
}

//API Key 
const apikey = ""

//地図作成(初期位置)
const map = L.map('map').setView([34.6862, 135.5196], 12);

//OSM利用
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);


//URL取得（大阪のカフェ20件）
const url = `https://api.geoapify.com/v2/places?categories=catering.cafe&conditions=internet_access&filter=rect:135.38716537573399,34.7640324232946,135.61418242194353,34.58656310434866&limit=20&apiKey=${apikey}`;


//API取得(夕会等,報告時以外は削除してます)
axios
  .get(url)
  .then(response => {
  const data = response.data;
  console.log("取得データ:",data); 
  
  data.features.forEach(place => {
    const [lon,lat] = place.geometry.coordinates;
    const props = place.properties;
    
    const website = props.website || "#";
    
    const popupContent = `
      <b>${props.name}</b></br>
      
      ${website !== "#" ? `<a href="${website}" target="_blank">公式サイトへ</a>` : ""}
      `;
    
    L.marker([lat,lon])
      .addTo(map)
      .bindPopup(popupContent);
  });      
})    
.catch(errror => {
  console.error("取得エラー:", error);
});