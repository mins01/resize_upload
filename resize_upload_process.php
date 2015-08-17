<?
/*
echo '<hr>_GET<hr>';
print_r($_GET);
echo '<hr>_POST<hr>';
print_r($_POST);
echo '<hr>_FILES<hr>';
print_r($_FILES);
echo '<hr>-<hr>';
//*/

$data = array(
	'error'=>false,
	'data'=>null,
	'msg'=>'',
	);
$data['data'] = array();
foreach($_FILES as $f){
	//print_r($f);
	//for($i=0,$m=count($f['name']);$i<$m;$i++){
	////echo $i;
	foreach($f['name'] as $i=>$v){
		if($f['error'][$i]!=0){
			//echo "[ERROR][{$i}] {$f['errors'][$i]}";
			$data['error'] = false;
			continue;
		}
		$r = move_uploaded_file($f['tmp_name'][$i], 'tmp/'.$f['name'][$i]);
		if(!$r){
			//echo 'FIAL';
			$data['data'][$i] = false;
		}else{
			$data['data'][$i] = true;
		}
	}
}
$data['msg']='업로드 완료.';

//var_dump($data);
echo json_encode($data);
//echo json_last_error();

