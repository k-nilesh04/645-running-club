export const summarizeAttendance = (attendanceRecords = [], paidMembersCount = 0) => {
  const totalUsers = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(({ status }) => status === "present").length;
  const registeredCount = attendanceRecords.filter(({ status }) => status === "registered").length;
  const absentCount = attendanceRecords.filter(({ status }) => status === "absent").length;

  return {
    totalUsers,
    presentCount,
    registeredCount,
    absentCount,
    paidMembersCount,
  };
};
