import React,{createContext,useReducer} from 'react'
import VisitorTable from './VisitorTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const VisitorMainContext = createContext();

export function ContextApi() {
const context = React.useContext(VisitorMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a VisitorMainContext.Provider')
    }
       return context
  }

export default function VisitorMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <VisitorMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <VisitorTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </VisitorMainContext.Provider>
  )
}
