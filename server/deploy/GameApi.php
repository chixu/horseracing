<?php

// require('db_config.php');
class GameApi{

    private $key = "FbcCY2yCFBwVCUE9R+6kJ4fAL4BJxxjd";
    private $iv =  "e16ce913a20dadb8";
    private $match_status_done = 2;

	public function __construct($dt, $db){
        $this->dt = $dt;
        $this->db = $db;
	}
	  
	 public function error($str){
        echo json_encode(array("err"=>$str));
        die();
	}

    public function sendData($d){
	    echo json_encode(array("data"=>$d));
    }

    public function break_record(){
        if(isset($_GET['level']))
            $level = $_GET['level'];
        else
            return $this->error('level');
        if(isset($_GET['value']))
            $value = $_GET['value'];
        else
            return $this->error('value');
        if(isset($_GET['user']))
            $user = $_GET['user'];
        else
            return $this->error('user');
        $sql = sprintf("select count(*) as count from %s.dksm_record where level = %s and username = '%s' and value>=%s",
            $this->dt,
            strval($level),
            $user,
            strval($value)
        );
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
		$result_count = count($array);
        if ($result_count > 0) {
            $row = $array[0];
            $this->sendData($row['count'] == 0);
        } else {
            $this->error('error');
        }
   }


	public function get_score(){
        if(isset($_GET['level']))
            $level = $_GET['level'];
        else
            return $this->error('level');
        // $sql = sprintf("select * from %s.dksm_record where level = %s order by value desc, date desc limit 10"
        $sql = sprintf("select t2.username, t2.value, t2.date from 
        (select username, max(value) as value from %s.dksm_record 
        where level = %s group by username) as t
        left join %s.dksm_record as t2
        on t.username = t2.username and t.value = t2.value order by t2.value desc, date desc"
        , $this->dt,
            strval($level),
            $this->dt
        );
        // echo $sql;
        $result = $this->db->query($sql);
		$data = array();
		$array = $this->get_result($result);
		$result_count = count($array);
        if ($result_count > 0) {
			foreach($array as $row) {
                // array_push($data, array(
                //     "value" => $row["value"],
                //     "date" => $row["date"],
                //     "user" => $row["username"]
                // ));
                $data[$row["username"]] = array(
                    "value" => $row["value"],
                    "date" => $row["date"],
                    "user" => $row["username"]
                );
            }
        } else {

        }
		$this->sendData($data);
    }

    public function get_user_info($user){
        // if(isset($_GET['user']))
        //     $user = $_GET['user'];
        // else
        //     return $this->error('user');
        $sql = sprintf("select * from %s.dksm_user where name = '%s'",$this->dt,$user);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
		$result_count = count($array);
        if ($result_count == 0) {
			$sql = sprintf("INSERT INTO %s.dksm_user (name, level) VALUES ('%s', 1)",
            $this->dt,
            $user);
            $this->db->query($sql);
            $this->sendData(array(
                "level" => 1
            ));
        } else {
            $this->sendData(array(
                "level" => $array[0]["level"]
            ));
        }
    }

    public function update_user_info($user){
        // if(isset($_GET['user']))
        //     $user = $_GET['user'];
        // else
        //     return $this->error('user');
        // if(isset($_GET['level']))
        //     $level = $_GET['level'];
        // else
        //     return $this->error('level');
        $data = $this->post_data();
        $level = $data['level'];
        $sql = sprintf("select * from %s.dksm_user where name = '%s'",$this->dt,$user);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
		$result_count = count($array);
        if ($result_count == 0) {
			$sql = sprintf("INSERT INTO %s.dksm_user (name, level) VALUES ('%s', %s)",
            $this->dt,$user,$level);
            $this->db->query($sql);
        } else {
            $sql = sprintf("UPDATE %s.dksm_user SET level=%s WHERE name = '%s'",
            $this->dt,$level,$user);
            $this->db->query($sql);
        }
    }
    // private function get_result($r){
    //     return $r->result_array();
    // }
    public function get_rand_stock($n){
        $arr = array("600000","600016","600019","600028","600029","600030","600036","600048","600050","600104","600111","600276","600309","600340","600519","600547","600585","600606","600690","600703","600887","600958","600999","601006","601088","601166","601169","601186","601211","601288","601318","601328","601336","601390","601398","601601","601628","601668","601688","601766","601800","601818","601857","601988","601989","603993");
        // $arr = array("600000","600016","600019");
        $indexs = range(0, count($arr)-1);
        $res = array();
        for($i = 0; $i<$n; $i++){
            $index = rand(0,count($indexs) - 1);
            array_push($res, $arr[$indexs[$index]]);
            array_splice($indexs, $index, 1);
        }
        return $res;
    }

