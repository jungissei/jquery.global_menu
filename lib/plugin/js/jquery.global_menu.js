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
  GlobalMenu = (function() {
    let instance_uid = 0;

    function GlobalMenu(elem, settings) {
      let _ = this;

      _.$elem = $(elem);

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
        scroll : {
          down_fix : false,
          up_hide : false
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
      _.fixed_active_position;


      // init on load
      _.init_on_load();

      _.global_menu();
    }

    return GlobalMenu;
  }());



  /** ----------------------------------------------------------------------------
   * init on load
   *----------------------------------------------------------------------------*/
  GlobalMenu.prototype.init_on_load = function() {
    let _ = this;

    // prevent animation
    _.$elem.addClass('is_preloaded');

    // add scroll event when scroll fix is active
    if(_.settings.scroll.down_fix) {
      $(window).trigger('scroll');
    }
  };


  /** ----------------------------------------------------------------------------
   * global menu
   *----------------------------------------------------------------------------*/
  GlobalMenu.prototype.global_menu = function() {
    let _ = this;

    if(_.settings.submenu.is_active){
      // job for submenu
      _.manage_submenu();

      if(_.settings.submenu.accordion.menu_width.is_active){

        // job for accordion menu width
        _.change_accordion_menu_width();
      }
    }

    if(_.settings.scroll.down_fix){
      if(_.settings.scroll.up_hide){
        _.scroll_to_fixed_hide();
      }

      if(!_.settings.scroll.up_hide){
        _.scroll_down_to_fixed();
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
    ].bind(_)();

    _.submenu_job.close.bind(_)();
  };

  GlobalMenu.prototype.submenu_job = {
    init : function(event_obj) {
      let _ = this;

      $(_.$elem).find(_.get_submenu()).each(function(){

        if(
          typeof event_obj !== 'undefined'
          && this == event_obj
        ) return;

        $(this).removeClass('is_show');

      });
    },
    click : function() {
      let _ = this,
          flag = true;

      $(_.$elem).find(_.get_submenu()).on('click', function(e){
        e.preventDefault();

        if(flag == false) return;
        flag = false;
        setTimeout(function(){ flag = true; }, 500);

        _.submenu_job.init.bind(_)(this);

        $(this).toggleClass('is_show');

      });
    },
    hover : function() {
      let _ = this;

      $(_.$elem).find(_.get_submenu()).on('mouseover', function(){

        _.submenu_job.init.bind(_)(this);
        $(this).addClass('is_show');

      });
    },
    close : function() {
      let _ = this;

      $(_.$elem).on('mouseleave', function(){
        _.submenu_job.init.bind(_)();
      });
    }
  };


  /** --------------------------------------
   * change accordion menu width
   *--------------------------------------*/
  GlobalMenu.prototype.change_accordion_menu_width = function() {
    let _ = this,
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
        width = _.settings.submenu.accordion.menu_width.min_width,
        max_width = _.settings.submenu.accordion.menu_width.max_width;

    list_items.each(function(){
      let $span = $(document.createElement('span'));
      $span
        .css({
          'font-size' : css_obj.font_size,
          'letter-spacing' : css_obj.letter_spacing,
          'padding-left' : css_obj.padding_left,
          'padding-right' : css_obj.padding_right,
          'display' : 'none',
          'white-space' : 'nowrap'
        })
        .append($(this).text());

      $('body').append($span);

      let span_outer_width = $span.outerWidth();

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

      $span.remove();
    });

    return width;

  }

  /** --------------------------------------
   * Scroll down to fixed
   *--------------------------------------*/
  GlobalMenu.prototype.scroll_down_to_fixed = function() {
    let _ = this,
        curr_position;

    _.fixed_active_position = parseInt(_.$elem.offset().top + _.$elem.height());

    $(window).on('scroll', function(){
      curr_position = $(this).scrollTop();

      _.scroll_down_to_fixed_jobs[
        _.fixed_active_position < curr_position?
          'fixed' : 'unfixed'
      ].bind(_)();
    });
  }

  GlobalMenu.prototype.scroll_down_to_fixed_jobs = {
    unfixed : function(){
      let _ = this;

      _.fixed_active_position = parseInt(_.$elem.offset().top + _.$elem.height());

      _.$elem.find('.gm_inner')
        .removeClass('is_fixed');

      _.$elem.css({
        'height' : ''
      });

      _.$elem.trigger('global_menu_unfixed');

    },
    fixed : function(){
      let _ = this;

      _.fixed_active_position = parseInt(_.$elem.offset().top);

      _.$elem.css('height', _.$elem.height());

      _.$elem.find('.gm_inner')
        .addClass('is_fixed');

      _.$elem.trigger('global_menu_fixed');
    }
  }



  /** --------------------------------------
   * Scroll up to fix global menu, scroll down to hide it
   *--------------------------------------*/
  GlobalMenu.prototype.scroll_to_fixed_hide = function() {
    let _ = this,
        curr_position,
        last_position = $(window).scrollTop();

    _.fixed_active_position = parseInt(_.$elem.offset().top + _.$elem.height());

    $(window).on('scroll', function(){
      curr_position = $(this).scrollTop();

      _.scroll_to_fixed_hide_job[
        _.fixed_active_position < curr_position?
          'fixed' : 'unfixed'
      ].bind(_)();

      if(
        _.fixed_active_position < curr_position &&
        last_position !== curr_position
      ){
        _.scroll_to_fixed_hide_job[
          last_position < curr_position?
            'hide' : 'show'
        ].bind(_)();
      }

      last_position = curr_position;
    });
  }

  GlobalMenu.prototype.scroll_to_fixed_hide_job = {
    unfixed : function(){
      let _ = this;

      _.fixed_active_position = parseInt(_.$elem.offset().top + _.$elem.height());

      _.$elem.find('.gm_inner')
        .removeClass('is_fixed is_scroll_hide is_scroll_show')
        .css({
          'transition' : '',
          'margin-top' : ''
        });

      _.$elem.css({
        'height' : ''
      });

      _.$elem.trigger('global_menu_unfixed');
    },
    fixed : function(){
      let _ = this;

      _.fixed_active_position = parseInt(_.$elem.offset().top);

      _.$elem.css('height', _.$elem.height());

      _.$elem.find('.gm_inner')
        .addClass('is_fixed');

      _.$elem.trigger('global_menu_fixed');
    },
    show : function(){
      let _ = this;

      _.$elem.find('.gm_inner')
        .removeClass('is_scroll_hide')
        .addClass('is_scroll_show')
        .css({
          'transition' : 'margin-top 0.2s',
          'margin-top' : 0
        });

      _.$elem.trigger('global_menu_scroll_show');
    },
    hide : function(){
      let _ = this,
          $inner = _.$elem.find('.gm_inner');

      $inner
        .removeClass('is_scroll_show')
        .addClass('is_scroll_hide')
        .css('margin-top', -($inner.outerHeight()));


      _.$elem.trigger('global_menu_scroll_hide');
    }
  }





  /** ----------------------------------------------------------------------------
   * other
   *----------------------------------------------------------------------------*/
  GlobalMenu.prototype.get_submenu = function() {
    let _ = this,
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
  $.fn.global_menu = function(){
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
