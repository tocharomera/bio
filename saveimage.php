<?php
if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
{
$imgdata = $GLOBALS['HTTP_RAW_POST_DATA'];

    $filteredData=substr($imgdata, strpos($imgdata, ",")+1);// Remove the headers (data:,) part.
    $data = base64_decode($filteredData);//decode data
    $im = imagecreatefromstring($data); //create image
    if ($im !== false) {
        imagesavealpha($im, true);
        imagejpeg($im, "result.jpg",9);
    }
    else {
        echo 'An error occurred.';
    }

    }
?>
