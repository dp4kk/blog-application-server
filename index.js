require('dotenv/config')
const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')

const app=express()

app.use(cors({credentials:true , origin:true}))
app.options('*',cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())



mongoose.connect(process.env.MONGO_URL,{useNewUrlParser :true ,useUnifiedTopology:true})

const blogSchema = new mongoose.Schema({
    title:String,
    content:String,
    imageURL:String,
    creator:String,
    comment:Array,
    date:Date
},
{
    collection:"blogdata"
}) 

const Blog=mongoose.model('blog',blogSchema)

app.post('/saveblog',async(req,res)=>{
    const {title,content,imageURL,creator}=req.body

    try {
        const newBlog = new Blog({
            title,
            content,
            imageURL,
            creator,
            date:new Date()
        })

        await newBlog.save().then(()=>{
            res.status(200).send({message:"Blog Saved"})
        })
        .catch((err)=>{
            res.status(400).send({message:err})
        })
    } catch (error) {
        res.status(400).send({message:error})      
    }
})


app.get('/getblog',async(req,res)=>{
    const blogs = await Blog.find({})
    res.send(blogs)
})

app.get('/searchblog',async(req,res)=>{
    let id=req.query.id
    const blogdata =await Blog.findById({_id : id}).exec()
    res.send(blogdata)
})

app.get('/userblog',async(req,res)=>{
    let name=req.query.name
    const userblog = await Blog.find({creator : name}).exec()
    res.send(userblog)
})


app.get('/',(req,res)=>{
    res.send('CHECK CHECK CHECK')
})




app.listen(process.env.PORT || 5000 , ()=>{
    console.log('Listening at PORT 5000')
})