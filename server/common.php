<?php

function error($str){
    die(json_encode(array("err"=>$str)));
}

function sendData($d){
    echo json_encode(array("data"=>$d));
}
?>