import React, { useContext, Suspense } from 'react';
import '../Assets/styles/MainContent.css';
import { MenuContext } from '../Pages/Dashboard/dashboard'
import { PathJson } from './componentPath'

const MainContent = () => {
  const { selectedMenu, FormID, setSelectedMenu, setFormID, UnitId, UserPermissions,...context } = useContext(MenuContext);
  const DynamicComponent = PathJson[FormID];

  return (
    <main className="main-content">
      {/* <div className='locationDiv'>
        <h3>{selectedMenu}</h3>
      </div> */}
      {DynamicComponent ? (
        <div className='childrenDiv'>
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicComponent alert={context.alert} setSelectedMenu={setSelectedMenu} setFormID={setFormID} UnitId={UnitId} UserPermissions={UserPermissions}/>
          </Suspense>
        </div>

      ) : (
        <div >Form Under development , Please Contact Admin</div>
      )}
    </main>
  );
};

export default MainContent;
