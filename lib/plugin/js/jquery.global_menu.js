;(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }

}(function($) {
  'use strict';

  let GlobalMenu = {};
  TestPlugin = (function() {
    let instance_uid = 0;

    function GlobalMenu(elem, settings) {
      let _ = this;

      _.$elem = elem;

      // fixed value settings
      _.settings = $.extend(true, {
        submenu : {
          is_active : false,
          accordion : {
            menu_width : {
              is_active : false,
              min_width : 220,
              max_width : 350
            }
          }
        },
        scroll_fix : {
          is_active : false,
          active_y : parseInt($(elem).offset().top + $(elem).height()),
          view_out : false
        }
      }, settings);


      // sub menu css class name
      _.submenu_class = {
        accordion : {
          item : 'gm_accordion',
          body : 'gm_accordion_body',
        },
        mega : {
          item : 'gm_mega',
          body : 'gm_mega_body'
        }
      }

      _.instance_uid = instance_uid++;

      // init on load
      _.init_on_load();
    }

    return GlobalMenu;
  }());



  /** ----------------------------------------------------------------------------
   * init on load
   *----------------------------------------------------------------------------*/
  GlobalMenu.prototype.init_on_load = function() {
    let _ = this,
        _s = _.settings;

    // prevent animation
    _.$elem.addClass('is_preloaded');

    // add scroll event when scroll fix is active
    if(_s.scroll_fix.is_active) {
      $(window).trigger('scroll');
    }
  };


  /** ----------------------------------------------------------------------------
   * global menu
   *----------------------------------------------------------------------------*/
  GlobalMenu.prototype.global_menu = function() {
    let _ = this,
        _s = _.settings;

    if(_s.submenu.is_active){
      // job for submenu
      _.manage_submenu();

      if(_s.submenu.accordion.menu_width.is_active){
        // job for accordion　menu　width
        _.change_accordion_menu_width();
      }
    }

    if(_s.scroll_fix.is_active){
      if(_s.scroll_fix.view_out.is_active){
        _.gm_position_fixed_view_out();
      }else{
        _.gm_position_fixed();
      }
    }
  };


  /** ----------------------------------------------------------------------------
   * sub menu
   *----------------------------------------------------------------------------*/
  /** --------------------------------------
   * sub menu
   *--------------------------------------*/
  GlobalMenu.prototype.manage_submenu = function() {
    let _ = this;

    _.submenu_job[
      _.is_touch_display()? 'click' : 'hover'
    ](_);

    _.submenu_job.close(_);
  };

  GlobalMenu.prototype.submenu_job = {
    init : function(self , event_obj) {
      let _ = self;

      $(_.$elem).find(_.get_submenu()).each(function(){

        if(
          typeof event_obj !== 'undefined'
          && this == event_obj
        ) return;

        $(this).removeClass('is_show');

      });
    },
    click : function(self) {
      let _ = self,
          flag = true;

      $(_.$elem).find(_.get_submenu()).on('click', function(){
        if(flag == false) return;
        flag = false;
        setTimeout(function(){ flag = true; }, 500);

        _.submenu_job.init(_, this);

        $(this).toggleClass('is_show');

      });
    },
    hover : function(self) {
      let _ = self;

      $(_.$elem).find(_.get_submenu()).on('mouseover', function(){

        _.submenu_job.init(_, this);
        $(this).addClass('is_show');

      });
    },
    close : function(self) {
      let _ = self;

      $(_.$elem).on('mouseleave', function(){
        _.submenu_job.init(_);
      });
    }
  };


  /** --------------------------------------
   * change accordion menu width
   *--------------------------------------*/
  GlobalMenu.prototype.change_accordion_menu_width = function() {
    let _ = this,
        _s = _.settings,
        _a = _s.submenu.accordion,
        li_anchor = $(_.$elem).find('.gm_accordion_body li a');

    $(_.$elem).find('.gm_accordion_body').each(function(){
      $(this).css(
        'width'
        , _.get_accordion_menu_width(

          $(this).children('li'),
          {
            'font_size' : li_anchor.css('font-size'),
            'letter_spacing' : li_anchor.css('letter-spacing'),
            'padding_left' : li_anchor.css('padding-right'),
            'padding_right' : li_anchor.css('padding-left')
          }

        )

      );
    });

  };

  GlobalMenu.prototype.get_accordion_menu_width = function(list_items, css_obj) {
    let _ = this,
        _s = _.settings,
        width = _s.submenu.accordion.menu_width.min_width,
        max_width = _s.submenu.accordion.menu_width.max_width;

    list_items.each(function(){
      let span = document.createElement('span');
      $(span).css({
        'font-size' : css_obj.font_size,
        'letter-spacing' : css_obj.letter_spacing,
        'padding-left' : css_obj.padding_left,
        'padding-right' : css_obj.padding_right,
        'display' : 'none',
        'white-space' : 'nowrap'
      });

      $(span).append($(this).text());
      $('body').append(span);

      //小数点が切捨てられるため
      let span_outer_width = $(span).outerWidth();

      if(width < span_outer_width){
        width = span_outer_width;
      }

      if(
        max_width > 0
        && max_width < span_outer_width
      ){
        width = max_width;
        return;
      }

      $(span).remove();
    });

    return width;

  }

  /** --------------------------------------
   * position fixed
   *--------------------------------------*/
  GlobalMenu.prototype.gm_position_fixed = function() {
    let _ = this,
        _s = _.settings,
        _sf = _s.scroll_fix,
        is_fixed = 'is_fixed',
        gm_inner = $(_.$elem).find('.gm_inner');

    $(window).on('scroll', function(){
      if(_sf.active_y < $(window).scrollTop()){
        gm_inner.addClass(is_fixed);

      }else{
        gm_inner.removeClass(is_fixed);
      }
    });
  }

  GlobalMenu.prototype.gm_position_fixed_view_out = function() {
    let _ = this,
        _s = _.settings,
        _sf = _s.scroll_fix,
        is_fixed = 'is_fixed',
        gm_inner = $(_.$elem).find('.gm_inner'),
        is_view_out = 'is_view_out',
        last_position = 0,
        curr_position = 0;

    $(window).on('scroll', function(){
      if(_sf.active_y < $(window).scrollTop()){

        curr_position = $(this).scrollTop();

        if ( curr_position <= last_position ) {

          gm_inner.removeClass(is_view_out);
          gm_inner.addClass(is_fixed);

        } else {
          gm_inner.addClass(is_view_out);
        }

        last_position = curr_position;

      }else{
        gm_inner.removeClass(is_fixed + ' ' + is_view_out);

      }

    });
  }



  /** ----------------------------------------------------------------------------
   * other
   *----------------------------------------------------------------------------*/
  GlobalMenu.prototype.get_submenu = function() {
    let _ = this,
        _s = _.settings,
        selector = '',
        cnt = 0;

    $.each(_.submenu_class, function(index, value) {
      if(cnt >= 1) selector += ', ';

      selector += '.' + value.item;
      cnt ++;
    });

    return selector;
  };

  GlobalMenu.prototype.is_touch_display = function() {
    return window.ontouchstart !== undefined
      && 0 < navigator.maxTouchPoints;
  };



  /** ----------------------------------------------------------------------------
   * Plugin wrapper
   *----------------------------------------------------------------------------*/
  /**
   * @return {any} plugin method return value
   * @return {object} options
   */
  $.fn.global_menu = function(options){
    let _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;

    for (i = 0; i < l; i++) {

      if (typeof opt == 'object' || typeof opt == 'undefined'){

        // Initialize the plugin
        _[i].global_menu = new GlobalMenu(_[i], opt);

      }else{

        // Call method on the plugin instance
        ret = _[i].global_menu[opt].apply(_[i].global_menu, args);

        // When method has return job, return it
        if (typeof ret != 'undefined') return ret;
      }

    };

    // options object
    return _;

  };
}));
