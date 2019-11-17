var account = '';
var net_id = '';
var receiveAddress = '';
var identity = localStorage.getItem("identity") || '';
var invitation_code = get_param("invite_code");
var currentPosition = '';
var isQueueInvest = '';
var eppContract;

var locationHerf = window.location.href;
 //h含有-的链接
 if (locationHerf.indexOf('-') != -1) {
     locationHerf = locationHerf.replace('index-en.html', '')
     $(".href_a").attr("href", locationHerf);
 }

localStorage.setItem("language", "english");

if (invitation_code == null || invitation_code == undefined || invitation_code == "") {
    invitation_code = '';
}

if (!localStorage.getItem("hide")) {
    $('.activity').removeClass('hide');
    localStorage.setItem("hide", 0);
}

// 侧导航
$("#icon_aside").click(function() {
    $(".aside").removeClass("hide");
})
$(".aside_mask").click(function() {
    $(".aside").addClass("hide");
})


// 弹出层分享链接
// $(".lianjie").click(function () {
//     $(".ceng").removeClass("hide");
//     $(".aside").addClass("hide");

//     // $('.copy').html(invite_code);
//     // $(".aside1").removeClass("hide1");
// })
$(".xx").click(function() {
    $(".ceng").addClass("hide");
})

// 活动规则
$('#guize').click(function() {
    $('.activity').removeClass('hide');
})
$('.activity_3').click(function() {
    $('.activity').addClass('hide');
})


// 投资
$('.tou').click(function() {
        $('.shu').html($(this).find('span').text());
        // $(".oneAmount").html($(this).find('span').text() * $(".advanceRatio").html());
    })
    // +-
$('.jia').click(function() {
    if ($('.shu').text() >= 1 && $('.shu').text() != 30) {
        $('.shu').text(Number($('.shu').text()) + 1);
        // $(".oneAmount").html(($('.shu').html() * $(".advanceRatio").html()).toFixed(1));
    } else if ($('.shu').text() == 30) {
        $('.shu').text(30);
        // $(".oneAmount").html(30 * $(".advanceRatio").html());
    }
})
$('.jian').click(function() {
    if ($('.shu').text() >= 2) {
        $('.shu').text(Number($('.shu').text()) - 1);
        // $(".oneAmount").html(($('.shu').html() * $(".advanceRatio").html()).toFixed(1));
    } else if ($('.shu').text() == 1) {
        $('.shu').text(1);
        // $(".oneAmount").html($(".advanceRatio").html());
    }

})

// 链接插件
window.addEventListener('load', async() => {
    // Modern dapp browsers... 现代DAPP浏览器…

    if (window.ethereum) {
        window.web3 = new Web3(ethereum);

        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            // alert("1")

            web3.version.getNetwork((err, netId) => {
                net_id = netId
                switch (netId) {
                    case "1":
                        // alert('This is mainnet')
                        break
                    case "2":
                        // alert('This is the deprecated Morden test network.')
                        break
                    case "3":
                        // alert('This is the ropsten test network.')
                        break
                    case "4":
                        // alert('This is the Rinkeby test network.')
                        break
                    case "42":
                        // alert('This is the Kovan test network.')
                        break
                    default:
                        // alert('This is an unknown network.')
                }
            })

            // 账户账号
            account = web3.eth.accounts[0];

            loginFun(account, invitation_code);

            // 投资
            $("#button").click(function() {
                if (!$('.parentCode').html()) {
                    layer_msg("Referrer not yet attached.")
                    return false;
                }

                var url = '';
                if (identity == "" || identity == undefined || identity == null) {
                    layer_msg("Please refresh and retry")
                    return false;
                }

                if (net_id != "1") {
                    layer_msg("Please switch to the main network")
                    return false;
                }

                if (isQueueInvest == 0) {
                    url = '/api/investment/pay';
                } else {
                    url = '/api/investment/queue';
                }

                var value = parseFloat($('.oneAmount').text()) * 1000000000000000000;
                if (value < 0) {
                    //提示
                    layer_msg("Digital error")
                    return false;
                }

                if (currentPosition > 30) {
                    layer_msg("The amount of single account investment shall not exceed 30ETH.")
                    return
                }

                loadding();
                var zhuanzhang = parseInt($('.shu').text()) * 1000000000000000000;

                //2、调用排单
                eppContract.investIn(zhuanzhang, {
                    from: account,
                    value: zhuanzhang
                }, function(error, hash) {
                    layer.closeAll();
                    if (error == null) {
                        console.log("hash:" + hash);
                        layer_msg("Broadcast transaction");
                        // setTimeout(function() {
                        //     budan()
                        // }, 20000);
                        loginFun(account, invitation_code);
                        // $(".oneAmount").html(($('.shu').html() * $(".advanceRatio").html()).toFixed(1));
                    } else {
                        console.log("error:" + error);
                        layer_msg("Please try again");
                    }
                });
            })


            // 补单

            $(".shua").click(function() {
                budan();
                loginFun(account, invitation_code);
            })

        } catch (error) {
            // User denied account access... 用户拒绝帐户访问…
        }
    }
    // Legacy dapp browsers... 传统的DAPP浏览器…
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({ /* ... */ });
    }
    // Non-dapp browsers... 非DAPP浏览器…
    else {
        $('.Tip').html('Non-ethernet browser detected. Please install MetaMask first!');
        // alert('检测到非以太坊浏览器. 你应该考虑试试安装 MetaMask!');
    }
});



