<?php
/**
 * Created by PhpStorm.
 * User: chao
 * Date: 15-8-6
 * Time: 下午3:17
 */
 class Login_model extends CI_Model{
     public function __construct(){
         parent::__construct();
         $this->load->database();
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
     public function get_info($user_id)
     {
         //result返回对象数组　　result_array返回纯数组　　但均是二维的
         //row_array()返回一个一维数组　　前端可直接使用
         $this->db->where('user_id', $user_id);
         $this->db->select('user_id,identity, sess_id,sess_id_phone,auth_state,username, face_pic, questions_count,concerns_count, fans_count, vips_count, mobile, email, gender,
          birthday, location, institue, qualification, signature,child_account, game_auth');
         $query = $this->db->get('ht_users');
         $data = $query->row_array();
         $data_price = $this->get_vip_price($user_id);
         $data['price'] = $data_price;
		 $data_lcs_count = $this->get_lcs_count($user_id);
		 $data['lcs_count'] = $data_lcs_count;
         return $data;

     }
     private function get_vip_price($master_id){
         $this->db->where('master_id',$master_id);
         $this->db->select('month, half_year, year');
         $query =$this->db->get('vip_price');
         $data = $query->row_array();
         return $data;

     }
	 /*
	  * username:liss
	  * time:201607070948
	  * function get_lcs_count 获取用户的理财师数量
	  */
	 private function get_lcs_count($user_id)
	 {
		 $this->db->where('user_id',$user_id);
		 $this->db->where('state',1);
		 $this->db->select('count(*) as lcs_count');
		 $query = $this->db->get('vip');
		 $lcs_count = $query->row()->lcs_count;
		 return $lcs_count;
	 }
     public function update_login_data($user_id,$data){
         $this->db->where('user_id', $user_id);
         $this->db->update('ht_users', $data);
         $bool = $this->db->affected_rows() == 1 ? TRUE : FALSE;
         return $bool;
     }
     public function delete_identifier($user_id,$data){
         $this->db->where('user_id',$user_id);
         $this->db->update('ht_users',$data);
     }

	 /**************************
	  * User:		Liss
	  * Program:	用户登录签到
	  * *************************/
	 public function sign($user_id)
	 {
		 //如果上次登录时间不是今天，今天增加一次登陆签到记录。(一天多次登陆只能算一次签到)
		 //并且把上次登录(last_login_time字段)更新到当前时间
		 $query = $this->db->query("update ht_users set numOfSignDay=numOfSignDay+1 ,last_login_time=now() where (to_days(now())!=to_days(last_login_time) or to_days(last_login_time) is null) and user_id = '$user_id'");
		 return ;
	 }

     public function check_sess_id_phone($field, $username, $sess_id_phone)
     {
         //用户名：
         $this->db->where($field, $username);
         $this->db->select('user_id,sess_id_phone');
         $query = $this->db->get('ht_users');
         $data = $query->row_array();
         $user_id = $data['user_id'];
         if ($sess_id_phone == $data['sess_id_phone']) {
             $this->session->set_userdata('uuid', $user_id);
             return TRUE;
         }
         return FALSE;

     }
	 /*********************************
	  * User:	liss
	  * Date:	2017/02/13
	  * Digest:	获取用户最新sess_id_phone
	  * **********************************/
	 public function get_session_id($user_id)
	 {
		 $this->db->where('user_id',$user_id);
		 $this->db->select("sess_id_phone");
		 $query = $this->db->get('ht_users');
		 $data = $query->row_array();
		 return $data;
	 }

	 public function cookie_check($identifier){
		 $user_agent = $this->input->user_agent();
		 $is_pc = (strpos($user_agent,"Windows NT"));
		 $is_iphone =(strpos($user_agent,"iPhone"));

		 $identifier_field = "identifier";
		 if($is_pc){
			 $identifier_field = 'identifier';
		 }elseif($is_iphone){
			 $identifier_field = 'identifier_phone';
		 }

		 $this->db->select('user_id');
		 $this->db->where($identifier_field,$identifier);
		 $this->db->from('ht_users');
		 $query = $this->db->get();
		 $data = $query->row_array();
		 if(isset($data)){
			 return $data['user_id'];
		 }
		 return FALSE;
	 }

	 public function  pwdTest(){
		 $this->db->select('password');
		 $this->db->where('user_id','888000032$');
		 $this->db->from(ht_users);
		 $query = $this->db->get();
	//	 $query=$this->db->query("select user_id from ht.ht_users where password = '123456a'");
		 $res = $query->result_array();
		 return $res;
	 
}

 }
