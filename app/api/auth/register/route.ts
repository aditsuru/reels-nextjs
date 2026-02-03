import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	let body;

	// Parse the request body for email & password
	try {
		body = await request.json();
		if (!body) throw new Error("Empty body");
	} catch (_err) {
		return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
	}

	const { email, password } = body;

	// Validate both
	if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

	// Connect DB
	await dbConnect();

	// Check for existing user with same email
	const existinguser = await User.findOne({ email });
	if (existinguser) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

	// Register the user
	try {
		User.create({
			email,
			password,
		});
		return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
	} catch (error) {
		// Internal server error
		console.error("REGISTRATION ERROR: ", error);
		return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
	}
}