//余额提现
$('#redeem').click(function() {
    if ($('.allInvestHide').html() != 0) {
        loadding();
        postFun('/api/withdrawal/redeem', {}, function(req) {
            layer.closeAll();
            if (req.basic.status == "1") {
                layer_msg(req.basic.msg);
                loginFun(account, invitation_code);
            } else {
                layer_msg(req.basic.msg);
            }
        })
    } else {
        layer_msg('You are not in the game yet. Please bet and try again!');
    }
})

$('.profit').click(function() {
    layer.open({
        type: 1,
        title: 'Tips' //不显示标题栏
            ,
        closeBtn: false,
        area: '300px;',
        shade: 0.8,
        id: 'LAY_layuipro' //设定一个id，防止重复弹出
            ,
        btn: ['Yes', 'No'],
        btnAlign: 'c',
        moveType: 1 //拖拽模式，0或者1
            ,
        content: 'Are you sure you want to withdraw all your money?',
        success: function(layero) {
            var btn = layero.find('.layui-layer-btn');
            btn.find('.layui-layer-btn0').click(function() {
                if ($('.allInvestHide').html() != 0) {
                    loadding();
                    postFun('/api/withdrawal/profit', {}, function(req) {
                        layer.closeAll();
                        if (req.basic.status == "1") {
                            layer_msg(req.basic.msg);
                            loginFun(account, invitation_code);
                        } else {
                            layer_msg(req.basic.msg);
                        }
                    })
                } else {
                    layer_msg('You are not in the game yet. Please bet and try again!');
                }
            })
        }
    });

})

$('#futou').click(function() {
    if ($('.allInvestHide').html() != 0) {
        loadding();
        postFun('/api/investment/rePay', {}, function(req) {
            layer.closeAll();
            if (req.basic.status == "1") {
                layer_msg(req.basic.msg);
                loginFun(account, invitation_code);
            } else {
                layer_msg(req.basic.msg);
            }
        })
    } else {
        layer_msg('You are not in the game yet. Please bet and try again!');
    }

})

$('.guoqi').click(function() {

    localStorage.setItem("language", "chinese");

})

$('.tips').click(function(event) {
    layer.open({
        type: 1,
        shade: false,
        title: false, //不显示标题
        content: 'Every Christmas, there will be a grand ethereal gold medal event, where players can use ethereal gold to win the ETH high prize, and have the opportunity to obtain the ethereal eternal pass, become a member of the ethereal eternal ecology of the permanent net body matrix, and get the amazing exclusive benefits.', //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        cancel: function() {
            layer.closeAll();
        }
    });
});

