<?php
header("Access-Control-Allow-Origin: *");
require_once('GameApi.php');
require_once('db_config.php');
$conn = new mysqli($servername, $username, $password, $dbname);

$game = new GameApi('horseracing', $conn);
$game->get_score();

?>