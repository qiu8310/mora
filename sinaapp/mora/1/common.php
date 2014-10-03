<?php

date_default_timezone_set('Asia/Shanghai');

define('DS', DIRECTORY_SEPARATOR);
define('OS_EOL', PHP_EOL);
define('HTML_EOL', '<br/>');
define('ROOT', dirname(__FILE__) . DS);
define('TIMESTAMP', time());
define('CURRENT_TIME', date('Y-m-d H:i:s', TIMESTAMP));

define('PATH_CONFIG', ROOT . 'config' . DS);
define('PATH_LIBS', ROOT . 'libs' . DS);
define('PATH_MODEL', ROOT . 'models' . DS);
define('PATH_VENDOR', ROOT . 'vendor' . DS);


// 导入环境变量
require_once( PATH_LIBS . 'environment.php' );


// 全局变量
global $_G;


if (function_exists('ini_set')) {
	ini_set('magic_quotes_gpc', 'off');
	ini_set('default_charset', 'UTF-8');
}


require_once( PATH_LIBS . 'function_core.php' );
require_once( PATH_LIBS . 'function_lib.php' );
define('IS_ROBOT', checkrobot());

// 配置文件
$config_file = PATH_CONFIG . ENVIRONMENT . DS . 'global.php';
$config_file = file_exists($config_file) ? $config_file : PATH_CONFIG . 'global.php';
require_once($config_file);
$_G['config'] = $_config;

// DEBUG
if (!defined('DEBUG')) {
	define('DEBUG', isset($_config['debug']) ? $_config['debug'] : false);
}

// error_reporting
error_reporting((ENVIRONMENT == ENVIRONMENT_LOCAL || DEBUG) ? E_ALL : 0);
// sae error reporting
define('SAE_DEBUG', DEBUG && ENVIRONMENT === ENVIRONMENT_SAE);
if (SAE_DEBUG) {
	sae_set_display_errors(SAE_DEBUG);
}


// DB
if ( function_exists( 'mysqli_connect' ) || version_compare( phpversion(), '5.5', '>=' ) ) {
	database::init(new db_driver_mysqli(), $_config['db']);
} else {
	database::init(new db_driver_mysql(), $_config['db']);
}



// Option 类
//class Option {
//	public static function get($key) {
//		return DB::fetch_first(sprintf("SELECT * FROM `setting` WHERE `key`='%s' LIMIT 1", $key));
//	}
//	public static function set($key, $val, $ext="") {
//		$set  = array("key"=>$key, "val"=>$val, "ext"=>$ext);
//		$data = DB::fetch_first(sprintf("SELECT * FROM `setting` WHERE `key`='%s' LIMIT 1", $key));
//		if (empty($data)) {
//			return DB::insert("setting", $set );
//		} else {
//			if ($data["val"] != $val) {
//				unset($set["key"]);
//				return DB::update("setting", $set, sprintf("`key`='%s'", $key));
//			}
//		}
//	}
//}


