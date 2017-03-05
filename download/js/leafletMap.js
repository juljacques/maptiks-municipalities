/**
 * Created by willcadell on 16-01-15.
 */

var leafletMap, analyticData, mapOptions, marker, place;

var SQUARE_PIN = 'M22-48h-44v43h16l6 5 6-5h16z';

place = L.latLng([54.0, -122.75]);

place2 = L.latLng([53.995, -122.7]);

mapOptions = {
    maptiks_id: "Maptiks Example Analytics Map"
};

analyticData = {
    pan: 0,
    zoom: 0,
    activity: 0,
    click: 0,
    converts: 0,
    conversions: []
};

function updateRate(){
    if (isFinite( analyticData.converts / analyticData.activity )) {
        $('#analytic-conversion-rate').html( (analyticData.converts / analyticData.activity).toFixed(2));
    }
}

function calcConverts(maptiks_id) {
	analyticData['converts'] += 1;
	$('#analytic-converts').html(analyticData['converts']);
	
    if(analyticData.conversions.hasOwnProperty(maptiks_id)) {
        analyticData.conversions[maptiks_id] += 1;
    } else {
        analyticData.conversions[maptiks_id] = 1;
    }

    var topConverted = 0;
    var topConverter = '-';
    for (var key in analyticData.conversions){
        if (analyticData.conversions.hasOwnProperty(key)) {
            if (analyticData.conversions[key] > topConverted){
                topConverted = analyticData.conversions[key];
                topConverter = key;
                $('#analytic-converter').html(topConverter);
            }
        }
    }
}

function updateEngagement() {
    if (analyticData.activity > 0 && analyticData.activity < 5) {
        $('#no_click_engagement').hide();
        $('#low-engagement').show();
        $('#low-engagement').width(analyticData.activity * 10 + "%");

    } else if (analyticData.activity >= 5 && analyticData.activity < 9) {
        $('#moderate-engagement').show();
        $('#moderate-engagement').width((analyticData.activity - 4) * 10 + "%");

    } else if (analyticData.activity >= 9 && analyticData.activity < 11) {
        $('#high-engagement').show();
        $('#high-engagement').width((analyticData.activity - 8) * 10 + "%");
    }
}

function updateActivity() {
    analyticData.activity += 1
    $('#analytic-activity').html(analyticData.activity);
    updateEngagement();
}

function updateAnalytic(type) {
    analyticData[type] += 1;
    $('#analytic-' + type).html(analyticData[type]);
    updateActivity();
}

$('#analytic-activity').html(analyticData.activity);
$('#analytic-pan').html(analyticData.pan);
$('#analytic-zoom').html(analyticData.zoom);
$('#analytic-click').html(analyticData.click);
$('#analytic-converts').html(analyticData.converts);
$('#analytic-converter').html(analyticData.topConverter);

leafletMap = L.map('leaflet-map', mapOptions).on('load', function () {
	//zooms
    watch(leafletMap.maptiks._map, '_zoom', function () {
        updateAnalytic('zoom');
        updateRate();
    });
	//pans
    watch(leafletMap.maptiks._map.dragging._draggable, ['_moved'], function (property, action, newValue) {
        if (newValue === true) {
            updateAnalytic('pan');
            updateRate();
        }
    });
	//clicks
    watch(leafletMap.maptiks._popups, function (property, action, newValue, oldValue) {
        if (action === 'push') {
            updateAnalytic('click');
            calcConverts(newValue._source.maptiks._id);
            updateRate();
        }
    }, 2);

});

leafletMap.setView(place, 12);

var redIcon = L.divIcon({className: "map-icon red map-icon-postal-code"})
var blueIcon = L.divIcon({className: "map-icon blue map-icon-postal-code"})

var markerBlue = L.marker(place, {maptiks_id: "Blue Marker", icon: blueIcon}).addTo(leafletMap);
markerBlue.bindPopup("<b> Maptiks Icon Id:</b>  <b class='blue'>Blue Marker</b><br></b>Sweet! The red icon's converted!");

var markerRed = L.marker(place2, {maptiks_id: "Red Marker", icon: redIcon}).addTo(leafletMap);
markerRed.bindPopup("<b> Maptiks Icon Id:</b>  <b class='red'>Red Marker</b><br></b>Sweet! The red icon's converted!");

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'willcadell.20c8a20a',
//     accessToken: 'pk.eyJ1Ijoid2lsbGNhZGVsbCIsImEiOiJKbjZwckU0In0.ET9f2IdpUPpsmZsOc_0T-w',
//     maptiks_id: 'MapBox summer tiles layer'
// }).addTo(leafletMap);

L.esri.basemapLayer('Streets').addTo(leafletMap);

$(function ()  
	{
		$("#analytic-count-help").popover({content: "The total count of activities which have occured on the map in this session", title: "Activities", trigger: "hover focus click"});
		$("#analytic-pans-help").popover({content: "The total count of pans which have occured on the map in this session", title: "Pans", trigger: "hover focus click", placement: "bottom"});
		$("#analytic-zooms-help").popover({content: "The total count of zooms which have occured on the map in this session", title: "Zooms", trigger: "hover focus click", placement: "bottom"});
		$("#analytic-clicks-help").popover({content: "The total count of clicks which have occured on the map in this session", title: "Clicks", trigger: "hover focus click", placement:"left"});
		$("#analytic-conversions-help").popover({content: "The total count of conversions, where a conversion is clicking on a map icon to open a window", title: "Map Conversions", trigger: "hover focus click", placement: "right"});
		$("#analytic-conversion-rate-help").popover({content: "The rate at which a conversion happens per activity. Think of this as the efficieny of your map's conversions", title: "Map Conversion Rate", trigger: "hover focus click", placement: "top"});		
		$("#analytic-converter-help").popover({content: "The marker which is driving most conversions, why would that be?", title: "Top Converter", trigger: "hover focus click", placement: "left"});
		$("#analytic-engagement-help").popover({content: "By combining the various activities we can determine a maps's level of user 'engagement'", title: "Engagement", trigger: "hover focus click", placement: "bottom"});
		$("#analytic-conversion-head-help").popover({content: "A map converts when it achieves the goal you set out for it, that could be discovering data, or selling a product. What is your map's purpose?", title: "Map Conversions", trigger: "hover focus click", placement: "top"});
		$("#analytic-loading-head-help").popover({content: "These analytics indicate how engageing your maps are", title: "Activity Analytics", trigger: "hover focus click", placement: "bottom"});
	}
);
