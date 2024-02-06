const axios = require('axios');
const fs = require('fs');
const successDingTalkAxios = () => {

}

const failDingTalkAxios = () => {

}

async function beforeRequestUrlAxios(requestUrl) {
    await axios.get(requestUrl).then(response => {
        const data = response.data;
        console.log("axios.get request_url的值: " + JSON.stringify(data))
        fs.writeFileSync(process.env.GITHUB_ENV, `BEFORE_DATA=${JSON.stringify(data)}`);
    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
        return null;
    });
}

async function afterRequestUrlAxios(requestUrl) {
    return new Promise((resolve, reject) => {
        axios.get(requestUrl)
            .then(response => {
                const data = response.data;
                console.log("axios.get request_url的值: " + JSON.stringify(data));
                process.env.AFTER_DATA = JSON.stringify(data);
                console.log("process.env.AFTER_DATA_AXIOS");
                console.log(process.env.AFTER_DATA);
                resolve();
            })
            .catch(reason => {
                console.error('Promise rejected with reason:', reason);
                reject(null);
            });
    });
}


module.exports = {
    beforeRequestUrlAxios,
    afterRequestUrlAxios
};