"use client"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useState } from 'react';
import { register } from '@/lib/userlib';

export default function Register(){
    const user_roles = ["admin", "user"]
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [tel, setTel] = useState("")
    const [role, setRole] = useState("user")

    const handleSubmit = async () => {
        if(
            !name.trim() || !email.trim() || !password.trim() || !tel.trim() || !role.trim()
        ){
            alert("Please fill in all fields")
            return
        }
        try{
            const res = await register(name, email, password, role, tel)
            if (res){
                console.log("Register success")
            }
        }catch(err){
            console.log("Error while register",err)
        }
    }

    return(
        <div>
            
            <div className="flex justify-center p-auto  w-full  h-auto py-10">
                <div className="flex-col justify-center w-1/2 bg-[#DDD] shadow-xl rounded-xl h-[644px] mx-20 top-10 align-center text-[#000]">
                <div className="flex">Register</div>
                <div className="flex-col bg-[F00]">
                    <TextField id="outlined-basic" label="Name" variant="outlined" 
                                value={name} onChange={(e)=>setName(e.target.value)}/>
                    <TextField id="outlined-basic" label="Email" variant="outlined" 
                                value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <TextField id="outlined-basic" label="Password" variant="outlined" 
                                value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <TextField id="outlined-basic" label="Tel" variant="outlined" 
                                value={tel} onChange={(e)=>setTel(e.target.value)}/>
                    <Autocomplete
                        disablePortal
                        options={user_roles}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Role" 
                        value={role}
                        onChange={(e)=>setRole(e.target.value)}/>}
                    />
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </div>
                
                </div> 
            </div>
        </div>
    )
}