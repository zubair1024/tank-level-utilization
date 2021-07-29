import csv from 'csvtojson';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import fs from 'fs';

import Analyzer from './components/Analyzer';
import { FileDataRecord, TankDataRecord } from './types';
import { transformData } from './util';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const csvFilePath = __dirname + `/../input/117 sme june.csv`;
const csvOutputPath = __dirname + `/../output/output.csv`;

const userTimezone = 'Asia/Dubai';
const fillingThreshold = 30;
const checkBufferSize = 10;
const capacity = 2512;

/**
 *
 */
const writeFirstLine = () => {
  fs.writeFileSync(
    csvOutputPath,
    `Date,Filled,Emptied,Filled Value,Emptied Value\r\n`,
    {
      flag: 'w',
    }
  );
};

/**
 *
 *
 * @param {Date} date
 * @param {number} filled
 * @param {number} emptied
 */
const writeLine = (
  date: Date,
  filled: number,
  emptied: number,
  filledValue: number,
  emptiedValue: number
) => {
  fs.writeFileSync(
    csvOutputPath,
    `${dayjs(date)
      .tz(userTimezone)
      .format(
        'YYYY-MM-DD'
      )},${filled},${emptied},${filledValue},${emptiedValue}\r\n`,
    {
      flag: 'a',
    }
  );
};

/**
 *
 *
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {TankDataRecord[]} transformedData
 */
const runForTimeline = (
  startTime: Date,
  endTime: Date,
  transformedData: TankDataRecord[]
) => {
  console.log(
    `Running for the timeline of ${dayjs(startTime)
      .tz(userTimezone)
      .format('YYYY-MM-DD HH:mm:ss')} - ${dayjs(endTime)
      .tz(userTimezone)
      .format('YYYY-MM-DD HH:mm:ss')}`
  );
  const filteredData = transformedData.filter((i) => {
    return i.eventTime >= startTime && i.eventTime <= endTime;
  });

  const analyzer = new Analyzer(
    fillingThreshold,
    checkBufferSize,
    filteredData
  );
  const [filled, emptied] = analyzer.getStats();
  const filledValue = (filled / 100) * capacity;
  const emptiedValue = (emptied / 100) * capacity;
  writeLine(startTime, filled, emptied, filledValue, emptiedValue);
  console.log(
    `For the timeline of ${dayjs(startTime)
      .tz(userTimezone)
      .format('YYYY-MM-DD HH:mm:ss')} - ${dayjs(endTime)
      .tz(userTimezone)
      .format('YYYY-MM-DD HH:mm:ss')} Filled ${filled} % , Emptied ${emptied} %`
  );
};

/**
 * A function to run program
 *
 * @param {string} inputFilePath a input file path
 */
const run = async (inputFilePath: string) => {
  try {
    writeFirstLine();

    const jsonArray: FileDataRecord[] = await csv().fromFile(inputFilePath);
    const transformedData = transformData(jsonArray);

    let startTime = dayjs(transformedData[0].eventTime)
      .tz(userTimezone)
      .startOf('day');
    const finalTime = dayjs(
      transformedData[transformedData.length - 1].eventTime
    )
      .tz(userTimezone)
      .endOf('day');

    while (startTime <= finalTime) {
      const endTime = startTime.endOf('day');
      runForTimeline(startTime.toDate(), endTime.toDate(), transformedData);
      startTime = startTime.add(1, 'day');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run(csvFilePath);
