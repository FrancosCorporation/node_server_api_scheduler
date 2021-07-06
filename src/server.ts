import express from "express";

const app = express();
const port = 3333;
app.get('/', (request, response) => {
    return response.json({
        message:"e ai cara, agora vai pra valer certo?"
    })
})
app.listen(port, ()=>{console.log(`http://localhost:${port}`)})