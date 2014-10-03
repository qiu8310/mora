<?php
if (!defined('ROOT')) exit();
abstract class StorageBase {
	public static function get($key, $callback = false, $arguments = array()) {
		$val = self::obtain($key);

		if ($val === false) {
			$val = self::callback($callback, $arguments);
			if ($val !== false) {
				self::set($key, $val);
			}
		}

		return $val;
	}

	public static function set($key, $val, $expire = 0) {
		return self::save($key, $val, $expire);
	}

	public static function del($key) {
		return self::_del($key);
	}

	abstract protected static function _get($key);
	abstract protected static function _set($key, $val);
	abstract protected static function _del($key);

	protected static function save($key, $val, $expire) {
		$save_val = serialize($val);
		$save_val_length = strlen($save_val);
		$expire = $expire > 0 ? TIMESTAMP + $expire : 0;

		self::_set($key, sprintf('%d,%d,%s', $expire, $save_val_length, $save_val));
		return $val;
	}

	protected static function obtain($key) {
		$val = self::_get($key);

		list($expire, $save_val_length, $save_val) = explode(',', $val, 3);
		$expire = intval($expire);
		$save_val_length = intval($save_val_length);

		if (!$save_val) return false;

		if (($expire > 0 && $expire < TIMESTAMP) || $save_val_length != strlen($save_val)) {
			$val = false;
		} else {
			$val = unserialize($save_val);
		}

		return $val;
	}

	protected static function callback($callback, $arguments) {
		if ($callback && function_exists($callback)) {
			return call_user_func_array($callback, $arguments);
		}
		return false;
	}
}

// 是否是在 SAE 下
if (ENVIRONMENT === ENVIRONMENT_SAE) {
	class Storage extends StorageBase {
		private static $kv;
		private static function instance () {
			if (!isset(self::$kv)) {
				self::$kv = new SaeKV();
				self::$kv->init();
			}
			return self::$kv;
		}
		protected static function _get ($key) {
			return self::instance()->get($key);
		}

		protected static function _set ($key, $val) {
			self::instance()->set($key, $val);
			return $val;
		}

		protected static function _del ($key) {
			return self::instance()->delete($key);
		}
	}
} else {
	define('STORAGE_CACHE', ROOT . '.cache' . DS);

	class Storage extends StorageBase {
		protected static function _get ($key) {
			$file = STORAGE_CACHE . $key;

			return file_exists($file) ? file_get_contents($file) : false;
		}

		protected static function _set ($key, $val) {
			$file = STORAGE_CACHE . $key;
			file_put_contents($file, $val);
			return $val;
		}

		protected static function _del ($key) {
			$file = STORAGE_CACHE . $key;
			if (!file_exists($file)) return false;
			return @unlink($file);
		}
	}
}
