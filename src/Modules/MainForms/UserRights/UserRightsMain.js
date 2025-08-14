import React,{createContext,useReducer} from 'react'
import UserRightsTable from './UserRightsTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const UserRightsMainContext = createContext();

export function ContextApi() {
const context = React.useContext(UserRightsMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a UserRightsMainContext.Provider')
    }
       return context
  }

export default function UserRightsMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <UserRightsMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <UserRightsTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </UserRightsMainContext.Provider>
  )
}
