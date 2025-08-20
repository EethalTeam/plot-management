import React,{createContext,useReducer} from 'react'
import RoleTable from './RoleTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const RoleMainContext = createContext();

export function ContextApi() {
const context = React.useContext(RoleMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a RoleMainContext.Provider')
    }
       return context
  }

export default function RoleMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <RoleMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <RoleTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </RoleMainContext.Provider>
  )
}
