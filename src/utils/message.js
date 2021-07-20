const mdmsg = (username , txt) =>{
    return {
        username : username,
        text : txt,
        createdAt : new Date().getTime()
    }
}

const mdlc = (username, url) =>{
    return {
        username : username,
        lc : url,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    mdmsg ,
    mdlc
}