<?php
namespace Util\Upload;

use OSS\Core\OssException;
use OSS\OssClient;

/**
 * 操作Object类
 */
class Object extends Common {

	/**
	 * 创建虚拟目录
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return boolean
	 */
	public static function createObjectDir($ossClient, $bucket, $dir) {
		try {
			$ossClient->createObjectDir($bucket, $dir);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}

	/**
	 * 把本地变量的内容到文件
	 *
	 * 简单上传,上传指定变量的内存值作为object的内容
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function putObject($ossClient, $bucket, $object, $filePath) {
		$content = file_get_contents($filePath);
		$options = array();
		try {
			$ossClient->putObject($bucket, $object, $content, $options);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}

	/**
	 * 上传指定的本地文件内容
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function uploadFile($ossClient, $bucket, $object, $filePath, $dir = '') {
		if (!empty($dir)) {
			$object = $dir . DIRECTORY_SEPARATOR . $object;
		}
		$options = array();
		try {
			$ossClient->uploadFile($bucket, $object, $filePath, $options);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}

	/**
	 * 列出Bucket内所有目录和文件
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function listObjects($ossClient, $bucket) {
		$prefix = '';
		$delimiter = '/';
		$nextMarker = '';
		$maxkeys = 1000;
		$options = array(
			'delimiter' => $delimiter,
			'prefix' => $prefix,
			'max-keys' => $maxkeys,
			'marker' => $nextMarker,
		);
		try {
			$listObjectInfo = $ossClient->listObjects($bucket, $options);
		} catch (OssException $e) {
			return false;
		}
		$objectList = $listObjectInfo->getObjectList();
		$prefixList = $listObjectInfo->getPrefixList();
		$objectArr = array();
		$prefixArr = array();
		if (!empty($objectList)) {
			foreach ($objectList as $objectInfo) {
				$objectArr[] = $objectInfo->getKey();
			}
		}
		if (!empty($prefixList)) {
			foreach ($prefixList as $prefixInfo) {
				$prefixArr[] = $prefixInfo->getPrefix();
			}
		}
		return array('objectList' => $objectArr, 'prefixList' => $prefixArr);
	}

	/**
	 * 获取object的内容
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function getObject($ossClient, $bucket, $object) {
		$options = array();
		try {
			$content = $ossClient->getObject($bucket, $object, $options);
		} catch (OssException $e) {
			return false;
		}
		return;
	}

	/**
	 * get_object_to_local_file
	 *
	 * 获取object
	 * 将object下载到指定的文件
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function getObjectToLocalFile($ossClient, $bucket, $object, $localfile) {
		$options = array(
			OssClient::OSS_FILE_DOWNLOAD => $localfile,
		);

		try {
			$ossClient->getObject($bucket, $object, $options);
		} catch (OssException $e) {
			return false;
		}
		if (file_get_contents($localfile) === file_get_contents(__FILE__)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 拷贝object
	 * 当目的object和源object完全相同时，表示修改object的meta信息
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function copyObject($ossClient, $bucket, $object, $copyObject) {
		$fromBucket = $bucket;
		$fromObject = $object;
		$toBucket = $bucket;
		$toObject = $copyObject;
		$options = array();

		try {
			$ossClient->copyObject($fromBucket, $fromObject, $toBucket, $toObject, $options);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}

	/**
	 * 修改Object Meta
	 * 利用copyObject接口的特性：当目的object和源object完全相同时，表示修改object的meta信息
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function modifyMetaForObject($ossClient, $bucket, $object) {
		$fromBucket = $bucket;
		$fromObject = $object;
		$toBucket = $bucket;
		$toObject = $fromObject;
		$copyOptions = array(
			OssClient::OSS_HEADERS => array(
				'Expires' => date('Y-m-d H:i:s', time()),
				'Content-Disposition' => 'attachment; filename="' . $object . '"',
			),
		);
		try {
			$ossClient->copyObject($fromBucket, $fromObject, $toBucket, $toObject, $copyOptions);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}

	/**
	 * 获取object meta, 也就是getObjectMeta接口
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function getObjectMeta($ossClient, $bucket, $object) {
		$object = $object;
		try {
			$objectMeta = $ossClient->getObjectMeta($bucket, $object);
		} catch (OssException $e) {
			return false;
		}
		if (isset($objectMeta[strtolower('Content-Disposition')]) &&
			'attachment; filename="' . $object . '"' === $objectMeta[strtolower('Content-Disposition')]) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 删除object
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function deleteObject($ossClient, $bucket, $object) {
		try {
			$ossClient->deleteObject($bucket, $object);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}

	/**
	 * 批量删除object
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function deleteObjects($ossClient, $bucket, $objects = array()) {
		try {
			$ossClient->deleteObjects($bucket, $objects);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}

	/**
	 * 判断object是否存在
	 *
	 * @param OssClient $ossClient OSSClient实例
	 * @param string $bucket 存储空间名称
	 * @return null
	 */
	public static function doesObjectExist($ossClient, $bucket, $object) {
		try {
			$exist = $ossClient->doesObjectExist($bucket, $object);
		} catch (OssException $e) {
			return false;
		}
		return true;
	}
}