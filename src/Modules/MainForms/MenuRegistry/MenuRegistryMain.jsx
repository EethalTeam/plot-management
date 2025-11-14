import React,{createContext,useReducer} from 'react'
import MenuRegistryTable from './MenuRegistryTable';
import {l1Reducer,initialState } from '../../../Components/Reducer/MasterFormReduer';
import '../../../Assets/styles/mastertype.css'
export const MenuRegistryMainContext = createContext();

export function ContextApi() {
const context = React.useContext(MenuRegistryMainContext)
    if (context === undefined) {
      throw new Error('ContextApi must be used within a MenuRegistryMainContext.Provider')
    }
       return context
  }

export default function MenuRegistryMain(props) {
const [cstate, cdispatch] = useReducer(l1Reducer, initialState);
  return (
    <MenuRegistryMainContext.Provider value={{
        cstate, cdispatch,
    }}>
        <MenuRegistryTable alert={props.alert} UserPermissions={props.UserPermissions} />

    </MenuRegistryMainContext.Provider>
  )
}
