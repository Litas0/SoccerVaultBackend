import mongoose from "mongoose"

const teamSchema = new mongoose.Schema({
    league: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'League' },
    name: { type: String, required: true },
    description: String,
    stadionAdress: String,
    players: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Player' }]
})

teamSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

export default mongoose.model("Team", teamSchema)

