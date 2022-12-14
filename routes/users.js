const router = require('express').Router();
const {userRegister, userLogin, userAuth, serializeUser, checkRole} =require('../utils/Auth')
 router.post("/register-user", async(req,res)=>{
    await userRegister(req.body,"user", res);
 });
 router.post("/register-admin", async(req,res)=>{
    await userRegister(req.body,'admin', res);
 });
 router.post("/register-super-admin", async(req,res)=>{
    await userRegister(req.body,'superadmin', res);
 });
 router.post("/login-user", async(req,res)=>{
   await userLogin(req.body,'user', res)
 });
 router.post("/login-admin", async(req,res)=>{
   await userLogin(req.body,'admin', res)
 });
 router.post("/login-super-admin", async(req,res)=>{
   await userLogin(req.body,'superadmin', res)
 });
 router.get("/profile",userAuth, async(req,res)=>{
   return res.json(serializeUser(req.user))
 })
 router.get("/user-protectd",userAuth,checkRole(['user']), async(req,res)=>{
   return res.json(serializeUser(req.user))
 });
 router.get("/admin-protectd",userAuth,checkRole(['admin']), async(req,res)=>{
   return res.json(serializeUser(req.user))
 });
 router.get("/super-admin-protectd",userAuth,checkRole(['superadmin']), async(req,res)=>{
   return res.json(serializeUser(req.user))
 });
 router.get("/super-admin-and-admin-protectd",userAuth,checkRole(['superadmin','admin']), async(req,res)=>{
   return res.json(serializeUser(req.user))
 });

module.exports = router;