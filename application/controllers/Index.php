<?php

class IndexController extends Yaf\Controller_Abstract
{
    public function indexAction()
    {
        echo 'success' . PHP_EOL;
        var_dump(M('User')->find());
    }
}