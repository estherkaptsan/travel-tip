export const utilService = {
    save,
    makeId,
    setQueryParams,
    deleteQueryParam,
    getValFromParam,
}




function setQueryParams(lat, lng) {

    const queryStringParams = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

// function setQueryParams(newParams) {
//     const url = new URL(window.location.href)
//     const params = new URLSearchParams(url.search)

//     for (var paramName in newParams) {
//         const paramValue = newParams[paramName]
//         params.set(paramName, paramValue) // used to update an existing query string parameter or add a new one if it doesn't exist.
//     }

//     url.search = params.toString()
//     window.history.pushState({ path: url.href }, '', url.href)  //modify the URL of the current page without reloading the page
// }

function deleteQueryParam(key) {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    params.delete(key)
    url.search = params.toString()

    window.history.pushState({ path: url.href }, '', url.href)
}

function getValFromParam(key) {
    const queryStringParams = new URLSearchParams(window.location.search)
    return queryStringParams.get(key)
}

// function setQueryParams(bookId = '',lang='en') {

//     const filterBy = getFilterBy()
//     console.log('H');
//      lang = getLang()
//     // &lang=${lang}

//     const queryStringParams = `?rate=${filterBy.rate}&price=${filterBy.price}&title=${filterBy.title}&bookid=${bookId}&lang=${lang}`
//     const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
//     window.history.pushState({ path: newUrl }, '', newUrl)
// }
