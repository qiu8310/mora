<?php

require_once( "../common.php" );

$options = DB::fetch_all('SELECT * FROM %t', array('option'), 'key');
$size = count($options);
assert(DB::affected_rows() === $size, 'fetch_all');


DB::delete('option', array('where' => '`key` = %s', 'arg' => array('test_key')));
$insert_id = DB::insert('option', array('key' => 'test_key', 'val' => 'test_val', 'ext' => ''), true);
assert($insert_id === DB::insert_id(), 'insert_id');



DB::update('option', array('val' => 'test_val_update'), array('key' => 'test_key'));
$options = DB::fetch_all('SELECT * FROM %t', array('option'), 'key');
assert($options['test_key']['val'] === 'test_val_update', 'update');


DB::delete('option', array('where' => '`key` = %s', 'arg' => array('test_key')));
assert(DB::affected_rows() === 1, 'delete');



echo 'DB test all done ' . date('Y-m-d H:i:s', TIMESTAMP) . HTML_EOL;