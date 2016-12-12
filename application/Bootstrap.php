<?php

/**
 * @name Bootstrap
 * @author CXH
 * @desc 所有在Bootstrap类中, 以_init开头的方法, 都会被Yaf调用,
 * @see http://www.php.net/manual/en/class.yaf-bootstrap-abstract.php
 * 这些方法, 都接受一个参数:Yaf_Dispatcher $dispatcher
 * 调用的次序, 和申明的次序相同
 */
class Bootstrap extends Yaf\Bootstrap_Abstract
{
    protected $_config;

    /**
     * 初始化配置信息
     */
    public function _initConfig()
    {
        //把配置保存起来
        $this->_config = Yaf\Application::app()->getConfig();
        Yaf\Registry::set('config', $this->_config);
    }

    /**
     * 导入核心文件
     */
    public function _initCore()
    {
        Yaf\Loader::import(APPLICATION_PATH . 'Core/Controller.php');
        Yaf\Loader::import('Core/Model.php');
        Yaf\Loader::import(APPLICATION_PATH . DS . 'common' . DS . 'functions.php');
        Yaf\Loader::import(APPLICATION_PATH . DS . 'common' . DS . 'F_filter.php');
    }

    /**
     * 初始化数据库配置
     */
    public function _initDatabase()
    {
        $_db = Yaf\Registry::get('config')->database->config->toArray();
        Yaf\Registry::set('db', $_db);
    }

    /**
     * 初始化redis配置
     */
    public function _initRedis()
    {
        $_redis = Yaf\Registry::get('config')->redis->config->toArray();
        Yaf\Registry::set('redis', $_redis);
    }

    /**
     * 初始化cache配置
     */
    public function _initCache()
    {
        $_cache = Yaf\Registry::get('config')->cache->config->toArray();
        Yaf\Registry::set('cache', $_cache);
    }

    /**
     * 初始化cache配置
     */
    public function _initLog()
    {
        $_log = Yaf\Registry::get('config')->log->config->toArray();
        Yaf\Registry::set('log', $_log);
    }

    /**
     * 插件设置
     * @param \Yaf\Dispatcher $dispatcher
     */
    public function _initPlugin(Yaf\Dispatcher $dispatcher)
    {
        //注册一个插件
        $AutoloadPlugin = new AutoloadPlugin();
        $dispatcher->registerPlugin($AutoloadPlugin);
    }

    /**
     * 路由设置
     * @param \Yaf\Dispatcher $dispatcher
     */
    public function _initRoute(Yaf\Dispatcher $dispatcher)
    {
        //在这里注册自己的路由协议,默认使用简单路由
    }

    /**
     * 视图设置
     * @param \Yaf\Dispatcher $dispatcher
     */
    public function _initView(Yaf\Dispatcher $dispatcher)
    {
        $dispatcher->disableView();
        //在这里注册自己的view控制器，例如smarty,firekylin
    }

    /**
     * 错误处理
     */
    public function _initErrors()
    {
        //报错是否开启
        if ($this->_config->application->showErrors) {
            error_reporting(-1);
            ini_set('display_errors', 'On');
        } else {
            error_reporting(0);
            ini_set('display_errors', 'Off');
        }
        //set_error_handler(array('Error','errorHandler'));
    }
}
