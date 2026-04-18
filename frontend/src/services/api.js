import axios from "axios"

const BASE_URL = "http://127.0.0.1:5000"

export const runAgent = async (data) => {
    const res = await axios.post(`${BASE_URL}/run-agent`, data)
    return res.data
}

export const getEmployees = async (company) => {
    const res = await axios.get(`${BASE_URL}/get-employees`, { params: { company } })
    return res.data
}

export const findCompanies = async (icp) => {
    const res = await axios.post(`${BASE_URL}/find-companies`, { icp })
    return res.data
}

export const sendDraft = async (to, body, subject) => {
    const res = await axios.post(`${BASE_URL}/send-draft`, { to, body, subject })
    return res.data
}