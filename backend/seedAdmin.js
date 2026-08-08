import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Employee from "./models/Employee.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding...");

    const existingAdmin = await Employee.findOne({ role: "admin" });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log(`✅ Existing Admin account updated.`);
      console.log(`🔑 Admin Email: ${existingAdmin.email}`);
      console.log(`🔑 Admin Password: admin123`);
    } else {
      const newAdmin = await Employee.create({
        name: "System Admin",
        email: "admin@ems.com",
        password: hashedPassword,
        role: "admin",
        department: "Management",
        designation: "Administrator",
      });
      console.log(`✅ New Admin account created.`);
      console.log(`🔑 Admin Email: ${newAdmin.email}`);
      console.log(`🔑 Admin Password: admin123`);
    }

    const existingEmp = await Employee.findOne({ email: "employee@ems.com" });
    const empPassword = await bcrypt.hash("employee123", 10);

    if (existingEmp) {
      existingEmp.password = empPassword;
      await existingEmp.save();
      console.log(`✅ Existing Employee account updated: employee@ems.com / employee123`);
    } else {
      await Employee.create({
        name: "Demo Employee",
        email: "employee@ems.com",
        password: empPassword,
        role: "employee",
        department: "Engineering",
        designation: "Software Engineer",
      });
      console.log(`✅ New Employee account created: employee@ems.com / employee123`);
    }

    process.exit(0);

  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedAdmin();
