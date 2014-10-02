<?php
if (!defined('ROOT')) exit();

class DB extends database {
	public static $_cache = array();

	public static function count($table) {
		return self::result_first('SELECT COUNT(*) FROM %t', array($table));
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
	public static function table_meta($table, $force = false) {
		if (!$force) {
			$key = 'table_meta_'.$table;
			if (!isset(self::$_cache[$key])) {
				//self::$_cache[$key] = forward_static_call(array('DB', 'table_meta'), $table, true);
				self::$_cache[$key] = Storage::get($key, create_function('$table', 'return DB::table_meta($table, true);'), array($table));
			}
			return self::$_cache[$key];
		}

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
	public static function db_meta($force = false) {
		if (!$force) {
			$key = 'db_meta';
			if (!isset(self::$_cache[$key])) {
				//self::$_cache[$key] = forward_static_call(array('DB', 'db_meta'), true);
				self::$_cache[$key] = Storage::get($key, create_function('', 'return DB::db_meta(true);'));
			}
			return self::$_cache[$key];
		}

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

}
