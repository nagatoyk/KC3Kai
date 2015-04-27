KC3.prototype.Logging  = {
	database :{},
	index :"",
	
	lastResource: 0,
	lastUseitem: 0,
	
	/* [Initialize] Connect to IndexedDB
	--------------------------------------------*/
	init: function(){
		this.database = new Dexie("KC3");
		this.database.version(1).stores({
			account: "++id,&hq,server,mid,name",
			build: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,result,time",
			lsc: "++id,hq,flag,rsc1,rsc2,rsc3,rsc4,devmat,result,time",
			sortie: "++id,hq,world,mapnum,fleetnum,combined,fleet1,fleet2,time",
			battle: "++id,hq,sortie_id,node,data,yasen,rating,drop,time",
			resource: "++id,hq,rsc1,rsc2,rsc3,rsc4,hour",
			useitem: "++id,hq,torch,screw,bucket,devmat,hour",
		});
		this.database.open();
	},
	
	/* [Reset] Delete the IndexedDB
	--------------------------------------------*/
	reset :function(){
		this.database.delete().then(function(){ console.log("RESET"); });
	},
	
	/* Account Information
	--------------------------------------------*/
	Player :function(data){
		var self = this;
		// check if account exists
		this.database.account
			.where("hq")
			.equals(this.index)
			.count(function(NumRecords){
				if(NumRecords == 0){
					// insert if not yet on db
					self.database.account.add({
						hq: self.index,
						server: data.server,
						mid: parseInt(data.mid, 10),
						name: data.name
					});
				}
			});
	},
	
	Build :function(data){
		data.hq = this.index;
		this.database.build.add(data);
	},
	
	LSC :function(data){
		data.hq = this.index;
		this.database.lsc.add(data);
	},
	
	Sortie :function(data, callback){
		data.hq = this.index;
		this.database.sortie.add(data).then(callback);
	},
	
	Battle :function(data){
		data.hq = this.index;
		this.database.battle.add(data);
	},
	
	Resource :function(data, stime){
		var ResourceHour = Math.floor(stime/3600);
		
		if(this.lastResource == 0){
			if(typeof localStorage.lastResource != "undefined"){
				this.lastResource = localStorage.lastResource;
			}
		}
		
		if(this.lastResource == ResourceHour){
			return false;
		}
		
		this.lastResource = ResourceHour;
		localStorage.lastResource = ResourceHour;
		
		this.database.resource.add({
			hq : this.index,
			rsc1 : data[0],
			rsc2 : data[1],
			rsc3 : data[2],
			rsc4 : data[3],
			hour : ResourceHour
		});
	},
	
	Useitem :function(data, stime){
		var ResourceHour = Math.floor(stime/3600);
		
		if(this.lastUseitem == 0){
			if(typeof localStorage.lastUseitem != "undefined"){
				this.lastUseitem = localStorage.lastUseitem;
			}
		}
		
		if(this.lastUseitem == ResourceHour){
			return false;
		}
		
		this.lastUseitem = ResourceHour;
		localStorage.lastUseitem = ResourceHour;
		
		this.database.useitem.add({
			hq : this.index,
			torch : data.torch,
			screw : data.screws,
			bucket : data.buckets,
			devmat : data.devmats,
			hour : ResourceHour
		});
	},
	
	/* [GET] Retrive logs from Local DB
	--------------------------------------------*/
	get_build :function(pageNumber, callback){
		var itemsPerPage = 25;
		this.database.build
			.where("hq").equals(this.index)
			.reverse()
			.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
			.toArray(callback);
	},
	
	count_build: function(callback){
		this.database.build
			.where("hq").equals(this.index)
			.count(callback);
	},
	
	get_lscs :function(pageNumber, callback){
		var itemsPerPage = 25;
		this.database.lsc
			.where("hq").equals(this.index)
			.reverse()
			.offset( (pageNumber-1)*itemsPerPage ).limit( itemsPerPage )
			.toArray(callback);
	},
	
	count_lscs: function(callback){
		this.database.lsc
			.where("hq").equals(this.index)
			.count(callback);
	},
	
	get_lsc :function(){
		
	},
	
	get_drop :function(){
		
	},
	
	get_sortie :function(){
		
	},
	
	get_battle :function(){
		
	},
	
	get_resource :function(HourNow, callback){
		var self = this;
		this.database.resource
			.where("hour").above(HourNow-720)
			.toArray(function(response){
				var callbackResponse = [];
				
				var ctr;
				for(ctr in response){
					if(response[ctr].hq == self.index){
						callbackResponse.push(response[ctr]);
					}
				}
				
				callback(callbackResponse);
			});
	}
};