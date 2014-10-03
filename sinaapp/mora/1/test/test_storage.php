<?php

require_once( "../common.php" );


$key = '___k';

Storage::del($key);
assert(false === Storage::get($key));


$val = Storage::set($key, '1');
assert($val === '1');


assert($val === Storage::get($key));


Storage::set($key, '2');
assert('2' === Storage::get($key));



Storage::del($key);
assert(false === Storage::get($key));


$val = Storage::get($key, create_function('', 'return 2;'));
assert($val === Storage::get($key));

Storage::del($key);



echo 'Storage test all done ' . date('Y-m-d H:i:s', TIMESTAMP) . HTML_EOL;