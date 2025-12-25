
// 仓库/项目名
const repository = process.env.GITHUB_REPOSITORY;

// 域名
const domain = process.env.DOMAIN;



//项目名
let projectName = repository;
//判断如果有仓库,把仓库去掉
if (repository && repository.includes('/')) {
    projectName = repository.split('/').pop();
}

const success_title = `github发布${projectName}完成`


const success_start_text =
    `### <font color=Green>github发布${projectName}完成</font>\n` +
    "|   <font color=Green>**项目地址**</font>  | <font color=Green>**发布人**</font>  | <font color=Green>**版本号**</font>                  |\n" +
    "| -------------- | ------------- | ---------------------------- |\n";


const end_text =
    `#### \n ` +
    `[${domain}](${domain})  \n `

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

module.exports = {
    success_start_text,
    end_text,
    markdown_data
};