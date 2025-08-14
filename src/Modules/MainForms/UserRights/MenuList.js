import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Typography,
  FormGroup,
  Paper,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const permissions = ["isAdd", "isEdit", "isView", "isDelete"];

const MenuTreeCheckboxes = ({ menuData, getMenuAction }) => {
  const [expanded, setExpanded] = useState({});
  const [checkedMainMenus, setCheckedMainMenus] = useState({});
  const [checkedChildPermissions, setCheckedChildPermissions] = useState({});

  // Initialize checked states from menuData
  useEffect(() => {
    const mainMenus = {};
    const childPermissions = {};

    menuData.forEach((menu) => {
      mainMenus[menu.formId] = menu.isEnable ?? false;

      if (menu.children?.length > 0) {
        menu.children.forEach((child) => {
          const perms = {};
          permissions.forEach((perm) => {
            perms[perm] = child[perm] === true;
          });
          perms.isEnable = child.isEnable ?? false;
          childPermissions[child.formId] = perms;
        });
      }
    });

    setCheckedMainMenus(mainMenus);
    setCheckedChildPermissions(childPermissions);
  }, [menuData]);

  // Watch changes and report updated user rights
  useEffect(() => {
    getMenuAction(getUpdatedMenuData());
  }, [checkedMainMenus, checkedChildPermissions]);

  const toggleExpand = (formId) => {
    setExpanded((prev) => ({
      ...prev,
      [formId]: !prev[formId],
    }));
  };

  /**
   * Prepares data to send to backend
   */
  const getUpdatedMenuData = () => {
    const result = [];

    for (const main of menuData) {
      // Main menu entry
      result.push({
        menuId: main.menuId || null,
        formId: main.formId || null,
        parentFormId : main.parentFormId,
        title: main.title,
        isEnable: checkedMainMenus[main.formId] ?? false,
        isView: checkedMainMenus[main.formId] ?? false,
        isAdd: checkedMainMenus[main.formId] ?? false,
        isEdit: checkedMainMenus[main.formId] ?? false,
        isDelete: checkedMainMenus[main.formId] ?? false,
        isNotification: main.isNotification || false,
        unitAccess: [],
      });

      // Child menus
      if (main.children?.length > 0) {
        for (const child of main.children) {
          const perms = checkedChildPermissions[child.formId] || {};
          result.push({
            menuId: child.menuId || null,
            formId: child.formId || null,
            parentFormId : child.parentFormId,
            title: child.title,
            isEnable: perms.isEnable ?? false,
            isView: perms.isView ?? false,
            isAdd: perms.isAdd ?? false,
            isEdit: perms.isEdit ?? false,
            isDelete: perms.isDelete ?? false,
            isNotification : child.isNotification || false,
            unitAccess: child.unitAccess || [],
          });
        }
      }
    }

    return result;
  };

  const handleMainMenuToggle = (formId, hasChildren) => {
    const newChecked = !checkedMainMenus[formId];

    setCheckedMainMenus((prev) => ({
      ...prev,
      [formId]: newChecked,
    }));

    if (!newChecked && hasChildren) {
      // Uncheck children if parent is disabled
      const mainMenu = menuData.find((m) => m.formId === formId);
      const childFormIds = mainMenu?.children?.map((c) => c.formId) || [];

      setCheckedChildPermissions((prev) => {
        const updated = { ...prev };
        for (let childId of childFormIds) {
          if (updated[childId]) {
            updated[childId].isEnable = false;
            permissions.forEach((perm) => {
              updated[childId][perm] = false;
            });
          }
        }
        return updated;
      });
    }
  };

  const handleChildCheckboxToggle = (childFormId, parentFormId) => {
    setCheckedChildPermissions((prev) => {
      const current = prev[childFormId] || {};
      const newIsEnable = !current.isEnable;

      const updated = {
        ...current,
        isEnable: newIsEnable,
      };

      permissions.forEach((perm) => {
        updated[perm] = newIsEnable;
      });

      return {
        ...prev,
        [childFormId]: updated,
      };
    });

    // If child is enabled, ensure main menu stays enabled
    if (!checkedMainMenus[parentFormId]) {
      setCheckedMainMenus((prev) => ({
        ...prev,
        [parentFormId]: true,
      }));
    }
  };

  const handleChildPermissionToggle = (childFormId, permission, parentFormId) => {
    setCheckedChildPermissions((prev) => {
      const current = prev[childFormId] || {};

      const newPermissions = {
        ...current,
        [permission]: !current[permission] || false,
      };

      // If ANY permission is on, isEnable should be true
      newPermissions.isEnable = Object.values(newPermissions).some(
        (val) => val === true
      );

      return {
        ...prev,
        [childFormId]: newPermissions,
      };
    });

    // If a permission is checked, ensure parent stays checked
    setCheckedMainMenus((prev) => ({
      ...prev,
      [parentFormId]: true,
    }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {menuData.map((mainMenu) => (
        <Box key={mainMenu.formId} sx={{ mb: 2 }}>
          {/* MAIN MENU ROW */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#e3f2fd",
              width: "100%",
              display: "flex",
              alignItems: "center",
              pl: 2,
            }}
          >
            {mainMenu.children?.length > 0 && (
              <IconButton
                size="small"
                onClick={() => toggleExpand(mainMenu.formId)}
                sx={{ mr: 1 }}
              >
                {expanded[mainMenu.formId] ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </IconButton>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!checkedMainMenus[mainMenu.formId]}
                  onChange={() =>
                    handleMainMenuToggle(
                      mainMenu.formId,
                      !!mainMenu.children?.length
                    )
                  }
                />
              }
              label={
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {mainMenu.title}
                </Typography>
              }
            />
          </Paper>

          {/* CHILDREN */}
          <Collapse in={expanded[mainMenu.formId]} timeout="auto">
            <Box sx={{ mt: 1 }}>
              {mainMenu.children?.map((child) => {
                const permissionsState =
                  checkedChildPermissions[child.formId] || {};

                const childChecked =
                  permissionsState.isEnable || false;

                return (
                  <Box key={child.formId} sx={{ mb: 2, width: "90%" }}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#fce4ec",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        pl: 6,
                        ml: "10%",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={childChecked}
                            onChange={() =>
                              handleChildCheckboxToggle(
                                child.formId,
                                mainMenu.formId
                              )
                            }
                          />
                        }
                        label={
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                          >
                            {child.title}
                          </Typography>
                        }
                      />
                    </Paper>

                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#fff3e0",
                        width: "90%",
                        mt: 1,
                        ml: "20%",
                        pl: 10,
                      }}
                    >
                      <FormGroup row sx={{ flexWrap: "wrap" }}>
                        {permissions.map((perm) => (
                          <FormControlLabel
                            key={perm}
                            control={
                              <Checkbox
                                size="small"
                                checked={permissionsState[perm] || false}
                                onChange={() =>
                                  handleChildPermissionToggle(
                                    child.formId,
                                    perm,
                                    mainMenu.formId
                                  )
                                }
                              />
                            }
                            label={perm}
                          />
                        ))}
                      </FormGroup>
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default MenuTreeCheckboxes;
