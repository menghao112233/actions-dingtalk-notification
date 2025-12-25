const {
    success_start_text,
    repository,
    end_text,
    markdown_data,
    projectName,
} = require('./constants/dingTalk');
const { dingTalkAxios} = require('./api/axios')
const core = require('@actions/core');

//发送钉钉消息内容
let markdown_text = "";

//发布人
const actor = process.env.GITHUB_ACTOR;

// 版本号
const gitHubRef = process.env.GITHUB_REF;

async function main() {
    
    markdown_text = `| [${repository}](https://github.com/cloudlab-os/${projectName})  | ${actor} | ${gitHubRef} |`

    markdown_data.markdown.text =
        success_start_text +
        markdown_text +
        end_text;
    
    //发送钉钉通知
    dingTalkAxios(core.getInput("ding_talk_url"), markdown_data)

}

main();