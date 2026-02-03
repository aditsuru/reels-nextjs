import env from "@/lib/env";
import mongoose, { type ConnectOptions } from "mongoose";

// Helper variables
const options: ConnectOptions = {
	bufferCommands: env.DB_BUFFER_COMMANDS,
	maxPoolSize: env.DB_MAX_POOL_SIZE,
	serverSelectionTimeoutMS: env.DB_SERVER_TIMEOUT_MS,
};

// Connection cache
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = {
		conn: null,
		promise: null,
	};
}

// Main functions
async function dbConnect() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(env.MONGODB_URI, options).then((mongoose) => mongoose.connection);
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		console.error(error);
		cached.promise = null;
		throw error;
	}

	return cached.conn;
}

export default dbConnect;
