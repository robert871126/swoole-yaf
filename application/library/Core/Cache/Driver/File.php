<?php
namespace Core\Cache\Driver;

use Core\Cache;

/**
 * 文件类型缓存类
 */
class File extends Cache
{
    private $_cacheConfig = array();

    /**
     * 架构函数
     * @access public
     */
    public function __construct($options = array())
    {
        if (!empty($options)) {
            $this->options = $options;
        }
        $this->_cacheConfig      = \Yaf\Registry::get('cache');
        $this->options['temp']   = !empty($options['temp']) ? $options['temp'] : $this->_cacheConfig['path'];
        $this->options['prefix'] = isset($options['prefix']) ? $options['prefix'] : $this->_cacheConfig['prefix'];
        $this->options['expire'] = isset($options['expire']) ? $options['expire'] : $this->_cacheConfig['time'];
        $this->options['length'] = isset($options['length']) ? $options['length'] : 0;
        if (substr($this->options['temp'], -1) != '/') $this->options['temp'] .= '/';
        $this->init();
    }

    /**
     * 初始化检查
     * @access private
     * @return boolean
     */
    private function init()
    {
        // 创建应用缓存目录
        if (!is_dir($this->options['temp'])) {
            mkdir($this->options['temp']);
        }
    }

    /**
     * 取得变量的存储文件名
     * @access private
     * @param string $name 缓存变量名
     * @return string
     */
    private function filename($name)
    {
        $name = md5($this->_cacheConfig['key'] . $name);
        if ($this->_cacheConfig['subdir']) {
            // 使用子目录
            $dir = '';
            for ($i = 0; $i < $this->_cacheConfig['path_level']; $i++) {
                $dir .= $name{$i} . '/';
            }
            if (!is_dir($this->options['temp'] . $dir)) {
                mkdir($this->options['temp'] . $dir, 0755, true);
            }
            $filename = $dir . $this->options['prefix'] . $name . '.php';
        } else {
            $filename = $this->options['prefix'] . $name . '.php';
        }
        return $this->options['temp'] . $filename;
    }

    /**
     * 读取缓存
     * @access public
     * @param string $name 缓存变量名
     * @return mixed
     */
    public function get($name)
    {
        $filename = $this->filename($name);
        if (!is_file($filename)) {
            return false;
        }
        N('cache_read', 1);
        $content = file_get_contents($filename);
        if (false !== $content) {
            $expire = (int)substr($content, 8, 12);
            if ($expire != 0 && time() > filemtime($filename) + $expire) {
                //缓存过期删除缓存文件
                unlink($filename);
                return false;
            }
            if ($this->_cacheConfig['check']) {//开启数据校验
                $check   = substr($content, 20, 32);
                $content = substr($content, 52, -3);
                if ($check != md5($content)) {//校验错误
                    return false;
                }
            } else {
                $content = substr($content, 20, -3);
            }
            if ($this->_cacheConfig['compress'] && function_exists('gzcompress')) {
                //启用数据压缩
                $content = gzuncompress($content);
            }
            $content = unserialize($content);
            return $content;
        } else {
            return false;
        }
    }

    /**
     * 写入缓存
     * @access public
     * @param string $name 缓存变量名
     * @param mixed $value 存储数据
     * @param int $expire 有效时间 0为永久
     * @return boolean
     */
    public function set($name, $value, $expire = null)
    {
        N('cache_write', 1);
        if (is_null($expire)) {
            $expire = $this->options['expire'];
        }
        $filename = $this->filename($name);
        $data     = serialize($value);
        if ($this->_cacheConfig['compress'] && function_exists('gzcompress')) {
            //数据压缩
            $data = gzcompress($data, 3);
        }
        if ($this->_cacheConfig['check']) {//开启数据校验
            $check = md5($data);
        } else {
            $check = '';
        }
        $data   = "<?php\n//" . sprintf('%012d', $expire) . $check . $data . "\n?>";
        $result = file_put_contents($filename, $data);
        if ($result) {
            if ($this->options['length'] > 0) {
                // 记录缓存队列
                $this->queue($name);
            }
            clearstatcache();
            return true;
        } else {
            return false;
        }
    }

    /**
     * 删除缓存
     * @access public
     * @param string $name 缓存变量名
     * @return boolean
     */
    public function rm($name)
    {
        return unlink($this->filename($name));
    }

    /**
     * 清除缓存
     * @access public
     * @param string $name 缓存变量名
     * @return boolean
     */
    public function clear()
    {
        $path  = $this->options['temp'];
        $files = scandir($path);
        if ($files) {
            foreach ($files as $file) {
                if ($file != '.' && $file != '..' && is_dir($path . $file)) {
                    array_map('unlink', glob($path . $file . '/*.*'));
                } elseif (is_file($path . $file)) {
                    unlink($path . $file);
                }
            }
            return true;
        }
        return false;
    }
}