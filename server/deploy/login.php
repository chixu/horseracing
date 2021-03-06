
<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<!DOCTYPE html>
<?php 
//	$cur_base_url = "http://192.168.0.136/";
	$cur_base_url = "https://www.haizhilicai.com/";

?>
<html lang="zh-cn">
<?php $this->load->view('./template/https_head', array('title' => '登录','cur_base_url'=>$cur_base_url)); ?>

<style>
    body {
        position: relative;
        background-image: url("<?php echo($cur_base_url.'assets/images/back/login_bg.jpg'); ?>");
    }
</style>
<?php var_dump($data);?>
<body>
    <div class="wrapper">
        <?php $this->load->view('./template/https_sub_navbar',array("cur_base_url"=>$cur_base_url)); ?>
        
        <?php $this->load->view('./template/https_navbar',array("cur_base_url"=>$cur_base_url)); ?>
        <div style="height: 700px">

        <div class="login-box <?php if($nav_mode == 'register') {echo 'register';} ?>">
            <div class="login-form">
                <h1>登录海知 <a href="#" class="pull-right turn-to-regist turn-btn">注册 <span class="glyphicon glyphicon-hand-right"></span></a></h1>
                <?php $username_error = form_error('user_name_input'); ?>
                <?php $password_error = form_error('password_input'); ?>

                <form method="post" class="form-horizontal login_form" id="login_form" action="<?php echo ($cur_base_url.'login/login') ?> ">
                    <div class="input-group <?php echo $username_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                        <input type="text" class="form-control" id="user_name_input" name="user_name_input" placeholder="<?php if($username_error) echo $username_error; else echo '手机号/会员名/邮箱' ?>">
                    </div>
                    <p class="theme-color hidden">请输入账号</p>

                    <div class="input-group <?php echo $password_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                        <input type="password" class="form-control" id="password_input" name="password_input" placeholder="<?php if($password_error) echo $password_error; else echo '密码' ?>">
                    </div>
                    <div style="display: none">
                        <input id="back_history" name="back_history">
                    </div>
                    <p class="theme-color hidden">请输入密码</p>

                    <div class="row pwd-help-info">
                        <div class="col-md-6">
                            <input name="remember_me" value="1" type="checkbox"> 记住我
                        </div>
                        <div class="col-md-6">
                            <a href="<?php echo($cur_base_url.'findpwd/index'); ?>" class="white-color pull-right">忘记密码？</a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="login-btn-div">
                                <button type="button" class="btn btn-block bg-theme" id="login-btn">登录</button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
            <div class="social-login">
                <ul class="nav navbar-nav txt-center">
                    
                    <li><span href="<?php /*echo($cur_base_url.'sns/session/qq');*/?>" style="color: grey"><img width="20px" height="20px" src="<?php echo($cur_base_url.'assets/images/icon/qq_black.png'); ?>" alt="..." class="img-rounded narbar_li"> qq登录</span></li>
                    
                    <li><span href="<?php /*echo($cur_base_url.'sns/session/weibo');*/?>" style="color: grey"><img width="20px" height="20px" src="<?php echo($cur_url.'assets/images/icon/weibo_black.png'); ?>" alt="..." class="img-rounded narbar_li"> 微博登录</span></li>
                </ul>
            </div>
        </div>


        
        <div class="login-box <?php if($nav_mode == 'login') {echo 'register';}?>">
            <div class="login-form register-form">
                <h1>注册账户<a href="#" class="pull-right turn-btn turn-to-login">登录 <span class="glyphicon glyphicon-hand-right"></span></a></h1>
                <?php $phone_error = form_error('phone_number'); ?>
                <?php $code_error = form_error('phone_code'); ?>
                <?php $nickname_error = form_error('nick_name'); ?>
                <?php $pwd_error = form_error('password'); ?>

                <form method="post" class="form-horizontal login_form" action="<?php echo $cur_base_url.'register/load_info'; ?> ">

                    <div class="input-group <?php echo $nickname_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                        <input type="text" class="form-control" id="nick_name" name="nick_name" required value="<?php echo !$nickname_error ? set_value('nick_name') : ''; ?>" placeholder="<?php if($nickname_error) echo $nickname_error; else echo '请输入昵称' ?>">
                    </div>
                    <p class="theme-color hidden nick_name_error input_alert_error" id="nick_name_error"></p>
                    <div class="input-group <?php echo $pwd_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                        <input type="password" style="display:none">
                        <input type="password" class="form-control" id="password" name="password" required placeholder="<?php if($pwd_error) echo $pwd_error; else echo '密码 (不少于6位)' ?>">
                    </div>
                    <p class="theme-color hidden input_alert_error" id="pwd_error"></p>
                    <div class="input-group <?php echo $pwd_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                        <input type="password" class="form-control" id="password_again" name="password_again" required placeholder="请再次输入密码">
                    </div>
                    <p class="theme-color hidden input_alert_error" id="pwd_again_error"></p>
                    
                    <div class="input-group <?php echo $f_vcode_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-eye-open"></span></span>
                        <input type="text" class="form-control" id="f_vcode" name="f_vcode" placeholder="请输入验证码,无需区分大小写">
                    </div>

                    <div id="vcode_img" style="padding-top:10px;float: left"></div>
                    <a href="#" class="next_vcode" style="padding-top:18px;float: right;color:#FFFFFF;">验证码看不清,换一张</a>



                    
                    <div class="input-group" style="height: 20px"></div>
                    <div class="input-group <?php echo $phone_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-earphone"></span></span>
                        <input type="tel" class="form-control" id="user_mobile" name="phone_number" required value="<?php echo !$phone_error ? set_value('phone_number') : ''; ?>" placeholder="<?php if($phone_error) echo $phone_error; else echo '手机号' ?>">
                    </div>
                    <p class="theme-color hidden input_alert_error" id="user_mobile_error"></p>
                    <div class="input-group <?php echo $code_error ? 'has-error' : ''; ?>">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-eye-open"></span></span>
                        <input type="text" class="form-control" id="verification_code" name="phone_code" required value="<?php echo !$code_error ? set_value('phone_code') : ''; ?>" placeholder="<?php if($code_error) echo $code_error; else echo '手机验证码' ?>">
                        <div class="input-group-btn"><button id="send_code" type="button" class="btn bg-theme" disabled="disabled">获取验证码</button></div>
                    </div>
                    <p class="theme-color hidden input_alert_error" id="image_num_error"></p>
                    <p class="theme-color hidden input_alert_error" id="ver_code_error"></p>
                    <div class="row pwd-help-info">
                        <div class="col-md-12">
                            <div class="login-btn-div">
                                <button type="submit" class="btn btn-block bg-theme">注册</button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

            <div class="social-login">
                <ul class="nav navbar-nav txt-center">
                    
                    <li><span href="<?php /*echo($cur_base_url.'sns/session/qq');*/?>" style="color: grey"><img width="20px" height="20px" src="<?php echo($cur_base_url.'assets/images/icon/qq_black.png'); ?>" alt="..." class="img-rounded narbar_li"> qq登录</span></li>
                    
                    <li><span href="<?php /*echo($cur_base_url.'sns/session/weibo');*/?>" style="color: grey"><img width="20px" height="20px" src="<?php echo($cur_url.'assets/images/icon/weibo_black.png'); ?>" alt="..." class="img-rounded narbar_li"> 微博登录</span></li>
                </ul>
            </div>
        </div>


        </div>
    </div>
    <?php $this->load->view('./template/https_footer',array("cur_base_url"=>$cur_base_url)); ?>

    <script type="text/javascript">
        $(document).ready(function () {

            /**
             * 获取二维码
             */
            $.ajax({
                url: '<?php echo($cur_base_url.'register/update_captcha/'); ?>',
                method: 'get',
                success: function (response) {
                    $('#vcode_img').html(response);
                }
            });
            $('.next_vcode').click(function () {
                $.ajax({
                    url: '<?php echo($cur_base_url.'register/update_captcha/'); ?>',
                    method: 'get',
                    success: function (response) {
                        $('#vcode_img').html(response);
                    }
                });
            });


            /**
             * 登录时前端验证，用户名和密码不能为空
             */
            $('#login-btn').click(function () {


                var back_href = document.referrer;

                $("#back_history").val(back_href);

                if($.trim($('#user_name_input').val()).length < 1){
                    $('#user_name_input').attr('placeholder','请填写用户名');
                }else if($.trim($('#password_input').val()).length < 1) {
                    $('#password_input').attr('placeholder', '请填写密码');
                }else{
                    $('#login_form').submit();

                }

            });

            document.onkeydown=function() {

                var e = window.event || arguments[0];

                if (e.keyCode == 13){

                    if($.trim($('#user_name_input').val()).length < 1){
                        $('#user_name_input').attr('placeholder','请填写用户名');
                    }else if($.trim($('#password_input').val()).length < 1) {
                        $('#password_input').attr('placeholder', '请填写密码');
                    }else{
                        $('#login_form').submit();
                    }

                    //防止ie不兼容
                    e.preventDefault();
                    e.returnValue = false;

                    return false;

                }

            }


            /**
             * 登录注册界面的动画切换
             */
            var login_box = $('div.login-box');
            $('a.turn-btn').click(function () {
                var cur_page = login_box.not('.register');
                if (cur_page.hasClass('active')) {
                    cur_page.addClass('login-delay');
                }
                if (cur_page.hasClass('login-delay') && !cur_page.hasClass('active')) {
                    cur_page.removeClass('login-delay');
                }
                login_box.toggleClass('active');
            });

        });


        /**
         * 全局变量
         * second - 倒计时设置为59s
         * speed - 每次计数间隔1s
         * send_code - 获取验证码按钮
         * count_down - 默认非倒计时状态
         */
        var second = 119;
        var speed = 1000;
        var send_code = $('#send_code');
        var count_down = false;

        /**
         * 倒计时一分钟
         * seconds - 倒计时秒数
         * speed - 每次计数间隔
         */
        function countDown(seconds, speed) {
            var txt = '倒计时 ' + ((seconds < 10) ? "0" + seconds : seconds) + ' 秒';
            send_code.html(txt);
            send_code.attr('disabled', 'disabled');
            count_down = true;
            var timeId = setTimeout("countDown(second--,speed)", speed);
            if (seconds == 0) {
                clearTimeout(timeId);
                send_code.html('获取验证码');
                send_code.removeAttr('disabled');
                second = 119;
                count_down = false;
            }
        }
        $(document).ready(function () {
            var user_mobile = $('#user_mobile');
            var nick_name = $('#nick_name');
            var password = $('#password');
            var password_agin = $('#password_again');
            var validate_code = $('#verification_code');

            /**
             * 发送手机验证码
             * count_down - 是否已经倒计时
             */
            send_code.click(function () {
                if (!count_down) {
                    var xmlhttp = new XMLHttpRequest();
                    var phone_number = $("#user_mobile").val();
                    var image_number = $("#f_vcode").val();

                    $.get("<?php echo($cur_base_url.'register/send_code')?>"+'/web/'+phone_number+'/'+image_number,function(data){
                        if(data['code'] == "2"){
                            $('#image_num_error').removeClass('hidden').html('（您发送验证码的请求过于频繁，请稍后再试！)');
                        }else if(data['code'] == "3"){
                            $('#image_num_error').removeClass('hidden').html('（您的验证码填写错误，请查验后再填写！)');
                            $.ajax({
                                url: '<?php echo($cur_base_url.'findpwd/update_captcha/'); ?>',
                                method: 'get',
                                success: function (response) {
                                    $('#vcode_img').html(response);
                                }
                            });
                        }else if(data['code'] == "0"){
                            $('#image_num_error').removeClass('hidden').html('（验证码填写正确，请填写收到的手机验证码！)');
                            countDown(second, speed);
                        }else{
                            $('#image_num_error').removeClass('hidden').html('（该号码绑定账户已达上限！)');
                        }
                    });

                    //xmlhttp.send();
                    //countDown(second, speed);
                }
            });

            /**
             * 验证手机号是否已注册
             */
            user_mobile.blur(function () {
                    var phone_num = $.trim($('#user_mobile').val());
                    if (validate_phone(phone_num)) {
                        $.get("<?php  echo($cur_base_url.'register/is_exist/web/')?>" + '/' + phone_num,
                            function (data) {
                                if (data == 'true') {
                                    $('#user_mobile_error').removeClass('hidden').html('(该号码绑定账户已达上限！)');
                                } else {
                                    $('#user_mobile_error').addClass('hidden');
                                }
                            });
                        $('#send_code').removeAttr('disabled');
                    }
                }
            );
            user_mobile.focus(function () {
                $('#user_mobile_error').addClass('hidden');
            });

            /**
             * 验证码是否为6位纯数字
             */
            validate_code.blur(function () {
                var value = $.trim(validate_code.val());
                var legal = /^\d+$/.test(value);
                if (value.length != 6 || !legal) {
                    $('#ver_code_error').removeClass('hidden').html('请输入6位验证码！');
                }
                else {
                    $('#ver_code_error').addClass('hidden');
                }
            });
            validate_code.focus(function () {
                $('#ver_code_error').addClass('hidden');
            });

            /**
             * 检查昵称是否已存在
             */
            nick_name.blur(function () {
                    var nick_name_value = $.trim($('#nick_name').val());
                    if (validate_nick_name(nick_name_value)) {
                        $.get("<?php echo($cur_base_url.'register/is_exist/web/')?>" + '/' + nick_name_value,
                            function (data) {
                                if (data == 'true') {
                                    $('#nick_name_error').removeClass('hidden').html('(该昵称已存在！)');
                                }
                                else {
                                    $('#nick_name_error').addClass('hidden');
                                }
                            });
                    }
                }
            );
            nick_name.focus(function () {
                $('#nick_name_error').addClass('hidden');
            });

            /**
             * 检查密码格式,长度6~32位
             * legal - 密码是否为纯数字
             */
            password.blur(function () {
                var value = $.trim(password.val());
                var legal = /^\d+$/.test(value);
                if (value.length < 6 || value.length > 32 || legal) {
                    $('#pwd_error').removeClass('hidden').html('(请输入6~32位密码,必须为数字与字母的组合！)');
                } else {
                    $('#pwd_error').addClass('hidden');
                }
            });
            password.focus(function () {
                $('#pwd_error').addClass('hidden');
            });

            password_agin.blur(function () {
                var value = $.trim(password.val());
                var again_value = $.trim(password_agin.val());
                if (again_value != value) {
                    $('#pwd_again_error').removeClass('hidden').html('(前后两次输入的密码不一致！)');
                } else {
                    $('#pwd_again_error').addClass('hidden');
                }
            });


        });

        /**
         *  检查手机号码的合法性，长度为11位
         *  value - 手机号
         */
        function validate_phone(value) {
            var re = /1[34578]{1}\d{9}$/;
            var legal = re.test(value);
            if (value.length != 11 || !legal) {
                $('#user_mobile_error').removeClass('hidden').html('请输入11位有效手机号码！');
                $('#send_code').attr("disabled", "disabled");
                return false;
            }
            else {
                $('#user_mobile_error').addClass('hidden');
                return true;
            }
        }

        /**
         * 昵称格式验证，不能全为数字，不能为空
         * value - 用户昵称
         */
        function validate_nick_name(value) {
            if (/^\d+$/.test(value)) {
                $('#nick_name_error').removeClass('hidden').html('(昵称不能为纯数字！)');
                return false;
            }
            if (value.length < 1) {
                $('#nick_name_error').removeClass('hidden').html('(昵称不能为空！)');
                return false;
            }
            else {
                $('#nick_name_error').addClass('hidden');
                return true;
            }
        }

    </script>
</body>
</html>


