<?php
class Game_login_model extends CI_Model{
	     public function __construct(){
         parent::__construct();
         $this->load->database('ht');
         $this->load->helper('url');

		 }
	  
     public function trans_start(){
         $this->db->trans_begin();
     }

     public function trans_end()
     {
         $state = $this->db->trans_status();
         if ($state === FALSE) {
             $this->db->trans_rollback();
         } else {
             $this->db->trans_commit();
         }
         return $state;
     }
     public function check_username($field,$username){
         $this->db->where($field, $username);
         $this->db->select('id');
         $query = $this->db->get('ht_users');
         $data = $query->row_array();
         if($data == null){
             return false;
         }
         return true;
	 }
	    public function check_password($field, $username, $pwd_login)
     {
		 //用户名：
		 /*if ($field == 'mobile')
		 {
			 $sql = "select password from ht_users where $field"
		 }
         $this->db->where($field, $username);
         $this->db->select('user_id,password');
         $query = $this->db->get('ht_users');
         $data = $query->row_array();
         $password = $data['password'];
         $user_id = $data['user_id'];
         if ($password == $pwd_login) {
             $this->session->set_userdata('uuid', $user_id);
             return TRUE;
		 }*/
		 $this->db->where($field, $username);
		 $this->db->where('password',$pwd_login);
		 $this->db->select('user_id');
		 $query = $this->db->get('ht_users');
		 $row = $query->first_row();
		 if ($row != NULL)
		 {
			 $user_id = $row->user_id;
             $this->session->set_userdata('uuid', $user_id);
             return TRUE;
		 }
         return FALSE;
     }

/*	 public function get_score($d){
		return 0; 
}*/
	 public function error($str){
		  
		 return array("err"=>$str);
}

    public function sendData($d){
	//	return "123";
		return array("data"=>$d);
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
	
        if(isset($_GET['level']))
            $level = $_GET['level'];
        else
			return $this->error('level');
		//date_default_timezone_set('PRC')
	
        $sql = sprintf("select * from ht.game_record where level = %s order by value desc, date desc limit 10", strval($level));
		$result = $this->db->query($sql);
		$data = array();
		$array = $result->result_array();
		$result_count = count($result->result_array());
        if ($result_count > 0) {
            // output data of each row
			for($i=0;$i<$result_count;$i++) {
				$row = $array[$i];
                array_push($data, array(
                    "value" => $row["value"],
                    "date" => $row["date"],
                    "user" => $row["username"]
                ));
            }
        } else {
   //          echo "0 results";
        }
			return $this->sendData($data);
		//	return $result->result_array();
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

