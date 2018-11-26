'use strict';

var checkElement = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(selector) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(document.querySelector(selector) === null)) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 3;
                        return rafAsync();

                    case 3:
                        _context.next = 0;
                        break;

                    case 5:
                        return _context.abrupt('return', true);

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function checkElement(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var map, colors, geojson;

function rafAsync() {
    return new Promise(function (resolve) {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

checkElement('#mapid') //use whichever selector you want
.then(function (element) {
    // colors = JSON.parse(document.querySelector('#color_container').innerText);
    initMap();
});

// checkElement('#color_container') //use whichever selector you want
//     .then((element) => {
//         listenToChange();
//     });

function initMap() {
    colors = base;
    map = L.map('mapid').setView([52.100556, 5.645833], 7);

    geojson = L.geoJSON(basemap, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    info.addTo(map);
    cb.addTo(map);
    listenToChange();
    listenToMapClick();
}

function getMax(arr, prop) {
    var keys = Object.keys(arr);
    var max;
    for (var i = 0; i < keys.length; i++) {
        if (!max || parseInt(arr[keys[i]][prop]) > parseInt(max)) max = arr[keys[i]][prop];
    }
    return max;
}

function listenToChange() {
    var target = document.querySelector('#color_container');
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        // alert('change');
        // console.log(target.textContent);
        try {
            // console.log("change");
            colors = JSON.parse(target.textContent);
            geojson.setStyle(style);
            document.querySelector("#max_val").textContent = getMax(colors, 'total');
        } catch (err) {
            console.log('error');
            return null;
        }
    });
    // configuration of the observer:
    var config = { attributes: false, childList: true, characterData: true, subtree: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}

function listenToMapClick() {
    var target = document.querySelector('#map');
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        if (target.classList.contains('tab--selected')) {
            document.querySelector('#mapid').style.display = 'block';
            map.invalidateSize();
        } else {
            document.querySelector('#mapid').style.display = 'none';
        }
    });
    // configuration of the observer:
    var config = { attributes: true, childList: false, characterData: false, subtree: false };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}

function style(feature) {
    return {
        fillColor: colors[feature.properties.gemeentena].colors,
        weight: 0.7,
        opacity: 1,
        color: 'black',
        dashArray: '',
        fillOpacity: 1
    };
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = props ? '<b>' + props.gemeentena + '</b><br />' + colors[props.gemeentena].total + ' zinnen in akkoord' : 'Beweeg je muis <br> over een gemeente';
};

var cb = L.control({ position: 'bottomleft' });

cb.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'cb'); // create a div with a class "info"
    // this._div.innerHTML = '<img src="../cb.svg" />';
    this._div.innerHTML = '<b>Aantal zinnen</b><br>' + cb_svg;

    return this._div;
};

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: 'black',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var base = {
    "Oud-Beijerland": { "colors": "#ffffff", "total": 0.0 },
    "Hardenberg": { "colors": "#88ce87", "total": 4.0 },
    "Leusden": { "colors": "#e7f6e3", "total": 1.0 },
    "Krimpenerwaard": { "colors": "#ceecc8", "total": 2.0 },
    "Westerveld": { "colors": "#ffffff", "total": 0.0 },
    "Giessenlanden": { "colors": "#ffffff", "total": 0.0 },
    "Twenterand": { "colors": "#e7f6e3", "total": 1.0 },
    "Bergen (NH.)": { "colors": "#ffffff", "total": 0.0 },
    "Teylingen": { "colors": "#ffffff", "total": 0.0 },
    "Texel": { "colors": "#ffffff", "total": 0.0 },
    "Wageningen": { "colors": "#e7f6e3", "total": 1.0 },
    "Terschelling": { "colors": "#ffffff", "total": 0.0 },
    "Nijmegen": { "colors": "#ffffff", "total": 0.0 },
    "Castricum": { "colors": "#ffffff", "total": 0.0 },
    "Schiermonnikoog": { "colors": "#ffffff", "total": 0.0 },
    "Heusden": { "colors": "#e7f6e3", "total": 1.0 },
    "Waalre": { "colors": "#ffffff", "total": 0.0 },
    "Alkmaar": { "colors": "#ffffff", "total": 0.0 },
    "Valkenswaard": { "colors": "#ffffff", "total": 0.0 },
    "Nederweert": { "colors": "#ffffff", "total": 0.0 },
    "Simpelveld": { "colors": "#ffffff", "total": 0.0 },
    "Oostzaan": { "colors": "#ceecc8", "total": 2.0 },
    "Borger-Odoorn": { "colors": "#ffffff", "total": 0.0 },
    "Alphen-Chaam": { "colors": "#e7f6e3", "total": 1.0 },
    "Cuijk": { "colors": "#ffffff", "total": 0.0 },
    "Wierden": { "colors": "#e7f6e3", "total": 1.0 },
    "De Wolden": { "colors": "#ffffff", "total": 0.0 },
    "Gooise Meren": { "colors": "#aedea7", "total": 3.0 },
    "Nunspeet": { "colors": "#ffffff", "total": 0.0 },
    "Westland": { "colors": "#ffffff", "total": 0.0 },
    "Best": { "colors": "#e7f6e3", "total": 1.0 },
    "Drimmelen": { "colors": "#aedea7", "total": 3.0 },
    "Westvoorne": { "colors": "#ffffff", "total": 0.0 },
    "Scherpenzeel": { "colors": "#ffffff", "total": 0.0 },
    "Gulpen-Wittem": { "colors": "#ffffff", "total": 0.0 },
    "Hattem": { "colors": "#ffffff", "total": 0.0 },
    "Losser": { "colors": "#ceecc8", "total": 2.0 },
    "Woerden": { "colors": "#ffffff", "total": 0.0 },
    "Ouder-Amstel": { "colors": "#ffffff", "total": 0.0 },
    "Beesel": { "colors": "#e7f6e3", "total": 1.0 },
    "Gouda": { "colors": "#88ce87", "total": 4.0 },
    "Aalten": { "colors": "#ffffff", "total": 0.0 },
    "Gorinchem": { "colors": "#ffffff", "total": 0.0 },
    "Nissewaard": { "colors": "#ceecc8", "total": 2.0 },
    "Zandvoort": { "colors": "#ffffff", "total": 0.0 },
    "Koggenland": { "colors": "#ffffff", "total": 0.0 },
    "Rheden": { "colors": "#1a843f", "total": 7.0 },
    "Drechterland": { "colors": "#e7f6e3", "total": 1.0 },
    "Delfzijl": { "colors": "#ffffff", "total": 0.0 },
    "Zederik": { "colors": "#ffffff", "total": 0.0 },
    "Veere": { "colors": "#ffffff", "total": 0.0 },
    "Medemblik": { "colors": "#e7f6e3", "total": 1.0 },
    "Vlissingen": { "colors": "#ffffff", "total": 0.0 },
    "Wijchen": { "colors": "#ffffff", "total": 0.0 },
    "Bodegraven-Reeuwijk": { "colors": "#e7f6e3", "total": 1.0 },
    "Roosendaal": { "colors": "#e7f6e3", "total": 1.0 },
    "Wijdemeren": { "colors": "#e7f6e3", "total": 1.0 },
    "Nuenen, Gerwen en Nederwetten": { "colors": "#ffffff", "total": 0.0 },
    "Haaksbergen": { "colors": "#88ce87", "total": 4.0 },
    "Amersfoort": { "colors": "#ffffff", "total": 0.0 },
    "Druten": { "colors": "#ffffff", "total": 0.0 },
    "Midden-Delfland": { "colors": "#ffffff", "total": 0.0 },
    "Doetinchem": { "colors": "#ffffff", "total": 0.0 },
    "Rotterdam": { "colors": "#ffffff", "total": 0.0 },
    "Rucphen": { "colors": "#ffffff", "total": 0.0 },
    "Boxmeer": { "colors": "#ceecc8", "total": 2.0 },
    "Rijssen-Holten": { "colors": "#ffffff", "total": 0.0 },
    "Amstelveen": { "colors": "#ffffff", "total": 0.0 },
    "Oisterwijk": { "colors": "#ffffff", "total": 0.0 },
    "Delft": { "colors": "#ffffff", "total": 0.0 },
    "Goes": { "colors": "#ffffff", "total": 0.0 },
    "Hoogeveen": { "colors": "#ffffff", "total": 0.0 },
    "Midden-Groningen": { "colors": "#ffffff", "total": 0.0 },
    "Berkelland": { "colors": "#ffffff", "total": 0.0 },
    "Noordenveld": { "colors": "#ffffff", "total": 0.0 },
    "Cranendonck": { "colors": "#ceecc8", "total": 2.0 },
    "Bergen (L.)": { "colors": "#ffffff", "total": 0.0 },
    "Deurne": { "colors": "#e7f6e3", "total": 1.0 },
    "Eemsmond": { "colors": "#ffffff", "total": 0.0 },
    "Werkendam": { "colors": "#ffffff", "total": 0.0 },
    "Sint-Michielsgestel": { "colors": "#ffffff", "total": 0.0 },
    "Tynaarlo": { "colors": "#ffffff", "total": 0.0 },
    "Heerlen": { "colors": "#ffffff", "total": 0.0 },
    "Zoeterwoude": { "colors": "#e7f6e3", "total": 1.0 },
    "Oude IJsselstreek": { "colors": "#ffffff", "total": 0.0 },
    "Lansingerland": { "colors": "#ceecc8", "total": 2.0 },
    "Montfoort": { "colors": "#e7f6e3", "total": 1.0 },
    "Katwijk": { "colors": "#ffffff", "total": 0.0 },
    "Ameland": { "colors": "#ffffff", "total": 0.0 },
    "Lingewaal": { "colors": "#ffffff", "total": 0.0 },
    "Smallingerland": { "colors": "#ffffff", "total": 0.0 },
    "Breda": { "colors": "#ceecc8", "total": 2.0 },
    "Bronckhorst": { "colors": "#ffffff", "total": 0.0 },
    "Winsum": { "colors": "#ffffff", "total": 0.0 },
    "Weesp": { "colors": "#37a055", "total": 6.0 },
    "Zwartewaterland": { "colors": "#ffffff", "total": 0.0 },
    "'s-Gravenhage": { "colors": "#ffffff", "total": 0.0 },
    "Staphorst": { "colors": "#ffffff", "total": 0.0 },
    "Geldermalsen": { "colors": "#ffffff", "total": 0.0 },
    "Purmerend": { "colors": "#ffffff", "total": 0.0 },
    "Rozendaal": { "colors": "#ffffff", "total": 0.0 },
    "Westerwolde": { "colors": "#ffffff", "total": 0.0 },
    "Sint Anthonis": { "colors": "#ffffff", "total": 0.0 },
    "Hardinxveld-Giessendam": { "colors": "#ffffff", "total": 0.0 },
    "Aalsmeer": { "colors": "#ffffff", "total": 0.0 },
    "Hellendoorn": { "colors": "#ffffff", "total": 0.0 },
    "Stichtse Vecht": { "colors": "#ffffff", "total": 0.0 },
    "Haarlemmerliede en Spaarnwoude": { "colors": "#ffffff", "total": 0.0 },
    "Meierijstad": { "colors": "#ffffff", "total": 0.0 },
    "Oldebroek": { "colors": "#e7f6e3", "total": 1.0 },
    "Heemstede": { "colors": "#e7f6e3", "total": 1.0 },
    "Alphen aan den Rijn": { "colors": "#aedea7", "total": 3.0 },
    "Bladel": { "colors": "#ffffff", "total": 0.0 },
    "West Maas en Waal": { "colors": "#ffffff", "total": 0.0 },
    "Oudewater": { "colors": "#ceecc8", "total": 2.0 },
    "Oost Gelre": { "colors": "#ffffff", "total": 0.0 },
    "Ferwerderadiel": { "colors": "#ffffff", "total": 0.0 },
    "Woudrichem": { "colors": "#ffffff", "total": 0.0 },
    "Barneveld": { "colors": "#ffffff", "total": 0.0 },
    "Leek": { "colors": "#ffffff", "total": 0.0 },
    "Vlaardingen": { "colors": "#ffffff", "total": 0.0 },
    "Baarle-Nassau": { "colors": "#ffffff", "total": 0.0 },
    "Geertruidenberg": { "colors": "#e7f6e3", "total": 1.0 },
    "Wassenaar": { "colors": "#ffffff", "total": 0.0 },
    "Appingedam": { "colors": "#e7f6e3", "total": 1.0 },
    "Horst aan de Maas": { "colors": "#ffffff", "total": 0.0 },
    "Vianen": { "colors": "#ffffff", "total": 0.0 },
    "Baarn": { "colors": "#ceecc8", "total": 2.0 },
    "Utrechtse Heuvelrug": { "colors": "#ceecc8", "total": 2.0 },
    "Bunschoten": { "colors": "#ffffff", "total": 0.0 },
    "Heumen": { "colors": "#e7f6e3", "total": 1.0 },
    "Wormerland": { "colors": "#ffffff", "total": 0.0 },
    "Krimpen aan den IJssel": { "colors": "#ffffff", "total": 0.0 },
    "Arnhem": { "colors": "#ceecc8", "total": 2.0 },
    "Binnenmaas": { "colors": "#ffffff", "total": 0.0 },
    "Roermond": { "colors": "#ffffff", "total": 0.0 },
    "Schiedam": { "colors": "#e7f6e3", "total": 1.0 },
    "Raalte": { "colors": "#e7f6e3", "total": 1.0 },
    "Hilvarenbeek": { "colors": "#ffffff", "total": 0.0 },
    "Eijsden-Margraten": { "colors": "#ffffff", "total": 0.0 },
    "Laarbeek": { "colors": "#ffffff", "total": 0.0 },
    "Beuningen": { "colors": "#ffffff", "total": 0.0 },
    "Reimerswaal": { "colors": "#ceecc8", "total": 2.0 },
    "Rijswijk": { "colors": "#ffffff", "total": 0.0 },
    "Woensdrecht": { "colors": "#ffffff", "total": 0.0 },
    "Westervoort": { "colors": "#ffffff", "total": 0.0 },
    "Dongeradeel": { "colors": "#ffffff", "total": 0.0 },
    "Kapelle": { "colors": "#ceecc8", "total": 2.0 },
    "Overbetuwe": { "colors": "#ffffff", "total": 0.0 },
    "Maasdriel": { "colors": "#ffffff", "total": 0.0 },
    "Noordwijk": { "colors": "#ffffff", "total": 0.0 },
    "Kollumerland en Nieuwkruisland": { "colors": "#ffffff", "total": 0.0 },
    "Utrecht": { "colors": "#00441b", "total": 9.0 },
    "Landsmeer": { "colors": "#ffffff", "total": 0.0 },
    "De Marne": { "colors": "#ffffff", "total": 0.0 },
    "Ooststellingwerf": { "colors": "#ffffff", "total": 0.0 },
    "Korendijk": { "colors": "#ffffff", "total": 0.0 },
    "Dantumadiel": { "colors": "#e7f6e3", "total": 1.0 },
    "Hellevoetsluis": { "colors": "#ceecc8", "total": 2.0 },
    "Peel en Maas": { "colors": "#ffffff", "total": 0.0 },
    "Ommen": { "colors": "#ffffff", "total": 0.0 },
    "Doesburg": { "colors": "#ffffff", "total": 0.0 },
    "Waddinxveen": { "colors": "#e7f6e3", "total": 1.0 },
    "Assen": { "colors": "#e7f6e3", "total": 1.0 },
    "Eersel": { "colors": "#ffffff", "total": 0.0 },
    "Diemen": { "colors": "#ffffff", "total": 0.0 },
    "Cromstrijen": { "colors": "#ffffff", "total": 0.0 },
    "Groningen": { "colors": "#ffffff", "total": 0.0 },
    "Haaren": { "colors": "#e7f6e3", "total": 1.0 },
    "Landgraaf": { "colors": "#ffffff", "total": 0.0 },
    "Borsele": { "colors": "#ffffff", "total": 0.0 },
    "Hollands Kroon": { "colors": "#ffffff", "total": 0.0 },
    "Oldenzaal": { "colors": "#ffffff", "total": 0.0 },
    "Oegstgeest": { "colors": "#e7f6e3", "total": 1.0 },
    "Mook en Middelaar": { "colors": "#ffffff", "total": 0.0 },
    "Beek": { "colors": "#ffffff", "total": 0.0 },
    "Langedijk": { "colors": "#ffffff", "total": 0.0 },
    "Zoetermeer": { "colors": "#ffffff", "total": 0.0 },
    "Amsterdam": { "colors": "#ffffff", "total": 0.0 },
    "Meerssen": { "colors": "#ffffff", "total": 0.0 },
    "Renswoude": { "colors": "#ffffff", "total": 0.0 },
    "Zundert": { "colors": "#ffffff", "total": 0.0 },
    "Bedum": { "colors": "#ffffff", "total": 0.0 },
    "Hengelo": { "colors": "#ffffff", "total": 0.0 },
    "Renkum": { "colors": "#ffffff", "total": 0.0 },
    "Haarlem": { "colors": "#00682a", "total": 8.0 },
    "Middelburg": { "colors": "#ffffff", "total": 0.0 },
    "Bernheze": { "colors": "#e7f6e3", "total": 1.0 },
    "Wijk bij Duurstede": { "colors": "#ceecc8", "total": 2.0 },
    "Brielle": { "colors": "#e7f6e3", "total": 1.0 },
    "Achtkarspelen": { "colors": "#e7f6e3", "total": 1.0 },
    "Urk": { "colors": "#ffffff", "total": 0.0 },
    "Gennep": { "colors": "#ffffff", "total": 0.0 },
    "Kampen": { "colors": "#ceecc8", "total": 2.0 },
    "Waadhoeke": { "colors": "#ffffff", "total": 0.0 },
    "Maastricht": { "colors": "#ffffff", "total": 0.0 },
    "Heemskerk": { "colors": "#ffffff", "total": 0.0 },
    "Oirschot": { "colors": "#ffffff", "total": 0.0 },
    "Waalwijk": { "colors": "#ffffff", "total": 0.0 },
    "Schinnen": { "colors": "#ffffff", "total": 0.0 },
    "Noordoostpolder": { "colors": "#ffffff", "total": 0.0 },
    "Landerd": { "colors": "#ffffff", "total": 0.0 },
    "Emmen": { "colors": "#e7f6e3", "total": 1.0 },
    "Elburg": { "colors": "#ffffff", "total": 0.0 },
    "Etten-Leur": { "colors": "#ffffff", "total": 0.0 },
    "Noord-Beveland": { "colors": "#ffffff", "total": 0.0 },
    "Molenwaard": { "colors": "#ffffff", "total": 0.0 },
    "Neder-Betuwe": { "colors": "#ffffff", "total": 0.0 },
    "Lisse": { "colors": "#ceecc8", "total": 2.0 },
    "Soest": { "colors": "#ffffff", "total": 0.0 },
    "Ten Boer": { "colors": "#ffffff", "total": 0.0 },
    "Loppersum": { "colors": "#ceecc8", "total": 2.0 },
    "Houten": { "colors": "#ffffff", "total": 0.0 },
    "Buren": { "colors": "#ffffff", "total": 0.0 },
    "Velsen": { "colors": "#ffffff", "total": 0.0 },
    "Oosterhout": { "colors": "#e7f6e3", "total": 1.0 },
    "Harlingen": { "colors": "#ffffff", "total": 0.0 },
    "Barendrecht": { "colors": "#ffffff", "total": 0.0 },
    "Tytsjerksteradiel": { "colors": "#ceecc8", "total": 2.0 },
    "Voorschoten": { "colors": "#ffffff", "total": 0.0 },
    "Tubbergen": { "colors": "#ffffff", "total": 0.0 },
    "Grootegast": { "colors": "#ffffff", "total": 0.0 },
    "Aalburg": { "colors": "#ffffff", "total": 0.0 },
    "Montferland": { "colors": "#ffffff", "total": 0.0 },
    "Zaanstad": { "colors": "#ceecc8", "total": 2.0 },
    "Uithoorn": { "colors": "#ffffff", "total": 0.0 },
    "Veenendaal": { "colors": "#ffffff", "total": 0.0 },
    "Bergeijk": { "colors": "#e7f6e3", "total": 1.0 },
    "Schouwen-Duiveland": { "colors": "#ffffff", "total": 0.0 },
    "Brummen": { "colors": "#ffffff", "total": 0.0 },
    "'s-Hertogenbosch": { "colors": "#ffffff", "total": 0.0 },
    "Ermelo": { "colors": "#e7f6e3", "total": 1.0 },
    "Zuidhorn": { "colors": "#ffffff", "total": 0.0 },
    "Almere": { "colors": "#aedea7", "total": 3.0 },
    "Halderberge": { "colors": "#ffffff", "total": 0.0 },
    "Weststellingwerf": { "colors": "#ffffff", "total": 0.0 },
    "Marum": { "colors": "#ffffff", "total": 0.0 },
    "Oldambt": { "colors": "#ceecc8", "total": 2.0 },
    "Opsterland": { "colors": "#ffffff", "total": 0.0 },
    "Berg en Dal": { "colors": "#ceecc8", "total": 2.0 },
    "Zwolle": { "colors": "#ffffff", "total": 0.0 },
    "Vaals": { "colors": "#ffffff", "total": 0.0 },
    "Alblasserdam": { "colors": "#ffffff", "total": 0.0 },
    "Dalfsen": { "colors": "#e7f6e3", "total": 1.0 },
    "Leiderdorp": { "colors": "#ffffff", "total": 0.0 },
    "Reusel-De Mierden": { "colors": "#ffffff", "total": 0.0 },
    "Stadskanaal": { "colors": "#e7f6e3", "total": 1.0 },
    "Ede": { "colors": "#ffffff", "total": 0.0 },
    "Heerde": { "colors": "#e7f6e3", "total": 1.0 },
    "Zutphen": { "colors": "#e7f6e3", "total": 1.0 },
    "Harderwijk": { "colors": "#aedea7", "total": 3.0 },
    "Woudenberg": { "colors": "#ffffff", "total": 0.0 },
    "Leudal": { "colors": "#ffffff", "total": 0.0 },
    "Gilze en Rijen": { "colors": "#e7f6e3", "total": 1.0 },
    "Mill en Sint Hubert": { "colors": "#ffffff", "total": 0.0 },
    "Tholen": { "colors": "#ffffff", "total": 0.0 },
    "Laren": { "colors": "#e7f6e3", "total": 1.0 },
    "Neerijnen": { "colors": "#ffffff", "total": 0.0 },
    "Putten": { "colors": "#aedea7", "total": 3.0 },
    "Moerdijk": { "colors": "#ffffff", "total": 0.0 },
    "Goeree-Overflakkee": { "colors": "#88ce87", "total": 4.0 },
    "Duiven": { "colors": "#ffffff", "total": 0.0 },
    "Voerendaal": { "colors": "#ffffff", "total": 0.0 },
    "Roerdalen": { "colors": "#ffffff", "total": 0.0 },
    "Hulst": { "colors": "#ffffff", "total": 0.0 },
    "Beemster": { "colors": "#ffffff", "total": 0.0 },
    "Leiden": { "colors": "#ffffff", "total": 0.0 },
    "Strijen": { "colors": "#ffffff", "total": 0.0 },
    "Lopik": { "colors": "#ffffff", "total": 0.0 },
    "Enschede": { "colors": "#aedea7", "total": 3.0 },
    "Midden-Drenthe": { "colors": "#ffffff", "total": 0.0 },
    "Heiloo": { "colors": "#5db96b", "total": 5.0 },
    "Papendrecht": { "colors": "#ffffff", "total": 0.0 },
    "Huizen": { "colors": "#ffffff", "total": 0.0 },
    "Uitgeest": { "colors": "#ceecc8", "total": 2.0 },
    "Steenbergen": { "colors": "#ceecc8", "total": 2.0 },
    "Edam-Volendam": { "colors": "#ffffff", "total": 0.0 },
    "Hof van Twente": { "colors": "#ffffff", "total": 0.0 },
    "Meppel": { "colors": "#ffffff", "total": 0.0 },
    "Vlieland": { "colors": "#e7f6e3", "total": 1.0 },
    "Maasgouw": { "colors": "#ffffff", "total": 0.0 },
    "Bunnik": { "colors": "#ffffff", "total": 0.0 },
    "Lochem": { "colors": "#ffffff", "total": 0.0 },
    "Asten": { "colors": "#ffffff", "total": 0.0 },
    "Pijnacker-Nootdorp": { "colors": "#ffffff", "total": 0.0 },
    "Uden": { "colors": "#ffffff", "total": 0.0 },
    "Nieuwkoop": { "colors": "#e7f6e3", "total": 1.0 },
    "Deventer": { "colors": "#ffffff", "total": 0.0 },
    "Schagen": { "colors": "#1a843f", "total": 7.0 },
    "Venlo": { "colors": "#e7f6e3", "total": 1.0 },
    "Ridderkerk": { "colors": "#ffffff", "total": 0.0 },
    "Stein": { "colors": "#ffffff", "total": 0.0 },
    'S\xFAdwest-Frysl\xE2n': { "colors": "#ffffff", "total": 0.0 },
    "Grave": { "colors": "#e7f6e3", "total": 1.0 },
    "Brunssum": { "colors": "#ffffff", "total": 0.0 },
    "Kaag en Braassem": { "colors": "#e7f6e3", "total": 1.0 },
    "Oss": { "colors": "#ffffff", "total": 0.0 },
    "Noordwijkerhout": { "colors": "#ffffff", "total": 0.0 },
    "Rhenen": { "colors": "#ffffff", "total": 0.0 },
    "Epe": { "colors": "#ffffff", "total": 0.0 },
    "Heerenveen": { "colors": "#ffffff", "total": 0.0 },
    "Sittard-Geleen": { "colors": "#ffffff", "total": 0.0 },
    "Venray": { "colors": "#ffffff", "total": 0.0 },
    "Maassluis": { "colors": "#ffffff", "total": 0.0 },
    "Zaltbommel": { "colors": "#ffffff", "total": 0.0 },
    "Hilversum": { "colors": "#37a055", "total": 6.0 },
    "Den Helder": { "colors": "#ffffff", "total": 0.0 },
    "Almelo": { "colors": "#ceecc8", "total": 2.0 },
    "Terneuzen": { "colors": "#ffffff", "total": 0.0 },
    "Culemborg": { "colors": "#ffffff", "total": 0.0 },
    "Sluis": { "colors": "#ffffff", "total": 0.0 },
    "Aa en Hunze": { "colors": "#ffffff", "total": 0.0 },
    "Bloemendaal": { "colors": "#ffffff", "total": 0.0 },
    "Son en Breugel": { "colors": "#ffffff", "total": 0.0 },
    "Heerhugowaard": { "colors": "#ffffff", "total": 0.0 },
    "Loon op Zand": { "colors": "#ffffff", "total": 0.0 },
    "Haren": { "colors": "#ffffff", "total": 0.0 },
    "Zevenaar": { "colors": "#ceecc8", "total": 2.0 },
    "Capelle aan den IJssel": { "colors": "#ffffff", "total": 0.0 },
    "De Ronde Venen": { "colors": "#e7f6e3", "total": 1.0 },
    "De Fryske Marren": { "colors": "#ffffff", "total": 0.0 },
    "Eindhoven": { "colors": "#ffffff", "total": 0.0 },
    "Nieuwegein": { "colors": "#ffffff", "total": 0.0 },
    "Veldhoven": { "colors": "#e7f6e3", "total": 1.0 },
    "Nuth": { "colors": "#ffffff", "total": 0.0 },
    "Albrandswaard": { "colors": "#ffffff", "total": 0.0 },
    "Zeist": { "colors": "#ffffff", "total": 0.0 },
    "Borne": { "colors": "#e7f6e3", "total": 1.0 },
    "Blaricum": { "colors": "#e7f6e3", "total": 1.0 },
    "Enkhuizen": { "colors": "#ffffff", "total": 0.0 },
    "Dordrecht": { "colors": "#e7f6e3", "total": 1.0 },
    "Leidschendam-Voorburg": { "colors": "#ffffff", "total": 0.0 },
    "Haarlemmermeer": { "colors": "#ffffff", "total": 0.0 },
    "Leeuwarden": { "colors": "#ffffff", "total": 0.0 },
    "Waterland": { "colors": "#ceecc8", "total": 2.0 },
    "Hendrik-Ido-Ambacht": { "colors": "#ffffff", "total": 0.0 },
    "Tilburg": { "colors": "#ffffff", "total": 0.0 },
    "Heeze-Leende": { "colors": "#ffffff", "total": 0.0 },
    "Onderbanken": { "colors": "#ffffff", "total": 0.0 },
    "Sliedrecht": { "colors": "#ffffff", "total": 0.0 },
    "Pekela": { "colors": "#e7f6e3", "total": 1.0 },
    "Dronten": { "colors": "#5db96b", "total": 5.0 },
    "Lingewaard": { "colors": "#ceecc8", "total": 2.0 },
    "Weert": { "colors": "#ffffff", "total": 0.0 },
    "Beverwijk": { "colors": "#88ce87", "total": 4.0 },
    "Olst-Wijhe": { "colors": "#ffffff", "total": 0.0 },
    "Helmond": { "colors": "#ffffff", "total": 0.0 },
    "Steenwijkerland": { "colors": "#e7f6e3", "total": 1.0 },
    "Dinkelland": { "colors": "#ffffff", "total": 0.0 },
    "Leerdam": { "colors": "#ffffff", "total": 0.0 },
    "Boekel": { "colors": "#ceecc8", "total": 2.0 },
    "Winterswijk": { "colors": "#ffffff", "total": 0.0 },
    "Coevorden": { "colors": "#ffffff", "total": 0.0 },
    "Nijkerk": { "colors": "#ffffff", "total": 0.0 },
    "Hillegom": { "colors": "#ffffff", "total": 0.0 },
    "De Bilt": { "colors": "#ffffff", "total": 0.0 },
    "Dongen": { "colors": "#ffffff", "total": 0.0 },
    "Zwijndrecht": { "colors": "#ffffff", "total": 0.0 },
    "Goirle": { "colors": "#ceecc8", "total": 2.0 },
    "Valkenburg aan de Geul": { "colors": "#ffffff", "total": 0.0 },
    "Zeewolde": { "colors": "#ffffff", "total": 0.0 },
    "Apeldoorn": { "colors": "#ffffff", "total": 0.0 },
    "Vught": { "colors": "#ffffff", "total": 0.0 },
    "Boxtel": { "colors": "#ffffff", "total": 0.0 },
    "Eemnes": { "colors": "#ffffff", "total": 0.0 },
    "Kerkrade": { "colors": "#ffffff", "total": 0.0 },
    "Voorst": { "colors": "#ffffff", "total": 0.0 },
    "Geldrop-Mierlo": { "colors": "#5db96b", "total": 5.0 },
    "IJsselstein": { "colors": "#ffffff", "total": 0.0 },
    "Veendam": { "colors": "#ffffff", "total": 0.0 },
    "Tiel": { "colors": "#ffffff", "total": 0.0 },
    "Opmeer": { "colors": "#ffffff", "total": 0.0 },
    "Zuidplas": { "colors": "#ffffff", "total": 0.0 },
    "Lelystad": { "colors": "#5db96b", "total": 5.0 },
    "Bergen op Zoom": { "colors": "#ceecc8", "total": 2.0 },
    "Hoorn": { "colors": "#ffffff", "total": 0.0 },
    "Stede Broec": { "colors": "#ffffff", "total": 0.0 },
    "Someren": { "colors": "#ffffff", "total": 0.0 },
    "Gemert-Bakel": { "colors": "#ffffff", "total": 0.0 },
    "Echt-Susteren": { "colors": "#ffffff", "total": 0.0 }
};