"use client"
import { useEffect } from 'react'
import api from "@/lib/api"; // Assuming your configured Axios instance

const page = () => {
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await api.get('/profile');
            console.log(response)
        }
        fetchProfile()
    }, [])
  return (
    <div>page</div>
  )
}

export default page
    