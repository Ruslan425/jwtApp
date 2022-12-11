import { Schema, model } from "mongoose";

const UserToken = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true},
    accessToken: {type: String, required: true}
})

export default model('UserToken', UserToken)