import mongoose from "mongoose";
import { noteModel } from "../../DB/model/notes.model.js"
import { userModel } from './../../DB/model/user.model.js';


const noteAndUserAuth =async (userId , noteId) => {
    const note =await noteModel.findById(noteId)
    
    if (!note) {
        throw new Error("Note Not Found" , {cause:{status:404}})
    }
    if (note.userId != userId) {
        throw new Error("You Are Not The Onwer",{cause:{status:402}})
    }
    return note.__v+1
}

export const addNote = async (userId, data) => {
    const {title , content} = data
    const checkUserExist = userModel.findById(userId)
    if (!checkUserExist) {
        throw new Error("User Not Found ",{ cause : { status : 404 } })
    }
    const note = await noteModel.create([ { title , content , userId } ])
    return note
}

export const updateNote = async (userId, noteId, data) => {
    const __v = await noteAndUserAuth(userId, noteId)
    console.log(__v);
    
    const updatedNote = noteModel.findByIdAndUpdate(noteId, { userId ,__v, ...data }, { new: true })
    return updatedNote
}
export const replaceNote = async (userId, noteId, data) => {
    await noteAndUserAuth(userId, noteId)
    const updatedNote = noteModel.findOneAndReplace({ _id: noteId }, { ...data , __v:0}, { new: true })
    return updatedNote
}

export const UpdateAll = async (userId, data) => {
    console.log(data);
    const notes = await noteModel.updateMany({ userId }, {data}, { runValidators: true })
    
    if (notes.matchedCount == 0) {
        throw new Error("No Notes Found",{cause:{status:400}})
    }
    return notes
}

export const deleteNote = async (userId, noteId) => {
        await noteAndUserAuth(userId,noteId)
        const deletedUser = noteModel.findByIdAndDelete(noteId, { new: true })
        return deletedUser
        
}

export const paginationSort = async (userId, query)=>{
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 5
    const skip = (page-1) * limit
    const notes = await noteModel.find({userId}).skip(skip).limit(limit).sort({createdAt:-1})
    if (!notes) {
        throw new Error("No Notes Found",{cause:{status:404}})
    }
    return notes
}

export const getUserNote = async (userId,noteId) => {
    await noteAndUserAuth(userId, noteId)
    const note = await noteModel.findById(noteId)
    return note

}
export const getNoteByContent = async (userId,query) => {
    const note = await noteModel.find({userId,content:{$regex:query.search}})
    if (note.length==0) {
        throw new Error("No Notes Found",{cause:{status:404}})
    }
    return note

}

export const getNotesWithUserDetails = async (userId) => {
    const notes = await noteModel.find({ userId }).select('title userId createdAt').populate('userId','email -_id')
    if (notes.length==0) {
        throw new Error("No Notes Found",{cause:{status:404}})
    }
    return notes

}
export const getNotesWithUserAggregation = async (userId, { search }) => {
    const matchQuery = { userId: new mongoose.Types.ObjectId(userId) }
    if (search) {
        matchQuery.tilte = { $regex: search }
    }
    
    const notes = await noteModel.aggregate([
        {
            $match:matchQuery
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $project:{
                title: 1,
                userId:1,
                createdAt: 1,
                user: {
                    name: { $arrayElemAt: ['$user.name', 0] },
                    email: { $arrayElemAt: ['$user.email', 0] }
                }
            }
        }
    ])
    if (notes.length==0) {
        throw new Error("No Notes Found",{cause:{status:404}})
    }
    return notes

}

export const deleteAllUserNotes = async (userId) => {
    const deletedNotes = await noteModel.deleteMany({ userId })
    return deletedNotes
}