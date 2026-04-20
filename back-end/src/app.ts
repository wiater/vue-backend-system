import 'reflect-metadata'
import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import container from '@/ioc-container';
const server = new InversifyExpressServer(container)

server.setConfig(app => {
    app.use(express.json())
})

const app = server.build()

app.listen(4000,() => {
    console.log("Server running on 4000")
})