<?php

if(isset($_GET['d']))
    $data = $_GET['d'];
$key = "bace4dd0fc47016bbace4dd0fc47016b";
// $key = "bace4dd0fc47016b8881bd3f41cdac87939d5816d719a772";
$iv = "cc0bd1d8d23cedb0";
$Clear = "Klartext";        

// $crypted = encrypt($Clear, $key);
echo encrypt("data=aaa&",  $key)."</br>";
echo $data;
$newClear = decrypt($data, $key);
echo "</br>";        
echo "Decrypred: ".$newClear."</br>";        

function encrypt($sValue, $key)
{
    global $iv;
    return base64_encode(mcrypt_encrypt(
            MCRYPT_RIJNDAEL_128 ,
                $key, $sValue, 
                MCRYPT_MODE_CBC, 
                $iv
            ));
}

function decrypt($sValue, $key)
{
    global $iv;
    return 
        mcrypt_decrypt(
            MCRYPT_RIJNDAEL_128 , 
            $key, 
            base64_decode($sValue), 
            MCRYPT_MODE_CBC,
            $iv
        );
}

?>