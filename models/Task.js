import { Schema, model } from "mongoose";

 
const taskSchema = new Schema({
  title : {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: { 
    type: String, 
    enum: {
      values: ['To Do', 'In Progress', 'Done'],
      message: '{VALUE} is not a valid status' 
    },
    default: 'To Do'
  },
  project: {
  type: Schema.Types.ObjectId,
  ref: 'Project',
  required: true
},

});
 

const Task = model("Task", taskSchema);
 
module.export = Task;