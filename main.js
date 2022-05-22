import { build, lookup } from "./3rdparty/sphere-knn/spherekd.js";
import { stations } from "./stations.js";

var nodes = build(stations);

function geoFindMe() {

	const status = document.querySelector('#status');

	async function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;

		station.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
		var closest = lookup(latitude, longitude, nodes,1)[0];
		let today = new Date().toISOString().slice(0, 10)
    prettydate.textContent = moment().format('dddd, MMMM Do');
		station.textContent = closest.station.replace("MODELLED","")
      .replace(" - READ flaterco.com/pol.html", " ")
      .replace(/_/gi, " ");
		let result = await sql.load(closest.station, today);
		console.log(result.map(x=>x.HIGH_TIDE));
		tides.innerText = result.map(x=>x.HIGH_TIDE).join('\n');
	  Array.from(document.getElementsByClassName("item")).forEach(x=>x.style.display = 'block');	
    loading.style.display = "none";

    share.style.display = "inline-block";
    share.onclick = ()=> {
      navigator.clipboard.writeText("High Tide " + prettydate.innerText + "\n" +
        station.innerText + '\n' + 
        tides.innerText + '\n' +
        "https://hightidenear.me");
      share.innerHTML = "Copied to Clipboard!";
    }; 
	}

	function error() {
		station.textContent = 'Unable to retrieve your location';
	}

	if(!navigator.geolocation) {
		station.textContent = 'Geolocation is not supported by your browser';
	} else {
		station.textContent = 'Locating…';
		navigator.geolocation.getCurrentPosition(success, error);
	}

}
geoFindMe();
//sql.load();
