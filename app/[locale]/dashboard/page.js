"use client"

import React from 'react'
import { useAuth } from "@/context/userContext";
import ProtectedRoute from '../../../components/protectedRoute';


const Dashboard = () => {
    const {user } = useAuth()

  return (
    <div>
      This is the user {user && user.username}
    </div>
  )
}

const page = ( ) => {
    return <ProtectedRoute >
        {<Dashboard />}
    </ProtectedRoute>
} 

export default page