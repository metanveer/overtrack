import React from "react";

const UserProfile = ({ user, role }) => {
  const { name, email, dept, role: userRole } = user;
  const roleName = role?.roleName || userRole;
  const permissions = role?.permissions || [];

  // Group permissions dynamically
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const [group, label] = permission.split("__");
    if (!acc[group]) acc[group] = [];
    acc[group].push(label || permission); // fallback in case no __
    return acc;
  }, {});

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden mx-auto">
      <div className="p-10 sm:p-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            User Profile
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Detailed information and access rights
          </p>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
            {name?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Name
              </p>
              <p className="text-lg font-semibold text-gray-800">{name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <p className="text-base font-medium text-gray-700">{email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Department
                </p>
                <p className="text-base font-medium text-gray-700">{dept}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Role
                </p>
                <p className="text-base font-medium text-gray-700">
                  {roleName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Permissions */}
        <div className="bg-white rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Role Permissions
          </h2>

          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([groupName, perms]) => (
              <div key={groupName}>
                <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                  {groupName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                  {perms.map((perm, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 hover:bg-indigo-50 transition text-gray-800 px-4 py-2 rounded-lg shadow-sm"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        {/* <div className="mt-10 text-center">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-200 shadow-md">
            Edit Profile
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default UserProfile;
