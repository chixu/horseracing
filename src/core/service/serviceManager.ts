import { Type, Map, isPresent, isType } from "../lang";

export abstract class Service {
    // configure(options) { }
    startup() { }
    shutdown() { }
}

export class ServiceManager {
    private services: {
        [key: string]: Service;
    };

    constructor() {
        this.services = {};
    }

    get<T>(name: string): T {
        return this.services[name] as any;
    }

    register(name: string, serviceOrType: Service | Type): Service {
        let service: Service;
        if (isType(serviceOrType)) {
            service = new serviceOrType();
        } else {
            service = serviceOrType;
        }
        this.services[name] = service;
        return service;
    }

    has(name: string): boolean {
        return isPresent(this.services[name]);
    }

    startup() {
        for (let name in this.services) {
            this.services[name].startup();
        }
    }

    shutdown() {
        for (let name in this.services) {
            this.services[name].shutdown();
        }
    }
}
