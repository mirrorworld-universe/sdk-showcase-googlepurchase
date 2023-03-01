const http = require("http");
let url = require('url');
let fs = require('fs');
let querystring=require('querystring');//操作参数模块

// const mysql=require('mysql')
const dbutil = require("./utils/dbutil");
const responseUtil = require("./utils/responseutil")
const itemUtil = require("./utils/itemUtil")
const hostname = "0.0.0.0";
const port = 3000;
//创建HTTP服务器，并提供两个对象，一个请求（http.IncomingMessage对象）和一个
//响应（http.ServerResponse对象）

//urls
const urlLogin = "login";
const urlBag = "bag";
const urlItemGain = "item/gain"
const urlItemDrop = "item/drop"
//response codes
const codeSuccess = 200
const codeFailed = 201
const codeNone = 404

const server = http.createServer(async (req, res) => {
    console.log("req.url:"+req.url);
    let urlStr = url.parse(req.url);
    let param = querystring.parse(urlStr.query);
    if(req.url === "/"){
        res.statusCode = codeSuccess
        res.setHeader("Content-Type", "text/plain");//设置Content-Type响应头
        res.writeHead(200,{"Content-Type":'text/plain','charset':'utf-8',
        'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});//可以解决跨域的请求
        console.log("params is:"+JSON.stringify(param));
        // res.write("{ name: '鲁班大师', iq: '250' }");
        res.end(urlLogin+"\n"+urlBag+"\n"+urlItemGain+"\n"+urlItemDrop+"\n");
    }else if(req.url === "/"+urlLogin){
        res.statusCode = codeSuccess
        let wallet = param["wallet"];
        if(!wallet || wallet === ""){
            let resStr = responseUtil.getNormalResponse(codeSuccess,null,"param wallet needed.")
            res.write(resStr);
            res.end();
        }else{
            let resStr = responseUtil.getNormalResponse(codeSuccess,null,"success.")
            res.write(resStr);
            res.end();
        }
    }else if(req.url === "/"+urlBag){
        res.statusCode = codeSuccess
        let wallet = param["wallet"];
        if(!wallet || wallet === ""){
            let resStr = responseUtil.getNormalResponse(codeSuccess,null,"param wallet needed.")
            res.write(resStr);
            res.end();
        }else{
            let itemsStr = await dbutil.queryBagItems(wallet)
            let resStr = responseUtil.getNormalResponse(codeSuccess,itemsStr,"success.")
            res.write(resStr);
            res.end();
        }
    }else if(req.url === "/"+urlItemGain){
        res.statusCode = codeSuccess
        let wallet = param["wallet"];
        let itemID = param["itemID"];

        if(!wallet || wallet === "" || !itemID || itemID === ""){
            let resStr = responseUtil.getNormalResponse(codeSuccess,null,"param wallet or itemID needed.")
            res.write(resStr);
            res.end();
        }else{
            let itemsStr = await dbutil.queryBagItems(wallet)
            let items = itemUtil.getItemsObj(itemsStr)
            itemUtil.addItemToBagObj(itemID,items)
            itemsStr = JSON.stringify(items)
            await dbutil.updateBagItems(wallet,itemsStr)
            let resStr = responseUtil.getNormalResponse(codeSuccess,itemsStr,"success.")
            res.write(resStr);
            res.end();
        }
    }else if(req.url === "/"+urlItemDrop){
        res.statusCode = codeSuccess
        let wallet = param["wallet"];
        let itemID = param["itemID"];

        if(!wallet || wallet === "" || !itemID || itemID === ""){
            let resStr = responseUtil.getNormalResponse(codeFailed,null,"param wallet or itemID needed.")
            res.write(resStr);
            res.end();
        }else{
            let itemsStr = await dbutil.queryBagItems(wallet)
            let items = itemUtil.getItemsObj(itemsStr)
            let dropResultCode = itemUtil.dropItemFromBagObj(itemID,items)
            if(dropResultCode === 1){//success
                itemsStr = JSON.stringify(items)
                await dbutil.updateBagItems(wallet,itemsStr)
                let resStr = responseUtil.getNormalResponse(codeSuccess,itemsStr,"success.")
                res.write(resStr);
            }else if(dropResultCode === 2){//no this item
                let resStr = responseUtil.getNormalResponse(codeFailed,"","no this itme."+itemID)
                res.write(resStr);
            }else if(dropResultCode === 3){
                let resStr = responseUtil.getNormalResponse(codeFailed,"","item is not enough to drop."+itemID)
                res.write(resStr);
            }else{
                let resStr = responseUtil.getNormalResponse(codeFailed,"","unknown error."+itemID)
                res.write(resStr);
            }
            res.end();
        }
    }else{
        res.statusCode = codeNone
        res.end("Unknown url"+req.url+"\n");
    }
})

//服务器启动监听
server.listen(port, hostname, () => {
    dbutil.initDB()
    console.log(`服务器运行在http://${hostname}:${port}/`);
})