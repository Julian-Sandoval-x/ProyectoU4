import express from"express";import bodyParser from"body-parser";import path from"path";import{fileURLToPath}from"url";import jwt from"jsonwebtoken";import bcrypt from"bcryptjs";import db from"../../../includes/config/database.js";const app=express(),port=3e3,secretKey="your_secret_key",__filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);function isAuthenticated(e,s,r){const o=e.headers.authorization;if(!o||!o.startsWith("Bearer "))return s.status(401).json({message:"Usuario no autenticado"});const t=o.split(" ")[1];jwt.verify(t,secretKey,((o,t)=>{if(o)return s.status(401).json({message:"Token inválido"});e.userId=t.id,r()}))}app.use(express.static(path.join(__dirname,"../../../public"))),app.use(express.static(path.join(__dirname,"../../../build"))),app.use(express.static(path.join(__dirname,"../../../media"))),app.use(bodyParser.json()),app.get("/create_user",((e,s)=>{s.sendFile(path.join(__dirname,"../../../public/create_user.html"))})),app.get("/",((e,s)=>{s.sendFile(path.join(__dirname,"../../../public/index.html"))})),app.get("/menu",((e,s)=>{s.sendFile(path.join(__dirname,"../../../public/menu.html"))})),app.get("/login",((e,s)=>{s.sendFile(path.join(__dirname,"../../../public/login.html"))})),app.get("/pedidos",((e,s)=>{s.sendFile(path.join(__dirname,"../../../public/pedidos.html"))})),app.get("/api/pedidos",isAuthenticated,((e,s)=>{const r=e.userId;db.query("SELECT * FROM pedidos WHERE idUser = ?",[r],((e,r)=>{if(e)return console.error("Error fetching orders from database:",e),s.status(500).json({message:"Error al obtener los pedidos"});s.status(200).json(r)}))})),app.get("/api/pedidos",((e,s)=>{const r=e.userId;db.query("SELECT * FROM pedidos WHERE idUser = ?",[r],((e,r)=>{if(e)return console.error("Error fetching orders from database:",e),s.status(500).json({message:"Error al obtener los pedidos"});s.status(200).json(r)}))})),app.get("/api/pedidos",((e,s)=>{const r=e.userId;db.query("SELECT * FROM pedidos WHERE idUser = ?",[r],((e,r)=>{if(e)return console.error("Error fetching orders from database:",e),s.status(500).json({message:"Error al obtener los pedidos"});s.status(200).json(r)}))})),app.patch("/api/pedidos/:id/cancelar",isAuthenticated,((e,s)=>{const r=e.userId,o=e.params.id;db.query("SELECT * FROM pedidos WHERE id = ? AND idUser = ? AND estado = 'pendiente'",[o,r],((e,r)=>{if(e)return console.error("Error al verificar el pedido:",e),s.status(500).json({message:"Error al procesar la solicitud"});if(0===r.length)return s.status(404).json({message:"Pedido no encontrado o no es cancelable"});db.query("UPDATE pedidos SET estado = 'cancelado' WHERE id = ?",[o],(e=>{if(e)return console.error("Error al actualizar el pedido:",e),s.status(500).json({message:"No se pudo cancelar el pedido"});s.status(200).json({message:"Pedido cancelado con éxito"})}))}))})),app.post("/create_user",(async(e,s)=>{const{email:r,password:o}=e.body;if(!r||!o)return s.status(400).json({message:"Todos los campos son obligatorios"});db.query("INSERT INTO usuarios (correo, password) VALUES (?, ?)",[r,o],((e,r)=>{if(e)return console.error("Error inserting user into database:",e),s.status(500).json({message:"Error al registrar el usuario"});s.status(201).json({message:"Usuario registrado con éxito"})}))})),app.post("/login",((e,s)=>{const{email:r,password:o}=e.body;if(console.log(r,o),!r||!o)return s.status(400).json({message:"Todos los campos son obligatorios"});db.query("SELECT * FROM usuarios WHERE correo = ?",[r],(async(e,r)=>{if(e)return console.error("Error fetching user from database:",e),s.status(500).json({message:"Error al iniciar sesión"});const o=r[0],t=jwt.sign({id:o.id},secretKey,{expiresIn:"1h"});s.status(200).json({token:t})}))})),app.post("/api/pedidos",isAuthenticated,((e,s)=>{const{cart:r,total:o}=e.body,t=e.userId,a=Math.random().toString(36).substring(2,12).toUpperCase();db.query("INSERT INTO pedidos (folio, total, estado, idUser) VALUES (?, ?, ?, ?)",[a,o,"pendiente",t],((e,r)=>{if(e)return console.error("Error inserting order into database:",e),s.status(500).json({message:"Error al registrar el pedido"});s.status(201).json({message:"Pedido registrado con éxito"})}))})),app.use(((e,s,r,o)=>{console.error(e.stack),r.status(500).json({message:"Ocurrió un error en el servidor"})})),app.listen(3e3,(()=>{console.log("Server running at http://localhost:3000")}));