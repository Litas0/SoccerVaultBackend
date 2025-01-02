import mongoose from "mongoose"

const matchSchema = new mongoose.Schema({
    date: { type: Date },
    place: { type: String, required: true },
    played: { type: Boolean, required: true},
    homeTeamId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref:'Team' },
    homeTeamName: String,
    awayTeamId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref:'Team' },
    awayTeamName: String,
    score: {
        home: Number,
        away: Number
    }
})

const roundSchema = new mongoose.Schema({
    league: { type: mongoose.SchemaTypes.ObjectId, required: true, ref:'League' },
    number: { type: Number, required: true },
    matches: [matchSchema]
})

roundSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

export default mongoose.model("Round", roundSchema)

