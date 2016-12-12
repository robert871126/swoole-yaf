<?php
namespace Core\Cache\Driver;

use Core\Cache;

/**
 * Redis缓存驱动 - 支持Redis集群与读写分离
 * 要求安装phpredis扩展：https://github.com/nicolasff/phpredis
 */
class Redis extends Cache
{
    /**
     * 架构函数
     * @param array $options 缓存参数
     * @access public
     */
    public function __construct($options = array())
    {
        if (!extension_loaded('redis')) {
            E('系统不支持:redis');
        }
        $redisConfig             = \Yaf\Registry::get('redis');
        $options                 = array_merge(array(
            'host'        => $redisConfig['host'] ? $redisConfig['host'] : '127.0.0.1',
            'port'        => $redisConfig['port'] ? $redisConfig['port'] : 6379,
            'timeout'     => $redisConfig['timeout'] ? $redisConfig['timeout'] : false,
            'persistent'  => false,
            'auth'        => $redisConfig['auth'] ? $redisConfig['auth'] : null, //auth认证
            'rw_separate' => $redisConfig['rw_separate'] ? $redisConfig['rw_separate'] : false, //主从分离
        ), $options);
        $cacheConfig             = \Yaf\Registry::get('cache');
        $this->options           = $options;
        $this->options['expire'] = isset($options['expire']) ? $options['expire'] : $cacheConfig['time'];
        $this->options['expire'] = intval($this->options['expire']);
        $this->options['prefix'] = isset($options['prefix']) ? $options['prefix'] : $cacheConfig['prefix'];
        $this->options['length'] = isset($options['length']) ? $options['length'] : 0;
        $this->options['func']   = $options['persistent'] ? 'pconnect' : 'connect';
    }

    /**
     * 主从连接
     * @access public
     * @param bool $master true=主连接
     */
    public function init_master()
    {
        $host = explode(",", $this->options['host']);

        $func          = $this->options['func'];
        $this->handler = new \Redis;
        $this->options['timeout'] === false ?
            $this->handler->$func($host[0], $this->options['port']) :
            $this->handler->$func($host[0], $this->options['port'], $this->options['timeout']);
        if ($this->options['auth'] != null) {
            $this->handler->auth($this->options['auth']);
        }
    }

    public function init_slave()
    {
        $host = explode(",", $this->options['host']);
        if (count($host) > 1 && $this->options['rw_separate'] == true) {
            array_shift($host);
            shuffle($host);
        }

        $func          = $this->options['func'];
        $this->handler = new \Redis;
        $this->options['timeout'] === false ?
            $this->handler->$func($host[0], $this->options['port']) :
            $this->handler->$func($host[0], $this->options['port'], $this->options['timeout']);
        if ($this->options['auth'] != null) {
            $this->handler->auth($this->options['auth']);
        }
    }

    /**
     * 查看redis连接是否断开
     * @return $return bool true:连接未断开 false:连接已断开
     */
    public function ping()
    {
        $this->init_master();
        $return = $this->handler->ping();
        return $return == 'PONG' ? true : false;
    }

    /**
     * 读取缓存
     * @access public
     * @param string $name 缓存变量名
     * @return mixed
     */
    public function get($name)
    {
        //\Core\Log::record('get:' . $name, \Core\Log::ALERT);
        N('cache_read', 1);
        $this->init_slave();
        $value    = $this->handler->get($this->options['prefix'] . $name);
        $jsonData = json_decode($value, true);
        return ($jsonData === NULL) ? $value : $jsonData; //检测是否为JSON数据 true 返回JSON解析数组, false返回源数据
    }

    /**
     * 写入缓存
     * @access public
     * @param string $name 缓存变量名
     * @param mixed $value 存储数据
     * @param integer $expire 有效时间（秒）
     * @return boolen
     */
    public function set($name, $value, $expire = null)
    {
        N('cache_write', 1);
        $this->init_master();
        if (is_null($expire)) {
            $expire = intval($this->options['expire']);
        }
        $name = $this->options['prefix'] . $name;
        //对数组/对象数据进行缓存处理，保证数据完整性
        $value = (is_object($value) || is_array($value)) ? json_encode($value) : $value;
        //删除缓存操作支持
        if ($value === null) {
            return $this->handler->delete($this->options['prefix'] . $name);
        }
        if (is_int($expire)) {
            //\Core\Log::record('expire-int:' . serialize($expire), \Core\Log::ALERT);
            $result = $this->handler->setex($name, $expire, $value);
        } else {
            $result = $this->handler->set($name, $value);
        }
        if ($result && $this->options['length'] > 0) {
            // 记录缓存队列
            $this->queue($name);
        }
        return $result;
    }

