const DashboardStats = ({ totalOTEntries, totalBills, totalEmployees }) => {
  const stats = [
    {
      title: "Total OT Entries",
      value: totalOTEntries,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Total Bills Created",
      value: totalBills,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Number of Employees",
      value: totalEmployees,
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`rounded-2xl shadow-sm p-6 ${stat.color} transition hover:shadow-md`}
        >
          <div className="text-sm font-medium uppercase tracking-wide mb-1">
            {stat.title}
          </div>
          <div className="text-3xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
