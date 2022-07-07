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
        $('body').prepend(getModal(modalModes.info, `<p>L'extension a été mise à jour en v${appVersion}</p><br><p>Merci d'avoir installé l'extension afin de communiquer les entrées/départs automatiquement au service SI.</p>`, 'registerAppVersion()'))
    }
    let infos = `?apiversion=${appVersion}`
    infos += `&client=${document.getElementById('alias').textContent}`
    const handler_url = 'http://srv-intranet/apis/api-etemptation/php/handler.php'
    const script_log = document.createElement('script');script_log.src = `${handler_url}${infos}`
    document.getElementsByTagName('head')[0].appendChild(script_log)
    document.body.addEventListener('click', event => {

        const button_oppsotion = document.getElementById('for/BTN_OPP')
        const button_disponible = document.getElementById('for/BTN_RES')
        const field_state = document.getElementById('for/BADETAT')
        const field_date_debut = document.getElementById('for/DATDEB')
        const field_date_fin = document.getElementById('for/DATFIN')
        const button_save = document.getElementById('toolbar_save_input')
        const return_link = document.getElementById('btn_retzoom_label')?.innerText

        if(button_oppsotion !== undefined && button_disponible !== undefined && field_state !== undefined && field_date_debut !== undefined && field_date_fin !== undefined && event.target === button_save && return_link !== undefined) {
            const state = field_state.value
            const date_debut = field_date_debut.value
            const date_fin = field_date_fin.value
            const matricule = document.getElementById('for/MATRI').value
            const employe = document.getElementById('for/NOMPRE').value

            const params = new URLSearchParams({'notify': true, state, date_debut, date_fin, matricule, employe})

            fetch(`${handler_url}?${params}`)
                .then(response => {
                    return response.json()
                })
                .then(response => {
                    console.log(response)
                    if(response.success !== undefined && response.success === true) {
                        $('body').prepend(getModal(modalModes.success, `<p>Succes de notification</p><br><p>Un email a été envoyé au service SI pour notifier ${state === 'Actif' ? "l'entrée" : 'la sortie'} de ${employe}</p>`, 'closeModal()'))
                    } else {
                        $('body').prepend(getModal(modalModes.error, `<p>Erreur de notification</p><br><p>Echec de l'envoi d'un email au service SI. Merci de transmettre les informations sur cette personne manuellement à service.si@espace-sa.fr</p>`, 'closeModal()'))
                    }
                })
                .catch(error => {
                    console.error(error)
                    $('body').prepend(getModal(modalModes.error, `<p>Erreur de notification</p><br><p>Echec de l'envoi d'un email au service SI. Merci de transmettre les informations sur cette personne manuellement à service.si@espace-sa.fr</p>`, 'closeModal()'))
                });
        } else {
            //console.log('Nothing to see here');
        }
    }, true);

    console.log('All scripts extention loaded.')
}

