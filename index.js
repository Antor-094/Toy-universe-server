const express = require('express')
const port = process.env.PORT || 5000;
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('Toy Universe is running')
});

app.listen(port, () => {
    console.log(`Toy Universe Api is running on port: ${port}`)
})