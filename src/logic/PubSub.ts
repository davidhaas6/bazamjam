// a typescript implementation of pubsub

class PubSub {
    private subscribers: { [key: string]: Function[] } = {};

    public subscribe(event: string, callback: Function) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }

        this.subscribers[event].push(callback);
    }

    public publish(event: string, ...args: any[]) {
        if (!this.subscribers[event]) {
            return;
        }

        this.subscribers[event].forEach(callback => callback(...args));
    }
}

export default PubSub;