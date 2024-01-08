const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
try {
    // `who-to-greet` input defined in action metadata file
    const requestUrl = core.getInput('requestUrl');
    // 发送GET请求
    const response = axios.get(requestUrl);
    const {branches_tags, date} = response.data;
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("date", date);
    core.setOutput("branches_tags", branches_tags);
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
