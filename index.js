const fs = require('fs');
const {fail_title, success_start_text, end_text, markdown_data, fail_start_text} = require('./constants/dingTalk');
const {requestUrlAxios, dingTalkAxios} = require('./api/axios')
const core = require('@actions/core');

//发送钉钉消息内容
let markdown_text = "";


//验证是否为有效的URL
function isURL(str) {
    // 匹配URL的模式
    var pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(str);
}


//读取文件
function readFileSync(requestUrl) {
    let jsonString = "{}"
    try {
        // 读取文件的第一行内容
        const fileContent = fs.readFileSync(requestUrl, 'utf-8');
        const firstLine = fileContent.split('\n')[0];
        console.log("firstLine:" + firstLine)
        console.log(firstLine)
        // 从注释中提取JSON字符串
        const match = firstLine.match(/<!--(.*)-->/);
        jsonString = match ? match[1] : '';
        console.log("firstLine—jsonString:" + jsonString)
    } catch (e) {
        console.log(e)
    }
    return jsonString;
}

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
        // 判断前后端
        if (!isURL(requestUrl)) {
            //读取文件的第一行内容
            before_data = readFileSync(requestUrl);
        } else {
            // 发送GET请求
            before_data = await requestUrlAxios(requestUrl)
            console.log("before_data: " + JSON.stringify(before_data))
        }

        //将消息内容添加到 变量中.
        fs.writeFileSync(process.env.GITHUB_ENV, `BEFORE_DATA=${JSON.stringify(before_data)}`);
        //将请求地址存入添加到变量中 供下次直接使用
        fs.appendFileSync(process.env.GITHUB_ENV, `\nREQUEST_URL=${requestUrl}`);
        return;
    }
    let after_data
    requestUrl = process.env.REQUEST_URL
    console.log("requestUrl: " + requestUrl)
    //进行校验
    if (validate) {
        console.log("validate: " + validate);
        validate = JSON.parse(validate)
        if (!isURL(requestUrl)) {
            after_data = readFileSync(requestUrl)
        } else {
            after_data = await requestUrlAxios(requestUrl)
        }
        before_data = JSON.parse(before_data)
        after_data = JSON.parse(after_data)
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


    if (!isURL(requestUrl)) {
        after_data = readFileSync(requestUrl)
    } else {
        after_data = await requestUrlAxios(requestUrl)
    }
    before_data = JSON.parse(before_data)
    after_data = JSON.parse(after_data)
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