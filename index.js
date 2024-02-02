const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

console.log("start")
const requestUrl = core.getInput("request_url");
console.log(requestUrl)

// const old_json = core.getInput("old_json");
console.log(1)

