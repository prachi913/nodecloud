const dotenv = require('dotenv').config();
const express = require('express');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const {connect} = require('./config/database'); 
const {UserRouter} = require('./Routes/User.routes');

// My firebase Imports
const admin = require("firebase-admin");
const serviceAccount = require("./my-firebase-keys.json");

// Making connection to my firebase Account that i created today;
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    storageBucket : 'shunya-friendly.appspot.com'
}); 

app.use(cors());
app.use(express.json());
app.use('/users', UserRouter);

const bucket = admin.storage().bucket();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to handle the file upload
app.post('/upload', upload.single('file'), async (req, res) => {

  console.log('file' , req.file)
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    if(!req.file.mimetype.startsWith('image/')) {
        return res.status(400).send({error : 'Only image Format allowed'});
    }

  // Upload the file to Firebase Storage
  const filename = req.file.originalname;
  const fileBuffer = req.file.buffer;

  console.log(filename,'\n',fileBuffer);

  const file = bucket.file(filename);
  await file.save(fileBuffer, {
    contentType: req.file.mimetype,
    public: true, // Make the uploaded file publicly accessible
  });

  // Get the public URL of the uploaded file
  const imageUrl =  file.publicUrl();

  console.log(imageUrl);

  res.status(200).send({profile_url : imageUrl,message : 'File uploaded successfully.'});
});


app.listen(PORT, async () => {
    try {
        //Makes Connection to the Database
        await connect; 
        console.log('\n------------------------------------------------------------------------\n');
        console.log('   🍾 🥳 Connected To The Server and The Database Successfully 🍾 🥳');
        console.log('\n------------------------------------------------------------------------\n');
    } catch (error) {
        console.log('\n***********************************************************************************\n');
        console.log('❌ ⚠️  UNABLE TO CONNECT TO THE DATABASE OR THE SERVER DUE TO FOLLOWING ERROR ❌ ⚠️');
        console.log('\n***********************************************************************************\n');
        console.error(error);
    }
});