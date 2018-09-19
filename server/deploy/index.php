<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<!DOCTYPE html>
<html lang="zh-cn">

<?php $this->load->view('./template/head', array('title' => '海知多空赛马')); ?>

<script src="<?php echo base_url('assets/js/echarts.min.js'); ?>"></script>
<script src="<?php echo base_url('assets/js/macarons.js'); ?>"></script>
<style>
    .wrapper {
        background-image: url("../assets/game/images/bg.jpg");
        background-repeat: no-repeat;
        background-size:cover;
    }
</style>


<?php
//var_dump($cate);
$state_login =  $this->session->userdata('login_state');
$self_name = $this->session->userdata('username');
?>


<body class="bg-gray">

<!--子导航栏-->
<?php $this->load->view('./template/sub_navbar'); ?>
<!--导航栏-->
<?php $this->load->view('./template/navbar'); ?>

<body>
<div class="bg-white row wrapper" style="margin: 1% 0;min-height: 800px;">
    <div style="position:fixed;right: 0px;bottom:0px;background-color: white;">
        <img src="../assets/game/images/qr.png"/>
        <div style="text-align: center;width: 100%;margin-bottom:5px">
                扫描二维码在手机上玩
        </div>
    </div>
    <iframe style="display: block; width: 600px; height: 900px; margin: auto;" frameborder="0">
    </iframe>
    <script>
        var iframe = document.getElementsByTagName('iframe')[0];
        iframe.src = "/assets/game/index.html?platform=web<?php if($state_login)echo "&username=$self_name"; ?>" + (document.referrer.indexOf('login')>-1?'&login=1':'');
        function redirect() {
            window.location.href = window.location.origin + "/login";
        }
        
        function resize() {
            let height = Math.min(900, Math.max(600, window.innerHeight));
            let width = Math.round(height / 3 * 2);
            let iframe = document.getElementsByTagName('iframe')[0];
            iframe.style.width = width + 'px';
            iframe.style.height = height + 'px';
        }
        window.onresize = resize;
        resize();
    </script>
</div>
</body>
<div class="global-wrapper">
    <?php $this->load->view('./template/footer'); ?>
</div>

</body>
</html>
