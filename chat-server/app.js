const express = require('express');
const dotenv = require('dotenv');
// const WebSocket = require('ws');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http')
const { Server } = require('socket.io')


dotenv.config();

const app = express();

let db = null;

const connectToDb = async () => {
    const client = new MongoClient(process.env.URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.connect()
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.error('Error connecting to MongoDB', err);
        });
    db = client.db('NeoChat');
}

connectToDb()

app.use(express.json());

const server = http.createServer(app)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3004");
    res.header('Access-Control-Allow-Methods', 'GET, POST, UPDATE, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
    next()
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await db.collection('users').findOne({ username });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = {
            username,
            email,
            password: await bcrypt.hash(password, 10),
        };
        console.log(user)
        await db.collection('users').insertOne({ ...user });
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await db.collection('users').findOne({ username });
        console.log(user)
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ jwt:token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.get('/getChats', async (req, res) => {
    const chatObj = await db.collection('chats').findOne({ chat: 'All' })
    let chats = []
    if (chatObj !== null) {
        // console.log(chatObj)
        chats = chatObj.chatRoom
    }
    res.status(201).send({data:chats})
})

// WebSocket setup

const io = new Server(server, {
    cors: {
        origin: 'https://neo-chat-96mp.vercel.app/',
        methods: ['GET', 'POST'],
    },
})

io.on("connection", (socket) => {
    console.log('User Connected', socket.id)


    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("Joined room", data)
    })

    socket.on('send_message', async (data) => {

        const chatObj = await db.collection('chats').findOne({ chat: 'All' })
        let chats = []
        if (chatObj !== null) {
            // console.log(chatObj)
            chats = chatObj.chatRoom
        }
        // console.log(chats)

        socket.to(data).emit('recieve_msg', [...chats, { username: data.username, text: data.text, timestamp:data.timestamp }])

        db.collection('chats').updateOne({ chat: 'All' }, { $set: { chatRoom: [...chats, {  username: data.username, text: data.text, timestamp:data.timestamp }] } })

    })
 
    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)
    })
})


server.listen(3005, () => console.log('Server running on port 3005'));

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//     console.log('Client connected');

//     ws.on('message', (message) => {
//         console.log(`Received message => ${message}`);
//         wss.clients.forEach(client => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(message);
//             }
//         });
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });


