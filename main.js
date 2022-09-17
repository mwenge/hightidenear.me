import { build, lookup } from "./3rdparty/sphere-knn/spherekd.js";
import { stations } from "./stations.js";
import { symbols } from "./icons.js";

var nodes = build(stations);

function formatTime(t) {
  let tm = t.substring(t.indexOf('.')+1).trim();
  let r = moment.utc(tm, "h a").format().toString();
  return r;
}

function getWeatherData(forecast, tideInfo) {
  let tideTime = formatTime(tideInfo);
  let f = forecast.properties.timeseries;
  let w = f.filter(x => x.time == tideTime);
  if (!w.length) {
    return tideInfo;
  }
  let temp = parseInt(w[0].data.instant.details.air_temperature, 10);
  let symbol = w[0].data.next_1_hours.summary.symbol_code;
  let icon = symbols[symbol];
  let updatedTide = `${icon} ${temp}° ${tideInfo.substring(2)}`;
  return updatedTide;
}

async function getWeather(station, predictions) {
  let lat = station.lat;
  let lon = station.lon;
  let url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`
	let response = await fetch(url);

	if (!response.ok) { // if HTTP-status is 200-299
		alert("HTTP-Error: " + response.status);
    return;
	}
  // get the response body (the method explained below)
  let json = await response.json();
  tides.innerText = predictions.map(p => getWeatherData(json, p.HIGH_TIDE)).join('\n');
}

function geoFindMe() {

	const status = document.querySelector('#status');

	async function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;

    // Set the date.
		var closest = lookup(latitude, longitude, nodes,1)[0];
		let today = new Date().toISOString().slice(0, 10)
    prettydate.textContent = moment().format('dddd, MMMM Do');
    
    // Set the station name.
		station.textContent = closest.station.replace("MODELLED","")
      .replace(" - READ flaterco.com/pol.html", " ")
      .replace(/_/gi, " ");

    // Get the tides.
		let result = await sql.load(closest.station, today);
		tides.innerText = result.map(x=>x.HIGH_TIDE).join('\n');

	  Array.from(document.getElementsByClassName("item")).forEach(x=>x.style.display = 'block');	
    loading.style.display = "none";

    // Display the share button.
    share.style.display = "inline-block";
    share.onclick = async ()=> {
      function copyToClipboard(shareData) {
        navigator.clipboard.writeText( `${shareData.title}\n${shareData.text}\n${shareData.url}`);
        copied.className = "copied visible";
        document.body.offsetTop;
        setTimeout(()=> {
          copied.className = "copied hidden";
        }, 1000);
      }
      let shareData = {
        title: `High Tide`,
        text: `${prettydate.innerText}\n${station.innerText}\n${tides.innerText}\n`,
        url: "https://hightidenear.me",
      }
      console.log(`Sharing ${JSON.stringify(shareData)}`);

      if (!navigator.canShare || !navigator.canShare(shareData)) {
        copyToClipboard(shareData);
        return;
      }

      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard(shareData);
      }
    }; 

    // Get the weather forecast.
    getWeather(closest, result);
	}

	function error() {
    loading.style.display = "none";
    station.style.display = "block";
		station.textContent = 'Unable to retrieve your location';
	}

	if(!navigator.geolocation) {
    loading.style.display = "none";
    station.style.display = "block";
		station.textContent = 'Geolocation is not supported by your browser';
	} else {
		navigator.geolocation.getCurrentPosition(success, error);
	}

}

geoFindMe();
//sql.load();
