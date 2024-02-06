const {fail_title, success_start_text, end_text, markdown_data, fail_start_text} = require('./constants/dingTalk');
const {beforeRequestUrlAxios,afterRequestUrlAxios} = require('./api/axios')
const core = require('@actions/core');
const axios = require('axios');


let markdown_text = "";


const requestUrl = core.getInput("request_url");


let before_data = process.env.BEFORE_DATA
console.log("before_data: -->" + before_data)
if (!before_data) {
    try {
        // `who-to-greet` input defined in action metadata file
        // 发送GET请求
        beforeRequestUrlAxios(requestUrl)
    } catch (error) {
        core.setFailed(error.message);
    }
} else {
    try {
        const requestUrl = core.getInput("request_url");

        // `who-to-greet` input defined in action metadata file
        // const requestUrl = core.getInput(requestUrl);
        // 发送GET请求
        afterRequestUrlAxios(requestUrl);

        for (const item in process.env.AFTER_DATA) {

            const before_value = before_data[item];
            const after_value = process.env.AFTER_DATA[item];
            markdown_text += `| <small>**${item}:**</small>    | <small><font color=Darkorange>${before_value}<font></small>          |<small><font color=Green> ${after_value} <font></small>                     |\n`;

        }
        markdown_data.markdown.text =
            success_start_text +
            markdown_text +
            end_text;

        axios.post(
            core.getInput("ding_talk_url"),
            markdown_data,
        ).then((response) => {
            console.log('DingTalk message sent successfully:  ' + JSON.stringify(`${response.data}`));
        }).catch((error) => {
            console.error('Error sending DingTalk message:', error);
        });


        // axios.get(requestUrl).then(response => {
        //     const data = response.data;
        //     let flag = true;
        //     const flag_data = JSON.parse(core.getInput("flag_data"));
        //     console.log("flag_data的值:  " + JSON.stringify(flag_data))
        //     console.log("before_data的值:  " + before_data)
        //     console.log("当前data的值:  " + JSON.stringify(data))
        //     before_data = JSON.parse(before_data)
        //     for (const key in flag_data) {
        //         if (!(flag_data[key] === data[key]) && flag) {
        //             flag = false;
        //         }
        //     }
        //     for (const item in data) {
        //
        //         const before_value = before_data[item];
        //         const after_value = data[item];
        //         markdown_text += `| <small>**${item}:**</small>    | <small><font color=Darkorange>${before_value}<font></small>          |<small><font color=Green> ${after_value} <font></small>                     |\n`;
        //
        //     }
        //     if (flag) {
        //         markdown_data.markdown.text =
        //             success_start_text +
        //             markdown_text +
        //             end_text;
        //     } else {
        //         markdown_data.markdown.title = fail_title
        //         markdown_data.markdown.text =
        //             fail_start_text +
        //             markdown_text +
        //             end_text;
        //     }
        //
        //     axios.post(
        //         core.getInput("ding_talk_url"),
        //         markdown_data,
        //     ).then((response) => {
        //         console.log('DingTalk message sent successfully:  ' + JSON.stringify(`${response.data}`));
        //     }).catch((error) => {
        //         console.error('Error sending DingTalk message:', error);
        //     });
        //
        // }
        // ).catch(reason => {
        //     console.error('Promise rejected with reason:', reason);
        // });
        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}