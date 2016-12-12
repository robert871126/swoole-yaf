<?php

/**
 * @name ErrorController
 * @desc 错误控制器, 在发生未捕获的异常时刻被调用
 */
class ErrorController extends Yaf\Controller_Abstract
{
    public function errorAction($exception)
    {
        switch ($exception->getCode()) {
            case Yaf\ERR\NOTFOUND\MODULE:
            case Yaf\ERR\NOTFOUND\CONTROLLER:
            case Yaf\ERR\NOTFOUND\ACTION:
            case Yaf\ERR\NOTFOUND\VIEW:
                $this->_pageNotFound($exception);
                break;
            default :
                $this->_unknownError($exception);
                break;
        }
    }

    private function _pageNotFound($exception)
    {
        $this->getResponse()->setHeader('HTTP/1.0 404 Not Found', true);
        $errorMessage = $exception->getCode() . ":" . $exception->getMessage();
        echo $errorMessage;
        //$this->_view->error = 'Page was not found';
    }

    private function _unknownError($exception)
    {
        $this->getResponse()->setHeader('HTTP/1.0 500 Internal Server Error', true);
        $errorMessage = $exception->getCode() . ":" . $exception->getMessage();
        echo $errorMessage;
        //$this->_view->error = 'Application Error';
    }
}