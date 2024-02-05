const axios = require('axios');

const successDingTalkAxios = () => {

}

const failDingTalkAxios = () => {

}

function requestUrlAxios(requestUrl) {
    axios.get(requestUrl).then(response => {
        const data = response.data;
        console.log("axios.get request_url的值: " + JSON.stringify(data))
        process.env.BEFORE_DATA = JSON.stringify(data);
        console.log(`::set-env name=BEFORE_DATA::${process.env.BEFORE_DATA}`);

    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
        return null;
    });
}

module.exports = {
    requestUrlAxios
};