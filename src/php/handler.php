<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
include '../../../intranet/sql-and-functions/commons_functions.php';

function logEvent($platform, $text)
{
    date_default_timezone_set('Europe/Paris');
    $date = date('Y/m/d H:i:s');

    $logFile = fopen("log.txt", "a");
    fwrite($logFile, "[" . $date . "] " . $platform . " => " . $text . "\n");
}

if($_GET['client']) {
    $report = "";
    foreach ($_GET as $k => $v) {
        $report = $report . " " . $k . " => " . $v . " /";
    }
    logEvent('AIM', $report);
}

if($_GET['notify']) {
    header('Content-type: application/json');
    $state = $_GET['state'] == 'Actif' ? 'entrée' : 'sortie';
    $body = '
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <Title>Etemptation</Title>
                <meta charset="windows-1252">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style type="text/css"> 
                    table 
                    {
                        border-collapse: collapse;
                    }
        
                    table, td, th {
                        border: 1px solid black;
                    }
                    
                    br 
                    {
                        mso-data-placement: same-cell;
                    }
                </style>
            </head>
            <body>
                <div>Bonjour</div>
                <br>
                <br> 
                <div>Une ' . $state . ' de l\'entreprise à eu lieu, merci de mettre à jour l\'Active Directory pour: </div>
                <br>
                <table>
                    <tr><td>Matricule</td><td>' . $_GET['matricule'] . '</td></tr>
                    <tr><td>Identitté</td><td>' . $_GET['employe'] . '</td></tr>
                    <tr><td>Date début de contrat</td><td>' . $_GET['date_debut'] . '</td></tr>
                    <tr><td>Date de fin de contrat</td><td>' . $_GET['date_fin'] . '</td></tr>
                    <tr><td>Evenement</td><td>' . $state . '</td></tr>
                </table>
            </body> 
        </html>';

    $mail = sendMail(false, 0, 'c.lopes@espace-sa.fr', '', 'Etemptation', "Etemptation - Mise à jour d'une " . $state . " du personnel.", $body, null, false);
    echo json_encode(['success' => $mail]);
} else {
    $_GET['error'] = true;
    echo json_encode($_GET);
}


?>