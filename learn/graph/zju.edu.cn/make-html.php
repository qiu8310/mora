<?php


$data = file_get_contents('./data.json');

$data = json_decode($data, true);

$html = array('<html><meta charset="utf-8">');

foreach ($data as $menu) {
    array_push($html, '<ul class="menu">');
    $menu_html = array();
    foreach($menu as $item) {

        $base = explode('/', 'http://give.zju.edu.cn/cgcourse/new/book');
        $path = explode('/', trim($item['url'], '/\\'));
        foreach($path as $p) {
            if ($p == '.') {
                continue;
            } else if ($p == '..') {
                array_pop($base);
                continue;
            } else {
                array_push($base, $p);
            }
        }
        $url = implode('/', $base);

        array_push($menu_html, "\t<li class='menu-item'><a href='{$url}'>{$item['label']}</a></li>");
    }

    array_push($html, implode(PHP_EOL, $menu_html));
    array_push($html, '</ul>');
}

array_keys($html, '</html>');
file_put_contents('./menu.html', implode(PHP_EOL, $html));