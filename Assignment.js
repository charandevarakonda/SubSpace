const express=require("express")
const axios=require("axios")
const lodash=require("lodash")
const app=express()

app.get('/api/blog-stats',async (req,res)=>{
    try{
        const ResponseData=await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
            headers:{
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        })
        blogdata=ResponseData.data;
        console.log(blogdata);
        const totalNumberOfBlog=blogdata.blogs.length
        const longestTitleBlog=lodash.maxBy(blogdata.blogs,blog=>blog.title.length)
        const totalPrivacyBlogs=lodash.filter(blogdata.blogs,blog=>blog.title?.toLowerCase().includes('privacy'))
        const arrayUnique=lodash.uniqBy(blogdata.blogs,'title')
        res.json({
            totalNumberOfBlogs:totalNumberOfBlog,
            titleOfTheLongestBlog:longestTitleBlog.title,
            numberOfBlogsWithPrivacy:totalPrivacyBlogs.length,
            uniqueTitlesArray:arrayUnique.map(blog=>blog.title)

        })

    }catch(err){
        console.error('Axios Error:', err.message);
        res.json({error:"Internal Server Error"})

    }
})

app.get('/api/blog-search',async (req,res)=>{
    try{
        const ResponseData=await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
            headers:{
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        })
        blogdata=ResponseData.data;
        // console.log(blogdata);
        const {query}=req.query
        if(!query){
            return res.status(500).json({err:"Plese enter the query"})
        }
        
        const blogsWithQuery=blogdata.blogs.filter(blog=>blog.title.toLowerCase().includes(query.toLowerCase()))
        return res.json({
            blogsWithQuery:blogsWithQuery

        })

    }catch(error){
        console.error(error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
})

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  });
  

app.listen(1080,()=>{
    console.log("Listening to port 1080");
})