<?php

require('GameApi.php');
class Game{
	public function __construct(){
		$this->gameApi = new GameApi();
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
        $sql = sprintf("select count(*) as count from ht.game_record where level = %s and value >= %s",
            strval($level),
            strval($value)
        );
        $result = $this->db->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $res = $row['count']<10;
            // echo $res;
            return $this->sendData($res);
        } else {
            return $this->error('error');
        }
   }


	public function get_score(){
        $this->gameApi->get_score();
	}

    public function upload_score(){
        if(isset($_GET['name']))
            $name = $_GET['name'];
        else
            return $this->error('name');
        if(isset($_GET['value']))
            $value = $_GET['value'];
        else
            return $this->error('value');
        if(isset($_GET['level']))
            $level = $_GET['level'];
        else
            return $this->error('level');
        date_default_timezone_set('PRC');
        $date = date('Y-m-d H:i:s');
        $sql = sprintf("INSERT INTO game_record (username, value, level, date)
VALUES ('%s', %s, %s, '%s')",
          $name,
        strval($value),
            strval($level),
            $date);

        if ($this->db->query($sql) === TRUE) {
            return "New record created successfully";
        } else {
            return "Error: " . $sql . "<br>" . $this->db->error;
        }
	}
}

