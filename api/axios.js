const axios = require('axios');

const successDingTalkAxios = () => {

}

const failDingTalkAxios = () => {

}

async function requestUrlAxios(requestUrl) {
    await axios.get(requestUrl).then(response => {
        const data = response.data;
        console.log("axios.get request_url的值: " + JSON.stringify(data))
        return data;

    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
        return null;
    });
}

module.exports = {
    requestUrlAxios
};