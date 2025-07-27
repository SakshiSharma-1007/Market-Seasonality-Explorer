import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"; // ✅ needed for .week()
import isoWeek from "dayjs/plugin/isoWeek"; // optional alternative

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export default dayjs;
