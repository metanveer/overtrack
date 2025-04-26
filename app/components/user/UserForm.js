import { useState } from "react";

export default function UserForm({
  initData,
  isEditing,
  depts,
  roles,
  onSubmit,
}) {
  const emptyData = {
    name: "",
    dept: "",
    role: "",
    email: "",
    password: "",
  };

  const initFormData = isEditing ? initData : emptyData;

  const [formData, setFormData] = useState(initFormData);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.dept) newErrors.dept = "Department is required.";
    if (!formData.role) newErrors.role = "Role is required.";

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!isEditing && !formData.password)
      newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formDataToSend = isEditing
    ? { ...formData, _id: initData.id }
    : { ...formData };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formDataToSend);

      setErrors({});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto px-4 pb-4 pt-2 bg-white  space-y-3"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* dept */}
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">
          Department
        </label>
        <select
          name="dept"
          value={formData.dept}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Department</option>
          {depts.map((dept) => (
            <option key={dept._id} value={dept.deptName}>
              {dept.deptName}
            </option>
          ))}
        </select>
        {errors.dept && (
          <p className="text-red-500 text-sm mt-1">{errors.dept}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role._id} value={role.roleName}>
              {role.roleName}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          defaultValue={isEditing ? "" : formData.password} // Allow user to enter new password
          onChange={handleChange}
          placeholder={isEditing ? "Skip to keep the same password" : ""}
          autoComplete="new-password"
        />

        {/* <input
          type="password"
          name="password"
          className={styles.input}
          defaultValue={isUpdatingUser ? "" : userData.password} // Allow user to enter new password
          onChange={handleChange}
          placeholder={isUpdatingUser ? "Skip to keep the same password" : ""}
          autoComplete="new-password"
        /> */}

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Submit
      </button>
    </form>
  );
}
