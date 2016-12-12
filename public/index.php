<?php
if (!ini_get('yaf.use_namespace')) {
    exit('请开启Yaf命名空间方式');
}
define('DS', DIRECTORY_SEPARATOR);
define('ROOT_PATH', realpath(dirname(__FILE__) . DS . '..' . DS));
define('APPLICATION_PATH', ROOT_PATH . DS . 'application'); //指向public的上一级
define('LOG_PATH', ROOT_PATH . DS . 'logs');
define('CONF_PATH', ROOT_PATH . DS . 'conf');
define('YAF_ENV', ini_get('yaf.environ'));
$app = new Yaf\Application(CONF_PATH . DS . 'application.ini', YAF_ENV);
$app->bootstrap()->run();