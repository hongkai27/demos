!function () {
    let text =
        `/*首先黄色的皮肤已经准备好了，我们需要一只鼻子*/
    .nose{
        border: 12px solid;
        width: 0px;
        height: 0px;
        border-radius: 12px;
        border-color: black transparent transparent;
        position: absolute;
        top: 92px;
        left: 185px;
        margin-left: -6px;
    }
    /*然后是眼睛*/
    .eye{
        width: 50px;
        height: 50px;
        background: #131212;
        border-radius: 50%;
        position: absolute;
    }
    /*顺便把眼珠也画好吧*/
    .eye::after{
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        left: 9px;
        top: 2px;
        border: 1px solid black;
    }
    .left.eye{
        top: 48px;
        left: 70px;
    }
    .right.eye{
        top: 48px;
        right: 70px;
    }
    /*接下来是可爱的腮红*/
    .face{
        width: 66px;
        height: 66px;
        background: #eb0818;
        border: 1px solid black;
        border-radius: 50%;
        position: absolute;
    }
    .left.face{
        top: 132px;
        left: 22px;
    }
    .right.face{
        top: 132px;
        right: 22px;
    }
    /*要画它的上嘴唇了*/
    .upperLip{
        width: 78px;
        height: 24px;
        z-index: 1;
        border: 2px solid black;
        background: #fee433;
        position: absolute;
        border-top: transparent;
    }
    .left.upperLip{
        top: 130px;
        left: 112px;
        transform: rotate(-20deg);
        border-bottom-left-radius: 46px 24px;
        border-right: transparent;
    }
    .right.upperLip{
        top: 130px;
        right: 100px;
        transform: rotate(20deg);
        border-bottom-right-radius: 46px 24px;
        border-left: transparent;
    }
    /*嘴巴内部比较难画，没办法，试着做一下吧*/
    .lowLip{
        width: 140px;
        height: 400px;
        position: absolute;
        background: #990513;
        bottom: 0;
        border-radius: 118px/300px;
        left: 8px;
        overflow: hidden;
    }
    /*别忘了还有舌头*/
    .lowLip::after{
        content: '';
        width: 102px;
        height: 78px;
        background: #fc4a62;
        left: 18px;
        bottom: 0;
        position: absolute;
        border-radius: 144px/118px;
    }`

    writeCode(text)

    /*................................ */
    var duration = 50
    function writeCode(code) {
        let preCode = document.querySelector('.code')
        let styleCode = document.querySelector('#styleCode')
        let n = 0
        setTimeout(function run() {
            n += 1
            styleCode.innerHTML = code.substring(0, n)
            preCode.innerHTML = Prism.highlight(code.substring(0, n), Prism.languages.css)
            preCode.scrollTop = preCode.scrollHeight
            if (n < code.length) {
                setTimeout(run, duration)
            } else {

            }
        }, duration)
    }

    $('.actions').on('click', 'button', function (x) {
        let $button = $(x.currentTarget)
        let speed = $button.attr('data-speed')//从data里面拿到需要的数据
        $button.addClass('active').siblings('.active').removeClass('active')
        switch (speed) {
            case 'slow':
                duration = 100
                break
            case 'normal':
                duration = 50
                break
            case 'fast':
                duration = 10
                break
        }
    })
}.call()

