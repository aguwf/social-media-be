import mongoose from 'mongoose'

const Schema = mongoose.Schema
const model = mongoose.model

const ImageModel = new Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  cloudinary_id: {
    type: String
  },
  thumb200: {
    type: String
  },
  thumb300: {
    type: String
  },
  thumb500: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now()
  }
})

export default model('Image', ImageModel)
