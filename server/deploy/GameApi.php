<?php

// require('db_config.php');
class GameApi{
	public function __construct($dt, $db){
        $this->dt = $dt;
        $this->db = $db;
	}
	  
	 public function error($str){
        echo json_encode(array("err"=>$str));
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
        $sql = sprintf("select count(*) as count from %s.game_record where level = %s and username = '%s' and value>=%s",
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
        // $sql = sprintf("select * from %s.game_record where level = %s order by value desc, date desc limit 10"
        $sql = sprintf("select t2.username, t2.value, t2.date from 
        (select username, max(value) as value from %s.game_record 
        where level = %s group by username) as t
        left join %s.game_record as t2
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

    public function get_user_info(){
        if(isset($_GET['user']))
            $user = $_GET['user'];
        else
            return $this->error('user');
        $sql = sprintf("select * from %s.game_user where name = '%s'",$this->dt,$user);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
		$result_count = count($array);
        if ($result_count == 0) {
			$sql = sprintf("INSERT INTO %s.game_user (name, level) VALUES ('%s', 1)",
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

    public function update_user_info(){
        if(isset($_GET['user']))
            $user = $_GET['user'];
        else
            return $this->error('user');
        if(isset($_GET['level']))
            $level = $_GET['level'];
        else
            return $this->error('level');
        $sql = sprintf("select * from %s.game_user where name = '%s'",$this->dt,$user);
        $result = $this->db->query($sql);
		$array = $this->get_result($result);
		$result_count = count($array);
        if ($result_count == 0) {
			$sql = sprintf("INSERT INTO %s.game_user (name, level) VALUES ('%s', %s)",
            $this->dt,$user,$level);
            $this->db->query($sql);
        } else {
            $sql = sprintf("UPDATE %s.game_user SET level=%s WHERE name = '%s'",
            $this->dt,$level,$user);
            $this->db->query($sql);
        }
    }
    // private function get_result($r){
    //     return $r->result_array();
    // }
    
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

    public function upload_score(){
        if(isset($_POST['user']))
            $user = $_POST['user'];
        else
            return $this->error('user');
        if(isset($_POST['value']))
            $value = $_POST['value'];
        else
            return $this->error('value');
        if(isset($_POST['level']))
            $level = $_POST['level'];
        else
            return $this->error('level');
        if(isset($_POST['data']))
            $data = $_POST['data'];
        else
            return $this->error('data');
        if(isset($_POST['rank']))
            $rank = $_POST['rank'];
        else
            return $this->error('rank');
        date_default_timezone_set('PRC');
        $date = date('Y-m-d H:i:s');
        $sql = sprintf("INSERT INTO %s.game_record (username, value, level, date, data, rank) VALUES ('%s', %s, %s, '%s','%s', %s)",
            $this->dt,
            $user,
            strval($value),
            strval($level),
            $date,
            $data,
            $rank);
        if ($this->db->query($sql) === TRUE) {
            $this->sendData("success");
        } else {
            $this->error($this->db->error);
        }
    }
    
    public function update_level(){
        if(isset($_GET['user']))
            $user = $_GET['user'];
        else
            return $this->error('user');
        if(isset($_GET['level']))
            $level = $_GET['level'];
        else
            return $this->error('level');
        $sql = sprintf("select level from %s.game_user where name = '%s'",$this->dt,$user);
        $result = $this->db->query($sql);
        $array = $this->get_result($result);
        $result_count = count($array);
        if ($result_count == 0) {
            $sql = sprintf("insert into %s.game_user (name, level) VALUES ('%s', %s)",
            $this->dt, $user, $level);
            $this->db->query($sql);
        }else{
            $l = $array[0]["level"];
            if($level > $l){
                $sql = sprintf("update %s.game_user set level = %s where name = '%s'",
                $this->dt, $level, $user);
                $this->db->query($sql);
            }
        }
	}
}

