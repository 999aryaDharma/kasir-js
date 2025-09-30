export function decodeJWT(token) {
	try {
		// JWT token terdiri dari 3 bagian: header.payload.signature
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const payload = JSON.parse(typeof window !== "undefined" ? window.atob(base64) : Buffer.from(base64, "base64").toString());
		return payload;
	} catch (error) {
		return null;
	}
}