    /**
     * 删除缓存
     * @access public
     * @param string $name 缓存变量名
     * @return boolen
     */
    public function rm($name)
    {
        $this->init_master();
        return $this->handler->delete($this->options['prefix'] . $name);
    }

    /**
     * 清除缓存
     * @access public
     * @return boolen
     */
    public function clear()
    {
        $this->init_master();
        return $this->handler->flushDB();
    }

    /**
     * List类型是按照插入顺序排序的字符串链表，lpush插入值
     */
    public function lpush($key, $value)
    {
        if (empty($key) || empty($value)) {
            return false;
        }

        $this->init_master();
        return $this->handler->LPUSH($key, $value);
    }

    //+++-------------------------队列操作-------------------------+++//

    /**
     * 入队列
     * @param $list string 队列名
     * @param $value mixed 入队元素值
     * @param $deriction int 0:数据入队列头(左) 1:数据入队列尾(右) 默认为0
     * @param $repeat int 判断value是否存在  0:不判断存在 1:判断存在 如果value存在则不入队列
     */
    public function listPush($list, $value, $direction = 0, $repeat = 0)
    {
        $return = null;
        $this->init_master();

        switch ($direction) {
            case 0:
                if ($repeat) {
                    $return = $this->handler->lPushx($list, $value);
                } else {
                    $return = $this->handler->lPush($list, $value);
                }

                break;
            case 1:
                if ($repeat) {
                    $return = $this->handler->rPushx($list, $value);
                } else {
                    $return = $this->handler->rPush($list, $value);
                }

                break;
            default:
                $return = false;
                break;
        }

        return $return;
    }

    /**
     * 出队列
     * @param $list1 string 队列名
     * @param $deriction int 0:数据入队列头(左) 1:数据入队列尾(右) 默认为0
     * @param $list2 string 第二个队列名 默认null
     * @param $timeout int timeout为0:只获取list1队列的数据
     *        timeout>0:如果队列list1为空 则等待timeout秒 如果还是未获取到数据 则对list2队列执行pop操作
     */
    public function listPop($list1, $direction = 0, $list2 = null, $timeout = 0)
    {
        $return = null;
        $this->init_master();

        switch ($direction) {
            case 0:
                if ($timeout && $list2) {
                    $return = $this->handler->blPop($list1, $list2, $timeout);
                } else {
                    $return = $this->hanlder->lPop($list1);
                }

                break;
            case 1:
                if ($timeout && $list2) {
                    $return = $this->handler->brPop($list1, $list2, $timeout);
                } else {
                    $return = $this->handler->rPop($list1);
                }

                break;
            default:
                $return = false;
                break;
        }

        return $return;
    }

    /**
     * 获取队列中元素数
     * @param $list string 队列名
     */
    public function listSize($list)
    {
        N('cache_read', 1);
        $this->init_slave();
        return $this->handler->lLen($list);
    }

    /**
     * 为list队列的index位置的元素赋值
     * @param $list string 队列名
     * @param $index int 队列元素位置
     * @param $value mixed 元素值
     */
    public function listSet($list, $index = 0, $value = null)
    {
        $this->init_master();
        return $this->handler->lSet($list, $index, $value);
    }

    /**
     * 获取list队列的index位置的元素值
     * @param $list string 队列名
     * @param $index int 队列元素开始位置 默认0
     * @param $end int 队列元素结束位置 $index=0,$end=-1:返回队列所有元素
     */
    public function listGet($list, $index = 0, $end = null)
    {
        N('cache_read', 1);
        $this->init_slave();

        if ($end) {
            $return = $this->handler->lRange($list, $index, $end);
        } else {
            $return = $this->handler->lIndex($list, $index);
        }

        return $return;
    }

    /**
     * 截取list队列，保留start至end之间的元素
     * @param $list string 队列名
     * @param $start int 开始位置
     * @param $end int 结束位置
     */
    public function listTrim($list, $start = 0, $end = -1)
    {
        $this->init_master();
        return $this->handler->lTrim($list, $start, $end);
    }

    /**
     * 删除list队列中count个值为value的元素
     * @param $list string 队列名
     * @param $value int 元素值
     * @param $count int 删除个数 0:删除所有 >0:从头部开始删除 <0:从尾部开始删除 默认为0删除所有
     */
    public function listRemove($list, $value, $count = 0)
    {
        $this->init_master();
        return $this->handler->lRem($list, $value, $count);
    }

