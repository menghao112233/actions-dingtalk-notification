const {
    success_start_text,
    end_text,
    markdown_data,
} = require('./constants/dingTalk');
const {dingTalkAxios} = require('./api/axios')
const core = require('@actions/core');

//发送钉钉消息内容
let markdown_text = "";

//发布人
const actor = process.env.GITHUB_ACTOR;

// 版本号
const gitHubRef = process.env.GITHUB_REF;


//项目名
let projectName = repository;
//判断如果有仓库,把仓库去掉
if (repository && repository.includes('/')) {
    projectName = repository.split('/').pop();
}

async function main() {
    
    markdown_text = `| [${projectName}](https://github.com/cloudlab-os/${projectName})  | ${actor} | ${gitHubRef} |\n`

    markdown_data.markdown.text =
        success_start_text +
        markdown_text +
        end_text;

    //发送钉钉通知
    dingTalkAxios(core.getInput("ding_talk_url"), markdown_data)

}

main();