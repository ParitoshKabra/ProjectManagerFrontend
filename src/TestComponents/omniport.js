import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie'
import { Redirect } from 'react-router';
const cookies = new Cookies()

export const Omniport = (props)=>{
    const [isAuth, setisAuth] = useState(false);
    const  codeAuth = ()=>{
        const params = new URLSearchParams(window.location.search);
        // code = params.get("code")
        const auth = params.get("code")
        // axios intercepter
        axios
        .get('http://127.0.0.1:8000/trelloAPIs/oauth_redirect', {params: {code:auth}}, {withCredentials: true})
        .then(response=>{
            cookies.set('sessionid',response.data['sessionid'], {path:"/"})
            cookies.set('csrftoken',response.data['csrftoken'], {path:"/"})
            console.log(response.data)
            console.log(cookies.get('sessionid'), cookies.get('csrftoken'))
            console.log(isAuth)
            setisAuth(true)
            console.log("before redirecting")
            return response.data
        })
        .catch(error=>{console.log("error occured with...", error)});
    }
    useEffect(()=>{
        codeAuth();
    })
    useEffect(()=>{
        console.log(isAuth)
    }, [isAuth])
    return !isAuth ? <p>Authenticating with omniport..</p> : <Redirect to="/" />
    // Encourage loading ui
    
}
// ssh with github
// frontend diff repo