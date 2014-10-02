<?php

date_default_timezone_set('Asia/Shanghai');

define('DS', DIRECTORY_SEPARATOR);
define('OS_EOL', PHP_EOL);
define('HTML_EOL', '<br/>');
define('ROOT', dirname(__FILE__) . DS);
define('TIMESTAMP', time());

define('PATH_CONFIG', ROOT . 'config' . DS);
define('PATH_LIBS', ROOT . 'libs' . DS);
define('PATH_MODEL', ROOT . 'models' . DS);

// 导入环境变量
require_once( PATH_LIBS . 'environment.php' );


// 全局变量
global $_G;


error_reporting(ENVIRONMENT === ENVIRONMENT_LOCAL ? E_ALL : 0);

ini_set('magic_quotes_gpc', 'off');
ini_set('default_charset', 'UTF-8');



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


