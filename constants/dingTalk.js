const core = require("@actions/core");


const success_start_text =
    `### <font color=Green>github发布${repository}完成</font>\n` +
    "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
    "| --------------: | ------------- | ---------------------------- |\n";

const end_text =
    `#### 发布人: ${actor} \n ` +
    core.getInput("footer_text")

const markdown_data = {
    msgtype: "markdown",
    markdown: {
        title: `github发布${repository}完成`,
        text: ""
    },
    at: {
        isAtAll: false,
    },
};

const fail_start_text =
    `### <font color=Red>github发布${repository}未通过</font>\n` +
    ` <font color=Orange>请先查看[发布版本](${requestUrl})是否误报,再查询问题</font>\n` +
    "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
    "| --------------: | ------------- | ---------------------------- |\n";


export {success_start_text,fail_start_text,end_text,markdown_data}