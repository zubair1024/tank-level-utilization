[![author](https://img.shields.io/badge/author-zubair1024-hotpink.svg)](https://github.com/zubair1024)
[![stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)]()

# Tank Level Utilization Analyzer

A program that analyzes tank level data over time and figures out the exact filled and emptied amount. Therefore, summarizing the usage of the tank over the duration of time.

The program filters out noise in tank level values caused by temperature and other physical variations, producing accurate filled and emptied values.

![Logo](https://res.cloudinary.com/dusou0qjr/image/upload/v1627495922/tank_variations_ybgy0h.png)

## Usage/Examples

1. Upload CSV file into the input folder

   Make sure it has the following format

   ```
   Unique ID, ISO String Date, Tank Level, Tank Level Percentage
   ```

1. Run program

   ```
   npm start
   ```

   The output should read giving the accurate filled and emptied value

   ```
   For the timeline of 2021-06-01T00:07:41.033Z - 2021-06-30T23:50:59.869Z Filled 4672.6100000000015 % , Emptied 4651.790000000002 %
   ```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Authors

- [@zubair1024](https://www.github.com/zubair1024)

## Tech Stack

**Server:** Node, TypeScript
