import React from 'react'

export const TemplateItem = (props)=>{
    console.log(props);
    return (
        <div>
            <h4>{props.attr.title}</h4>
            <p>{props.attr.descp}</p>
            {props.attr.comment  ? <p>{props.attr.comment}</p>: <></>}
        </div>
    );
}