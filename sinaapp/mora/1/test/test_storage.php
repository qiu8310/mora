<?php

require_once( "../common.php" );


$key = '___k';

Storage::del($key);
assert(false === Storage::get($key), 'get empty key return false');


$val = Storage::set($key, '1');
assert($val === '1', 'set will return your set value');


assert($val === Storage::get($key), 'get should return your set value');


Storage::set($key, '2');
assert('2' === Storage::get($key), 'should overwrite set value');



Storage::del($key);
assert(false === Storage::get($key), 'set value should be deleted');


$val = Storage::get($key, create_function('', 'return 2;'));
assert($val === Storage::get($key), 'support callback');

Storage::del($key);



echo 'Storage test all done ' . date('Y-m-d H:i:s', TIMESTAMP) . HTML_EOL;