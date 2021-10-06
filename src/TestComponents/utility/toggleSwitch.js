import React from 'react'
import { useState } from 'react';
import { Button } from '@material-ui/core';

export const ToggleSwitch = (props)=>{
    const [toggle, setToggle] = useState(false);
    return (
    <>
    <Button variant="contained" onClick={()=>{setToggle(!toggle)}}>{props.name}</Button>
    {!toggle ? <></> : props.children}
    </>);
}