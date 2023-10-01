const express = require('express');
const UserRouter = express.Router();
const {USER_MODEL} = require('../Models/usermodel')

//this Route sends All the users Present in the Database
UserRouter.get('/get', async (req,res) => {
    try {
        const allUsers = await USER_MODEL.find();
        console.log(allUsers);
        res.status(200).send({users : allUsers})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

//this Route used to Add New users to the Database
UserRouter.get('/get/:user_id', async (req,res) => {
    try {
        const {user_id} = req.params;
        const user = await USER_MODEL.findById(user_id);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error('Unable to get the user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

//this Route used to Add New users to the Database
UserRouter.post('/post', async (req,res) => {
    try {
        const newUser = req.body;
        console.log('ffgfgfg',newUser);
        const user = new USER_MODEL(newUser);
        await user.save();
        res.status(201).send({message : "New user added successfully", user: newUser});
    } catch (error) {
        console.error('Unable to Add New user:', error);
        if (error.code === 11000) {
            return res.status(400).send({error : "User with this email id already exists", code : 11000})
        }
        res.status(500).send({ error: 'Server Error' });
    }
});

//this Route used to Update users Data to the Database
UserRouter.put('/put/:user_id', async (req,res) => {
    try {
        const {user_id} = req.params;
        const user = req.body;
        const update_user = await USER_MODEL.findByIdAndUpdate(user_id,user);

        if (!update_user) {
            return res.status(404).send({ error: 'User not found' });
        }
        
        res.send({message : 'User updated succesfully ', updatedUser : update_user});

    } catch (error) {
        console.error('Unable to update the user:', error);
        res.status(500).send({ error: 'Server Error' });
    }
});

//this Route used to Delete users Data from the Database
UserRouter.delete('/delete/:user_id', async (req,res) => {
    try {
        const {user_id} = req.params;
        const user = req.body;
        const delete_user = await USER_MODEL.findByIdAndDelete(user_id);

        if(!delete_user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send({message : 'User deleted successfully', deleted_uSer : delete_user})
    } catch (error) {
        console.error('Unable to Delete the user:', error);
        res.status(500).send({ error: 'Server Error' });
    }
});

module.exports = {UserRouter}