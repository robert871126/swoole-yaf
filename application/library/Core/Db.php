<?php
namespace Core;
/**
 * 数据库中间层实现类
 */
class Db
{

    static private $instance  = array();     //  数据库连接实例
    static private $_instance = null;   //  当前数据库连接实例

    /**
     * 取得数据库类实例
     * @static
     * @access public
     * @param mixed $config 连接配置
     * @return Object 返回数据库驱动类
     */
    static public function getInstance($config = array())
    {
        $md5 = md5(serialize($config));
        if (!isset(self::$instance[$md5])) {
            // 解析连接参数 支持数组和字符串
            $options = self::parseConfig($config);
            // 兼容mysqli
            if ('mysqli' == $options['type']) $options['type'] = 'mysql';
            $class = 'Core\\Db\\Driver\\' . ucwords(strtolower($options['type']));
            if (class_exists($class)) {
                self::$instance[$md5] = new $class($options);
            } else {
                // 类没有定义
                E('无法加载数据库驱动: ' . $class);
            }
        }
        self::$_instance = self::$instance[$md5];
        return self::$_instance;
    }

    /**
     * 数据库连接参数解析
     * @static
     * @access private
     * @param mixed $config
     * @return array
     */
    static private function parseConfig($config)
    {
        $dbConfig = \Yaf\Registry::get('db');
        if (!empty($config)) {
            if (is_string($config)) {
                return self::parseDsn($config);
            }
            $config = array_change_key_case($config);
            $config = array(
                'type'        => $config['db_type'],
                'username'    => $config['db_user'],
                'password'    => $config['db_pwd'],
                'hostname'    => $config['db_host'],
                'hostport'    => $config['db_port'],
                'database'    => $config['db_name'],
                'dsn'         => isset($config['db_dsn']) ? $config['db_dsn'] : null,
                'params'      => isset($config['db_params']) ? $config['db_params'] : null,
                'charset'     => isset($config['db_charset']) ? $config['db_charset'] : 'utf8',
                'deploy'      => isset($config['db_deploy_type']) ? $config['db_deploy_type'] : 0,
                'rw_separate' => isset($config['db_rw_separate']) ? $config['db_rw_separate'] : false,
                'master_num'  => isset($config['db_master_num']) ? $config['db_master_num'] : 1,
                'slave_no'    => isset($config['db_slave_no']) ? $config['db_slave_no'] : '',
                'debug'       => isset($config['db_debug']) ? $config['db_debug'] : $dbConfig['debug'],
            );
        } else {
            $config = array(
                'type'        => $dbConfig['type'],
                'username'    => $dbConfig['user'],
                'password'    => $dbConfig['pwd'],
                'hostname'    => $dbConfig['host'],
                'hostport'    => $dbConfig['port'],
                'database'    => $dbConfig['name'],
                'dsn'         => $dbConfig['dsn'],
                'params'      => $dbConfig['params'],
                'charset'     => $dbConfig['charset'],
                'deploy'      => $dbConfig['deploy_type'],
                'rw_separate' => $dbConfig['rw_separate'],
                'master_num'  => $dbConfig['master_num'],
                'slave_no'    => $dbConfig['slave_no'],
                'debug'       => $dbConfig['debug'],
            );
        }
        return $config;
    }

    /**
     * DSN解析
     * 格式： mysql://username:passwd@localhost:3306/DbName?param1=val1&param2=val2#utf8
     * @static
     * @access private
     * @param string $dsnStr
     * @return array
     */
    static private function parseDsn($dsnStr)
    {
        if (empty($dsnStr)) {
            return false;
        }
        $info = parse_url($dsnStr);
        if (!$info) {
            return false;
        }
        $dsn = array(
            'type'     => $info['scheme'],
            'username' => isset($info['user']) ? $info['user'] : '',
            'password' => isset($info['pass']) ? $info['pass'] : '',
            'hostname' => isset($info['host']) ? $info['host'] : '',
            'hostport' => isset($info['port']) ? $info['port'] : '',
            'database' => isset($info['path']) ? substr($info['path'], 1) : '',
            'charset'  => isset($info['fragment']) ? $info['fragment'] : 'utf8',
        );

        if (isset($info['query'])) {
            parse_str($info['query'], $dsn['params']);
        } else {
            $dsn['params'] = array();
        }
        return $dsn;
    }

    // 调用驱动类的方法
    static public function __callStatic($method, $params)
    {
        return call_user_func_array(array(self::$_instance, $method), $params);
    }
}
