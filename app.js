const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const OrderingApp = require("./orderingApp")


const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const path = require("path")

app.get("/", (req,res)=>{
    res.send("Welcome to the ordering app")
})

app.get("/sender", (req,res)=>{
    res.sendFile(path.join(__dirname + "/sender.html"))
})

app.get("/driver", (req,res)=>{
    res.sendFile(path.join(__dirname + "/driver.html"))
})

const orderingApp = new OrderingApp()

io.on("connection", (socket)=>{
    console.log("A new user is connected", socket.id)

    socket.on("join", (user_type, Username )=>{
        const userInfo = {
            socket:socket,
            user_type:user_type,
            name:Username
        }

        orderingApp.joinSession(userInfo)
    })

    socket.on("orderRide", (order)=>{
        orderingApp.orderRide(order)
    })

    socket.on("acceptOrder", (id, driverId)=>{
        orderingApp.acceptOrder(id, driverId)
    })

    socket.on("rejectOrder", (id, driverId)=>{
        orderingApp.rejectOrder(id, driverId)
    })

    socket.on("completeRide", (id, driverId)=>{
        orderingApp.completeRide(id, driverId)
    })
    
})



const PORT = 3600
server.listen(PORT, ()=>{
    console.log("Ordering app has started")
})