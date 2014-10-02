<?php
if (!defined('ROOT')) exit();

// 是否是在 SAE 下
if (ENVIRONMENT === ENVIRONMENT_SAE) {
	class Storage {
		private static $kv;
		private static function instance () {
			if (!isset(self::$kv)) {
				self::$kv = new SaeKV();
				self::$kv->init();
			}
			return self::$kv;
		}
		public static function get ($key, $callback = false, $callback_params = array()) {
			$val = self::instance()->get($key);
			if ($val !== false) {
				$val = unserialize($val);
			} else if ($callback && function_exists($callback)) {
				$val = self::set($key, call_user_func_array($callback, $callback_params));
			}
			return $val;
		}

		public static function set ($key, $val) {
			self::instance()->set($key, serialize($val));
			return $val;
		}

		public static function del ($key) {
			return self::instance()->delete($key);
		}
	}
} else {
	define('STORAGE_CACHE', ROOT . '.cache' . DS);

	class Storage {
		public static function get ($key, $callback = false, $callback_params = array()) {
			$file = STORAGE_CACHE . $key;
			if (file_exists($file)) {
				return unserialize(file_get_contents($file));
			} else if ($callback && function_exists($callback)) {
				return self::set($key, call_user_func_array($callback, $callback_params));
			}
			return false;
		}

		public static function set ($key, $val) {
			$file = STORAGE_CACHE . $key;
			file_put_contents($file, serialize($val));
			return $val;
		}

		public static function del ($key) {
			$file = STORAGE_CACHE . $key;
			if (!file_exists($file)) return false;

			return @unlink($file);
		}
	}
}
