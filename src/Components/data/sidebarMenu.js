import { LuLandPlot } from "react-icons/lu";
import { RiAdminFill } from "react-icons/ri";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export const allUnits = [
  { name: 'Head Office', formId: '1018' ,UnitId:'684fee05f58e7b161f931f30'},
  { name: 'Unit 1', formId: '1019' ,UnitId:'685f739230fe1a916881a428' },
  // { name: 'Unit 2', formId: '1020' },
  // { name: 'Unit 3', formId: '1021' },
];

export const sidebarMenu = [
  {
    title: 'Dashboard',
    formId:1000,
    icon: <MdDashboard />,
    children: [],
    roles: ['admin', 'agent'],
     UnitAccess: ['Head Office','Unit 1'],
  },
  {
    title: 'Plots',
    icon:<LuLandPlot />,
    children: [
     { title: 'Plot List' ,formId:'1005',roles: ['admin', 'agent'],UnitAccess: ['Head Office','Unit 1'],},
     { title: 'Plot View' ,formId:'1006',roles: ['admin', 'agent'],UnitAccess: ['Head Office','Unit 1'],},
    ],
    roles: ['admin', 'agent'],
    UnitAccess: ['Head Office','Unit 1'],
  },
    {
    title: 'Visitor',
    icon:<FaUsers />,
    children: [
     { title: 'Visitors' ,formId:'1002',roles: ['admin'],UnitAccess: ['Head Office']}
    ],
    roles: ['admin', 'agent'],
    UnitAccess: ['Head Office','Unit 1'],
  },
  {
    title: 'Master forms',
    icon: <MdOutlineFormatListBulleted />,
    children: [
       { title: 'Unit' ,formId:'1004',roles: ['admin'],UnitAccess: ['Head Office'],},
       { title: 'State' ,formId:'1007',roles: ['admin'],UnitAccess: ['Head Office'],},
       { title: 'City' ,formId:'1008',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
       { title: 'Employee' ,formId:'1009',roles: ['admin'],UnitAccess: ['Head Office'],},
      //  { title: 'Category' ,formId:'1005',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
      //  { title: 'Child Product' ,formId:'1006',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
      //  { title: 'Parent Product' ,formId:'1007',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
      //  { title: 'Main Parent' ,formId:'1009',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
       { title: 'Plot Status' ,formId:'1003',roles: ['admin'],UnitAccess: ['Head Office'],},
      //  { title: 'Add Plot' ,formId:'1009',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
    ],
    roles: ['admin'],
    UnitAccess: ['Head Office','Unit 1'],
  },
  //  {title: 'Log view',
  //   icon: <MdOutlineShoppingCart />,
  //   children: [
  //    { title: 'Logs' ,formId:'1017',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
  //   ],
  //   roles: ['admin'],
  //   UnitAccess: ['Head Office','Unit 1'],
  // },
  //    {title: 'Other Units',
  //   icon: <MdOutlineShoppingCart />,
  //   children: [{ title: 'Head Office' ,formId:'1018',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
  // { title: 'Unit 1' ,formId:'1019',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],}
  // ],
  //   roles: ['admin'],
  //  UnitAccess: ['Head Office', 'Unit 1', 'Unit 2', 'Unit 3'],
  // },
  {title: 'Admin Panel',
    icon: <RiAdminFill />,
    children: [{ title: 'Menu Registry' ,formId:'1001',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],},
  { title: 'User Rights' ,formId:'1023',roles: ['admin'],UnitAccess: ['Head Office','Unit 1'],}
  ],
    roles: ['admin'],
   UnitAccess: ['Head Office', 'Unit 1', 'Unit 2', 'Unit 3'],
  },
];

export const generateOtherUnitsMenu = (currentUnitName, allUnits) => {
  return allUnits
    .filter(unit => unit.name !== currentUnitName)
    .map(unit => ({
      title: unit.name,
      formId: unit.formId,
      roles: ['admin'],
      UnitAccess: [currentUnitName],
      UnitId:unit.UnitId
    }));
};

export const prepareSidebarMenu = (sidebarMenu, currentUnitName) => {
  const otherUnitsChildren = generateOtherUnitsMenu(currentUnitName, allUnits);

  return sidebarMenu.map(item => {
    if (item.title === 'Other Units') {
      return {
        ...item,
        children: otherUnitsChildren,
      };
    }
    return item;
  });
};

export const updatedMenu = prepareSidebarMenu(sidebarMenu);

export const filterMenuByRoleAndUnit = (menu, role, unit) => {
  return menu
    .filter(item => {
      const hasRole = item.roles?.includes(role);
      const hasUnit = item.UnitAccess?.includes(unit);
      return hasRole && hasUnit;
    })
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => {
          const hasRole = child.roles?.includes(role);
          const hasUnit = child.UnitAccess?.includes(unit);
          return hasRole && hasUnit;
        });
        return { ...item, children: filteredChildren };
      }
      return item;
    })
    .filter(item => {
      // remove parent menus that have no children left after filtering
      if (item.children) {
        return item.children.length > 0;
      }
      return true;
    });
};


