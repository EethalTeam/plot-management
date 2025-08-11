import React,{createContext,useReducer} from 'react'
import CityTable from './CityTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const CityMainContext = createContext();

export function ContextApi() {
const context = React.useContext(CityMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a CityMainContext.Provider')
    }
       return context
  }

export default function CityMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <CityMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <CityTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </CityMainContext.Provider>
  )
}
