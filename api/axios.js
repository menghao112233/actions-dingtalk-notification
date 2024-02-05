const axios = require('axios');

const successDingTalkAxios = () => {

}

const failDingTalkAxios = () => {

}

function requestUrlAxios(requestUrl) {
    axios.get(requestUrl).then(response => {
        const data = response.data;
        console.log("axios.get request_url的值: " + JSON.stringify(data))
        process.env.BEFORE_DING_DATA = JSON.stringify(data);

        console.log(process.env.BEFORE_DING_DATA)

    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
        return null;
    });
}

module.exports = {
    requestUrlAxios
};