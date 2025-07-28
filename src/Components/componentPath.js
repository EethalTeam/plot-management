import { lazy } from 'react';
export const PathJson = {
1000 : lazy (()=> import('../Pages/Home/home')),
1001 : lazy (()=> import('../Modules/MainForms/MenuRegistry/MenuRegistryMain'))
}