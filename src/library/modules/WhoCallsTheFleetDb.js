(function(){
	"use strict";

	window.WhoCallsTheFleetDb = {
		db: {},
		init: function(repo) {
			var rawDb = $.ajax({
				url : repo + 'assets/js/WhoCallsTheFleetShipDb.json',
				async: false
			}).responseText;

			var content = rawDb
				.split("\n")
				.map( function(x) {
					try {
						return JSON.parse(x); 
					} catch (e) {
						return false;
					}
				})
				.filter( function(x) {return x;});
			if (content.length != 398) {
				console.warn("Unexpected entity number, "+
							 "WhoCallsTheFleetShipDb.json might has been changed.");
			}

			var db = {};
			$.each( content, function(i,x) {
				db["s"+x.id] = x;
			});

			this.db = db;
		},
		getStockEquipment: function(shipId) {
			var ent = this.db["s"+shipId];
			if (typeof(ent) !== 'undefined') {
				return ent.equip;
			} else {
				return false;
			}
		}
	};
	
})();
