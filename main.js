import { build, lookup } from "./3rdparty/sphere-knn/spherekd.js";
const stations = [
{ lon: -10.27732, lat: 52.13924, station: "Dingle"},
{ lon: -10.1016, lat: 53.9522, station: "Achill_Island_MODELLED"},
{ lon: -10.0388, lat: 53.582, station: "Letterfrack_MODELLED"},
{ lon: -9.9443, lat: 53.8019, station: "Clare_Island_MODELLED"},
{ lon: -9.90442, lat: 53.76235, station: "Roonagh"},
{ lon: -9.9034, lat: 51.6496, station: "Castletownbere"},
{ lon: -9.9016, lat: 53.6316, station: "Killary_Harbour_MODELLED"},
{ lon: -9.89, lat: 54.253, station: "Ballyglass"},
{ lon: -9.8644, lat: 52.27129, station: "Fenit"},
{ lon: -9.6812, lat: 52.5965, station: "Carrigaholt_MODELLED"},
{ lon: -9.66, lat: 53.126, station: "Inishmore"},
{ lon: -9.562056, lat: 53.266926, station: "Rossaveel"},
{ lon: -9.50208, lat: 52.63191, station: "Kilrush"},
{ lon: -9.3899, lat: 52.911, station: "Lahinch_MODELLED"},
{ lon: -9.1335, lat: 51.559, station: "Union_Hall"},
{ lon: -9.04796, lat: 53.26895, station: "Galway"},
{ lon: -8.5689, lat: 54.3046, station: "Sligo"},
{ lon: -8.49562, lat: 54.9896, station: "Aranmore"},
{ lon: -8.446, lat: 51.6777, station: "Kinsale_MODELLED"},
{ lon: -8.3949, lat: 54.6364, station: "Killybegs"},
{ lon: -8.304, lat: 51.84, station: "Ringaskiddy"},
{ lon: -8.2411, lat: 51.7794, station: "Crosshaven_MODELLED"},
{ lon: -8.1962, lat: 55.2508, station: "Tory_Island_MODELLED"},
{ lon: -8.0007, lat: 51.82776, station: "Ballycotton"},
{ lon: -7.5521, lat: 52.0672, station: "Dungarvan_MODELLED"},
{ lon: -7.33432, lat: 55.37168, station: "Malin_Head"},
{ lon: -6.99166, lat: 52.14754, station: "Dunmore"},
{ lon: -6.4589, lat: 52.33852, station: "Wexford"},
{ lon: -6.334861, lat: 52.2546, station: "Rosslare"},
{ lon: -6.221713, lat: 53.79899, station: "Port_Oriel"},
{ lon: -6.22166, lat: 53.34574, station: "Dublin_Port"},
{ lon: -6.145231, lat: 52.792046, station: "Arklow"},
{ lon: -6.108117, lat: 53.585, station: "Skerries"},
{ lon: -6.0901, lat: 53.2191, station: "Bray_Harbour_MODELLED"},
{ lon: -6.0683, lat: 53.39148, station: "Howth"},
{ lon: -6.0127, lat: 52.9889, station: "Wicklow_MODELLED"},
];

var nodes = build(stations);

function geoFindMe() {

	const status = document.querySelector('#status');

	async function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;

		station.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
		var closest = lookup(latitude, longitude, nodes,1)[0];
		let today = new Date().toISOString().slice(0, 10)
    prettydate.textContent = moment().format('dddd, MMMM Do YYYY');
		station.textContent = closest.station.replace("MODELLED","").replace("_", " ");
		let result = await sql.load(closest.station, today);
		console.log(result.map(x=>x.HIGH_TIDE));
		tides.textContent = result.map(x=>x.HIGH_TIDE).join('\n');
	}

	function error() {
		status.textContent = 'Unable to retrieve your location';
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
