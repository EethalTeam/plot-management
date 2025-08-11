import React,{createContext,useReducer} from 'react'
import UnitTable from './UnitTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const UnitMainContext = createContext();

export function ContextApi() {
const context = React.useContext(UnitMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a UnitMainContext.Provider')
    }
       return context
  }

export default function UnitMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <UnitMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <UnitTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </UnitMainContext.Provider>
  )
}
