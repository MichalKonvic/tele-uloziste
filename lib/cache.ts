import {randomUUID} from 'crypto'

interface memoryI{
    uID: string,
    data: any,
    deleteFunction: (deleteTime:number) => any
}

class tempMemory {
    #memory: memoryI[] = [];
    /**
     * Temporary saves data
     * @param data data to save
     * @param deleteTime number in seconds
     * @returns memoryUID
     */
    addToMemory(data:any, deleteTime: number) {
        const dataUID: string = randomUUID();
        this.#memory.push({
            uID: dataUID,
            data: data,
            deleteFunction: (deleteAfter:number) => setTimeout(() => {
                this.deleteFromMemory(dataUID)
            }, deleteAfter * 1000)
        })
        this.#memory[-0].deleteFunction(deleteTime);
        return dataUID;
    }
    deleteFromMemory(uID: string) {
        this.#memory = this.#memory.filter(memoryData => memoryData.uID !== uID);
    }
    find(uID: string) {
        return this.#memory.find(dataMemory => dataMemory.uID === uID)?.data;
    }
    setData(uID: string,data: any) {
        const dataIndex = this.#memory.findIndex(dataMemory => dataMemory.uID === uID);
        this.#memory[dataIndex].data = data;
    }
}
if (!global.cache) {
    global.cache = new tempMemory();
}

export default global.cache;