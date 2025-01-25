import { Context } from "hono";
import { getEntity, createEntity, deleteEntity, updateEntity,searchEntity, getAllEntity } from "./gen.func";

// Controller to get all entities
export const getAllController = <T>(getFunction: () => Promise<T[]>) => async (c: Context) => {
    try {
        const entities = await getAllEntity(getFunction);
        if (entities === undefined) {
            return c.json({ msg: "Entities not found", status: 404 }, 404);
        }
        return c.json({ data: entities, status: 200 }, 200);
    } catch (error) {
        console.error("Error fetching entities:", error);
        return c.json({ msg: "Internal Server Error", status: 500 }, 500);
    } 
}

// get a controller
export const getController = <T>(getFunction: (id: string) => Promise<T | undefined>) => async (c: Context) => {
    const id = c.req.param("id");

    const entity = await getEntity(id, getFunction);
    if (entity === undefined) {
        return c.json({ msg: "Entity not found", status: 404 }, 404);
    }
    return c.json({ data: entity, status: 200 }, 200);
}

// create a new controller
export const createController = <T>(createFunction: (data: T) => Promise<T>) => async (c: Context) => {
    try {
        const data = await c.req.json();
        const createdEntity = await createEntity(data, createFunction);
        console.log(createdEntity);
        if (!createdEntity) return c.json({ msg: "Entity not created", status: 404 }, 404);
        return c.json({ data: createdEntity, status: 201 }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message, status: 400 }, 400);
    }
}

// delete controller
export const deleteController = <T>(getFunction: (id: string) => Promise<T | undefined>, deleteFunction: (id: string) => Promise<boolean>) => async (c: Context) => {
    const id = c.req.param("id");
    
    try {
        const entity = await getEntity(id, getFunction);
        if (entity === undefined) return c.json({ msg: "Entity not found", status: 404 }, 404);

        const deleted = await deleteEntity(id, deleteFunction);
        if (!deleted) return c.json({ msg: "Entity not deleted", status: 404 }, 404);

        return c.json({ data: entity, status: 200 }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message, status: 400 }, 400);
    }
}

// update controller
export const updateController = <T>(getFunction: (id: string) => Promise<T | undefined>, updateFunction: (id: string, data: T) => Promise<T | undefined>) => async (c: Context) => {
    const id = c.req.param("id");

    const data = await c.req.json();

    try {
        const entity = await getEntity(id, getFunction);
        if (entity === undefined) return c.json({ msg: "Entity not found", status: 404 }, 404);

        const updatedEntity = await updateEntity(id, data, updateFunction);
        if (!updatedEntity) return c.json({ msg: "Entity not updated", status: 404 }, 404);

        return c.json({ data: updatedEntity, status: 200 }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message, status: 400 }, 400);
    }
}

// search a controller
export const searchController = <T>(getFunction: (id: string) => Promise<T | undefined>) => async (c: Context) => {
    const id = c.req.param("id");

    const entity = await searchEntity(id, getFunction);
    if (entity === undefined) {
        return c.json({ msg: "Entity not found", status: 404 }, 404);
    }
    return c.json({ data: entity, status: 200 }, 200);
}