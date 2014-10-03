<?php
if (!defined('ROOT')) exit();


class model {
	public $table;  // 表名
	public $pri;    // 主键
	public $fields; // 表中所有的字段

	private  $meta; // 所有字段的详细数据


	public function __construct($table) {
		$this->meta = DB::table_meta($table);
		if (!$this->meta) {
			throw new Exception("Model $table not find");
		}

		$this->table = $table;
		$this->pri = DB::get_table_primary_key($table);
		$this->fields = array_keys($this->meta);
	}

	public function __call($name, $arguments) {
		return forward_static_call_array(array('DB', $name), $arguments);
	}

	public function insert($data, $return_insert_id = true) {
		return DB::insert($this->table, $data, $return_insert_id);
	}

	/*
	 * 批量插入
	 */
	public function batch_insert($data) {
		if (!isset($data[0])) return false;

		$fields = array_keys($data[0]);
		$fields_str = implode(', ', DB::quote_field($fields));

		$values = array();
		foreach($data as $row) {
			$temp = array();
			foreach($fields as $field) {
				array_push($temp, $row[$field]);
			}
			array_push($values, '(' . implode(', ', DB::quote($temp)) . ')');
		}

		DB::query("INSERT INTO %t (%r) VALUES %r", array($this->table, $fields_str, implode(', ', $values)), false, true);
		return DB::affected_rows() == count($data);
	}


	public function delete($condition, $limit = 0) {
		return DB::delete($this->table, $condition, $limit);
	}

	public function delete_all() {
		return DB::delete($this->table, '1');
	}

	public function truncate() {
		return DB::query('TRUNCATE %t', array($this->table));
	}


	public function update($data, $condition) {
		return DB::update($this->table, $data, $condition);
	}

	public function all($condition = '1', $keyfield = '') {
		return DB::fetch_all('SELECT * FROM %t WHERE %r', array($this->table, DB::where($condition)), $keyfield);
	}

	public function page($page_num = 1, $page_size = 10, $condition = '1', $keyfield = '') {
		$limit = DB::limit(($page_num - 1) * $page_size, $page_size);
		return DB::fetch_all('SELECT * FROM %t WHERE %r %r', array($this->table, DB::where($condition), $limit), $keyfield);
	}

	public function count($condition = '1') {
		return DB::count($this->table, $condition);
	}

	public function get($pri_value) {
		return DB::fetch_first('SELECT * FROM %t WHERE %F = %q LIMIT 1', array($this->table, $this->pri, $pri_value));
	}

	public function set($pri_value, $data) {
		$this->update($data, array('where' => '%F = %q', 'arg' => array($this->pri, $pri_value)));
		return DB::affected_rows() == 1;
	}

	public function del($pri_value) {
		return $this->delete(array('where' => '%F = %q', 'arg' => array($this->pri, $pri_value)), 1);
	}


	// 下面的可以不写（定义了 __call），写它们是为了有语法提示
	public function affected_rows() {
		return DB::affected_rows();
	}

	public function insert_id() {
		return DB::insert_id();
	}

}