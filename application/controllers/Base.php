<?php
namespace Controllers;
/**
 * Api基础类
 */
class BaseController extends \Core\Controller
{
    protected $token;
    protected static $uinfo;

    /**
     * 初始化函数
     * @return [type] [description]
     */
    public function _initialize()
    {

        //禁止使用视图层
        \Yaf\Dispatcher::getInstance()->disableView();
       $this->checkParam();
        $this->initUserInfo();

        //$this->updateCache();
        //$this->initOperationLog();
    }

    /**
     * 判断用户状态，更新用户缓存
     * @return [type] [description]
     */
    public function updateCache()
    {
        $token = $this->token;
        $user = S($token . "_User");

        if ($user) {
            S($token . "_User", $user);
        } else {
            $this->output(array(), -1, '用户未登录');
        }
    }

    /**
     * 检查参数
     */
    public function checkParam()
    {
        $token = $this->getPost('token');
        $sign = $this->getPost('sign');
        $this->token = $token;
        if (empty($token)) {
            $this->output(array(), 0, 'the param token is required');
        }
        if (empty($sign)) {
            $this->output(array(), 0, 'the param sign is required');
        }

        $param = '';

        //$_POST['zcode'] = 'yuanding';
        ksort($_POST);

        foreach ($_POST as $k => $v) {
            if ($k != 'sign') {
                $param .= $k . $v;
            }
        }

        //正式环境下面才进行签名验证
        if (\YAF\ENVIRON !== 'develop') {
            $param = md5($param);
            if ($param != $sign) {
                $this->output(array(), 0, 'the param sign is error');
            }
        }
    }

    /**
     * token验证成功后提取用户信息
     *
     */
    public function initUserInfo()
    {
        $key = $this->token . "_User";
        $sid = S($key);
        if (empty($sid)) {
            session_destroy();
            $this->output(array(), -1, '用户未登录');
        }
        session_id($sid);
        session_start();

        if (empty($_SESSION['admin'])) {
            S($key,null);
            $this->output(array(), -1, '用户未登录');
        }
        $uinfo = $_SESSION['admin'];
        self::$uinfo = $uinfo;
        S($key,$sid);
		setcookie("token", $this->token, time() + 3600, '/', C('INFO_DOMAIN'));
    }


    /**
     * 记录操作日志
     * @author syp
     * @since    2016-01-21
     */
    public function initOperationLog()
    {
        //引入用户操作记录类
        \Yaf\Loader::import(LIB_PATH . 'ApiServer/Operation.class.php');

        \Operation::writeLog(self::$uinfo['admin_id'], 0, '');
    }
}