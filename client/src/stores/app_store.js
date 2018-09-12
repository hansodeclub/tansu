import { observable } from 'mobx';

export default class AppStore {
    @observable appConfig;
    @observable user; // TODO: implement login
    @observable instance;

    constructor(appConfig) {
        this.appConfig = appConfig;
    }
}