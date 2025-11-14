import React, { createContext, useReducer } from 'react';
import CallLogTable from './AllCallsTable'; // The new table component
import { l1Reducer, initialState } from '../../../Components/Reducer/MasterFormReduer'; // Using your existing reducer
import '../../../Assets/styles/mastertype.css';

export const CallLogContext = createContext();

export function ContextApi() {
  const context = React.useContext(CallLogContext);
  if (context === undefined) {
    throw new Error('ContextApi must be used within a CallLogContext.Provider');
  }
  return context;
}

export default function CallLogMain(props) {
  // Using your existing reducer, as requested
  const [cstate, cdispatch] = useReducer(l1Reducer, initialState);

  return (
    <CallLogContext.Provider value={{
      cstate, cdispatch,
    }}>
      <CallLogTable 
        alert={props.alert} 
        UserPermissions={props.UserPermissions} 
      />
    </CallLogContext.Provider>
  );
}