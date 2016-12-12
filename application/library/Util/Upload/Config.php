<?php
namespace Util\Upload;
/**
 * Class Config
 *
 * 执行Sample示例所需要的配置，用户在这里配置好Endpoint，AccessId， AccessKey和Sample示例操作的
 * bucket后，便可以直接运行RunAll.php, 运行所有的samples
 */
final class Config {
	const OSS_ACCESS_ID = 'x7qFvPY2PqDqdXh2';
	const OSS_ACCESS_KEY = 'AuX9tuNznxopYi77wRgkFTlyEkxg8w';
	const OSS_ENDPOINT = 'oss-cn-beijing.aliyuncs.com';
	const OSS_TEST_BUCKET = 'ydgxt';
}
