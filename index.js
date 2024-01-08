const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
try {
    // `who-to-greet` input defined in action metadata file
    // const requestUrl = core.getInput(requestUrl);
    // 发送GET请求
    axios.get("https://beta.oscollege.net/api/version").then(response => {
        const {version, date} = response.data;
        core.setOutput("date", date);
        core.setOutput("branches_tags", version);
        console.log(date)
        console.log(version)
    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
    });

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
