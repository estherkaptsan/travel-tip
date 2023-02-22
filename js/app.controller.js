import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onAddPlace = onAddPlace
window.onRemovePlace = onRemovePlace
// window.onPanToPlace = onPanToPlace
window.onSearch = onSearch
window.onCopyLink = onCopyLink

function onInit() {

    renderPlaces()

    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))

        renderQueryStringParama()


}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            // document.querySelector('.user-pos').innerText =
            //     `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log(lat,lng);
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
    mapService.addMarker({ lat, lng })
    setQueryParams(lat, lng)
    // mapService.panTo(35.6895, 139.6917)
}

// function onPanToPlace(lat, lng) {
//     console.log('Panning the Map')
//     mapService.panTo(lat, lng)
//     // mapService.panTo(35.6895, 139.6917)
// }

function onAddPlace(name, lat, lng, zoom) {
    mapService.addMarker({ lat, lng })
    // mapService.panTo({lat,lng})
    onPanTo(lat, lng)
    locService.addLoc(name, lat, lng, zoom).then(renderPlaces)
}

function onSearch(ev) {
    ev.preventDefault()
    let elInpiut = document.querySelector('.search').value
    console.log(elInpiut)
    locService.getSearchResults(elInpiut)
        .then(({ lat, lng }) => {
            onPanTo(lat, lng)
            // mapService.panTo(lat, lng)
            onAddPlace(elInpiut, lat, lng, 15)
        })
}

function onRemovePlace(placeId) {
    console.log(placeId)
    locService.removeLoc(placeId).then(renderPlaces)
}

function renderPlaces() {
    locService.getLocs().then(places => {
        console.log('places', places)
        const elList = document.querySelector('.place-list')
        let strHtmls = places
            .map(({ id, name, lat, lng }) => {
                return `
              <article class="place-card">
              <h4>${name}</h4>
              <button class="close-btn" onclick="onRemovePlace('${id}')"><i class="fa-solid fa-trash"></i>
              </button>
              <button class="go-btn" onclick="onPanTo(${lat}, ${lng})"><i class="fa-sharp fa-solid fa-globe"></i>
              </button>
            </article>
              `
            })
            .join('')
        elList.innerHTML = strHtmls
    })
}

function onCopyLink() {
    const queryStringParams = (new URLSearchParams(window.location.search)).toString()

    console.log(queryStringParams);


   const url = window.location.href;
   console.log(url);

   const projectUrl=`https://github.io/estherkaptsan/travel-tip${url}`


   const strHtml= `<a href="${projectUrl}">link</a>`
   console.log(strHtml);
   console.log(document.querySelector('.link'));
   document.querySelector('.link').innerHTML=strHtml
   console.log(projectUrl);


    // const params = new URLSearchParams(url.split('?')[1]);

    // const url = window.location.href;

    // // Extract the parameters from the URL string
    // const params = new URLSearchParams(url.split('?')[1]);
    
    // // Create a new URLSearchParams object and set its value to the extracted parameters
    // const newParams = new URLSearchParams(params);
    
    // // Convert the parameters to a string
    // const paramsString = newParams.toString();
    

}

function setQueryParams(lat, lng) {

    const queryStringParams = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderQueryStringParama() {

    const queryStringParams = new URLSearchParams(window.location.search)

    const loaction = {
        lat: +queryStringParams.get('lat') || 35.6895,
        lng: +queryStringParams.get('lng') || 139.6917,

    }
    console.log(loaction.lat, loaction.lng);

    onPanTo(loaction.lat, loaction.lng)

}