    /**
     * 在list中值为$value1的元素前Redis::BEFORE或者后Redis::AFTER插入值为$value2的元素
     * 如果list不存在，不会插入，如果$value1不存在，return -1
     * @param $list string 队列名
     * @param $location int 插入位置 0:之前 1:之后
     * @param $value1 mixed 要查找的元素值
     * @param $value2 mixed 要插入的元素值
     */
    public function listInsert($list, $location = 0, $value1, $value2)
    {
        $this->init_master();

        switch ($location) {
            case 0:
                $return = $this->handler->lInsert($list, Redis::BEFORE, $value1, $value2);
                break;
            case 1:
                $return = $this->handler->lInsert($list, Redis::AFTER, $value1, $value2);
                break;
            default:
                $return = false;
                break;
        }

        return $return;
    }

    /**
     * pop出list1的尾部元素并将该元素push入list2的头部
     * @param $list1 string 队列名
     * @param $list2 string 队列名
     */
    public function rpoplpush($list1, $list2)
    {
        $this->init_master();
        return $this->handler->rpoplpush($list1, $list2);
    }

    //+++-------------------------哈希操作-------------------------+++//

    /**
     * 将key->value写入hash表中
     * @param $hash string 哈希表名
     * @param $data array 要写入的数据 array('key'=>'value')
     */
    public function hashSet($hash, $data)
    {
        $return = null;
        $this->init_master();

        if (is_array($data) && !empty($data)) {
            $return = $this->handler->hMset($hash, $data);
        }

        return $return;
    }

    /**
     * 获取hash表的数据
     * @param $hash string 哈希表名
     * @param $key mixed 表中要存储的key名 默认为null 返回所有key>value
     * @param $type int 要获取的数据类型 0:返回所有key 1:返回所有value 2:返回所有key->value
     */
    public function hashGet($hash, $key = array(), $type = 0)
    {
        $return = null;
        N('cache_read', 1);
        $this->init_slave();

        if ($key) {
            if (is_array($key) && !empty($key)) {
                $return = $this->handler->hMGet($hash, $key);
            } else {
                $return = $this->handler->hGet($hash, $key);
            }

        } else {
            switch ($type) {
                case 0:
                    $return = $this->handler->hKeys($hash);
                    break;
                case 1:
                    $return = $this->handler->hVals($hash);
                    break;
                case 2:
                    $return = $this->handler->hGetAll($hash);
                    break;
                default:
                    $return = false;
                    break;
            }
        }

        return $return;
    }

    /**
     * 获取hash表中元素个数
     * @param $hash string 哈希表名
     */
    public function hashLen($hash)
    {
        N('cache_read', 1);
        $this->init_slave();
        return $this->handler->hLen($hash);
    }

    /**
     * 删除hash表中的key
     * @param $hash string 哈希表名
     * @param $key mixed 表中存储的key名
     */
    public function hashDel($hash, $key)
    {
        $this->init_master();
        return $this->handler->hDel($hash, $key);
    }

    /**
     * 查询hash表中某个key是否存在
     * @param $hash string 哈希表名
     * @param $key mixed 表中存储的key名
     */
    public function hashExists($hash, $key)
    {
        N('cache_read', 1);
        $this->init_slave();
        return $this->handler->hExists($hash, $key);
    }

    /**
     * 自增hash表中某个key的值
     * @param $hash string 哈希表名
     * @param $key mixed 表中存储的key名
     * @param $inc int 要增加的值
     */
    public function hashInc($hash, $key, $inc)
    {
        $this->init_master();
        return $this->handler->hIncrBy($hash, $key, $inc);
    }

    /**
     * 获取满足给定pattern的所有key
     * @param $key regexp key匹配表达式 模式:user* 匹配以user开始的key
     */
    public function getKeys($key = null)
    {
        N('cache_read', 1);
        $this->init_slave();
        return $this->handler->keys($key);
    }

    public function subscribe($channels, $callback)
    {
        $this->init_master();
        return $this->handler->subscribe($channels, $callback);
    }

    public function publish($channel, $message)
    {
        $this->init_master();
        return $this->handler->publish($channel, $message);
    }

    /**
     * 析构释放连接
     * @access public
     */
    /*
        public function __destruct() {
            $this->handler->close();
        }
    */
}
