const SettingsView = ({ settingsData }) => {
  return (
    <div className=" bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Title */}
        <h1 className="text-3xl pt-2 text-center font-bold text-blue-700">
          Settings - {settingsData._id}
        </h1>

        {/* OT Types */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            OT Types
          </h2>
          <div className="flex flex-wrap gap-2">
            {settingsData.OtType.map((type, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {type}
              </span>
            ))}
          </div>
        </section>

        {/* Units */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Units</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {settingsData.Unit.map((unit, idx) => (
              <div
                key={idx}
                className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm"
              >
                {unit}
              </div>
            ))}
          </div>
        </section>

        {/* Employees */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Employees
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-blue-200">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Designation</th>
                  <th className="px-4 py-2">Basic Salary</th>
                </tr>
              </thead>
              <tbody>
                {settingsData.Employee.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="px-4 py-2 border-t">{emp.Name}</td>
                    <td className="px-4 py-2 border-t">{emp.Designation}</td>
                    <td className="px-4 py-2 border-t">{emp.BasicSalary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* OT Times */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            OT Times
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-blue-200">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Hours</th>
                </tr>
              </thead>
              <tbody>
                {settingsData.OtTime.map((time, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="px-4 py-2 border-t">{time.Time}</td>
                    <td className="px-4 py-2 border-t">{time.Hour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
