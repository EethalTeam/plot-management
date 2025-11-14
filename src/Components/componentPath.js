import { lazy } from 'react';
export const PathJson = {
1000 : lazy (()=> import('../Pages/Home/home')),
1001 : lazy (()=> import('../Modules/MainForms/MenuRegistry/MenuRegistryMain')),
1002 : lazy (()=> import('../Modules/MainForms/Visitor/VisitorMain')),
1003 : lazy (()=> import('../Modules/MasterForms/Status/StatusMain')),
1004 : lazy (()=> import('../Modules/MasterForms/Unit/UnitMain')),
1005 : lazy (()=> import('../Modules/MainForms/Plot/PlotMain')),
1006 : lazy (()=> import('../Modules/MainForms/PlotView/PlotViewMain')),
1007 : lazy (()=> import('../Modules/MasterForms/State/StateMain')),
1008 : lazy (()=> import('../Modules/MasterForms/City/CityMain')),
1009 : lazy (()=> import('../Modules/MasterForms/Employee/EmployeeMain')),
1010 : lazy (()=> import('../Modules/MainForms/TransferFollowUp/TransferMain')),
1011 : lazy (()=> import('../Modules/MainForms/UserRights/UserRightsMain')),
1012 : lazy (()=> import('../Modules/MasterForms/RBAC/RoleBasedMain')),
1013 : lazy (()=> import('../Modules/MainForms/AllCalls/AllCallsMain')),
}