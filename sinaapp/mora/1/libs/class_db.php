<?php
if (!defined('ROOT')) exit();

class DB extends database {
	public static $_cache = array();

	public static function count($table, $condition = '1') {
		return self::result_first('SELECT COUNT(*) FROM %t WHERE %r', array($table, self::where($condition)));
	}

	/*
	 * @return array
	 *
			Array
			(
			    [key] = Array
			        (
			            [Field] = key
			            [Type] = varchar(30)
			            [Collation] = utf8_general_ci
			            [Null] = NO
			            [Key] = PRI
			            [Default] = 
			            [Extra] = 
			            [Privileges] = select,insert,update,references
			            [Comment] = 关键字
			        )
			
			    [val] = Array
			        (
			            [Field] = val
			            [Type] = text
			            [Collation] = utf8_general_ci
			            [Null] = NO
			            [Key] = 
			            [Default] = 
			            [Extra] = 
			            [Privileges] = select,insert,update,references
			            [Comment] = 对应的值
			        )
			
			)
	
	 */
	private static function _cache_table_meta($table, $force = false) {
		# SHOW COLUMNS FROM m_option
		# SHOW CREATE TABLE m_option
		# SHOW FULL FIELDS FROM m_option
		return self::fetch_all('SHOW FULL FIELDS FROM %t', array($table), 'Field');
	}

	
	/*
	 * 
	 * Array
			(
			    m_option = Array
			        (
			            [Name] = m_option
			            [Engine] = MyISAM
			            [Version] = 10
			            [Row_format] = Dynamic
			            [Rows] = 1
			            [Avg_row_length] = 44
			            [Data_length] = 112
			            [Max_data_length] = 281474976710655
			            [Index_length] = 2048
			            [Data_free] = 68
			            [Auto_increment] = 
			            [Create_time] = 2014-10-02 20:28:05
			            [Update_time] = 2014-10-02 21:10:15
			            [Check_time] = 
			            [Collation] = utf8_general_ci
			            [Checksum] = 
			            [Create_options] = 
			            [Comment] = 
			        )
			
			)
	 */
	private static function _cache_db_meta($force = false) {
		// SHOW TABLE STATUS
		$res = self::fetch_all('SHOW TABLE STATUS', array());
		// 去掉表前缀
		$rtn = array();
		foreach ($res as &$item) {
			$item['Name']         = substr( $item['Name'], strlen( self::$db->tablepre ) );
			$rtn[ $item['Name'] ] = $item;
		}
		return $rtn;
	}


	public static function get_table_primary_key($table) {
		foreach(self::table_meta($table) as $item) {
			if ($item['Key'] === 'PRI') {
				return $item['Field'];
			}
		}
		return false;
	}

	public static function get_table_keys($table) {
		return array_keys(self::table_meta($table));
	}

	public static function __callStatic($func, $arguments) {
		static $_caches = array();

		$cache_name = '_cache_' . $func;
		$force = end($arguments);

		// get cache key
		if (is_bool($force)) {
			array_pop($arguments);
			$key = $func . implode('_', $arguments);
			array_push($arguments, $force);
		} else {
			$force = false; // 默认如果没有 $force，则永远为 false
			$key = $func . implode('_', $arguments);
		}
		$key = __CLASS__ . '_' . $key;

		if (!$force) {
			if (isset($_caches[$key])) {
				return $_caches[$key];
			} else {
				$val = Storage::get($key);
				if ($val) {
					$_caches[$key] = $val;
					return $val;
				}
			}
		}

		if (method_exists(DB, $cache_name)) {
			$val = forward_static_call_array(array(self, $cache_name), $arguments);
			$_caches[$key] = $val;
			return Storage::set($key, $val);

		} else {
			throw new Exception("Static function [" . __CLASS__ . "::$func()] not found");
		}
	}
}
