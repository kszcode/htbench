# HTBench

Simple benchmark script. To be used a a boilerplate for more fance stuffs in the future.


## Requirements

* NodeJS 8

## Setting up

```
npm install
```

## Running

Current command line options

```
$ node htbench.js --help

Usage:
  htbench.js [OPTIONS] [ARGS]

Options:
  -u, --url [STRING]     The URL to hit (Default is http://127.0.0.1:8080)
  -r, --maxRate [NUMBER] Number of maximum concurrent connections (Default is 100)
  -h, --hits [NUMBER]    The total number of requests (Default is 20000)
  -l, --log [FILE]       The log file (JSON) (Default is hits.csv)
  -r, --report [BOOLEAN] Generate report (Default is true)
```

Example:

```
node htbench.js -u http://youapi.com -r 1000 -h 1000000 -r api_hits.csv

```

Enjoy!