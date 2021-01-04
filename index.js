const express = require('express');
const multer=require("multer");
const nodemailer=require("nodemailer");
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const cors = require('cors');
var path = require('path');
require('dotenv').config();


const pdfTemplate = require('./documents');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT || 5000;



const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000
    }
})
app.use('/image', express.static('public/images'));
app.post("/public", upload.single('image'), (req, res) => {

    res.json({
        success: 1,
        profile_url: `https://temp-casestudy-app.herokuapp.com/image/${req.file.filename}`
    })
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(), {}).toFile(".public/result.pdf", (err) => {
        if(err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
});

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
})


app.post('/api/form',(req,res)=>{
  
        nodemailer.createTestAccount((err,account)=>{


            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: req.body.senderemail,
                    pass: req.body.password
                }
            });
    
            let mailOption ={
                from: req.body.senderemail, // sender address
                to: req.body.receiveremail,// list of receivers 
                subject: "Analysis Data", // Subject line
                attachments: [
                    { filename: 'result.pdf',
                    path: path.join(__dirname,'result.pdf'), // <= Here
                    contentType: 'application/pdf' } // TODO: replace it with your own image
                ]
                
              }
    
            transporter.sendMail(mailOption,(err,info)=>{
                if(err){
                    res.send('sharing failed')
                }
                res.send('Shared Successfully')
                
            })
        })
    });


app.listen(port, () => console.log(`Listening on port ${port}`));