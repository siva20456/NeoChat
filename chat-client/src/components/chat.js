import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import {RiSendPlane2Fill} from 'react-icons/ri'
import '../OverAll.css'
import Cookies from 'js-cookie'
// const envVar = require('dotenv').config()


// const PORT = 3005
const socket = io.connect('https://neochat-69jw.onrender.com')

const Chat = () => {

    // const {room,user} = props
    // console.log(room,user)
    const thisSideUser = Cookies.get('user')

    const [currentMsg,setMsg] = useState('')
    const [messagesList,setMsgList] = useState([])

    useEffect(() => {
        socket.emit('join_room','room')
        getChatData()
    },[])

    const getChatData = async() => {
        const res = await fetch(`https://neochat-69jw.onrender.com/getChats`)
        const data = await res.json()
        console.log(data,'DataGiven')
        setMsgList(data.data)
    }

    
    const handleInput = e => {
        const {value} = e.target
        if(e.key === 'Enter'){
            sendMsg()
        }
    }

    const sendMsg = async() => {
        if(currentMsg !== ''){
            const msgData = {
                text:currentMsg,
                timestamp: new Date(Date.now()).getHours() +":"+ new Date(Date.now()).getMinutes(),
                username:thisSideUser,
            }

            await socket.emit("send_message",msgData)
            setMsgList([...messagesList,{text:currentMsg,username:thisSideUser,timestamp:msgData.timestamp}])
            setMsg('')
            
        }
    }

    useEffect(() => {
        socket.on('recieve_msg',(data) => {
            console.log(data,'dataGiven')
            setMsgList(data)
        })
        getChatData()
    },[socket])


    return(
        <div className='chat-cont'>
            <div className='chat-header'>
                <h1 className='chat-user-name'>Live Chat</h1>
            </div>
            <div id='chatBody' className='chat-body'>
                {messagesList.map((obj,i) => <div className={obj.user===thisSideUser?'msg-item user-side':'msg-item'} key={i}>
                    <p className='msg-content'>{obj.text}</p>
                    <p className='user-content'>{obj.username===thisSideUser?'You':obj.username}</p>
                    <p className='user-content'>{obj.timestamp}</p>
                </div>)}
            </div>
            <div className='chat-footer'>
                <input className='chat-input' type='text' placeholder='Hey..' value={currentMsg} onKeyDown={handleInput} onChange={(e) => setMsg(e.target.value)} />
                <button className='chat-send-btn' onClick={sendMsg}><RiSendPlane2Fill /></button>
            </div>
        </div>
    )
}

export default Chat