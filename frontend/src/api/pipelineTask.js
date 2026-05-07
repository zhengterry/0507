import axios from 'axios'

const baseURL = 'http://localhost:3000/api/pipeline-task'

export const getPipelineTasks = (params) => {
  return axios.get(baseURL, { params })
}

export const getPipelineTask = (id) => {
  return axios.get(`${baseURL}/${id}`)
}

export const createPipelineTask = (data) => {
  return axios.post(baseURL, data)
}

export const updatePipelineTask = (id, data) => {
  return axios.put(`${baseURL}/${id}`, data)
}

export const deletePipelineTask = (id) => {
  return axios.delete(`${baseURL}/${id}`)
}