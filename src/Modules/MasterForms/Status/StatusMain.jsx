import React,{createContext,useReducer} from 'react'
import StatusTable from './StatusTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const StatusMainContext = createContext();

export function ContextApi() {
const context = React.useContext(StatusMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a StatusMainContext.Provider')
    }
       return context
  }

export default function StatusMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <StatusMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <StatusTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </StatusMainContext.Provider>
  )
}
