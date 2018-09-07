<?php
header('Access-Control-Allow-Origin:*');

defined('BASEPATH') OR exit('No direct scipt access allowed');

class Game extends MY_Controller{
	/*
	 * User:     shy
	 * Date:     2018-08-02
	 *			 2018-08-03
	 * Comment:  游戏的数据交互接口
	 * */
	
	public $field;
	public $username;

	public function __construct(){
		parent::__construct();
	/*	error_reporting(E_ALL);
		ini_set('display_errors',1);*/
        $this->load->model('Modify_info_model', 'modify_info_model');
		$this->load->database('ht');
		$this->load->helper('url');
		$this->load->library('session');
		$this->load->model('login_model');
		$this->load->model("Opinion_model");
		//	$this->load->model('Game_login_model');
		$this->load->model('Game_login_model','game_log');
	}
	/*
	 * USer:    shy
	 * Date:    2018-08-09 19:22
	 * COmment: 海知多空赛马入口
	 * */
	public function index(){
		$this->load->view('game/index');

	}

	/*
	 * User:    shy 
	 * Date：   2018-08-03 9:49
	 * Comment: 用户登录主程序，判断登录状态，登录成功则返回用户信息，登录失败则返回失败信息
	 * */
	public function login(){
		
		$login_state = $this->session->userdata('login_state');
		$userName = $_POST['user_name'];
		$userPwd = $_POST['user_pwd'];
		
		$checkName = $this->username_check($userName);
		$checkPwd = $this->password_check($userPwd);
		if($checkName == true && $checkPwd == true){
	                //登录成功后加载数据
                $this->session->set_userdata('login_state', TRUE);
                $user_id = $this->session->userdata('uuid');
				$data = $this->login_model->get_info($user_id);
	
		}
			$this->output
				->set_content_type('application/json')
				->set_output(json_encode($data),JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
		//如果是登录状态，返回用户信息
	}
	//检查用户名是否存在
    public function username_check($username){
		$username=trim($username);		//去除掉前后的空格
        $this->username = $username;
        if($this->form_validation->valid_email($username)){
            $this->field = 'email';
        }elseif($this->form_validation->is_natural($username)&&strlen($username) == 11){
            $this->field = 'mobile';
            //数字字母组合｜非11位纯数字｜汉字
        }elseif($this->form_validation->alpha_dash($username)
            &&!($this->form_validation->numeric($username)&&strlen($username) == 11)||preg_match("/[\x7f-\xff]/", $username)){
            $this->field = 'username';
        }else{
            return false;
        }
        $bool = $this->login_model->check_username($this->field,$username);
        return $bool;

	}
	//检查密码是否匹配

	    public function password_check($pwd_login){
        $bool = $this->login_model->check_password($this->field,
            $this->username,$pwd_login);
        return $bool;
    }

/*    private function load_login_data($client, $data){
        //全部缓存到session中，便于前端使用
        $user_id = $data['user_id'];
        $sess_id = $data['sess_id'];
        $sess_id_phone = $data['sess_id_phone'];
        if($client == 'web'){
            $this->delete_session($sess_id);
            $data_field = array('sess_id' => "sess_id",'identifier' => "identifier",'token' => "token", "expire" => "expire");
        }else{
            $this->delete_session($sess_id_phone);
            $data_field = array('sess_id' => "sess_id_phone",'identifier' => "identifier_phone",'token' => "token_phone", "expire" => "expire_phone");
        }
        unset($sess_id);
        unset($sess_id_phone);
        $this->session->set_userdata($data);
        $this->session->set_userdata('game_state',0);
        $this->set_login_data($user_id, $data_field);   
        }
}*/
    private function set_login_data($user_id,$field){
        //未选中状态下　　没有remember_me字段
        $token = $this->input->post('remember_me');
        $new_sess_id = 'ci_session:' . session_id();
        if($token == 1){
            //组织生成identifier
            $ran_num_1 = md5(rand(1000,9999));
            $ran_num_2 = md5(rand(10000,99999));
            $md_id = md5($user_id);
            $identifier = $md_id.$ran_num_1;
            $expire = date('Y-m-d H:i:s', strtotime("+30 days"));
            $this->input->set_cookie(array('name'=>'HZTECHID','value'=> $identifier,'expire' => '2592000'));
            $this->input->set_cookie(array('name'=>'HZATUOID','value'=> $ran_num_1.$ran_num_2,'expire' => '1200'));
            //更新表字段
            $data = array($field['identifier'] => $identifier,$field['token'] => 1, $field['expire'] => $expire, $field['sess_id'] => $new_sess_id);
        }else{
            $ran_num_1 = md5(rand(1000,9999));
            $ran_num_2 = md5(rand(100000,999999));
            $identifier = $ran_num_1.$ran_num_2;
            $this->input->set_cookie(array('name'=>'HZTECHID','value'=> $identifier,'expire' => '1200'));
            $data = array($field['identifier'] => "",$field['token'] => 0, $field['expire'] => "0000-00-00 00:00:00", $field['sess_id'] => $new_sess_id);
        }
        $this->login_model->update_login_data($user_id,$data);
	}
    public function delete_session($sess_id){
        //更新sess_id,　并删除原session
        if ($sess_id != null) {
            $this->cache->memcached->delete($sess_id);
        }
	}

	public function get_score(){
		error_reporting(E_ALL);
		ini_set('display_errors',1);
		$this->game_log->get_score();		
	}

	public function upload_score(){
		 $this->game_log->upload_score();
			
	}
	public function break_record(){
		$this->game_log->break_record();
	}
	public function update_user_info(){
		$this->game_log->update_user_info();
	}
	public function get_user_info(){
		$this->game_log->get_user_info();
	}
	
	public function update_level(){
		$this->game_log->update_level();
	}
}
