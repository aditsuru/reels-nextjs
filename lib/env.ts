import * as z from "zod";

const envSchema = z.object({
	// General
	NODE_ENV: z.enum(["production", "test", "development"]).default("development"),

	// Database
	MONGODB_URI: z.url(),
	DB_BUFFER_COMMANDS: z.coerce.boolean().default(false),
	DB_MAX_POOL_SIZE: z.coerce.number().default(2),
	DB_SERVER_TIMEOUT_MS: z.coerce.number().default(5000),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
	console.error(z.prettifyError(env.error));
	process.exit(1);
}

export default env.data;
