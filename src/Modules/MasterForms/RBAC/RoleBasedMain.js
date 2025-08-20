import React,{createContext,useReducer} from 'react'
import RoleBasedTable from './RoleBasedTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const RoleBasedMainContext = createContext();

export function ContextApi() {
const context = React.useContext(RoleBasedMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a RoleBasedMainContext.Provider')
    }
       return context
  }

export default function RoleBasedMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <RoleBasedMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <RoleBasedTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </RoleBasedMainContext.Provider>
  )
}
