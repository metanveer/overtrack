export const perm = {
  viewReport: "View report",
  viewReportsList: "View reports list",
  createReport: "Create report",
  editReport: "Edit report",
  deleteReport: "Delete report",

  viewWpsReport: "View WPS",
  viewWpsReportsList: "View all WPS",
  createWpsReport: "Create WPS",
  editWpsReport: "Edit WPS",
  deleteWpsReport: "Delete WPS",

  addEquipment: "Add equipment",
  editEquipment: "Edit equipment",
  deleteEquipment: "Delete equipment",

  modifyEquipmentSpecs: "Modify equipment specs",
  addEquipmentSpecsForCategory: "Add specs for equipment category",

  addEquipmentDetailsFile: "Add equipment details file",
  renameEquipmentDetailsFile: "Rename equipment details file",
  deleteEquipmentDetailsFile: "Delete equipment details file",

  addEquipmentDrawingFile: "Add equipment drawing file",
  renameEquipmentDrawingFile: "Rename equipment drawing file",
  deleteEquipmentDrawingFile: "Delete equipment drawing file",

  addEquipmentMaintHistory: "Add equipment maint. history",
  editEquipmentMaintHistory: "Edit equipment maint. history",
  deleteEquipmentMaintHistory: "Delete equipment maint. history",
  renameEquipmentMaintHistoryFile: "Rename equipment maint. history attachment",
  deleteEquipmentMaintHistoryFile: "Delete equipment maint. history attachment",

  addEquipmentThicknessPoints: "Add equipment thickness points",
  editEquipmentThicknessPoints: "Edit or add equipment actual thickness points",
  deleteEquipmentThicknessPoints: "Delete equipment all thickness points",

  adminOptions: "__admin__Admin options",
  showUsers: "__admin__Show users",
  addUser: "__admin__Add new user",
  editUser: "__admin__Edit user info",
  deleteUser: "__admin__Delete user",
  showRoles: "__admin__Show roles page",
  addRole: "__admin__Add new role",
  editRolePermissions: "__admin__Edit role permissions",
  deleteRole: "__admin__Delete role",
};

export const permissionsData = Object.values(perm);

export const initRole = {
  _id: {
    $oid: "67e424c34e031ff10be73602",
  },
  name: "Inspector",
  slug: "inspector",
  permissions: [
    "__admin__Admin Options",
    "View report",
    "View reports list",
    "Create report",
    "View WPS",
    "View all WPS",
    "Create WPS",
    "Add equipment",
    "Modify equipment specs",
    "Add specs for equipment category",
    "Add equipment details file",
    "Rename equipment details file",
    "Rename equipment drawing file",
    "Add equipment drawing file",
    "Add equipment maint. history",
    "Rename equipment maint. history attachment",
    "Add equipment thickness points",
    "Edit or add equipment actual thickness points",
  ],
};
