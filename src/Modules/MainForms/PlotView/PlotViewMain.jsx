import React,{createContext,useReducer} from 'react'
import PlotViewTable from './PlotViewTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const PlotViewMainContext = createContext();

export function ContextApi() {
const context = React.useContext(PlotViewMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a PlotViewMainContext.Provider')
    }
       return context
  }

export default function PlotViewMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <PlotViewMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <PlotViewTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </PlotViewMainContext.Provider>
  )
}
