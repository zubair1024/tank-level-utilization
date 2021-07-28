import csv from 'csvtojson';

import Analyzer from './components/Analyzer';
import { FileDataRecord } from './types';
import { transformData } from './util';

const csvFilePath = __dirname + `/../input/117 sme june.csv`;

const fillingThreshold = 50;
const checkBufferSize = 10;

const run = async (inputFilePath: string) => {
  try {
    const jsonArray: FileDataRecord[] = await csv().fromFile(inputFilePath);
    const transformedData = transformData(jsonArray);
    const analyzer = new Analyzer(
      fillingThreshold,
      checkBufferSize,
      transformedData
    );
    const [filled, emptied] = analyzer.getStats();
    console.log(
      `For the timeline of ${transformedData[0].eventTime.toISOString()} - ${transformedData[
        transformedData.length - 1
      ].eventTime.toISOString()} Filled ${filled} % , Emptied ${emptied} %`
    );
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run(csvFilePath);
