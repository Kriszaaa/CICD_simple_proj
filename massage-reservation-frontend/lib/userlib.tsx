import { API_URL } from "@/app/_constant/env"

export async function register(
    name:string,
    email:string,
    password:string,
    role:string,
    tel:string
    ) {
    try{
        const response = await fetch(`${API_URL}/user/register`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            // credentials:'include',
            body:JSON.stringify({
                name:name,
                email:email,    
                password:password,
                role:role,
                tel:tel
            })
        })
        if(response.ok){
            return response.json()
        }
    }catch(err){
        console.log("Error while register",err)
    }
}