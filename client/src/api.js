import axios from 'axios';
/*
const statusParser = (statuses) => {
    return statuses.map((status) => {
        return Object.assign(status, {
            created_at: status['created_at'],
            media_attachments: status['media_attachments'] || []
        })
    });
}*/

export default class API {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    buildUrl = (path) => {
        return this.endpoint + path;
    }

    getTimeline = async ({ size = 5, user = undefined, cursor = undefined, date = undefined }) => {
        let url = this.buildUrl(`/api/v1/timeline`);
        let params = {
            cursor,
            user,
            size,
        }

        if (date) {
            url += `/${date}`;
        }

        const timeline = await axios.get(url, { params: params });
        return timeline.data;
    }
}