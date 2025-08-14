import React,{createContext,useReducer} from 'react'
import TransferTable from './TransferTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const TransferMainContext = createContext();

export function ContextApi() {
const context = React.useContext(TransferMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a TransferMainContext.Provider')
    }
       return context
  }

export default function TransferMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <TransferMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <TransferTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </TransferMainContext.Provider>
  )
}
