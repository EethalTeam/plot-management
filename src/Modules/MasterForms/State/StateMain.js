import React,{createContext,useReducer} from 'react'
import StateTable from './StateTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const StateMainContext = createContext();

export function ContextApi() {
const context = React.useContext(StateMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a StateMainContext.Provider')
    }
       return context
  }

export default function StateMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <StateMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <StateTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </StateMainContext.Provider>
  )
}
