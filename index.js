const { success_start_text, end_text, markdown_data, fail_start_text } = require('./constants/dingTalk');
const {requestUrlAxios} =require('./api/axios')
const core = require('@actions/core');
const axios = require('axios');


let markdown_text = "";


const requestUrl = core.getInput("request_url");


let old_json = process.env.BEFORE_DING_DATA
console.log("old_json: -->"+old_json)
if (!old_json) {
    try {
        // `who-to-greet` input defined in action metadata file
        // 发送GET请求
        requestUrlAxios(requestUrl)
    } catch (error) {
        core.setFailed(error.message);
    }
} else {
    try {
        const requestUrl = core.getInput("request_url");

        // `who-to-greet` input defined in action metadata file
        // const requestUrl = core.getInput(requestUrl);
        // 发送GET请求
        axios.get(requestUrl).then(response => {
            const data = response.data;
            let flag = true;
            const flag_data = JSON.parse(core.getInput("flag_data"));
            console.log("flag_data的值:  " + JSON.stringify(flag_data))
            console.log("old_json的值:  " + old_json)
            console.log("当前data的值:  " + JSON.stringify(data))
            old_json = JSON.parse(old_json)
            for (const key in flag_data) {
                if (!(flag_data[key] === data[key]) && flag) {
                    flag = false;
                }
            }
            for (const item in data) {

                const before_value = old_json[item];
                const after_value = data[item];
                markdown_text += `| <small>**${item}:**</small>    | <small><font color=Darkorange>${before_value}<font></small>          |<small><font color=Green> ${after_value} <font></small>                     |\n`;

            }
            if (flag) {
                markdown_data.markdown.text =
                    success_start_text +
                    markdown_text +
                    end_text;
            } else {
                markdown_data.markdown.title = `github发布${projectName}失败`
                markdown_data.markdown.text =
                    fail_start_text +
                    markdown_text +
                    end_text;
            }

            axios.post(
                core.getInput("ding_talk_url"),
                markdown_data,
            ).then((response) => {
                console.log('DingTalk message sent successfully:  ' + JSON.stringify(`${response.data}`));
            }).catch((error) => {
                console.error('Error sending DingTalk message:', error);
            });

        }).catch(reason => {
            console.error('Promise rejected with reason:', reason);
        });
        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}