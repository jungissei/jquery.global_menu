(function($) {
  'use strict';

  let GlobalMenu = {};
  GlobalMenu = (function(elem, settings) {
    this.$elem = elem;

    // fixed value settings
    this.settings = $.extend(true, {
      elem : elem
      , gm_area : 'gm_area'
      , gm_inner : 'gm_inner'
      , submenu : {
        is_active : false
        , accordion : {
          item : 'gm_accordion'
          , body : 'gm_accordion_body'
          , menu_width : {
            is_active : false
            , min_width : 220
            , max_width : 350
          }
        }
        , mega : {
          item : 'gm_mega'
          , body : 'gm_mega_body'
        }
      }
      , scroll_fix : {
        is_active : false
        , active_y : parseInt($(elem).offset().top + $(elem).height())
        , is_fixed : 'is_fixed'
        , view_out : {
          is_active : false
          , is_view_out : 'is_view_out'
        }
      }
    }, settings);


    this.init_on_load();
  });


  /** ----------------------------------------------------------------------------
   * init on load
   *----------------------------------------------------------------------------*/
  GlobalMenu.prototype.init_on_load = function() {
    let _ = this,
        _s = _.settings;

    // prevent animation
    _.$elem.addClass('is_preloaded');

    // add scroll event when scroll fix is active
    if(_.settings.scroll_fix.is_active) {
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
      _.add_submenu_job();

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
  GlobalMenu.prototype.init_submenu = function(event_obj) {
    let _ = this,
        _s = _.settings;

    $(_.$elem)
      .find(_.get_submenu())
        .each(function(){

          if(typeof event_obj !== 'undefined' && this == event_obj) return;

          $(this)
            .removeClass('is_show');
    });
  };

  GlobalMenu.prototype.add_submenu_job = function() {
    let _ = this,
        _s = _.settings;

    _.submenu_job[
      _.is_touch_display()?
          'toggle' : 'show'
    ]();

    $(_.$elem)
      .on('mouseleave', function(){
        _.init_submenu();
    });

  };

  GlobalMenu.prototype.submenu_job.toggle = function() {
    let _ = this,
        _s = _.settings,
        flag = true;

    $(_.$elem)
      .find(_.get_submenu())
        .on('click', function(){
          if(flag == false) return;
          flag = false;
          setTimeout(function(){ flag = true; }, 500);

          _.init_submenu(this);

          $(this)
            .toggleClass('is_show');

    });

  };

  GlobalMenu.prototype.submenu_job.show = function() {
    let _ = this;
    _.init_submenu(event_obj);

    $(_.$elem)
    .find(submenu)
      .on('mouseover', function(){
        $(this)
          .addClass('is_show');
    });

  };


  /** --------------------------------------
   * change accordion menu width
   *--------------------------------------*/
  GlobalMenu.prototype.change_accordion_menu_width = function() {
    let _ = this
      , _s = _.settings
      , _a = _s.submenu.accordion
      , li_anchor = $(_.$elem)
        .find('.' + _a.body + ' li a')
    ;

    $(_.$elem).find('.' + _a.body).each(function(){
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
    let _ = this
      , _s = _.settings
      , _a = _s.submenu.accordion
      , width = _a.menu_width.min_width
      , max_width = _a.menu_width.max_width
    ;

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
    let _s = this.settings
      , _sf = _s.scroll_fix
      , is_fixed = _sf.is_fixed
      , gm_inner = $(_.$elem).find('.' + _s.gm_inner)
    ;

    $(window).on('scroll', function(){
      if(_sf.active_y < $(window).scrollTop()){
        gm_inner.addClass(is_fixed);

      }else{
        gm_inner.removeClass(is_fixed);
      }
    });
  }

  GlobalMenu.prototype.gm_position_fixed_view_out = function() {
    let _s = this.settings
      , _sf = _s.scroll_fix
      , is_fixed = _sf.is_fixed
      , gm_inner = $(_.$elem).find('.' + _s.gm_inner)
      , is_view_out = _sf.view_out.is_view_out
      , last_position = 0
      , curr_position = 0
    ;

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
    let _ = this
      , _s = _.settings
      , selector = ''
      , cnt      = 0
    ;

    $.each(_s.submenu, function(index, value) {
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
   * plugin
   *----------------------------------------------------------------------------*/
  $.fn.global_menu = function(options){
    let _ = new GlobalMenu(this, options);
    _.global_menu();

    return(this);
  };
})(jQuery);
