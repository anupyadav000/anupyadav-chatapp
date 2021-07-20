
const sokt = io()

// sokt.on('cup',(count)=>{
//     console.log(`The updated count is ${count} `)
// })

const mstmp = document.querySelector('#msgtmp').innerHTML
const $msmsg = document.querySelector('#uimsg')

const sidtmp = document.querySelector('#sidebar-template').innerHTML


const {username,roomname} = Qs.parse(location.search, { ignoreQueryPrefix : true})


const autoscroll = () => {
    // New message element
    const $newMessage = $msmsg.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $msmsg.offsetHeight

    // Height of messages container
    const containerHeight = $msmsg.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $msmsg.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $msmsg.scrollTop = $msmsg.scrollHeight
    }
}

sokt.on('wlmsg',(msg)=>{
    console.log(msg)
    const html = Mustache.render(mstmp,{
        username : msg.username,
        msgg: msg.text,
        createdAt : moment(msg.createdAt).format('h:mm a')
    })
    $msmsg.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


sokt.on('sndmsg',(msg)=>{
    console.log(msg)
    const html = Mustache.render(mstmp,{
        username : msg.username,
        msgg: msg.text,
        createdAt : moment(msg.createdAt).format('h:mm a')
    })
    $msmsg.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


const lcctmp = document.querySelector('#lctmp').innerHTML

sokt.on('lcmsg',(msgurl)=>{
    console.log(msgurl)
    const htmll = Mustache.render(lcctmp,{
        username : msgurl.username,
        lc: msgurl.lc,
        createdAt : moment(msgurl.createdAt).format('h:mm a')
    })
    $msmsg.insertAdjacentHTML('beforeend',htmll)
    autoscroll()
})

sokt.on('getdata' , ({users,room}) =>{
    const html = Mustache.render(sidtmp ,{
        users,
        room
    })
    document.querySelector('#sidebar').innerHTML = html

})

// document.querySelector('#clbt').addEventListener('click',()=>{
//     console.log('clicked')
//     sokt.emit('incnt')
// })

const $formele = document.querySelector('#msf')
const $forminp = $formele.querySelector('input')
const $formbtn = $formele.querySelector('button')

$formele.addEventListener('submit',(e)=>{
    e.preventDefault()
    $formbtn.setAttribute('disabled','disabled')
    // const msg = document.querySelector('input').value
    const msg = e.target.elements.msg.value
    sokt.emit('frd',msg,(error)=>{
        $formbtn.removeAttribute('disabled')
        $forminp.value =''
        $forminp.focus()

        if(error){
            return console.log(error)
        }
        console.log('Your message has been sent!')
    })
})



const $lcbtn = document.querySelector('#sndlc')

$lcbtn.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return ('Alert ! , Your chrome browser does not support it.')
    }

    $lcbtn.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        sokt.emit('sdlc',{
            lattitude : position.coords.latitude,
            longitude : position.coords.longitude
        },()=>{
            $lcbtn.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})


sokt.emit('join',{username,roomname} , (error) =>{
    if(error){
        alert(error)
        location.href ='/'
    }
})