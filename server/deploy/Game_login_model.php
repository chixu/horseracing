<?php
require_once('GameApi.php');
class Game_login_model extends CI_Model{
	/*
	 * User:    shy
	 * Date:    2018-08-09
	 * Comment: 游戏的后台，提供包括登陆游戏的验证、登陆游戏后的数据库更新等
	 * */
	
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

//     public function break_record(){
// 		$api = new GameApi('ht',$this->db);
// 		$api->break_record();
//    }


	public function get_score(){
		$api = new GameApi('ht',$this->db);
		$api->get_score();
	}

    public function upload_score($u){
		$api = new GameApi('ht',$this->db);
		$api->upload_score($u);
	}

    public function get_user_info($u){
        $api = new GameApi('ht',$this->db);
        $api->get_user_info($u);
    }

    public function update_user_info($u){
        $api = new GameApi('ht',$this->db);
        $api->update_user_info($u);
    }
    
    public function get_stock(){
        $api = new GameApi('ht',$this->db);
        $api->get_stock();
    }

    public function get_user_match($u){
        $api = new GameApi('ht',$this->db);
        $api->get_user_match($u);
    }

    public function get_user_submatch($u){
        $api = new GameApi('ht',$this->db);
        $api->get_user_submatch($u);
    }

    public function create_submatch($u){
        $api = new GameApi('ht',$this->db);
        $api->create_submatch($u);
    }
	// public function update_level(){
    //     $api = new GameApi('ht',$this->db);
    //     $api->update_level();
    // }

}

