import { FileDataRecord, TankDataRecord } from './types';

export const transformData = (
  jsonArray: FileDataRecord[]
): TankDataRecord[] => {
  const result = jsonArray.map((i) => {
    const result = {
      eventTime: new Date(i.eventTime),
      tankLevelPercentage: Number(i.tankLevelPercentage),
      tankLevel: Number(i.tankLevel),
    };
    return Object.assign(i, result);
  });
  result.sort((a, b) => {
    return a.eventTime.getTime() - b.eventTime.getTime();
  });
  return result;
};
