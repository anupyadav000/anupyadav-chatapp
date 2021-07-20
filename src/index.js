const pth = require('path')

const htp = require('http')

const exprs = require('express')

const sktio = require('socket.io')

const app = exprs()
const htsrv = htp.createServer(app)
const io = sktio(htsrv)

const Filter = require('bad-words')

const port = process.env.PORT || 3000

const pubdirpth = pth.join(__dirname,'../public')

const {mdmsg} = require('./utils/message.js')

const {mdlc} = require('./utils/message.js')

const { addUser , removeUser , getUser , getUsers } = require('./utils/users')

app.use(exprs.static(pubdirpth))

// let count = 0

io.on('connection',(sokt)=>{

    // console.log('New Websocket Connection')


    // sokt.emit('wlmsg',mdmsg('Welcome'))
    // sokt.broadcast.emit('sndmsg',mdmsg("A new user has joined!"))

    // sokt.on('incnt',()=>{
    //     count++
    //     io.emit('cup',count)
    // })

    sokt.on('join',({username,roomname}, clbcc)=>{
        const {error,usrr} = addUser({id:sokt.id , username,roomname})
        if(error){
            return clbcc(error)
        }
        sokt.join(usrr.roomname)
        sokt.emit('wlmsg',mdmsg('Admin','Welcome'))
        sokt.broadcast.to(usrr.roomname).emit('sndmsg',mdmsg('Admin',`${usrr.username} has joined!`))

        io.to(usrr.roomname).emit('getdata',{
            users : getUsers(usrr.roomname),
            room : usrr.roomname
        })
    })

    
    sokt.on('frd',(msg,callback)=>{
        const usr = getUser(sokt.id)
        const filter = new Filter()
        filter.addWords('chutiya', 'gandu','loda','sale','chod','bhosdika','gand','C','c','land')

        if(filter.isProfane(msg)){
            return callback('Profane words not allowed!')
        }

        io.to(usr.roomname).emit('sndmsg',mdmsg(usr.username, msg))
        callback()
    })

    sokt.on('sdlc',(coords,clbc)=>{
        const useer = getUser(sokt.id)
        // io.emit('sndmsg',`Location : ${coords.lattitude},${coords.longitude}`)
        io.to(useer.roomname).emit('lcmsg',mdlc(useer.username,`https://google.com/maps?q=${coords.lattitude},${coords.longitude}`))
        clbc()
    })

    sokt.on('disconnect',()=>{
        const useer = removeUser(sokt.id)
        if(useer){
            io.to(useer.roomname).emit('sndmsg',mdmsg( `${useer.username} has left!`))
            io.to(useer.roomname).emit('getdata',{
                users : getUsers(useer.roomname),
                room : useer.roomname
            })
        }
    })
})


htsrv.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

