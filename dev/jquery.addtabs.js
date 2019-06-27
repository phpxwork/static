/**
 * http://git.oschina.net/hbbcs/bootStrap-addTabs
 * Created by joe on 2015-12-19.
 * Modified by Karson
 */

(function ($) {
    //刷新Addtabs
    $.fn.refreshAddtabs = function () {
        var navobj = $(this);
        var dropdown = $(".tabdrop", navobj);
        if (dropdown.size() === 0) {
            dropdown = $('<li class="dropdown pull-right hide tabdrop"><a class="dropdown-toggle" data-toggle="dropdown" href="javascript:;">' +
                '<i class="glyphicon glyphicon-align-justify"></i>' +
                ' <b class="caret"></b></a><ul class="dropdown-menu"></ul></li>');
            dropdown.prependTo(navobj);
        }

        //检测是否有下拉样式
        if (navobj.parent().is('.tabs-below')) {
            dropdown.addClass('dropup');
        }

        var collection = 0;
        var maxwidth = navobj.width() - 55;

        var liwidth = 0;
        //检查超过一行的标签页
        var litabs = navobj.append(dropdown.find('li')).find('>li').not('.tabdrop');
        var totalwidth = 0;
        litabs.each(function () {
            totalwidth += $(this).outerWidth(true);
        });
        if (navobj.width() < totalwidth) {
            litabs.each(function () {
                liwidth += $(this).outerWidth(true);
                if (liwidth > maxwidth) {
                    dropdown.find('ul').append($(this));
                    collection++;
                }
            });
            if (collection > 0) {
                dropdown.removeClass('hide');
                if (dropdown.find('.active').length === 1) {
                    dropdown.addClass('active');
                } else {
                    dropdown.removeClass('active');
                }
            }
        } else {
            dropdown.addClass('hide');
        }

    };
})(jQuery);
