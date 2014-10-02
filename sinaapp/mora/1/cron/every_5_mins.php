<?php
/**
 *	此脚本5分钟会运行一次
 *
 *	主要用来抓取网上我想要的东西，符合我的条件第一时间短信通知我
 */
require( '../libs/common.php' );

$day	= intval(date('d', TIMESTAMP)); // 1 - 31 日
$hour	= intval(date('H', TIMESTAMP)); // 0 - 23 时
$minute = intval(date('i', TIMESTAMP)); // 0 - 59 分

$curl = curl_init();
curl_setopt($curl, CURLOPT_HEADER, 0);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");
curl_setopt($curl, CURLOPT_TIMEOUT, 40);


// 深夜，不要打扰我
if ($hour >= 1 && $hour < 8) {

}




exit('0');