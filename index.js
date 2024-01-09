const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const flag_data =
    {"appName": "www-oscollege-net-api"}
const before_data =
    {"date": "2024-01-04 19:29:40", "appName": "1www-oscollege-net-api", "version": "refs/tags/v0.8.2.0"}

const success_start_text =
    "### <font color=Green>github发布{repositoryName}完成</font>\n" +
    "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
    "| --------------: | ------------- | ---------------------------- |\n";
let markdown_text = "";
const text = ["version", "date", "appName"]
const end_text =
    "#### 发布人: 123 \n" +
    "[链接](https://beta.oscollege.net)"
const markdown_data = {
    msgtype: "markdown",
    markdown: {
        title: `github发布{repositoryName}完成`,
        text: ""
    },
    at: {
        isAtAll: false,
    },
};


const fail_start_text =
    "### <font color=Red>github发布{repositoryName}未通过</font>\n" +
    " <font color=Orange>请先查看[发布版本](https://beta.oscollege.net/api/version)是否误报,再查询问题</font>\n" +
    "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
    "| --------------: | ------------- | ---------------------------- |\n";

try {
    // `who-to-greet` input defined in action metadata file
    const requestUrl = core.getInput(requestUrl);
    // 发送GET请求
    axios.get(requestUrl).then(response => {
        response.data;
        core.setOutput("data_json", date);
        console.log(date.text)

    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
    });
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}

try {
    const requestUrl = core.getInput(requestUrl);
    // `who-to-greet` input defined in action metadata file
    // const requestUrl = core.getInput(requestUrl);
    // 发送GET请求
    axios.get(requestUrl).then(response => {
        const data = response.data;
        let flag = true;
        for (const key in flag_data) {
            if (!(flag_data[key] === data[key]) && flag) {
                flag = false;
            }
        }
        for (const item in data) {
            const before_value = data[item];
            const after_value = data[item];
            markdown_text += `| <small>**${item}:**</small>    | <small><font color=Darkorange>${before_value}<font></small>          |<small><font color=Green> ${after_value} <font></small>                     |\n`;

        }
        if (flag) {
            markdown_data.markdown.text =
                success_start_text +
                markdown_text +
                end_text;
        } else {
            markdown_data.markdown.title = 'github发布{repositoryName}失败'
            markdown_data.markdown.text =
                fail_start_text +
                markdown_text +
                end_text;
        }
        axios.post(
            'https://oapi.dingtalk.com/robot/send?access_token=8356808cecfa40221b3c6a0d69376ce33983fa6ba81d7df8f6754f41a5abe3ca',
            markdown_data,
        ).then((response) => {
            console.log(`DingTalk message sent successfully: ${response.data}`);
        }).catch((error) => {
            console.error('Error sending DingTalk message:', error);
        });


        console.log("end结束")
    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
    });
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}




