'use strict'

window.etempation_utils = {}

window.etempation_utils.tryLoadScript = function(span) {
    setTimeout(() => {
        if (span === undefined || window.etempation_utils.loadScript === undefined) {
            window.etempation_utils.tryLoadScript()
        } else {
            window.etempation_utils.loadScript(span)
        }
    }, 1000)
}

window.etempation_utils.loadExtension = setTimeout(() => {
    const span = document.createElement('span')
    if(span === undefined) {
        window.etempation_utils.loadExtension()
    } else {
        const script_App = document.createElement('script')
        script_App.src = `${localStorage.getItem('appsrcurl') != undefined ? localStorage.getItem('appsrcurl') : 'http://srv-intranet'}/apis/api-etemptation/js/app-src.js?v=${new Date().getTime()}`
        document.getElementsByTagName('head')[0].appendChild(script_App)
        window.etempation_utils.tryLoadScript(span)
    }
}, 1000)

