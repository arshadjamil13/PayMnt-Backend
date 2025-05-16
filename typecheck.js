const {z} = require("zod")
const checkSignup = z.object({
    username : z.string(),
    password: z.string(),
    firstname : z.string(),
    lastname :z.string()
})

const checksignin = z.object({
    username : z.string(),
    password: z.string(),
})

const updateBody = z.object({
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
})

module.exports = {
    checkSignup,
    checksignin,
    updateBody
}