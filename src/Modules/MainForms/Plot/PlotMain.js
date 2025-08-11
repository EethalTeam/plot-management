import React,{createContext,useReducer} from 'react'
import PlotTable from './PlotTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const PlotMainContext = createContext();

export function ContextApi() {
const context = React.useContext(PlotMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a PlotMainContext.Provider')
    }
       return context
  }

export default function PlotMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <PlotMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <PlotTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </PlotMainContext.Provider>
  )
}
