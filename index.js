const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');


try {


// const flag_data =
//     {"appName": "www-oscollege-net-api"}
    console.log("start")
    const success_start_text =
        `### <font color=Green>github发布${github.context.repo.repo}完成</font>\n` +
        "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
        "| --------------: | ------------- | ---------------------------- |\n";
    let markdown_text = "";
    const end_text =
        `#### 发布人: ${github.context.actor} \n ` +
        core.getInput("footer_text")
    const markdown_data = {
        msgtype: "markdown",
        markdown: {
            title: `github发布${github.context.repo.repo}完成`,
            text: ""
        },
        at: {
            isAtAll: false,
        },
    };

    const requestUrl = core.getInput("request_url");
    const fail_start_text =
        `### <font color=Red>github发布${github.context.repo.repo}未通过</font>\n` +
        ` <font color=Orange>请先查看[发布版本](${requestUrl})是否误报,再查询问题</font>\n` +
        "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
        "| --------------: | ------------- | ---------------------------- |\n";
    let old_json = core.getInput("old_json");
    console.log(1)
    if (!old_json) {
        console.log(2)
        try {
            console.log("requestUrl:" + requestUrl)
            // `who-to-greet` input defined in action metadata file
            // 发送GET请求
            axios.get(requestUrl).then(response => {
                const data = response.data;
                core.setOutput("old_json", data);
                console.log("axios.get request_url的值: " + JSON.stringify(data))

            }).catch(reason => {
                console.error('Promise rejected with reason:', reason);
            });
            // Get the JSON webhook payload for the event that triggered the workflow
            // const payload = JSON.stringify(github.context.payload, undefined, 2)
            // console.log(`The event payload: ${payload}`);
        } catch (error) {
            core.setFailed(error.message);
        }
    } else {
        console.log('b')
        try {
            const requestUrl = core.getInput("request_url");
            console.log("requestUrl:" + requestUrl)

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
                    markdown_data.markdown.title = `github发布${github.context.repo.repo}失败`
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


} catch (error) {
    console.log("打印错误日志:  " + JSON.stringify(error))
    console.error("打印错误日志:  " + JSON.stringify(error))
}