
const express=require("express");

const jwt=require("jsonwebtoken");

const bcrypt=require("bcryptjs");


const app =express();
app.use(express.json());

const SECRET="secret";
let users=[];
app.post("/register",async(req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(400).json({error:"Username and password req"}
        );
    }
    const hashedPassword=bcrypt.hashSync(password,8);
    users.push({username,password:hashedPassword});
    res.json({message:"User registerd"});
})

app.post("/login",async(req,res)=>{
    const {username,password}=req.body;

    const user= users.find(u=>u.username=== username);
    if(!username) return res.status(401).json({error:"Invalid creds"});

    const valid= bcrypt.compareSync(password,user.password);
    if(!valid) return res.status(401).json({error:"Invalid creds"});

    const token=jwt.sign({username},SECRET,{expiresIn:"1hr"});

    res.json({token});
})
function authenticate(req,res,next){
    const authHeader=req.headers.authorization;

    if(!authHeader)
        return res.status(401).json({error:"Token missing"});

    const token=authHeader.split(" ")[1];
    try{
        const decoded=jwt.verify(token,SECRET);
        req.user=decoded;
        next();
    }
    catch{
        res.status(401).json({error:"Invalid token"})
    }

}

app.get("/profile",authenticate,(req,res)=>{
    res.json({message:"Welvome",user:req.user});
});
app.listen(3000,()=>{
    console.log("Running!"); 
})