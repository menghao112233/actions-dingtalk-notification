const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');


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

        } catch (error) {
            core.setFailed(error.message);
        }
    }