$('#chouj').click(function() {
    $(".tit").html('');
    $(".ht").html('');
    if ($('.allInvestHide').html() != 0) {
        loadding();
        postFun('/api/lottery/join ', {}, function(req) {
            layer.closeAll();
            if (req.basic.status == "1") {
                $(".ceng").removeClass("hide");
                $(".aside").addClass("hide");
                if (req.data.prize.prizeValue == 0) {
                    $(".tit").html('Thank you for your patronage!');
                } else {
                    $(".tit").html('Congratulations on your winning!');
                    $(".ht").html('You got it' + req.data.prize.prizeValue + 'ETH，Your wallet has been put in. Please check it carefully.');
                }
                loginFun(account, invitation_code);
            } else {
                layer_msg(req.basic.msg);
                loginFun(account, invitation_code);
            }
        })
    } else {
        layer_msg('You are not in the game yet. Please bet and try again!');
    }

})

function budan() {
    // setTimeout(function(){
    postFun('/api/investment/queueList', {
        page: 1,
        pageSize: 100,
    }, function(req) {
        if (req.basic.status == "1") {
            layer.closeAll();
            var html = ""
            var data = req.data.list;

            if (data.length > 0) {
                $(".title-1,.shua,.bubox").show();
                for (i = 0; i < data.length; i++) {
                    html += '<div class="ellipse">'
                    if (data[i].status == 0) {
                        html += '<h2><span class="jin">Total bet：' + data[i].allAmount + ' ETH</span><span class="zh" >Row in the single</span></h2>' +
                            '<h2><span class="jin"> Investment amount：' + data[i].oneAmount + ' ETH</span><span>&nbsp;</span></h2>'
                    } else if (data[i].status == 1) {
                        html += '<h2><span class="jin">Total bet：' + data[i].allAmount + ' ETH</span><span class="tudan_btn btn"  data="' + data[i].id + '" money="' + (data[i].allAmount - data[i].oneAmount) + '">Pay </span></h2>' +
                            '<h2><span class="jin" style="width:100%;"> Investment amount：' + data[i].oneAmount + ' ETH</span><span>&nbsp;</span></h2>' +
                            '<h2><span class="jin" style="width:100%;">Remaining amount：' + (data[i].allAmount - data[i].oneAmount) + ' ETH</span><span>&nbsp;</span></h2>'

                    } else {
                        html += '<h2><span class="jin">Total bet：' + data[i].allAmount + ' ETH</span><span class="zh" >Have been betting</span></h2>' +
                            '<h2><span class="jin"> Investment amount：' + data[i].oneAmount + ' ETH</span><span>Remaining amount：' + (data[i].allAmount - data[i].oneAmount) + ' ETH</span></h2>'
                    }
                    html += '</div>'
                }
                $(".bubox").html(html);

                $(".tudan_btn").click(function() {
                    var id = $(this).attr("data");
                    var money = $(this).attr("money") * 1000000000000000000;
                    //调用补单
                    eppContract.investInAppend(id, {
                        from: account,
                        value: money
                    }, function(error, hash) {
                        if (error == null) {
                            console.log("hash:" + hash);
                            layer_msg("Broadcast transaction");
                            setTimeout(function() {
                                budan()
                            }, 20000);
                        } else {
                            console.log("error:" + error);
                            layer.closeAll();
                            layer_msg("Please try again");
                        }
                    });
                })
            } else {
                $(".title-1,.shua,.bubox").hide();
                $(".bubox").empty();
            }



        } else {
            layer_msg(req.basic.msg);
        }
    })

}

