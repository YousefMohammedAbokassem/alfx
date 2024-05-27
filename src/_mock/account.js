// ----------------------------------------------------------------------

// const account = {
//   displayName: 'Jaydon Frankie',
//   email: 'demo@minimals.cc',
//   photoURL: '/assets/images/avatars/avatar_default.jpg',
// };

// export default account;


import React from 'react'
import { useSelector } from 'react-redux'

const useAccount = () => {

  const {admin} = useSelector(state => state.auth)

  const account = {
    displayName: `${admin.name}`,
    email: admin.phone,
    photoURL: `${process.env.REACT_APP_API_URL_IMAGE}${admin.image}`
  }


  return {account}


}

export default useAccount
