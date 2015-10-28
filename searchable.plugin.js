/*!
   _____                      __          __    __         _
  / ___/___  ____ ___________/ /_  ____ _/ /_  / /__      (_)____
  \__ \/ _ \/ __ `/ ___/ ___/ __ \/ __ `/ __ \/ / _ \    / / ___/
 ___/ /  __/ /_/ / /  / /__/ / / / /_/ / /_/ / /  __/   / (__  )
/____/\___/\__,_/_/   \___/_/ /_/\__,_/_.___/_/\___(_)_/ /____/
                                                 /___/
 Version: 1.0.0
  Author: Philippe Roy
    Repo: https://github.com/PhilippeRoy/Searchable.git
  Issues: https://github.com/PhilippeRoy/Searchable/issues
Liscence: MIT

*/

// Make Searchable List
;(function($) {
    'use strict';
    var Searchable = window.Searchable || {};

    Searchable = (function() {

      var instanceUid = 0;

      function Searchable(element, options){

        var _ = this;

        _.defaults = {
            list: $(element),
            items: $(element).children(),
            errorMsg: 'Sorry, no results found.',
            searchInput: '<input type="text" placeholder="Search" />',
            prependInput: $(element),
            elementToSortBy: $(element).children(),
            amountToShow: null
        };

        _.settings = $.extend( {}, _.defaults, options );

        // A simple way to check for HTML strings
        // Strict HTML recognition (must start with <)
        // Extracted from jQuery v1.11 source
        _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

        _.instanceUid = instanceUid++;

        _.init();

      }

      return Searchable;

    })();

    Searchable.prototype.init = function(){

      var _ = this;

      _.initSearchInput();
      _.showThisMany();

    }

    Searchable.prototype.initSearchInput = function(){

      var _ = this;

      if (_.htmlExpr.test(_.settings.searchInput)) {
        _.$searchInput = $(_.settings.searchInput).attr('data-search-input', _.instanceUid);
        _.$searchInput.prependTo(_.settings.prependInput);
        _.searchInputEvents($('[data-search-input="' + _.instanceUid + '"]'));

      } else {
        //throw new Error("Incorrect HTML");
      }

    }

    Searchable.prototype.filterFind = function(searchVal, searchIn){
      var str = searchIn;
      var patt = new RegExp(searchVal.toString());
      return patt.test(str);
    }

    Searchable.prototype.showThisMany = function() {
      var _ = this;
      var count = _.settings.amountToShow;

      if (typeof count === 'number'){
        _.settings.items.addClass('hide').removeClass('show');

        for (var i = 0; i < count; i++){
          $(_.settings.items[i]).removeClass('hide').addClass('show');
        }

      } else {
        _.settings.items.removeClass('hide').addClass('show');
      }
    }

    Searchable.prototype.searchInputEvents = function(element) {

      var _ = this, msgIsShown = false;

      element = element.find('input').addBack('input');

      element.on('keyup', function(e){


      if($(this).val().length <= 0){

        _.showThisMany();


       } else if($(this).val().length > 0){
         //do regex and show only those that match
         var searchVal = $(this).val().toLowerCase();

         _.settings.items.each(function(){

           var item = $(this);

           item.addClass('hide').removeClass('show');


           if(_.filterFind(searchVal, item.find(_.settings.elementToSortBy).addBack(_.settings.elementToSortBy).text().toLowerCase())){
               item.addClass('show').removeClass('hide');
             }

           });
         }

         if (!_.settings.items.hasClass('show') && !msgIsShown){
            _.settings.items.parent().append('<p class="search-err-msg">' + _.settings.errorMsg + '</p>');
            msgIsShown = true;
          } else if(_.settings.items.hasClass('show')) {
            $('.search-err-msg').remove();
            msgIsShown = false;
          }
       });
     }


    $.fn.searchable = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined'){
              _[i].searchable = new Searchable(_[i], opt);
            } else {
              _[i].searchable = new Searchable(_[i], {});
            }
        }
        return _;
    };

})(jQuery);
