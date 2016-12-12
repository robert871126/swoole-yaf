<?php
namespace Util;

/**
 * curl类
 */

class Curl {

	public $ch;
	public function __construct() {

		if (!$this->ch) {
			$this->ch = curl_init();
		}

	}
	public function __destruct() {
		curl_close($this->ch);
	}
	public function parseurl($url) {

		if (substr($url, 0, 5) == 'https') {
			curl_setopt($this->ch, CURLOPT_SSL_VERIFYPEER, FALSE);
			curl_setopt($this->ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		}

	}
	public function post($url, $param, $post) {
		$this->parseurl($url);
		curl_setopt($this->ch, CURLOPT_URL, $url);
		$this->setparam($param);
		curl_setopt($this->ch, CURLOPT_POST, true);
		curl_setopt($this->ch, CURLOPT_POSTFIELDS, $post);
		return curl_exec($this->ch);
	}
	public function get($url, $param) {

		$this->parseurl($url);
		curl_setopt($this->ch, CURLOPT_URL, $url);
		$this->setparam($param);
		return curl_exec($this->ch);
	}
	public function getinfo() {
		return curl_getinfo($this->ch);
	}
	public function setparam($param = array()) {
		//返回数据
		curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($this->ch, CURLOPT_TIMEOUT, 80);
		//是否跟随跳转
		if (isset($param['follow_location']) && $param['follow_location']) {
			curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, 1);
		} else {
			curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, 0);
		}
		//是否返回头部信息
		if (isset($param['return_header']) && $param['return_header']) {
			curl_setopt($this->ch, CURLOPT_HEADER, 1);
		} else {
			curl_setopt($this->ch, CURLOPT_HEADER, 0);
		}
		//是否设置cookie接收和设置文件
		if (isset($param['cookie_file']) && $param['cookie_file']) {
			curl_setopt($this->ch, CURLOPT_COOKIEFILE, $param['cookie_file']);
			curl_setopt($this->ch, CURLOPT_COOKIEJAR, $param['cookie_file']);
		}
		//是否设置引用来源
		if (isset($param['refer']) && $param['refer']) {
			curl_setopt($this->ch, CURLOPT_REFERER, $param['refer']);
		} else {
			curl_setopt($this->ch, CURLOPT_REFERER, '');
		}
		//是否设置浏览器头部
		if (isset($param['agent']) && $param['agent']) {
			curl_setopt($this->ch, CURLOPT_USERAGENT, $param['agent']);
		}
		//头部信息
		if (isset($param['headers']) && $param['headers']) {
			curl_setopt($this->ch, CURLOPT_HTTPHEADER, $param['headers']);
		}
	}
}
?>