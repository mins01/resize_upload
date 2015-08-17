"use strict"
/**
 * 리사이즈 and 업로드
 * require Jquery
 */

var resize_upload = {
	"fd":null,
	"files":[],
	"init":function(){
		this.fd = new FormData();
	},
	/**
	 * [description]
	 * @param  {[type]} w         sjql
	 * @param  {[type]} h        [description]
	 * @param  {[type]} name     [description]
	 * @param  {[type]} filename [description]
	 * @param  {[type]} type     [description]
	 * @param  {[type]} quality  [description]
	 * @return {[type]}          [description]
	 */
	"help_conf_resize":function(w,h,name,filename,type,quality){

		if(type==undefined) type = 'png';
		if(quality==undefined) quality = 70;
		if(!filename || filename.length ==0) filename = (new Date()).getTime().toString()+(Math.floor(Math.random()*9999)).toString()+'.'+type;
		return {"width":w,"height":h,"name":name,"filename":filename,"type":type,"quality":quality};
	},
	"set_org":function(org,conf){
		this.files.push(org);
		org.imgs = [];
		org.blobs = [];
		org.wc = WebCanvas(100,100);
		org.conf = conf;
		org.org_img = new Image();
		//$(org).after(org.imgs[0]); //오리지널 이미지는 안보여준다.
		$(org).bind("change",function(){
			var callback = function(org){
				return function(dataUrl){
					var image = org.org_img;
					image.src = dataUrl;
					var w = 0,h=0;
					w = image.naturalWidth!=undefined?image.naturalWidth:(image.width?image.width:0);
					h = image.naturalHeight!=undefined?image.naturalHeight:(image.height?image.height:0);
					while(org.blobs.length>0){
						org.blobs.pop();
					}
					if(w==0 || h==0){
						this.setError("대상이 이미지가 아닙니다.");
						return false;
					}


					org.wc.resize(w,h);
					org.wc.copy(image);
					//image.width = w;
					//image.height = h;
					image.src = dataUrl;
					$(image).attr('data-filename',org.files[0].name)
					$(image).attr('data-name',org.name)
					if(org.conf.preview_img && org.conf.preview_img.src != undefined){
						org.conf.preview_img.src = dataUrl;
					}
					//---

					for(var i=0,m=org.conf['resize'].length;i<m;i++){
						var r = org.conf['resize'][i];
						var c_wc = org.wc.clone();
						c_wc.resize(r.width,r.height);
						var blob = wc2Helper.dataURL2Blob(c_wc.toDataURL(r.type,r.quality))
						blob.name = r.name;
						blob.filename = r.filename;
						org.blobs.push(blob);

					}

					//c_wc.resize(100,100);
					//image.src = c_wc.toDataURL();
				}
			}(org)
			//-- readType : readAsDataURL, readAsText , readAsBinaryString , readAsArrayBuffer
			if(!wc2Helper.loadInputFile(this,callback,'readAsDataURL')){
				org.blobs = [];// 파일 선택에 문제가 있을 경우
			}
		});

	},
	"upload":function(to_url,callback){
		var formdata = new FormData();
		for(var i=0,m=this.files.length;i<m;i++){
			var org = this.files[i];
			for(var i2=0,m2=org.blobs.length;i2<m2;i2++){
				var blob = org.blobs[i2];
				formdata.append(blob.name, blob, blob.filename);
			}
		}

		$.ajax({
			url: to_url,
			processData: false,
			contentType: false,
			//contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			dataType :"json",
			data: formdata,
			type: 'POST',

		}).done(
			callback
		).fail(function() {
			alert( "error" );
		})
		.always(function() {
			//alert( "complete" );
		});
		return true;
	}
}
