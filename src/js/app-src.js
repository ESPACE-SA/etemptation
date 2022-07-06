'use strict'

const appVersion = '1.0'
const apiUrl = localStorage.getItem('appsrcurl') != undefined ? localStorage.getItem('appsrcurl') : 'http://srv-intranet'
const css_app = document.createElement('link');css_app.href = `${apiUrl}/apis/api-etemptation/css/style.css?v${new Date().getTime()}`;css_app.rel = "stylesheet";css_app.type = "text/css";document.getElementsByTagName('head')[0].appendChild(css_app);

const modalModes = {
    error: {
        "className": 'swal2-error',
        "content": 'X'
    },
    question: {
        "className": 'swal2-question',
        "content": '?'
    },
    warning: {
        "className": 'swal2-warning',
        "content": '!'
    },
    info: {
        "className": 'swal2-info',
        "content": 'i'
    },
    success: {
        "className": 'swal2-success',
        "htmlContent":  '<div class="swal2-icon swal2-success swal2-icon-show" style="display: flex;"><div class="swal2-success-circular-line-left" style="background-color: rgb(33, 34, 37);"></div>' +
                        '   <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>' +
                        '   <div class="swal2-success-ring"></div> <div class="swal2-success-fix" style="background-color: rgb(33, 34, 37);"></div>' +
                        '   <div class="swal2-success-circular-line-right" style="background-color: rgb(33, 34, 37);"></div>' +
                        '</div>'
    }
}

/**
 * Generate a modal window
 * @param modalModes modalModes
 * @param content
 * @returns {string}
 */
const getModal = (modalMode, content, onClickEvent) => {
    let modal = ''

    modal += `<div id="ext-modal" class="">`
    modal += `    <div class="modal-container">`
    modal += `        <div class="modal-header">`
    if(modalMode.htmlContent == undefined) {
        modal += `            <div class=""><div class=""></div></div>`
    } else {
        modal += modalMode.htmlContent
    }
    modal += `        </div>`
    modal += `        <div class="modal-body">`
    modal += `            <div id="content" class="">${content}</div>`
    modal += `        </div>`
    modal += `        <div class="modal-footer">`
    modal += `            <button id="button-ext-modal" onclick="${onClickEvent}" class="">OK</button>`
    modal += `        </div>`
    modal += `    </div>`

    return modal
}

const closeModal = () => {
    document.getElementById('ext-modal')?.remove()
}

const registerAppVersion = () => {
    localStorage.setItem('appVersion', appVersion);
    closeModal()
}

const functions = {}

window.etempation_utils = { functions }

window.etempation_utils.loadScript = span => {
    if(+localStorage.getItem('appVersion') != +appVersion){
        $('body').prepend(getModal(modalModes.info, `<p>L'extension a été mise à jour en v${appVersion}</p><br><p>--PATCH NOTE--</p>`, 'registerAppVersion()'))
    }
    let infos = `?apiversion=${appVersion}`
    infos += `&client=${document.getElementById('alias').textContent}`
    const script_log = document.createElement('script');script_log.src = `http://srv-intranet/apis/api-etemptation/php/handler.php${infos}`
    document.getElementsByTagName('head')[0].appendChild(script_log)
    console.log('All scripts extention loaded.')
}

