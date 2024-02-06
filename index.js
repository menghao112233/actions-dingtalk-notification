const fs = require('fs');
const {fail_title, success_start_text, end_text, markdown_data, fail_start_text} = require('./constants/dingTalk');
const {requestUrlAxios, dingTalkAxios} = require('./api/axios')
const core = require('@actions/core');
const axios = require('axios');

//发送钉钉消息内容
let markdown_text = "";

//获取钉钉消息内容接口地址
const requestUrl = core.getInput("request_url");

//钉钉消息before内容
let before_data = process.env.BEFORE_DATA
console.log("before_data: -->" + before_data)

async function main() {
    //根据before_data参数判断是获取before_data内容消息 还是 组装钉钉消息内容发送钉钉消息.
    if (!before_data) {
        try {
            // `who-to-greet` input defined in action metadata file
            // 发送GET请求
            const before_data = await requestUrlAxios(requestUrl)
            console.log("before_data request_url的值: " + JSON.stringify(before_data))
            //将消息内容添加到 变量中.
            fs.writeFileSync(process.env.GITHUB_ENV, `BEFORE_DATA=${JSON.stringify(before_data)}`);
        } catch (error) {
            core.setFailed(error.message);
        }
    } else {
        try {
            const requestUrl = core.getInput("request_url");
            const after_data = await requestUrlAxios(requestUrl)
            before_data = JSON.parse(before_data)
            console.log("after_data request_url的值: " + JSON.stringify(after_data))

            for (const item in after_data) {

                const before_value = before_data[item];
                console.log("before_value:" + before_value)
                const after_value = after_data[item];
                console.log("after_value:" + after_value)
                markdown_text += `| <small>**${item}:**</small>    | <small><font color=Darkorange>${before_value}<font></small>          |<small><font color=Green> ${after_value} <font></small>                     |\n`;

            }
            console.log("markdown_text:" + markdown_text)
            markdown_data.markdown.text =
                success_start_text +
                markdown_text +
                end_text;
            //发送钉钉通知
            dingTalkAxios(core.getInput("ding_talk_url"),markdown_data)


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
}

main();