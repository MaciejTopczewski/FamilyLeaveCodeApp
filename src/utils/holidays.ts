import type { Holiday } from "./leaveCalculator";
import { Ireland_HolidaysService } from "../generated/services/Ireland_HolidaysService";

function h(dateStr: string, name: string): Holiday {
  const [d, m, y] = dateStr.split("/").map(Number);
  return { date: new Date(y, m - 1, d), name };
}

// Fallback holidays used when SharePoint is not available (e.g. localhost without connectors)
const FALLBACK_HOLIDAYS: Holiday[] = [
  h("01/01/2026", "New Year's Day"),
  h("02/02/2026", "St. Brigid's Day"),
  h("17/03/2026", "St. Patrick's Day"),
  h("06/04/2026", "Easter Monday"),
  h("04/05/2026", "May Day"),
  h("01/06/2026", "June Bank Holiday"),
  h("03/08/2026", "August Bank Holiday"),
  h("26/10/2026", "October Bank Holiday"),
  h("25/12/2026", "Christmas Day"),
  h("26/12/2026", "St. Stephen's Day"),
  h("01/01/2027", "New Year's Day"),
  h("01/02/2027", "St. Brigid's Day"),
  h("17/03/2027", "St. Patrick's Day"),
  h("29/03/2027", "Easter Monday"),
  h("03/05/2027", "May Day"),
  h("07/06/2027", "June Bank Holiday"),
  h("02/08/2027", "August Bank Holiday"),
  h("25/10/2027", "October Bank Holiday"),
  h("25/12/2027", "Christmas Day"),
  h("26/12/2027", "St. Stephen's Day"),
  h("01/01/2028", "New Year's Day"),
  h("07/02/2028", "St. Brigid's Day"),
  h("17/03/2028", "St. Patrick's Day"),
  h("17/04/2028", "Easter Monday"),
  h("01/05/2028", "May Day"),
  h("05/06/2028", "June Bank Holiday"),
  h("07/08/2028", "August Bank Holiday"),
  h("30/10/2028", "October Bank Holiday"),
  h("25/12/2028", "Christmas Day"),
  h("26/12/2028", "St. Stephen's Day"),
  h("01/01/2029", "New Year's Day"),
  h("05/02/2029", "St. Brigid's Day"),
  h("17/03/2029", "St. Patrick's Day"),
  h("02/04/2029", "Easter Monday"),
  h("07/05/2029", "May Day"),
  h("04/06/2029", "June Bank Holiday"),
  h("06/08/2029", "August Bank Holiday"),
  h("29/10/2029", "October Bank Holiday"),
  h("25/12/2029", "Christmas Day"),
  h("26/12/2029", "St. Stephen's Day"),
  h("01/01/2030", "New Year's Day"),
  h("01/02/2030", "St. Brigid's Day"),
  h("17/03/2030", "St. Patrick's Day"),
  h("22/04/2030", "Easter Monday"),
  h("06/05/2030", "May Day"),
  h("03/06/2030", "June Bank Holiday"),
  h("05/08/2030", "August Bank Holiday"),
  h("28/10/2030", "October Bank Holiday"),
  h("25/12/2030", "Christmas Day"),
  h("26/12/2030", "St. Stephen's Day"),
];

// Known Irish public holiday names by month-day pattern
const HOLIDAY_NAMES: Record<string, string> = {
  "01-01": "New Year's Day",
  "03-17": "St. Patrick's Day",
  "12-25": "Christmas Day",
  "12-26": "St. Stephen's Day",
};

function guessHolidayName(date: Date): string {
  const key = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  if (HOLIDAY_NAMES[key]) return HOLIDAY_NAMES[key];
  const month = date.getMonth();
  if (month === 1) return "St. Brigid's Day";
  if (month === 2 || month === 3) return "Easter Monday";
  if (month === 4) return "May Day";
  if (month === 5) return "June Bank Holiday";
  if (month === 7) return "August Bank Holiday";
  if (month === 9) return "October Bank Holiday";
  return "Public Holiday";
}

export async function fetchHolidays(): Promise<Holiday[]> {
  try {
    const result = await Ireland_HolidaysService.getAll();
    const records = result.data;
    if (!records || records.length === 0) return FALLBACK_HOLIDAYS;

    return records.map((r) => {
      const date = new Date(r.Date);
      const name = r.Title || guessHolidayName(date);
      return { date, name };
    });
  } catch {
    return FALLBACK_HOLIDAYS;
  }
}

export { FALLBACK_HOLIDAYS as IRISH_PUBLIC_HOLIDAYS };