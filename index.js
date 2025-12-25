const fs = require('fs');
const {
    success_start_text,
    repository,
    end_text,
    markdown_data,
    projectName,
    actor,
    gitHubRef,
    dingTalkUrl
} = require('./constants/dingTalk');
const { dingTalkAxios} = require('./api/axios')
const core = require('@actions/core');

//发送钉钉消息内容
let markdown_text = "";


async function main() {
    
    markdown_text = `| [${repository}](https://github.com/cloudlab-os/${projectName})  | ${actor} | ${gitHubRef} | 
`

    markdown_data.markdown.text =
        success_start_text +
        markdown_text +
        end_text;
    
    //发送钉钉通知
    dingTalkAxios(dingTalkUrl, markdown_data)

}

main();