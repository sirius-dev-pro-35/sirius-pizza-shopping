import express, { json } from 'express';
import cors from 'cors'; // Import the cors middleware
import indexRouter from '../routes/index.route.mjs';


const app = express();
const port = 3000; // Choose a port for your server

app.use(cors());
app.use(json());

//routes
app.use("/", indexRouter)
app.use(("*"), (req, res) => {
    res.send("404 - Not Found!")
})

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
