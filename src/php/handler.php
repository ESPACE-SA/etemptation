<?php

function donate_log($platform, $text)
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
    donate_log('AIM', $report);
}

?>