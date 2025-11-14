import React,{createContext,useReducer} from 'react'
import EmployeeTable from './EmployeeTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const EmployeeMainContext = createContext();

export function ContextApi() {
const context = React.useContext(EmployeeMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a EmployeeMainContext.Provider')
    }
       return context
  }

export default function EmployeeMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <EmployeeMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <EmployeeTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </EmployeeMainContext.Provider>
  )
}
