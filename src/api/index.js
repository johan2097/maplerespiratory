import axios from 'axios'

export var api_url;
export var static_url;

/*api_url = process.env.API_URL */
api_url = "https://portalpacientes.maplerespiratory.co/api/"
static_url = process.env.STATIC_URL

const AUTH_TOKEN = localStorage.getItem('authToken') || ""

export default function initApi() {
  axios.defaults.baseURL = api_url
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
  axios.defaults.headers.post['Content-Type'] = 'application/json'
}





