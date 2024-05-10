const express= require('express');
const app=express();
const port=process.env.PORT || 8000;
const db=require('./config/db');
const Post=require('./models/Post');



db().then(()=>console.log('Successfully connected to db')).catch((err)=>console.log(err));

app.use(express.static('public'));
const middleware=(req, res, next)=>{
    req.customInfo = 20;
    console.log("You Entered a middleware");
    next();
}

app.use(express.json());


app.get('/api/', (req,res)=>{
    res.status(200).json({message:" Api is working fine"});
})

app.get('/api/posts',(req,res)=>{
    Post.find({}).then((data)=>{
        console.log(data)
        res.status(200).json({data})
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({message:err});
    })
})


app.get('/api/posts/:id',(req,res)=>{
    let postid=req.params.id;
    Post.find({_id:postid}).then((data)=>{
        console.log(data)
        res.status(200).json({data})
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({message:err});
    })
})

app.post('/api/posts/',(req,res)=>{

    let newPost= new Post({
        title: req.body.title,
        description:  req.body.description
    })

    newPost.save().then((data)=>{
        console.log(data)
        res.status(200).json({message: "Posts created successfully", data: data})
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({message:err});
    })
})

app.put('/api/posts/:id',(req,res)=>{
    let postid=req.params.id;

    let newinfo= {
        title: req.body.title,
        description:  req.body.description
    }
    Post.findByIdAndUpdate(postid, newinfo).then((data)=>{
        console.log(data)
        res.status(200).json({message: "post updated successfully", data: data})
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({message:err});
    })
})

app.delete('/api/posts/:id', (req,res)=>{
    let postid=req.params.id;

    Post.findByIdAndDelete(postid).then(()=>{
        res.status(200).json({message: "post updated successfully"})
    }).catch((err)=>{
        res.status(500).json({message:err}); 
    })
})



app.get('/',(req, res)=>{
    res.send('Hello World'); 
})

app.get('/me', middleware, (req, res)=>{
    console.log(req.customInfo);
    res.send("Hello how are you");
})

app.get('/users/:username' , (req,res)=>{
    console.log(req.params);
    res.send('Welcome to USer Search');
})

app.get('/page',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.listen(port, (err)=>{
    if(!err){
        console.log(`Server is running at port ${port}`);
    }
})