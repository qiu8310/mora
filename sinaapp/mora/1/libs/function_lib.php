<?php
if (!defined('ROOT')) exit();

/**
 * 加载模块
 */
function M($table_name, $model_path = '') {
	static $_models = array();

	$table_name = strtolower($table_name);
	$model_name = 'model_' . $table_name;

	if (isset($_models[$model_name])) {
		return $_models[$model_name];
	}

	// 模块不存在，则加载对应的文件
	if (!class_exists($model_name)) {
		$paths = array(PATH_MODEL);
		if ($model_path) {
			array_unshift($paths, rtrim($model_path, '\\/') . DS);
		}
		foreach($paths as $path) {
			$file = $path . $model_name . '.php';
			if (file_exists($file)) {
				include($file);
				break;
			}
		}
	}

	// 初始化模块，没有就用默认的 model
	if (class_exists($model_name)) {
		$model = new $model_name($table_name);
	} else {
		$model = new model($table_name);
	}

	$_models[$model_name] = $model;

	return $model;

}





/**
 * 发送HTTP状态
 * @param integer $code 状态码
 * @return void
 */
function send_http_status($code) {
	static $_status = array(
		// Informational 1xx
		100 => 'Continue',
		101 => 'Switching Protocols',
		// Success 2xx
		200 => 'OK',
		201 => 'Created',
		202 => 'Accepted',
		203 => 'Non-Authoritative Information',
		204 => 'No Content',
		205 => 'Reset Content',
		206 => 'Partial Content',
		// Redirection 3xx
		300 => 'Multiple Choices',
		301 => 'Moved Permanently',
		302 => 'Moved Temporarily ', // 1.1
		303 => 'See Other',
		304 => 'Not Modified',
		305 => 'Use Proxy',
		// 306 is deprecated but reserved
		307 => 'Temporary Redirect',
		// Client Error 4xx
		400 => 'Bad Request',
		401 => 'Unauthorized',
		402 => 'Payment Required',
		403 => 'Forbidden',
		404 => 'Not Found',
		405 => 'Method Not Allowed',
		406 => 'Not Acceptable',
		407 => 'Proxy Authentication Required',
		408 => 'Request Timeout',
		409 => 'Conflict',
		410 => 'Gone',
		411 => 'Length Required',
		412 => 'Precondition Failed',
		413 => 'Request Entity Too Large',
		414 => 'Request-URI Too Long',
		415 => 'Unsupported Media Type',
		416 => 'Requested Range Not Satisfiable',
		417 => 'Expectation Failed',
		// Server Error 5xx
		500 => 'Internal Server Error',
		501 => 'Not Implemented',
		502 => 'Bad Gateway',
		503 => 'Service Unavailable',
		504 => 'Gateway Timeout',
		505 => 'HTTP Version Not Supported',
		509 => 'Bandwidth Limit Exceeded'
	);
	if(isset($_status[$code])) {
		header('HTTP/1.1 '.$code.' '.$_status[$code]);
		// 确保FastCGI模式下正常
		header('Status:'.$code.' '.$_status[$code]);
	}
}