import { observable, action } from 'mobx';


const timelineInfo = ({ status = [], cursor = null, isLoading = true }) => {
    return {
        status, cursor, isLoading
    }
};

export default class TimelineStore {
    @observable isLoading = false;
    @observable timelines = {
        local: timelineInfo({})
    };

    constructor(api) {
        this.api = api
    }

    @action
    async loadTimeline(name) {
        console.log(name);
        const [type, val, val2] = name.split('/', 3);
        let params = { size: 20 };
        if (type === 'date') {
            params['date'] = val;
        } else if (type === 'user') {
            params['user'] = val;
            if (val2) {
                params['date'] = val2;
            }
        } else if (type !== 'local') {
            console.log('Unknown timeline type:', type);
        }


        const timeline = this.timelines[name] || timelineInfo({});
        timeline.isLoading = true;

        const { result, cursor } = await this.api.getTimeline({ cursor: timeline.cursor, ...params });
        this.timelines[name] = timelineInfo({
            status: timeline.status.concat(result),
            cursor: cursor,
            isLoading: false
        });
    }

    @action clearTimeline(name) {
        this.timelines[name] = timelineInfo({});
    }

    getTimeline(name) {
        return this.timelines[name] || timelineInfo({});
    }
}