
import { algorithm, JWT_SECRET, SALT_ROUND, securityKey } from '../../../config/config.service.js';
import { userModel } from './../../DB/model/index.js';
import * as crypto from "node:crypto"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



function encryptData(data) { 
    const IV = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(securityKey, 'hex'), IV);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${IV.toString('hex')}:${tag}:${encrypted}`;
}

function decryptData(encryptedData) {
    const [iv, tag, content] = encryptedData.split(':');
    
    const decipher = crypto.createDecipheriv(
        algorithm, 
        securityKey, 
        Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

async function hashPassword(password) {
    const salt = SALT_ROUND
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}

export const signup = async (userData) => {
    const { name, password, email, age, phone } = userData;
    const encryptedPhoneData = encryptData(phone);
    const hashedPassword = await hashPassword(password);
    const checkUserExist = await userModel.findOne({ email });
    if (checkUserExist) { 
        throw new Error('User already exists', { cause: { status: 409 } });
    }
    const user = await userModel.create([{ name, password: hashedPassword, email, age, phone: encryptedPhoneData }]);
    return user;
}


export const login = async (loginData) => { 
    const { email, password } = loginData;
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password', { cause: { status: 401 } });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password', { cause: { status: 401 } });
    }
    const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:"1h"})
    return token
}

export const updateUser = async (userId, updateData) => { 
    const checkUserExist = await userModel.findById(userId);
    if (!checkUserExist) {
        throw new Error('User not found', { cause: { status: 404 } });
    }
    if(updateData.email){
        const checkEmailExist = await userModel.findOne({email:updateData.email});
        if (checkEmailExist && checkEmailExist._id.toString() !== userId) {
            throw new Error('Email already in use', { cause: { status: 409 } });
        }    
    }

    if (updateData.password) {
        delete updateData.password
    }
    console.log(updateData);
    
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
        new: true,
        select: '-password',
         runValidators: true
     });
    return updatedUser;
}

export const deleteUser = async (id) => {
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (!user) {
            throw new Error("User not found" , { cause: { status:404 } } )
        }
        return user 
    } catch (error) {
        if (error.cause && error.cause.status) {
            throw error;
        }
        throw new Error("Something Went Wrong", { cause : { status:400 } })
    }   
}

export const getUserData = async (id) => {
    try {
        const user = await userModel.findById(id)
        return user
    } catch (error) {
        throw new Error('Something Went Wrong',{ cause : { status : 400}})
    }
    
}