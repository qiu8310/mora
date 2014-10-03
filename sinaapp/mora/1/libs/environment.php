<?php
define('ENVIRONMENT_LOCAL', 'local');
define('ENVIRONMENT_SAE', 'sae');


// 根据 host 自动判断环境
if (!defined('ENVIRONMENT')
		&& ($_SERVER['HTTP_HOST'] === 'mora.sinaapp.com'
    || $_SERVER['HTTP_HOST'] === 'mora.org.cn')) {
	define ('ENVIRONMENT', ENVIRONMENT_SAE);
} else {
	define ('ENVIRONMENT', ENVIRONMENT_LOCAL);
}