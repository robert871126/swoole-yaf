<?php
namespace Util;
/**
 * Description of Category
 * @date 2015-11-23 11:51:59
 * @author HOT <126star@163.com>
 */
class Category {
	/**
	 * 组成多维数组
	 * @param array $cate 传递的分类数组
	 * @param string $name 子分类数组名
	 * @param int $pid 父ID
	 * @return array
	 */
	static public function toLayer($cate, $name = 'child', $pid = 0) {
		$arr = array();
		foreach ($cate as $v) {
			if ($v['parent_id'] == $pid) {
				$v[$name] = self::toLayer($cate, $name, $v['id']);
				if (empty($v[$name])) {
					unset($v[$name]);
				}
				$arr[] = $v;
			}
		}
		return $arr;
	}

	/**
	 * 组成一维数组
	 * @param array $cate 传递的分类数组
	 * @param int $pid 父ID
	 * @param int $level 层级
	 * @return array
	 */
	static public function toSingleLayer($cate, $pid = 0, $level = 0) {
		$arr = array();
		foreach ($cate as $v) {
			if ($v['parent_id'] == $pid) {
				$v['level'] = $level + 1;
				$arr[]      = $v;
				$arr        = array_merge($arr, self::toSingleLayer($cate, $v['id'], $level + 1));
			}
		}
		return $arr;
	}

	/**
	 * 传递一个子分类ID返回他的所有父级分类
	 * @param array $cate 传递的分类数组
	 * @param int $id 分类ID
	 * @return array
	 */
	static public function getParents($cate, $id) {
		$arr = array();
		foreach ($cate as $v) {
			if ($v['id'] == $id) {
				$arr[] = $v;
				$arr   = array_merge(self::getParents($cate, $v['parent_id']), $arr);
			}
		}
		return $arr;
	}

	/**
	 * 传递一个父级分类ID返回所有子级分类
	 * @param array $cate 传递的分类数组
	 * @param int $id  分类ID
	 * @return array
	 */
	static public function getParentsId($cate, $id, $flag = 0) {
		$arr = array();
		if ($flag) {
			$arr[] = $id;
		}
		foreach ($cate as $v) {
			if ($v['id'] == $id) {
				if ($v['parent_id']) {
					$arr[] = $v['parent_id'];
				}
				$arr = array_merge(self::getParentsId($cate, $v['parent_id']), $arr);
			}
		}
		return $arr;
	}

	/**
	 * 传递一个父级分类ID返回所有子级分类
	 * @param array $cate
	 * @param int $parent_id
	 * @return array
	 */
	static public function getChilds($cate, $parent_id) {
		$arr = array();
		foreach ($cate as $v) {
			if ($v['parent_id'] == $parent_id) {
				$arr[] = $v;
				$arr   = array_merge($arr, self::getChilds($cate, $v['id']));
			}
		}
		return $arr;
	}

	/**
	 * 传递一个父级分类ID返回所有子分类ID
	 * @param array $cate 传递的分类数组
	 * @param int $parent_id 父ID
	 * @param int $flag 是否包括父级自己的ID，默认不包括
	 * @return array
	 */
	static public function getChildsId($cate, $parent_id, $flag = 0) {
		$arr = array();
		if ($flag) {
			$arr[] = $parent_id;
		}
		foreach ($cate as $v) {
			if ($v['parent_id'] == $parent_id) {
				$arr[] = $v['id'];
				$arr   = array_merge($arr, self::getChildsId($cate, $v['id']));
			}
		}
		return $arr;
	}

	/**
	 * 判断分类是否有子分类,返回false,true
	 * @param array $cate
	 * @param int $id
	 * @return boolean
	 */
	static public function hasChild($cate, $id) {
		$arr = false;
		foreach ($cate as $v) {
			if ($v['parent_id'] == $id) {
				$arr = true;
				return $arr;
			}
		}
		return $arr;
	}
}
