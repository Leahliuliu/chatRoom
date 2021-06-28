//后台服务器代码
//引入websocket模块
let ws = require('nodejs-websocket')

//创建服务对象启动，监听端口号是2555
let server = ws.createServer((conn)=>{
    console.log('有人连接...')
    //当客户端发消息时会触发text事件
    conn.on('text',(str)=>{
        let data = JSON.parse(str)
        console.log(data)
        //判断接受消息的类型
        switch(data.type){
            case 'login': //新用户加入
                conn.nickname = data.username //保存用户名属性
                broadcast(
                    //发送json字符串告诉客户端有新用户加入
                    JSON.stringify({
                        username:data.username,
                        time:getTime(),
                        type:data.type
                    })
                )
                break
            case 'msg':
                broadcast(
                    JSON.stringify({
                        username:data.username,
                        time:getTime(),
                        message:data.message,
                        type:data.type
                    })
                )
                break
        }
    })

    //监听错误信息
    conn.on('error',(err)=>{
        console.log(err)
    })

    //监听断开连接
    conn.on('close',()=>{
        broadcast(
            JSON.stringify({
                username:conn.nickname,
                time:getTime(),
                type:'leave'
            })
        )
    })

}).listen(2555)

//给所有客户端连接发送消息
function broadcast(str){
    //遍历所有的客户端连接
    server.connections.forEach((conn)=>{
        //发送消息
        conn.send(str)
    })
}

function getTime(){
    var date = new Date();
    var hour = date.getHours();
    var min = date.getMinutes()
    var sec = date.getSeconds()
    return hour + ":" + min + ":" + sec
}