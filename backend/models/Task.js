
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // ✅ Admin Status (Only Admin can update this)
    adminStatus: {
      type: String,
      enum: ["New", "Active", "Completed", "Failed"],
      default: "New",
    },

    // ✅ Employee Status (Only Employee can update this)
    employeeStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },

    // ✅ Employee assigned to this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true, // Recommended for proper task allocation
      index: true,
    },

    // ✅ Priority Level
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    // ✅ Attachment URL (Figma, GitHub PR, Docs, etc.)
    attachmentUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Task Deadline
    deadline: {
      type: Date,
      required: true,
      index: true,
    },

    // ✅ Task Comments & Activity Stream
    comments: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },


  { timestamps: true }
);

// ✅ Optional: Prevent selecting unwanted fields globally
// taskSchema.set("toJSON", {
//   transform: function (doc, ret) {
//     delete ret.__v;
//     return ret;
//   },
// });

const Task = mongoose.model("Task", taskSchema);
export default Task;
