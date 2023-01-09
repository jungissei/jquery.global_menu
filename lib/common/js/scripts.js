// ----------------------------------------------------------------------------
// Table Of Content
//
// Template
// ----------------------------------------------------------------------------



// ----------------------------------------------------------------------------
// Template
// ----------------------------------------------------------------------------
// --------------------------------------
// Global menu
// --------------------------------------
// Sub menu
$(function(){

  let $submenu_item = $('#global_menu [data-submenu]'),
      show_class = 'is_show',
      submenu_job = {
        init : function(event_obj){

          $submenu_item.each(function(){

            if(
              typeof event_obj !== 'undefined'
              && this == event_obj
            ) return;

            $(this).removeClass(show_class);
          });
        },
        click : function(){

          let flag = true;

          $submenu_item.on('click', function(e){
            e.preventDefault();

            if(flag == false) return;
            flag = false;
            setTimeout(function(){ flag = true; }, 500);

            submenu_job.init(this);

            $(this).toggleClass(show_class)
          });
        },
        hover : function(){

          $submenu_item.on('mouseover', function(){

            submenu_job.init(this);
            $(this).addClass('is_show');
          });
        },
        close : function() {

          $submenu_item.on('mouseleave', function(){

            submenu_job.init();
          });
        }
      };

  submenu_job[
    is_touch_display()? 'click' : 'hover'
  ]();

  submenu_job.close();
});


// Sticky when scroll below global menu
// .data-sticky-scroll=[below-this-and-scrolling-down]
$(function(){
  let $header = $('#template_header[data-sticky-scroll]');
  if($header.length === 0) return;

  let fixed_class = 'is_fixed',
      hide_class = 'is_hide',
      header_height = parseInt($header.outerHeight()),
      fixed_active_point = parseInt($header.offset().top),
      curr_window_scroll_top,
      last_window_scroll_top = parseInt($(window).scrollTop()),
      sticky_scroll = {
        fixed : function(){

          $header
            .css('height' , header_height)
            .addClass(fixed_class);
        },
        unfixed : function(){

          $header
            .removeClass(fixed_class)
            .css('height' , '');
        },
        hide : function(){

          $header.addClass(hide_class);
        },
        show : function(){

          $header.removeClass(hide_class);
        }
      };

  $(window).on('scroll', function(){

    curr_window_scroll_top = parseInt($(window).scrollTop());

    sticky_scroll[
      fixed_active_point < curr_window_scroll_top?
        'fixed' : 'unfixed'
    ].bind()();

    if( $header.data('sticky-scroll') === 'below-this-and-scrolling-down' ){

      if(fixed_active_point < curr_window_scroll_top &&
        last_window_scroll_top !== curr_window_scroll_top){

        sticky_scroll[
          last_window_scroll_top < curr_window_scroll_top?
            'hide' : 'show'
        ].bind()();
      }

      last_window_scroll_top = curr_window_scroll_top;
    }
  });
});

