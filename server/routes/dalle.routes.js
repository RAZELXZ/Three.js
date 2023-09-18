import express from 'express'
import * as dotenv from 'dotenv'
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI();


router.route('/').get((req, res) => {
    res.status(200).json({message: "Hello from Dalle Routes"});
})

router.route('/').post(async (req, res) => {
    try {
        // const {prompt} = req.body;
        const response = await openai.images.generate({
            prompt: "A simple Logo",
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
          });
        const image = response.data;
        res.status(200).json({photo: image});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong."})
    }
})

export default router;