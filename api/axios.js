const axios = require('axios');
function dingTalkAxios (ding_talk_url,markdown_data){
    axios.post(
        ding_talk_url,
        markdown_data,
    ).then((response) => {
        console.log('DingTalk message sent successfully:  ' + JSON.stringify(`${response.data}`));
    }).catch((error) => {
        console.error('Error sending DingTalk message:', error);
    });
}



async function requestUrlAxios(requestUrl) {
    return await axios.get(requestUrl).then(response => {
        return response.data;
    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
        return null;
    });
}



module.exports = {
    requestUrlAxios,
    dingTalkAxios
};