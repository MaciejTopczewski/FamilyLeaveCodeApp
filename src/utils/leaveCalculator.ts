export interface Holiday {
  date: Date;
  name: string;
}

export type LeaveType = "maternity" | "paternity";

export interface LeaveInput {
  leaveType: LeaveType;
  startDate: Date;
  durationWeeks: number;
  unpaidMaternityWeeks: number;
  parentsLeaveWeeks: number;
  annualLeaveDays: number;
}

export interface LeavePeriod {
  label: string;
  startDate: Date;
  endDate: Date;
  calendarDays: number;
}

export interface LeaveResult {
  leaveStartDate: Date;
  expectedReturnDate: Date;
  periods: LeavePeriod[];
  publicHolidaysInPeriod: Holiday[];
  totalCalendarDays: number;
  totalWeeks: number;
  totalWorkingDays: number;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: Holiday[]): boolean {
  return holidays.some((h) => isSameDay(h.date, date));
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addWorkingDays(
  startDate: Date,
  workingDays: number,
  holidays: Holiday[]
): Date {
  let current = new Date(startDate);
  let added = 0;
  while (added < workingDays) {
    if (!isWeekend(current) && !isHoliday(current, holidays)) {
      added++;
    }
    if (added < workingDays) {
      current = addCalendarDays(current, 1);
    }
  }
  return current;
}

function getNextWorkingDay(date: Date, holidays: Holiday[]): Date {
  let current = new Date(date);
  while (isWeekend(current) || isHoliday(current, holidays)) {
    current = addCalendarDays(current, 1);
  }
  return current;
}

function getHolidaysInRange(
  start: Date,
  end: Date,
  holidays: Holiday[]
): Holiday[] {
  return holidays.filter((h) => {
    const d = h.date;
    return (
      (d >= start && d <= end) || isSameDay(d, start) || isSameDay(d, end)
    );
  });
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function countWorkingDaysInRange(
  start: Date,
  end: Date,
  holidays: Holiday[]
): number {
  let count = 0;
  let current = new Date(start);
  while (current <= end) {
    if (!isWeekend(current) && !isHoliday(current, holidays)) {
      count++;
    }
    current = addCalendarDays(current, 1);
  }
  return count;
}

export function calculateLeave(
  input: LeaveInput,
  holidays: Holiday[]
): LeaveResult {
  const periods: LeavePeriod[] = [];
  let cursor = new Date(input.startDate);

  // 1. Main leave (Maternity or Paternity)
  const mainLeaveLabel =
    input.leaveType === "maternity" ? "Maternity Leave" : "Paternity Leave";
  const mainLeaveDays = input.durationWeeks * 7;
  const mainLeaveEnd = addCalendarDays(cursor, mainLeaveDays - 1);
  periods.push({
    label: mainLeaveLabel,
    startDate: new Date(cursor),
    endDate: mainLeaveEnd,
    calendarDays: mainLeaveDays,
  });
  cursor = addCalendarDays(mainLeaveEnd, 1);

  // 2. Unpaid Maternity (only for maternity)
  if (input.leaveType === "maternity" && input.unpaidMaternityWeeks > 0) {
    const unpaidDays = input.unpaidMaternityWeeks * 7;
    const unpaidEnd = addCalendarDays(cursor, unpaidDays - 1);
    periods.push({
      label: "Unpaid Maternity Leave",
      startDate: new Date(cursor),
      endDate: unpaidEnd,
      calendarDays: unpaidDays,
    });
    cursor = addCalendarDays(unpaidEnd, 1);
  }

  // 3. Parents Leave
  if (input.parentsLeaveWeeks > 0) {
    const parentsLeaveDays = input.parentsLeaveWeeks * 7;
    const parentsEnd = addCalendarDays(cursor, parentsLeaveDays - 1);
    periods.push({
      label: "Parents Leave",
      startDate: new Date(cursor),
      endDate: parentsEnd,
      calendarDays: parentsLeaveDays,
    });
    cursor = addCalendarDays(parentsEnd, 1);
  }

  // 4. Annual Leave (working days only, skip weekends)
  if (input.annualLeaveDays > 0) {
    const alStart = new Date(cursor);
    const alEnd = addWorkingDays(cursor, input.annualLeaveDays, []);
    periods.push({
      label: "Annual Leave",
      startDate: alStart,
      endDate: alEnd,
      calendarDays: daysBetween(alStart, alEnd) + 1,
    });
    cursor = addCalendarDays(alEnd, 1);
  }

  // 5. Calculate public holidays in the entire leave period
  const leaveStart = new Date(input.startDate);
  let leaveEnd = addCalendarDays(cursor, -1);

  let holidaysInPeriod = getHolidaysInRange(leaveStart, leaveEnd, holidays);
  let prevCount = 0;

  // Iteratively extend for public holidays until stable
  while (holidaysInPeriod.length > prevCount) {
    const newHolidayCount = holidaysInPeriod.length - prevCount;
    prevCount = holidaysInPeriod.length;
    leaveEnd = addCalendarDays(leaveEnd, newHolidayCount);
    holidaysInPeriod = getHolidaysInRange(leaveStart, leaveEnd, holidays);
  }

  // 6. Return date is the day after leave ends
  let returnDate = addCalendarDays(leaveEnd, 1);

  // 7. If return date falls on weekend or public holiday, push to next working day
  returnDate = getNextWorkingDay(returnDate, holidays);

  // Update periods to include holiday extension
  if (holidaysInPeriod.length > 0) {
    const lastPeriod = periods[periods.length - 1];
    const extensionStart = addCalendarDays(lastPeriod.endDate, 1);
    const extensionEnd = addCalendarDays(returnDate, -1);
    const extensionDays = daysBetween(extensionStart, extensionEnd) + 1;
    if (extensionDays > 0) {
      periods.push({
        label: "Public Holiday Extension",
        startDate: extensionStart,
        endDate: extensionEnd,
        calendarDays: extensionDays,
      });
    }
  }

  const totalCalendarDays = daysBetween(leaveStart, addCalendarDays(returnDate, -1)) + 1;

  return {
    leaveStartDate: leaveStart,
    expectedReturnDate: returnDate,
    periods,
    publicHolidaysInPeriod: holidaysInPeriod,
    totalCalendarDays,
    totalWeeks: Math.floor(totalCalendarDays / 7),
    totalWorkingDays: countWorkingDaysInRange(
      leaveStart,
      addCalendarDays(returnDate, -1),
      holidays
    ),
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
