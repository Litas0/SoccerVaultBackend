import mongoose from "mongoose"

const playerSchema = new mongoose.Schema({
    team: { type: mongoose.SchemaTypes.ObjectId, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    position: { type: String, required: true },
    number: { type: Number, required: true }
})

playerSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

export default mongoose.model('Player', playerSchema)

