import { Router } from "express"
import { verifyToken } from "../../middlewares/varifyToken.js"
import { addNote, deleteAllUserNotes, deleteNote, getNoteByContent, getNotesWithUserAggregation, getNotesWithUserDetails, getUserNote, paginationSort, replaceNote, UpdateAll, updateNote } from "./note.service.js"

const router = Router()

router.use(verifyToken)

//Post EndPoints
router.post("/", async (req, res, next) => {
    const result = await addNote( req.user.id , req.body )
    return res.status(201).json({ message : "Note Added Successfuly" , result})
})

//Patch EndPoints
router.patch("/all", async (req, res, next) => {
    const result = await UpdateAll(req.user.id, req.body)
    return res.status(200).json({message:"All Notes Updated",result})
    return 
})

router.patch("/:noteId",async (req, res, next) => {
    const result = await updateNote(req.user.id , req.params.noteId , req.body)
    return res.status(200).json({message:"Note Updated Successfully" , result})
})

//Put EndPoints
router.put("/replace/:noteId",async (req, res, next) => {
    const result = await replaceNote(req.user.id , req.params.noteId , req.body)
    return res.status(200).json({message:"Note Updated Successfully" , result})
})


//delete EndPoints
router.delete("/",async (req, res, next) => {
    const result = await deleteAllUserNotes(req.user.id)
        return res.status(200).json({message:"Deleted",result})

})
router.delete("/:noteId",async (req,res,next) => {
    const result = await deleteNote(req.user.id,req.params.noteId)
    return res.status(200).json({message:"user Deleted Successfully",result})
})


//Get EndPoints
    router.get("/paginate-sort", async (req, res, next) => {
        const result = await paginationSort(req.user.id, req.query)
        return res.status(200).json({ message: "data fetched successfully", result })
    })

    router.get("/note-by-content", async (req, res, next) => {
        const result = await getNoteByContent(req.user.id, req.query)
        return res.status(200).json({ message: "Note Fetched Successfully", result })
    })

    router.get("/note-with-user", async (req, res, next) => {
        const result = await getNotesWithUserDetails(req.user.id)
        return res.status(200).json({ message: "Note Fetched Successfully", result })
    })
    router.get("/aggregate", async (req, res, next) => {
        const result = await getNotesWithUserAggregation(req.user.id, req.query)
        return res.status(200).json({ message: "Note Fetched Successfully", result })
    })

    router.get("/:noteId", async (req, res, next) => {
        const result = await getUserNote(req.user.id, req.params.noteId)
        return res.status(200).json({ message: "Note Fetched Successfully", result })
    })

export default router 