let getItemsObj = function(itemsStr){
    if(!itemsStr || itemsStr === ""){
        return clone(bagModel)
    }else{
        return JSON.parse(itemsStr)
    }
}
module.exports.getItemsObj = getItemsObj

let itemObj = {
    id:0,
    count:1
}
let bagModel = {
    array:[]
}

let addItemToBagObj = function(itemID,bagObj){
    for(let i=0;i<bagObj.array.length;i++){
        let t = bagObj.array[i]
        if(t.id === itemID){
            t.count++
            return
        }
    }

    let obj = clone(itemObj)
    obj.id = itemID
    obj.count = 1

    bagObj.array.push(obj)
}
module.exports.addItemToBagObj = addItemToBagObj

let dropItemFromBagObj = function(itemID,bagObj){
    for(let i=0;i<bagObj.array.length;i++){
        let t = bagObj.array[i]
        if(t.id === itemID){
            if(t.count <= 0){
                bagObj.array.splice(i,1)
                return 3
            }
            t.count--
            return 1
        }
    }
    return 2
}
module.exports.dropItemFromBagObj = dropItemFromBagObj

function clone(Obj){
	var buf;
	if(Obj instanceof Array){
		buf=[];
		var i=Obj.length;
		while(i--){
			buf[i]=clone(Obj[i]);
		}
		return buf;
	}
	else if(Obj instanceof Object){
		buf={};
		for(var k in Obj){
			buf[k]=clone(Obj[k]);
		}
		return buf;
	}else{
		return Obj;
	}
}