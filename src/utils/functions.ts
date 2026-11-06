import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isToday,
  format,
} from "date-fns";
import { SUCCESS_EVALUATION } from "./constant";

export const formatNotificationDate = (date: Date | string) => {
  const dateObj = new Date(date);
  const now = new Date();

  const secondsAgo = differenceInSeconds(now, dateObj);
  const minutesAgo = differenceInMinutes(now, dateObj);
  const hoursAgo = differenceInHours(now, dateObj);

  // Less than 60 seconds
  if (secondsAgo < 60) {
    return "now";
  }

  // Less than 60 minutes
  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`;
  }

  // Less than 24 hours
  if (hoursAgo < 24 && isToday(dateObj)) {
    return `${hoursAgo}h ago`;
  }

  // // Yesterday
  // if (isYesterday(dateObj)) {
  //   return 'yesterday';
  // }

  // Older dates
  return format(dateObj, "dd MMM yyyy");
};

export const successEvaluation = (text: string) => {
  if (text.toLowerCase().includes(SUCCESS_EVALUATION.HOT)) {
    return SUCCESS_EVALUATION.HOT;
  } else if (text.toLowerCase().includes(SUCCESS_EVALUATION.WARM)) {
    return SUCCESS_EVALUATION.WARM;
  } else if (text.toLowerCase().includes(SUCCESS_EVALUATION.COLD)) {
    return SUCCESS_EVALUATION.COLD;
  } else if (text.toLowerCase().includes(SUCCESS_EVALUATION.POOR)) {
    return SUCCESS_EVALUATION.POOR;
  } else {
    return SUCCESS_EVALUATION.NEW;
  }
};
