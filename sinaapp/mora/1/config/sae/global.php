<?php
if (!defined('ROOT')) exit();

$_config = array();

$_config['debug'] = false;

// ----------------------------  CONFIG DB  ----------------------------- //
$_config['db']['1']['dbhost'] = SAE_MYSQL_HOST_M . ':' . SAE_MYSQL_PORT;
$_config['db']['1']['dbuser'] = SAE_MYSQL_USER;
$_config['db']['1']['dbpw'] = SAE_MYSQL_PASS;
$_config['db']['1']['dbcharset'] = 'utf8';
$_config['db']['1']['pconnect'] = '0';
$_config['db']['1']['dbname'] = SAE_MYSQL_DB;
$_config['db']['1']['tablepre'] = 'm_';
$_config['db']['slave'] = '';
$_config['db']['common']['slave_except_table'] = '';


$_config['security']['querysafe']['status'] = 1;
$_config['security']['querysafe']['dfunction']['0'] = 'load_file';
$_config['security']['querysafe']['dfunction']['1'] = 'hex';
$_config['security']['querysafe']['dfunction']['2'] = 'substring';
$_config['security']['querysafe']['dfunction']['3'] = 'if';
$_config['security']['querysafe']['dfunction']['4'] = 'ord';
$_config['security']['querysafe']['dfunction']['5'] = 'char';
$_config['security']['querysafe']['daction']['0'] = 'intooutfile';
$_config['security']['querysafe']['daction']['1'] = 'intodumpfile';
$_config['security']['querysafe']['daction']['2'] = 'unionselect';
$_config['security']['querysafe']['daction']['3'] = '(select';
$_config['security']['querysafe']['daction']['4'] = 'unionall';
$_config['security']['querysafe']['daction']['5'] = 'uniondistinct';
$_config['security']['querysafe']['dnote']['0'] = '/*';
$_config['security']['querysafe']['dnote']['1'] = '*/';
$_config['security']['querysafe']['dnote']['2'] = '#';
$_config['security']['querysafe']['dnote']['3'] = '--';
$_config['security']['querysafe']['dnote']['4'] = '"';
$_config['security']['querysafe']['dlikehex'] = 1;
$_config['security']['querysafe']['afullnote'] = '0';


?>