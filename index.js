const fs = require('fs');
const {fail_title, success_start_text, end_text, markdown_data, fail_start_text} = require('./constants/dingTalk');
const {requestUrlAxios, dingTalkAxios} = require('./api/axios')
const core = require('@actions/core');

//发送钉钉消息内容
let markdown_text = "";


async function main() {

    //校验验证参数
    let validate = core.getInput("validate");

    //钉钉消息before内容
    let before_data = process.env.BEFORE_DATA
    console.log("before_data: " + before_data)

    //获取钉钉消息内容接口地址
    let requestUrl = core.getInput("request_url");

    //根据before_data参数判断是获取before_data内容消息 还是 组装钉钉消息内容发送钉钉消息.
    if (!before_data) {
        // `who-to-greet` input defined in action metadata file
        // 发送GET请求
        const before_data = await requestUrlAxios(requestUrl)
        console.log("before_data: " + JSON.stringify(before_data))
        //将消息内容以及请求地址添加到 变量中.
        fs.writeFileSync(process.env.GITHUB_ENV, `BEFORE_DATA=${JSON.stringify(before_data)},REQUEST_URL=${requestUrl}`);
        return;
    }

    requestUrl = process.env.REQUEST_URL
    console.log("requestUrl: " + requestUrl)
    //进行校验
    if (validate) {
        console.log("validate: " + validate);
        validate = JSON.parse(validate)
        const after_data = await requestUrlAxios(requestUrl)
        before_data = JSON.parse(before_data)
        console.log("after_data: " + JSON.stringify(after_data))

        let flag = true;
        for (const key in validate) {
            if (!(validate[key] === after_data[key]) && flag) {
                flag = false;
            }
        }

        for (const item in after_data) {

            const before_value = before_data[item];
            console.log("before_value:" + before_value)
            const after_value = after_data[item];
            console.log("after_value:" + after_value)
            markdown_text += `| <small>**${item}:**</small>    | <small><font color=Darkorange>${before_value}<font></small>          |<small><font color=Green> ${after_value} <font></small>                     |\n`;

        }
        console.log("markdown_text:" + markdown_text)

        if (flag) {
            markdown_data.markdown.text =
                success_start_text +
                markdown_text +
                end_text;
        } else {
            markdown_data.markdown.title = fail_title
            markdown_data.markdown.text =
                fail_start_text +
                markdown_text +
                end_text;
        }
        //发送钉钉通知
        dingTalkAxios(core.getInput("im_hook_url"), markdown_data)
        return;
    }


    const after_data = await requestUrlAxios(requestUrl)
    before_data = JSON.parse(before_data)
    console.log("after_data: " + JSON.stringify(after_data))

    for (const item in after_data) {
        const before_value = before_data[item];
        const after_value = after_data[item];
        markdown_text += `| <small>**${item}:**</small>    | <small><font color=Darkorange>${before_value}<font></small>          |<small><font color=Green> ${after_value} <font></small>                     |\n`;
    }
    console.log("markdown_text:" + markdown_text)
    markdown_data.markdown.text =
        success_start_text +
        markdown_text +
        end_text;
    //发送钉钉通知
    dingTalkAxios(core.getInput("im_hook_url"), markdown_data)

}

main();