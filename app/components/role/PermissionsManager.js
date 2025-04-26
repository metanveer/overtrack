"use client";

import { useState } from "react";

// import Message from "../Message";
import { permissionsData } from "@/utils/permissions";
import { updateRolePermissions } from "@/app/actions/roleActions";

export default function PermissionsManager({ initRole }) {
  const [role, setRole] = useState(initRole);
  const [formState, setFormState] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  if (!role) return <p>No role found.</p>;

  const handlePermissionChange = async (permission) => {
    if (!role) return;
    setIsSaving(true);

    const newPermissions = role.permissions.includes(permission)
      ? role.permissions.filter((p) => p !== permission)
      : [...role.permissions, permission];

    setRole((prevRole) => ({
      ...prevRole,
      permissions: newPermissions,
    }));

    const res = await updateRolePermissions(role.slug, newPermissions);
    setFormState(res);
    setIsSaving(false);
  };

  const handleSelectAll = async () => {
    if (!role) return;
    setIsSaving(true);

    const allSelected = permissionsData.every((perm) =>
      role.permissions.includes(perm)
    );

    const newPermissions = allSelected ? [] : [...permissionsData];

    setRole((prevRole) => ({
      ...prevRole,
      permissions: newPermissions,
    }));

    const res = await updateRolePermissions(role.slug, newPermissions);
    setFormState(res);
    setIsSaving(false);
  };

  const renderPermissionSection = (
    title,
    filterFn,
    labelFormatter = (p) => p
  ) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {permissionsData.filter(filterFn).map((permission) => (
          <label
            key={permission}
            className="flex items-center gap-2 p-2 border border-blue-300 rounded cursor-pointer hover:bg-blue-300"
          >
            <input
              type="checkbox"
              checked={role.permissions.includes(permission)}
              onChange={() => handlePermissionChange(permission)}
              disabled={isSaving}
              className="h-4 w-4"
            />
            {labelFormatter(permission)}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">{role.name}</h3>

          {/* Select All */}
          <div className="flex items-center gap-2 mb-6">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={permissionsData.every((perm) =>
                  role.permissions.includes(perm)
                )}
                onChange={handleSelectAll}
                disabled={isSaving}
                className="h-5 w-5"
              />
              Select All Permissions
            </label>
          </div>

          {/* Permission Sections */}
          {renderPermissionSection("Permissions Related to Reports", (item) =>
            item.includes("report")
          )}

          {renderPermissionSection("WPS Related", (item) =>
            item.includes("WPS")
          )}

          {renderPermissionSection(
            "Equipment or Pipeline Related",
            (item) => item.includes("equipment"),
            (permission) => permission.replace("equipment ", "")
          )}

          {renderPermissionSection(
            "Administrative",
            (item) => item.includes("__admin__"),
            (permission) => permission.replace("__admin__", "")
          )}
        </div>
      </div>

      {/* Saving state or response */}
      {isSaving && (
        <div className="text-center my-4 text-blue-600 font-medium">
          Saving changes...
        </div>
      )}
      {/* {formState.success ? (
        <Message text={formState.message} />
      ) : formState.error ? (
        <Message error={formState.error} />
      ) : null} */}
    </>
  );
}
