/**
 * ����ʱ���
 * author: breezefeng
 * @param {string} endTime ����ʱ��,��ʽΪ(20151225000000)
 * @param {object} config
 * {
 *      dayBox:  document.getElementById('day'),//������ʾ����(��������ʾ)
 *      hourBox: document.getElementById('hour'),//Сʱ��ʾ����(��������ʾ)
 *      miniBox: document.getElementById('mini'),//������ʾ����(��������ʾ)
 *      secBox:  document.getElementById('sec'),//������ʾ����(��������ʾ)
 *      everyCallback: function () {},//ÿ�θ���ʱ��Ļص�
 *      endCallback: function () {},//����ʱ����ʱ�Ļص�
 *      interval: 1                 //����ʱʱ������Ĭ��1����µ���ʱʱ��
 * }
 */
function countDown(endTime, config) {
    var emptyFn = function () {},
        reg = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
        arr = reg.exec(endTime);

    endTime = Date.UTC(arr[1] - 0, arr[2] - 1, arr[3] - 0, arr[4] - 0, arr[5] - 0, arr[6] - 0);

    config = $.extend({
        everyCallback: emptyFn,
        endCallback: emptyFn,
        interval: 1
    }, config);

    var _private = {
        zero: function (n) {
            if (n > 0) {
                if (n < 10) {
                    n = '0' + n
                }
                return String(n);
            } else {
                return '00';
            }
        },
        render: function (pms) {
            var hours = parseInt(pms.hour);

            config.dayBox ? $(config.dayBox).html(pms.day) : (hours += parseInt(pms.day) * 24);

            config.hourBox && $(config.hourBox).html(_private.zero(hours));

            config.miniBox && $(config.miniBox).html(pms.mini);

            config.secBox && $(config.secBox).html(pms.sec);
        },
        timer: function () {
            var future = new Date(endTime), now = new Date(),
                dur = Math.round((future.getTime() - now.getTime()) / 1000) + future.getTimezoneOffset() * 60,
                pms = {
                    day: '00',
                    hour: '00',
                    mini: '00',
                    sec: '00'
                };

            if (dur > 0) {
                pms.day = Math.floor((dur / 86400)) > 0 ? _private.zero(Math.floor((dur / 86400)) % 30) : "00";
                pms.hour = Math.floor((dur / 3600)) > 0 ? _private.zero(Math.floor((dur / 3600)) % 24) : "00";
                pms.mini = Math.floor((dur / 60)) > 0 ? _private.zero(Math.floor((dur / 60)) % 60) : "00";
                pms.sec = _private.zero(dur % 60);

                config.everyCallback(dur);

                setTimeout(function () {
                    _private.timer();
                }, config.interval * 1000);
            } else {
                config.endCallback();
            }
            _private.render(pms);
        }
    };

    _private.timer();
}