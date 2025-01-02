import mongoose from "mongoose"

const leagueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    rematches: { type: Boolean, required: true },
    numberOfTeams: { type: Number, required: true},
    ownerId: { type: String, required: true },
    ownerFullName: { type: String, required: true },
    teams: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Team' }],
    calendar: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Round' }]
})

leagueSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

export default mongoose.model("League", leagueSchema)

