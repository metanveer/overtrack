// const data = [
//   {
//     _id: "67f74404d0b71b18e827969f",
//     Type: "Regular",
//     Unit: "Topping",
//     WorkDescription: "Topping startup",
//     Employees: [
//       { Name: "MR. MD. ABU NAYEEM", OtTime: "08.00-16.00", OtHour: "8" },
//       { Name: "MR. MD. ABDUL MOMEN", OtTime: "17.00-06.00", OtHour: "13" },
//       { Name: "MR. MD. ARFAN", OtTime: "08.00-16.00", OtHour: "8" }
//     ],
//     Remarks: "Casual: Arman, Eliyas"
//   },
//   // more entries...
// ];

export const calculateTotalOtHours = (data) => {
  return data.reduce((sum, item) => {
    const employeeHours = item.Employees.reduce((empSum, emp) => {
      return empSum + Number(emp.OtHour);
    }, 0);
    return sum + employeeHours;
  }, 0);
};
