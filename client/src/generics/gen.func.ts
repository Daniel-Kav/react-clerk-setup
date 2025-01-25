// generics to handle the functions

// Generic function to get all entities
export const getAllEntity = async <T>(getFunction: () => Promise<T[]>) => {
    return await getFunction();
}

export const getEntity = async <T>(id: string, getFunction: (id: string) => Promise<T | undefined>) => {
    return await getFunction(id);
}

export const createEntity = async <T>(data: T, createFunction: (data: T) => Promise<T | undefined>) => {
    return await createFunction(data);
}

export const deleteEntity = async <T>(id: string, deleteFunction: (id: string) => Promise<boolean>) => {
    return await deleteFunction(id);
}

export const updateEntity = async <T>(id: string, data: T, updateFunction: (id: string, data: T) => Promise<T | undefined>) => {
    return await updateFunction(id, data);
}

export const searchEntity = async <T>(id:string,searchFunction: (id: string) => Promise<T | undefined>) =>{
    return await searchFunction(id);
}