    public function get_stock_enddate(){
        $date = new DateTime(date('Y-m-d'));
        $date->sub(new DateInterval('P'.rand(10,600).'D'));
        return $date->format('Y-m-d');
    }

    public function get_stock(){
        $data = $this->post_data();
        $this->sendData(array(
            "code"=>implode('_',$this->get_rand_stock(strval($data['count']))),
            "date"=>$this->get_stock_enddate()
        ));
    }

    public function get_user_match($user){
        $data = $this->post_data();
        $sql = sprintf("SELECT t1.title as title, t2.status as status, start_date>now() as start, end_date<now() as end, t3.id as id FROM %s.dksm_match as t1
        left join %s.dksm_user_match as t2 on matchid = t1.id 
        left join %s.ht_user_groups as t3 on t1.id = t3.id where username='%s'
        order by status, start, end"
            ,$this->dt,$this->dt,$this->dt,$user);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
        $this->sendData($array);
        // echo json_encode(array("data"=>$array,"sql"=>$sql));
    }

    public function get_user_submatch($user){
        $data = $this->post_data();
        // $user = $data['user'];
        $match = $data['match'];
        $sql = sprintf("SELECT info,count FROM %s.dksm_match where id='%s'",$this->dt,$match);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
        if (count($array) > 0) {
            $matchinfo = explode(',',$array[0]['info']);
            $matchcount = strval($array[0]['count']);
            $sql = sprintf("SELECT count(*) as count FROM %s.dksm_user_submatch where username='%s' and 
            submatchid in (select id from %s.dksm_submatch where matchid = %s)",$this->dt,$user,$this->dt,$match);
            $result = $this->db->query($sql);
            $array = $this->get_result($result);
            $subcount = strval($array[0]['count']);
            if($subcount == $matchcount){
                $this->sendData(array());
            }else{
                $index = 0;
                for($i=0; $i<count($matchinfo); $i++){
                    $matchinfo2 = explode(':',$matchinfo[$i]);
                    $level = $matchinfo2[0];
                    $levelcount = $matchinfo2[1];
                    $index = $index+$levelcount;
                    if($subcount<$index){
                        $sql = sprintf("SELECT * FROM %s.dksm_submatch
                        where matchid = %s and level = %s and id not in (select submatchid from %s.dksm_user_submatch where username = '%s')",
                        $this->dt,$match,$level,$this->dt,$user);
                        $result = $this->db->query($sql);
                        $array = $this->get_result($result);
                        $index = rand(0,count($array) - 1);
                        $data = $array[$index];
                        $sql = sprintf("INSERT INTO %s.dksm_user_submatch (username, submatchid) VALUES ('%s', %s)",
                        $this->dt, $user, $data['id']);
                        $this->db->query($sql);
                        //最后一个submatch
                        if($matchcount-$subcount == 1){
                            $sql = sprintf("UPDATE %s.dksm_user_match SET status=%s where matchid=%s and username='%s'",
                            $this->dt, $this->match_status_done, $match, $user);
                            $this->db->query($sql);
                            $data['last'] = 1;
                        }
                        $this->sendData($data);
                        return;
                    }
                }
            }
        }else{
            $this->error("nomatch");
        }
    }

    public function get_stock_info(){
        http_get("http://192.168.0.136/stock_page_controller/fetch_period_stocks_base_data/?code=000001_600000&date=2018-09-15&days=10", array("timeout"=>1), $info);
        return $info;
    }

    public function upload_score($user){
        $data = $this->post_data();
        // $user = $data['user'];
        $value = $data['value'];
        $valueminusindex = $data['valueminusindex'];
        $level = $data['level'];
        $history = $data['data'];
        $rank = $data['rank'];
        date_default_timezone_set('PRC');
        $date = date('Y-m-d H:i:s');
        // $sql = sprintf("INSERT INTO %s.dksm_record (username, value, level, date, data, rank) VALUES ('%s', %s, %s, '%s','%s', %s)",
        //     $this->dt,
        //     $user,
        //     strval($value),
        //     strval($level),
        //     $date,
        //     $history,
        //     $rank);

        
        $insert_data = array(
            "username"=>$user,
            "value"=>strval($value),
            "valueminusindex"=>strval($valueminusindex),
            "level"=>strval($level),
            "date"=>$date,
            "data"=>$history,
            "rank"=>$rank,
        );
        $insert_id = $this->insert("dksm_record", $insert_data);
        if(isset($data['matchid'])){
            $matchid = $data['matchid'];
            $submatchid = $data['submatchid'];
            $sql = sprintf("UPDATE %s.dksm_user_submatch set recordid = %s where username='%s' and submatchid=%s" ,
            $this->dt,
            $insert_id,
            $user,
            $submatchid);
            $this->db->query($sql);
        }
        // if ($this->db->query($sql) === TRUE) {
        //     $this->sendData("success");
        // } else {
        //     $this->error($this->db->error);
        // }
    }

    public function insert($db, $data){
        // echo json_encode($data);
        if(method_exists($this->db, 'insert')){
            $this->db->insert($this->dt . "." . $db, $data);
            return $this->db->insert_id();
        }else{
            $cols = "";
            $values = "";
            foreach($data as $k=>$v){
                // echo $v;
                $cols = $cols.",".$k;
                if(is_string($v)){
                    $values =$values.",'".$v."'";
                }else
                    $values = $values.",".$v;
            }
            $sql = sprintf("INSERT INTO %s.%s (%s) VALUES (%s)",
            $this->dt,
            $db,
            substr($cols, 1),
            substr($values, 1));
            // echo $sql;
            $this->db->query($sql);
            return mysqli_insert_id($this->db);
        }
    }
    
    public function create_submatch($id){
        // if(isset($_GET['id']))
        //     $id = $_GET['id'];
        // else
        //     return $this->error('null');
        $sql = sprintf("SELECT * FROM %s.dksm_submatch where matchid='%s'",$this->dt,$id);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
        if (count($array) > 0) {
            $this->error('e');
        }
        $sql = sprintf("SELECT info FROM %s.dksm_match where id='%s'",$this->dt,$id);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
        if (count($array) > 0) {
            $arr = explode(',',$array[0]['info']);
            for($i=0; $i<count($arr); $i++){
                $arr2 = explode(':',$arr[$i]);
                $level = $arr2[0];
                for($j=0; $j<strval($arr2[1]); $j++){ 
                    // echo 'insert ' .$num . ' '. $j. '<br/>';
                    $sql = sprintf("INSERT INTO %s.dksm_submatch (matchid,subid,code,enddate,level) VALUES (%s,%s,'%s','%s',%s)",
                    $this->dt,$id,$j+1,implode('_',$this->get_rand_stock($level)),$this->get_stock_enddate(),$level);
                    // echo $sql.'<br/>';
                    $this->db->query($sql);
                }
            }
        }
        // $this->sendData('d');
    }

    private function get_data(){
        if(isset($_GET['data'])){
            $data = $_GET['data'];
            return json_decode($data, true);
        }else
            $this->error('null');
    }

    private function post_data(){
        if(isset($_POST['data'])){
            // global $key;
            // global $iv;
            $data = $_POST['data'];
            // echo $data . '<br/>';
            $data2 = openssl_decrypt($data,"AES-256-CBC",$this->key,NULL,$this->iv);
            $obj = json_decode(substr($data2,1), true);
            // echo $this->key;
            // echo '<br/>';
            // echo $this->iv;
            // echo '<br/>';
            // echo $data;
            // echo '<br/>';
            // echo json_encode($data2);
            return $obj;
        }else
            $this->error('null');
    }

    private function get_result($r){
        if(method_exists($r, 'result_array'))
            return $r->result_array();
        $data = array();
        if ($r->num_rows > 0) {
            // output data of each row
            while($row = $r->fetch_assoc()) {
                array_push($data, $row);
            }
        }
        return $data;
    }
}

