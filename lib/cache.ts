interface cachedData{
    userData: object,
    id: string,
    deleteFunction: () => void,
}

/**
 * Stores values for specific amount of time
 */
class tempStore {
    #cache:cachedData[] = []
    #idGen = (): string => {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substring(2, 9);
    };
    insert(
        data: any,
        deleteDelay: number
        ): string{
        const objId: string = this.#idGen();
        this.#cache.push({
                id: objId,
                userData:data,
                deleteFunction: () => setTimeout(() => {
                    this.delete(objId)
                }, deleteDelay)
            })
        this.#cache[-0].deleteFunction();
        return objId;
    }
    delete(id: string){
        this.#cache = this.#cache.filter(cachedObj => cachedObj.id !== id);
    }
    find(id: string){
        return this.#cache.find(cacheObj => cacheObj.id === id);
    }
}
export default  tempStore;