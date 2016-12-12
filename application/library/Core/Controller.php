<?php
namespace Core;
/**
 * 控制器基类 抽象类
 */
abstract class Controller extends \Yaf\Controller_Abstract {
	public function init() {
		//控制器初始化
		if (method_exists($this, '_initialize')) {
			$this->_initialize();
		}
		\Yaf\Dispatcher::getInstance()->autoRender(false);
		//$this->checkPost();
	}

	/**
	 * 检查是否是POST提交
	 * @return [type] [description]
	 */
	public function checkPost() {
		if (!IS_POST) {
			$this->redirect("/html/login.html");
			exit;
		}
	}

	/**
	 * 操作错误跳转的快捷方法
	 * @param type $message 错误信息
	 * @param type $ajax 是否为Ajax方式 当数字时指定跳转时间
	 */
	protected function error($message = '', $jumpUrl = '', $ajax = false) {
		$this->dispatchJump($message, 0, $jumpUrl, $ajax);
	}

	/**
	 * 操作成功跳转的快捷方法
	 * @param type $message 提示信息
	 * @param type $ajax 是否为Ajax方式 当数字时指定跳转时间
	 */
	protected function success($message = '', $jumpUrl = '', $ajax = false) {
		$this->dispatchJump($message, 1, $jumpUrl, $ajax);
	}

	/**
	 * Ajax方式返回数据到客户端
	 * @param type $data 要返回的数据
	 * @param type $type AJAX返回数据格式
	 * @param type $json_option 传递给json_encode的option参数
	 */
	protected function ajaxReturn($data, $type = '', $json_option = 0) {
		Yaf_Dispatcher::getInstance()->disableView();
		if (empty($type)) {
			$type = C('DEFAULT_AJAX_RETURN');
		}

		switch (strtoupper($type)) {
			case 'XML':
				header('Content-Type:text/xml; charset=utf-8');
				$this->getResponse()->setBody($data);
			case 'JSONP':
				header('Content-Type:application/json; charset=utf-8');
				$callback = $this->getRequest()->getQuery('callback');
				$this->getResponse()->setBody($callback . "(" . json_encode($data, $json_option) . ")");
				exit();
			case 'EVAL':
				header('Content-Type:text/html; charset=utf-8');
				$this->getResponse()->setBody($data);
			default:
				header('Content-Type: application/json; charset=utf-8');
				$this->getResponse()->setBody(json_encode($data, $json_option));
		}
	}

	/**
	 * 默认跳转操作 支持错误导向和正确跳转
	 * @param type $message 提示信息
	 * @param type $status 状态
	 * @param type $jumpUrl 页面跳转地址
	 * @param type $ajax 是否为Ajax方式 当数字时指定跳转时间
	 */
	private function dispatchJump($message, $status = 1, $jumpUrl = '', $ajax = false) {
		if (true === $ajax || IS_AJAX) {
			$data = is_array($ajax) ? $ajax : array();
			$data['info'] = $message;
			$data['status'] = $status;
			$data['url'] = $jumpUrl;
			$this->ajaxReturn($data);
		}
	}

	/**
	 * get方法获取
	 * @param  [type]  $key    [description]
	 * @param  boolean $filter [description]
	 * @return [type]          [description]
	 */
	public function get($key, $default = '', $filter = TRUE) {
		if ($filter) {
			return filterStr($this->getRequest()->get($key, $default));
		} else {
			return $this->getRequest()->get($key, $default);
		}
	}

	/**
	 * post方法获取
	 * @param  [type]  $key    [description]
	 * @param  boolean $filter [description]
	 * @return [type]          [description]
	 */
	public function getPost($key, $default = '', $filter = TRUE) {
		if ($filter) {
			return filterStr($this->getRequest()->getPost($key, $default));
		} else {
			return $this->getRequest()->getPost($key, $default);
		}
	}

	/**
	 * get方法获取:不能获取pathinfo的方式
	 * @param  [type]  $key    [description]
	 * @param  boolean $filter [description]
	 * @return [type]          [description]
	 */
	public function getQuery($key, $default = '', $filter = TRUE) {
		if ($filter) {
			return filterStr($this->getRequest()->getQuery($key, $default));
		} else {
			return $this->getRequest()->getQuery($key, $default);
		}
	}

	/**
	 * 返回客户端json数据
	 * @param  array   $data 返回的数据
	 * @param  integer $status 请求状态 1为成功，其他为失败
	 * @param  string  $msg 错误提示
	 * @return json
	 */
	public function output($data = array(), $status = 1, $msg = '') {
		$return['status'] = $status;
		$return['msg'] = $msg;
		$return['time'] = time();
		$return = array_merge($return, $data);
		echo json_encode($return);
		exit();
	}
}
