import { API_BASE_URL } from "../config.js";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}/${path}`)
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'DELETE'
  })
  return res.json()
}