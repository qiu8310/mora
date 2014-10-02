<?php
/**
 *	此脚本45分钟会运行一次
 *
 *	运行模式是：
 * 	00:00 -> 00:45 -> 01:00 -> 01:45 -> 02:00 -> 02:45 ... （并不是真正的每 45 分钟一次）
 */
require( '../libs/common.php' );

$day	= intval(date('d', TIMESTAMP)); // 1 - 31 日
$hour	= intval(date('H', TIMESTAMP)); // 0 - 23 时
$minute = intval(date('i', TIMESTAMP)); // 0 - 59 分

$curl = curl_init();
curl_setopt($curl, CURLOPT_HEADER, 0);

// 每天凌晨 00:45 刷新 fcbst 的分类信息
if ($hour >= 0 && $hour < 1 && $minute > 10) {

}

// 每隔两天，凌晨 02:45 清除 fcbst 的缓存
if ($hour >= 2 && $hour < 3 && $minute > 10 && $day % 3 === 0) {

}


// 每月一次，生成 sitemap
if ($hour >= 3 && $hour < 4 && $minute > 10 && $day === 1) {

}


curl_close($curl);
// writelog('cron_every_45_mins', 'Finished!!!');

exit('0');
