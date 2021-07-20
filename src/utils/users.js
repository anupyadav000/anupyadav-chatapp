const users = []

// add user , remove user , get user , get users in room 

const addUser = ( {id , username , roomname} ) =>{
    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()
    if(!username || !roomname ){
        return  {
            error : ' username or roomname should must be provided!'
        }
    }
    const exusr = users.find((user)=>{
        return (user.roomname === roomname && user.username === username )
    })

    if(exusr) {
        return {
            error : 'user already in the room!'
        }
    }
    const usrr = {id,username,roomname}
    users.push(usrr)
    return {usrr}
}



const removeUser = (id) => {
    const ind = users.findIndex((user) => (user.id === id))
    if (ind != -1){
        return users.splice(ind, 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}


const getUsers = (roomname) =>{
    const roomn = roomname.trim().toLowerCase()
    return users.filter((user) => user.roomname === roomn)
}


module.exports = {
    getUsers ,
    getUser,
    addUser,
    removeUser
}

// const vr = addUser ({
//     id : 23,
//     username : "anup",
//     roomname : '1'
// })

// console.log(vr)

// console.log(users)
// const vrr = addUser ({
//     id : 23,
//     username : "anup",
//     roomname : '1'
// })

// console.log(vrr)
// console.log(users)

// addUser ({
//     id : 25,
//     username : "osim",
//     roomname : '1'
// })

// addUser ({
//     id : 29,
//     username : "visnu",
//     roomname : '4'
// })


// console.log(getUser(29))
// console.log(getUsers('1'))
// console.log(users)


// const vr = removeUser(23)
// console.log(vr)


