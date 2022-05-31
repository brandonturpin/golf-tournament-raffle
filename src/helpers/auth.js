import Cookies from 'js-cookie'
import axios from "axios";

const tokenName = 'access_token';
const getAccessToken = () => Cookies.get(tokenName)
const setAccessToken = (token) => Cookies.set(tokenName, token)
const isAuthenticated = () => !!getAccessToken()

const signin = (username, password) => {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3500/users/login`, {
            username: username,
            password: password
        })
        .then((response) => {
            if(response.status === 200 && response.data.isSuccess){
                setAccessToken(response.data.value);
                resolve();
            } else {
                reject();
            }
        });
    });
}

const signUp = (request) => {
    return new Promise((resolve, reject) => {
      axios.post(`http://localhost:3500/users/signup`, request)
      .then((response) => {
          if(response.status === 200 && response.data.isSuccess){
              setAccessToken(response.data.value);
              resolve();
          } else {
              reject();
          }
      });
  });
  }

export { isAuthenticated, signin, signUp, getAccessToken };