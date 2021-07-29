import * as dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { FileDataRecord, TankDataRecord } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const dayjsFn = dayjs.default;

export { dayjsFn };

export const transformData = (
  jsonArray: FileDataRecord[]
): TankDataRecord[] => {
  let result = jsonArray.map((i) => {
    const result = {
      eventTime: new Date(i.eventTime),
      tankLevelPercentage: Number(i.tankLevelPercentage),
      tankLevel: Number(i.tankLevel),
    };
    return Object.assign(i, result);
  });

  result = result.filter((i) => {
    return i && i.eventTime && i.tankLevel && i.tankLevelPercentage;
  });

  result.sort((a, b) => {
    return a.eventTime.getTime() - b.eventTime.getTime();
  });
  return result;
};
