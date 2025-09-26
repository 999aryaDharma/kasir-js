const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(response) {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }));
		throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.data; // Asumsi API Anda selalu mengembalikan { success: boolean, data: ... }
}

export const fetcher = async (url) => {
	const response = await fetch(`${BASE_URL}${url}`);
	return handleResponse(response);
};

export const mutator = async (url, { arg }) => {
	const response = await fetch(`${BASE_URL}${url}`, {
		method: arg.method,
		headers: { "Content-Type": "application/json" },
		body: arg.body ? JSON.stringify(arg.body) : null,
	});
	return handleResponse(response);
};
