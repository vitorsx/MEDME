import axios from "axios";
const api = axios.create({
	baseURL: "http://localhost:5000",
});

export async function userLogin(email, pass) {
	const r = await api.post("/api/user/login", {
		email: email,
		pass: pass,
	});
	return r.data;
}

export async function userSigIn(name, sobrenome, email, pass) {
	const r = await api.post("/api/user/account", {
		name: name,
		sobrenome: sobrenome,
		email: email,
		pass: pass,
	});
	return r.data;
}

export async function getConsultas(id) {
	const r = await api.get(`/api/user/consultas?id=${id}`)
	console.log(r.data)
	return r.data
}
