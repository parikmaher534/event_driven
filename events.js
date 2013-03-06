var EVENTER = (function(){
	
	'use strict'

  	var pref_ = "eventer" + new Date().getTime(),
  	    ev_   = {};


	/**
	 * Is it an array
	 * @param o checking element
	 */
	var isArray = function(o){
		return o.constructor === Array;
	};

	/**
	 * Is it an Object
	 * @param o checking element
	 */
	var isObject = function(o){
		return o.constructor === Object;
	};


	/**
	 * Is it a String
	 * @param o checking element
	 */
	var isString = function(o){
		return o.constructor === String;
	};


	return {

		/**
		 * Method bind event on object
		 * @param {Object} our object
		 * @param {String} event name
		 * @param {Function} handler
		 */
		on: function (o, e, f) {

			/* Add event to object */	
			var add = function (o) {
	
			  if ( !o[pref_] ) o[pref_] = {};

			  var set = function(e){

				  //Do we already have this type of event
				  if ( o[pref_][e] ) {
					 o[pref_][e].push(f);
				  } else {
					 o[pref_][e] = [f];
				  };

				  //Add event to global list
				  ev_[e] ? ev_[e].push(f) : ev_[e] = [f];
			  };	  

			  /* If we set array of events */
			  if( isString(e) ) {
				  set(e);
			  } else if ( isArray(e) ) {
				  for( var i = 0; i < e.length; i++ ){
					  set(e[i]);
				  };
			  }; 
			};


			/* First parameter must be only Array || Object */
			if( isArray(o) ){
			  for( var i = 0; i < o.length; i++ ){
				add(o[i]);
			  };
			} else if( isObject(o) ) {
			  add(o);
			};
		},


		/**
		 * Method emit the event
		 * @param {Object} our object
		 * @param {String} event name
		 * @param p parameters 
		 */
		trigger: function(o, e, p){

			/** 
			 * Call all handlers 
			 * @param {Array} array of handlers
			 */
			var callF = function (a) {
			  if ( a ) {
				for ( var i = 0; i < a.length; i++ ) {
				  if ( a[i] ) a[i](p || null);
				};
			  };
			};

			/** 
			 * Call handlers from objects array 
			 * @param {Object} object
			 */
			var callFArray = function(o){
				if( isString(e) ){
					callF(o[e]);
				}else if( isArray(e) ){
					for( var ev = 0; ev < e.length; ev++ ){
						callF(o[e[ev]]);
					};
				};
			};



			/* If first parameter is object */
			if( isObject(o) ) {
				if ( o[pref_] ) callFArray(o[pref_]);
			} 

			/* If first parameter is Array */
			else if ( isArray(o) && arguments.length > 1 ) {
			  for ( var i = 0; i < o.length; i++ ) {
				if ( o[i][pref_] ) callFArray(o[i][pref_]);	
			  };
			}

			/* If we want to call this event from all objects */
			else if( isString(o) ) {
				for( var j = 0; j < ev_[o].length; j++ ){
					ev_[o][j](e || null);
				};  
			} 

			/* If we eant to call an array of events from all objects */
			else if ( isArray(o) && 1 === arguments.length) {
				
				//Loop all events
				for( var eo = 0; eo < o.length; eo++ ){

					//Loop all objects
					for( var eo_ = 0; eo_ < ev_[o[eo]].length; eo_++ ){
						ev_[o[eo]][eo_](e || null);
					}; 
				};
			};
		}
	};
}());




/* Examples */
window.addEventListener('load', function(){

	var test  = {},
		test2 = {},
		again = {};


	/* Single event on single object */
	EVENTER.on(test, 'go', function(params){
		console.log(params, ' - Object 1');
	});

	/* Array of objects */
	EVENTER.on([test, test2], 'go', function(params){
		console.log(params, ' - Several objects with one event');
	});

	/* Array of events */
	EVENTER.on(again, ['go', 'went', 'gone'], function(params){
		console.log(params, ' - Several events on one object');
	});
	



	/* Emit one event from one object*/
	EVENTER.trigger(test, 'go');

	/* Emit several events */
	EVENTER.trigger(again, ['go', 'gone'], 'hello world');	

	/* Several objects and several events */
	EVENTER.trigger([test, again], ['go', 'gone', 'went']);	

	/* Emit this event from all objects */
	EVENTER.trigger('go', 'nooooooooooooooooooooooooooo!');

	/* Emit array of events from all objects */
	EVENTER.trigger(['go', 'gone']);

}, false);







