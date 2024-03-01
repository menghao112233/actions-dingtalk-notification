const core = require("@actions/core");


//发布人
const actor = process.env.GITHUB_ACTOR;

// 仓库/项目名
const repository = process.env.GITHUB_REPOSITORY;

const requestUrl = core.getInput("request_url");


//项目名
let projectName = repository;
//判断如果有仓库,把仓库去掉
if (repository && repository.includes('/')) {
    projectName = repository.split('/').pop();
}

const success_title = `github发布${projectName}完成`

const fail_title = `github发布${projectName}失败`

const success_start_text =
    `### <font color=Green>github发布${projectName}完成</font>\n` +
    "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
    "| --------------: | ------------- | ---------------------------- |\n";


const end_text =
    `#### 发布人: ${actor} \n ` +
    core.getInput("footer_text")

const markdown_data = {
    msgtype: "markdown",
    markdown: {
        title: success_title,
        text: ""
    },
    at: {
        isAtAll: false,
    },
};

const fail_start_text =
    `### <font color=Red>github发布${projectName}未通过</font>\n` +
    ` <font color=Orange>请先查看[发布版本](${process.env.REQUEST_URL})是否误报,再查询问题</font>\n` +
    "|                 | <font color=Darkorange>**before**</font>  | <font color=Green>**after**</font>                  |\n" +
    "| --------------: | ------------- | ---------------------------- |\n";


module.exports = {
    fail_title,
    success_start_text,
    fail_start_text,
    end_text,
    markdown_data
};