let getNormalResponse = function(code,content,message){
    let result = {
        code: code,
        data:content,
        message:message
    }
    return JSON.stringify(result)
}
module.exports.getNormalResponse = getNormalResponse