function loginFun(account, invitation_code) {
    postFun('/api/login', {
        address: account,
        invitationCode: invitation_code
    }, function(req) {
        if (req.basic.status == "1") {
            receiveAddress = req.data.receiveAddress
            invitation_code = req.data.inviteCode;
            identity = req.data.identity;
            currentPosition = req.data.currentPosition;
            isQueueInvest = req.data.isQueueInvest;

            // $('.advanceRatio').html(req.data.advanceRatio);
            // $(".oneAmount").html((req.data.advanceRatio * $(".shu").html()).toFixed(1));
            $('.Invitation').html(req.data.invitationUrl); //链接地址

            $('.inviteCode').html(req.data.inviteCode); //邀请码
            $('.staticLevel').html('Lv ' + req.data.staticLevel); //分红等级
            $('.dynamicLevel').html('Lv ' + req.data.dynamicLevel); //节点等级
            $('.reInvestCount').html(req.data.reInvestCount); //复投次数
            $('.luckyDrawTime').html(req.data.luckyDrawTime); //抽奖次数
            $('.parentCode').html(req.data.parentCode); //推荐人
            $('.allInvest').html(req.data.allInvest + ' ETH'); //总投资
            $('.allInvestHide').html(req.data.allInvest); //隐藏
            $('.inviteAmount').html(req.data.inviteAmount); //邀请人数
            $('.comuitityNumber').html(req.data.comuitityNumber); //网体人数
            $('.gold').html(req.data.gold); //以太金币
            $('.allEarnings').html(req.data.allEarnings); //总收益
            $('.currentPosition').html(req.data.currentPosition); //当前持仓
            $('.allStaticAmount').html(req.data.allStaticAmount); //投注分红
            $('.allDynamicAmount').html(req.data.allDynamicAmount); //节点收益
            $('.unlockAmount').html(req.data.unlockAmount); //静态分红可提现余额
            $('.withdrawalAmount').html(req.data.withdrawalAmount); //节点可提现余额
            $('.allBets').html(req.data.allBets); //所有投资
            $('.coefficient').html('x' + req.data.coefficient); //分红倍数
            $('.supporter').html(req.data.supporter || '0'); //伴随者基金
            $('.hisSupporterAmount').html(req.data.hisSupporterAmount || '0'); //累计基金分红
            $('.queueAmount').html(req.data.queueAmount + ' ETH' || '0 ETH'); //排单金额
            $('.comuitityPerformance').html(req.data.comuitityPerformance + ' ETH' || '0 ETH'); //网体业绩

            if (localStorage.getItem("identity") != identity) {
                localStorage.setItem("identity", req.data.identity);
            }

            if (req.data.isQueueInvest == 0) {
                $(".tz").show();
            } else {
                $(".pd").show();
            }
            // 邀请好友
            $("#copy_button").click(function() {
                // 复制链接
                var invite_code = req.data.invitationUrl;
                var clipboard = new Clipboard('#copy_button', {
                    text: function() {
                        return invite_code;
                    }
                });
                clipboard.on('success', function(e) {
                    layer_msg("Replication success ");
                });
                clipboard.on('error', function(e) {
                    layer_msg("copy failed");
                });
            })

            // budan();

            if(eppContract==null){
                                eppContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"coeff","type":"uint256"}],"name":"setCoefficient","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"financial","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"investId","type":"string"}],"name":"investInAppend","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"reInvestIn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"start","type":"uint256"},{"name":"end","type":"uint256"}],"name":"calDynamicProfit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getGameInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceWhitelistAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"code","type":"string"}],"name":"isUsed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"removeWhitelistAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addWhitelistAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"userAddr","type":"address"}],"name":"calStaticProfit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawProfit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"code","type":"string"}],"name":"getUserAddressByCode","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"},{"name":"money","type":"uint256"}],"name":"sendMoneyToUserNew","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"inviteCode","type":"string"},{"name":"referrer","type":"string"}],"name":"registerUserInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"indexMapping","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isWhitelistAdmin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"lotteryJoin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"time","type":"uint256"}],"name":"activeGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"investIn","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"roundId","type":"uint256"},{"name":"i","type":"uint256"}],"name":"getUserInfo","outputs":[{"name":"ct","type":"uint256[17]"},{"name":"inviteCode","type":"string"},{"name":"referrer","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"uid","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"},{"indexed":false,"name":"inviteCode","type":"string"},{"indexed":false,"name":"referrer","type":"string"},{"indexed":false,"name":"typeFlag","type":"uint256"}],"name":"LogInvestIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"uid","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"LogWithdrawProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"uid","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"now","type":"uint256"}],"name":"LogRedeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"WhitelistAdminAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"WhitelistAdminRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]).at(req.data.receiveAddress);
                            }

        } else {
            layer_msg(req.basic.msg);
        }

    })

}