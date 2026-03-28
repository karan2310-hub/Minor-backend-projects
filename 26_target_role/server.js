const express= require("express");
const cors=require("cors");
const app=express();
app.use(express.json());
app.use(cors());
let books=[ 
    {id:1, author:"a"},
    {id:2, author:"b"},
    {id:3, author:"c"}
];

function authorize(allowedRoles){//cd c dccn sinsxns cn 
    return (req,res,next)=>{
const role = req.headers.role;

if(!role){return res.status(403).json({error:"role is required"});}
if(!allowedRoles.includes(role)){
    return res.status(403).json({error:"access denied"});
}
next();
};
}

app.get("/books", authorize(["member", "librarian", "admin"]),(req,res)=>{
    res.json(books);
})

app.post("/books", authorize(["librarian","admin"]),(req,res)=>{
    const book={
        id: books.length +1,
        author: req.body.author
    };
    if(!req.body.author) return res.status(400).json({error:"author is required"});
    books.push(book);
    res.json(books);

})

app.delete("/books/:id", authorize(["admin"]),(req,res)=>{
    books=books.filter(b=>b.id!==req.params.id);
    res.json({message:"book is deleted"});
});
app.listen(3000,()=>{
    console.log("book runs!!!!");
})