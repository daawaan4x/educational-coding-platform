import bcrypt from "bcrypt";

const saltRounds = Number(process.env.USERPASS_SALT_ROUNDS ?? 12);

export async function hashPassword(password: string) {
	const hash: string = await bcrypt.hash(password, saltRounds);
	return hash;
}

export async function verifyPassword(password: string, hash: string) {
	const match: boolean = await bcrypt.compare(password, hash);
	return match;
}
