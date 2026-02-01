import { Router } from "express";
import { deleteUser, getUserData, login, signup, updateUser } from "./user.service.js";
import { verifyToken } from "../../middlewares/varifyToken.js";
const router=Router()

router.post("/signup", async (req, res, next) => { 
    const result = await signup(req.body)
    return res.status(201).json({message:"user created successfully", data: result})
})

router.post("/login", async (req, res, next) => {
    const result = await login(req.body)
    return res.status(200).json({message:"user logged in successfully", token: result})
})
 
router.use(verifyToken);

router.patch("/", async (req, res, next) => { 
    const result = await updateUser(req.user.id,req.body)
    return res.status(200).json({message:"user updated successfully", data: result})
})

router.delete("/", async (req, res, next) => { 
    const result = await deleteUser(req.user.id)
    return res.status(200).json({message:"user deleted successfully", data: result})
}
)

router.get("",async (req, res, next) => {
    const result = await getUserData(req.user.id)
    return res.status(200).json({ result })
})
export default router