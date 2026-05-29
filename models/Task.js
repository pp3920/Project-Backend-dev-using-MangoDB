const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 
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
 
const Task = mongoose.model("Task", taskSchema);

// export default ki jagah module.exports use karo
module.exports = Task;