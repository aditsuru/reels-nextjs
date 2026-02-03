import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// User model interface
interface IUser {
	email: string;
	password: string;
	_id?: mongoose.Types.ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
}

// Mongoose schema
const userSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true, trim: true },
	},
	{
		timestamps: true,
	},
);

// Password hashing hook
userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 10);
});

export const User = models?.User || model("User", userSchema);
