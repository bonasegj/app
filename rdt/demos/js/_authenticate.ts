//----------------------------
import { client, parsers } from '../../dist/webauthn.min.js'

type Data = {
    username: any,
    isRegistered: boolean, 
    isAuthenticated: boolean,
    isRoaming: boolean,
    registrationData: any,
    authenticationData: any
  };

  let data: Data = {
    username: "user",
    isRegistered: false,
    isAuthenticated: false,
    isRoaming: false,
    registrationData: null,
    authenticationData: null
  };

  async function checkIsRegistered() {
    console.log(data.username + ' => ' + !!window.localStorage.getItem(data.username))
    data.isRegistered = !!window.localStorage.getItem(data.username)
  };
  async function register() {
    let res = await client.register(data.username, window.crypto.randomUUID(), { 
    "authenticatorType": "auto",
    "userVerification": "required",
    "timeout": 60000,
    "attestation": false,
    "debug": false })
    console.debug(res)

    const parsed = parsers.parseRegistration(res)
    console.log(parsed)

    window.localStorage.setItem(data.username, parsed.credential.id)
    data.isAuthenticated = true
    data.registrationData = parsed

    console.log({
      message: 'Registered!',
      type: 'is-success'
    })

    await checkIsRegistered();
  };
  async function login() {
    let credentialId = window.localStorage.getItem(data.username)
    let res = await client.authenticate(credentialId ? [credentialId] : [], window.crypto.randomUUID(), { 
    "authenticatorType": "auto",
    "userVerification": "required",
    "timeout": 60000,
    "debug": false});
    console.debug(res)

    const parsed = parsers.parseAuthentication(res)
    console.log(parsed)

    data.isAuthenticated = true
    data.authenticationData = parsed

    console.log({
      message: 'Signed in!',
      type: 'is-success'
    })
  };
  async function logout() {
    data.isAuthenticated = false;
    console.log({
      message: 'Signed out!',
      type: 'is-success'
    })
    data.authenticationData = null
    data.registrationData = null
  }
  
  checkIsRegistered();
  if (data.isRegistered) login();
  else register();

//---------------------------------
