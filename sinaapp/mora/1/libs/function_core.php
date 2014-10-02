<?php
if (!defined('ROOT')) exit();

/**
 *	写日志
 */
function writelog($file, $log, $logtime=true) {
	/*
		CREATE TABLE IF NOT EXISTS `logs` (
		  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
		  `time` datetime NOT NULL,
		  `app` varchar(50) NOT NULL,
		  `message` text NOT NULL,
		  `ext` varchar(200) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
	*/

	if (ENVIRONMENT === ENVIRONMENT_SAE) {
		//DB::insert('logs', array('time'=>date('Y-m-d H:i:s', TIMESTAMP), 'app'=>$file, 'message'=>$log));
		return true;
	}

	$yearmonth = date('Ym');
	$logdir = ROOT.'logs'.DS;
	if (!file_exists($logdir)) mkdir($logdir, 0777);

	$logfile = $logdir.$yearmonth.'_'.$file.'.php';
	$exist = @file_exists($logfile);
	if($exist && @filesize($logfile) > 2048000) {
		$dir = opendir($logdir);
		$length = strlen($file);
		$maxid = $id = 0;
		while($entry = readdir($dir)) {
			if(strpos($entry, $yearmonth.'_'.$file) !== false) {
				$id = intval(substr($entry, $length + 8, -4));
				$id > $maxid && $maxid = $id;
			}
		}
		closedir($dir);

		$logfilebak = $logdir.$yearmonth.'_'.$file.'_'.($maxid + 1).'.php';
		@rename($logfile, $logfilebak);
		$exist = false;
	}

	if($fp = @fopen($logfile, 'a')) {
		@flock($fp, 2);
		if (!$exist) {
			fwrite($fp, '<?php if (!defined(\'ROOT\')) exit(); ?>'.PHP_EOL);
		}
		if(!is_array($log)) {
			$log = array($log);
		}
		if ($logtime) {
			$time = date('Y-m-d H:i:s', TIMESTAMP)."\t";
		}
		foreach($log as $tmp) {
			fwrite($fp, str_replace(array('<?', '?>'), '', $time.$tmp).PHP_EOL);
		}
		fclose($fp);
	}
}

/**
 *	检查是否是爬虫
 */
function checkrobot($useragent = '') {
	static $kw_spiders = array('bot', 'crawl', 'spider' ,'slurp', 'sohu-search', 'lycos', 'robozilla');
	static $kw_browsers = array('msie', 'netscape', 'opera', 'konqueror', 'mozilla');

	$useragent = strtolower(empty($useragent) ? $_SERVER['HTTP_USER_AGENT'] : $useragent);
	if(strpos($useragent, 'http://') === false && dstrpos($useragent, $kw_browsers)) return false;
	if(dstrpos($useragent, $kw_spiders)) return true;
	return false;
}

/**
 *	获取用户IP
 */
function get_client_ip() {
	$ip = $_SERVER['REMOTE_ADDR'];
	if (isset($_SERVER['HTTP_CLIENT_IP']) && preg_match('/^([0-9]{1,3}\.){3}[0-9]{1,3}$/', $_SERVER['HTTP_CLIENT_IP'])) {
		$ip = $_SERVER['HTTP_CLIENT_IP'];
	} elseif(isset($_SERVER['HTTP_X_FORWARDED_FOR']) && preg_match_all('#\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}#s', $_SERVER['HTTP_X_FORWARDED_FOR'], $matches)) {
		foreach ($matches[0] as $xip) {
			if (!preg_match('#^(10|172\.16|192\.168)\.#', $xip)) {
				$ip = $xip;
				break;
			}
		}
	}
	return $ip;
}

/**
 *	扩展 php 的 strpos
 */
function dstrpos($string, &$arr, $returnvalue = false) {
	if(empty($string)) return false;
	foreach((array)$arr as $v) {
		if(strpos($string, $v) !== false) {
			$return = $returnvalue ? $v : true;
			return $return;
		}
	}
	return false;
}

function dintval($int, $allowarray = false) {
	$ret = intval($int);
	if($int == $ret || !$allowarray && is_array($int)) return $ret;
	if($allowarray && is_array($int)) {
		foreach($int as &$v) {
			$v = dintval($v, true);
		}
		return $int;
	} elseif($int <= 0xffffffff) {
		$l = strlen($int);
		$m = substr($int, 0, 1) == '-' ? 1 : 0;
		if(($l - $m) === strspn($int,'0987654321', $m)) {
			return $int;
		}
	}
	return $ret;
}


/**
 *	获取全局变量
 */
function getglobal($key, $group = null) {
	global $_G;
	$key = explode('/', $group === null ? $key : $group.'/'.$key);
	$v = &$_G;
	foreach ($key as $k) {
		if (!isset($v[$k])) {
			return null;
		}
		$v = &$v[$k];
	}
	return $v;
}

/**
 *	设置全局变量
 */
function setglobal($key , $value, $group = null) {
	global $_G;
	$key = explode('/', $group === null ? $key : $group.'/'.$key);
	$p = &$_G;
	foreach ($key as $k) {
		if(!isset($p[$k]) || !is_array($p[$k])) {
			$p[$k] = array();
		}
		$p = &$p[$k];
	}
	$p = $value;
	return true;
}




// 自动化
spl_autoload_register('autoload');
set_error_handler('error_handler');
set_exception_handler('exception_handler');

function error_handler ($errno, $errstr, $errfile, $errline) {
	writelog('php_error', "[$errno] $errstr ON FILE $errfile AT LINE $errline");
	if ($errno === E_NOTICE) return true;
	exit('PHP ERROR: ' . $errstr);
}

function exception_handler ($e) {
	$sql = '';
	if ($e instanceof DbException) {
		$sql = OS_EOL ."\t SQL: " . $e->getSql();
	}
	writelog('php_exception', $e->getMessage() . ' ON FILE ' . $e->getFile() . ' AT LINE ' . $e->getLine() . $sql );
	exit('Uncaught Exception: ' . $e->getMessage());
}

function autoload ($class) {
	$class = strtolower($class);
	list($class_prefix) = explode('_', $class, 2);

	$files = array(
		PATH_LIBS . 'class_' . $class . '.php',
		PATH_LIBS . $class_prefix . DS . $class . '.php'
	);

	foreach($files as $file) {
		if (file_exists($file)) {
			include($file);
			break;
		}
	}
}
