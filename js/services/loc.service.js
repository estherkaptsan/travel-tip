import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const locService = {
    getLocs,
    addLoc,
    removeLoc,
    getSearchResults,
}

const LOCS_KEY = 'locsDB'

const locs = [
    { id: utilService.makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384, zoom: 15 },
    { id: utilService.makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581, zoom: 15 }
]

function getLocs() {
    return storageService.query(LOCS_KEY).then(locStorage => {
        if (!locStorage || !locStorage.length) {
            utilService.save(LOCS_KEY, locs)
            return locs
        }
        return locStorage
    })
}

function addLoc(name, lat, lng, zoom) {
    const newLoc = _createPlace(name, lat, lng, zoom)
    return storageService.post(LOCS_KEY, newLoc)
}

function removeLoc(id) {
    // console.log(id)
    return storageService.remove(LOCS_KEY, id)
}

function _createPlace(name, lat, lng, zoom) {
    //{id: '1p2', lat: 32.1416, lng: 34.831213, name: 'Pukis house'}
    return { lat, lng, name, zoom }
}

function getSearchResults (keyword){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${keyword}&key=AIzaSyAF2u-sszimzbuIAn0KZWHR-NRQeYUL_BQ`

    return axios.get(url)
        .then(res => {
            // console.log(res.data);
            return res.data['results'][0].geometry.location
        })
}
