import {
    Repository,
    FindOptionsWhere,
    DeepPartial,
    ObjectLiteral,
    JoinTable,
    FindOptionsSelect,
    FindOptionsRelations,
} from 'typeorm';
import { ValidEntity } from '../types/entities';
import { ErrorProne } from '../../core/errors/ErrorProne';
import { StandardError } from '../../core/errors/StandardError';
import { getConnectedTables } from '../utils/JoinTables';
import { app } from '../../core/App';

/**
 * Base repository providing common CRUD operations for all entities.
 * Extend this class to create entity-specific repositories.
 *
 * @template T - The entity type this repository manages
 */
export abstract class BaseRepository<T extends ValidEntity> extends ErrorProne {
    protected repo: Repository<T>;

    constructor(entityClass: new () => T) {
        super();
        this.repo = app.database.dataSource.getRepository(entityClass);
    }

    /**
     * Find a single entity by its ID.
     *
     * @param id The ID of the Entity to find.
     * @returns Returns an Entity with the proper ID, or null if none were found.
     */
    protected async findById(id: number): Promise<T | null> {
        return this.repo.findOneBy({ id } as unknown as FindOptionsWhere<T>);
        /*
         * Unknown is safe since all Entities include an id, and always will.
         * If this errors because you did not include an ID to your entity, it is your fault.
         */
    }

    /**
     * Find all entities. Optionally filter by criteria.
     *
     * @param where (optional) Criteria to restrict results by.
     * @param relations (optional) Relations to load.
     * @returns An array of Entities that match the criteria.
     */
    protected async findAll(
        where?: FindOptionsWhere<T>,
        relations?: FindOptionsRelations<T>,
    ): Promise<T[]> {
        return where ? this.repo.find({ where, relations }) : this.repo.find();
    }

    /**
     * Find a single entity matching the given criteria.
     *
     * @param where Criteria to restrict results by.
     * @param relations (optional) Relations to load.
     * @returns An array of Entities that match the criteria, or null if none/multiple were found.
     */
    protected async findOne(
        where: FindOptionsWhere<T>,
        relations?: FindOptionsRelations<T>,
    ): Promise<T | null> {
        return this.repo.findOne({ where, relations });
    }

    /**
     * Find a single entity matching the given criteria, on a different Table than the one taken as parameter.
     *
     * @param otherTable Table to make a lookup on.
     * @param where Criteria to restrict results by.
     * @param relations (optional) Relations to load.
     * @returns An array of Entities that match the criteria, or null if none/multiple were found.
     */
    protected async findOneOnOtherTable<J extends ValidEntity>(
        otherTable: new () => J,
        where: FindOptionsWhere<J>,
        relations?: FindOptionsRelations<J>,
    ): Promise<J | null> {
        return app.database.dataSource.getRepository(otherTable).findOne({ where, relations });
    }

    /**
     * Find a junction table record by providing the junction table class and entity instances.
     * The return type is automatically inferred from the junction table parameter.
     *
     * @param joinTable - The junction table entity class
     * @param thisEntity - Instance of this entity (e.g., a User)
     * @param otherEntity - Instance of the other entity (e.g., a Host)
     * @returns The junction table record, or null if not found, or error
     *
     * @example
     * // In UserRepository:
     * const userHost = await this.findByJoin(UserHostTable, user, host);
     * // userHost is typed as UserHostTable | null | StandardError
     */
    protected async findOneByJoin<J extends ValidEntity, O extends ValidEntity>(
        joinTable: new () => J,
        thisEntity: T,
        otherEntity: O,
    ): Promise<J | null> {
        const thisTable = thisEntity.constructor as new () => T;
        const otherTable = otherEntity.constructor as new () => O;

        const thisFieldName = this.getEntityIdField(thisTable.name);
        const otherFieldName = this.getEntityIdField(otherTable.name);

        const where = {
            [thisFieldName]: thisEntity.id,
            [otherFieldName]: otherEntity.id,
        } as FindOptionsWhere<J>;

        return app.database.dataSource.getRepository(joinTable).findOne({ where });
    }

    /**
     * Find all junction table records related to this entity.
     * Automatically adds the foreign key constraint for this entity.
     *
     * @param joinTable - The junction table entity class
     * @param thatEntity - Instance of another entity (e.g., a User on HostRepository)
     * @param where - Optional additional WHERE conditions
     * @returns Array of junction table records
     *
     * @example
     * // In UserRepository - find all UserHost records for a user:
     * const userHosts = await this.findAllJoins(UserHostTable, user);
     * // With filter:
     * const adminHosts = await this.findAllJoins(UserHostTable, user, { permLevel: PermLevel.ADMIN });
     */
    protected async findAllByJoin<J extends ValidEntity, O extends ValidEntity>(
        joinTable: new () => J,
        thatEntity: O,
        where?: Partial<FindOptionsWhere<J>>,
        relations?: FindOptionsRelations<J>,
    ): Promise<J[] | StandardError> {
        const connectedTables = getConnectedTables(joinTable);
        if (this.isError(connectedTables)) {
            return this.propagateError(connectedTables, 'Find all joins failed.');
        }

        const thatTable = thatEntity.constructor as new () => O;

        const thatFieldName = this.getEntityIdField(thatTable.name);

        const fullWhere = {
            [thatFieldName]: thatEntity.id,
            ...where,
        } as FindOptionsWhere<J>;

        return app.database.dataSource
            .getRepository(joinTable)
            .find({ where: fullWhere, relations });
    }

    /**
     * Converts entity class name to foreign key field name.
     * UserTable -> userId, HostTable -> hostId
     */
    private getEntityIdField(className: string): string {
        const baseName = className.replace(/Table$/, '');
        return baseName.charAt(0).toLowerCase() + baseName.slice(1) + 'Id';
    }

    /**
     * Check if any entity exists matching the criteria.
     *
     * @param where Criteria to find results by.
     * @returns True if found any result, False otherwise
     */
    protected async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.repo.countBy(where);
        return count > 0;
    }

    /**
     * Create a new entity instance (not yet saved to database).
     *
     * @param data Partial entity data. All fields are optional and nested objects are recursively optional.
     *   DeepPartial allows you to provide only the fields you need (e.g., just discordId for a User),
     *   while auto-generated fields (like id) and relations can be omitted.
     * @returns A new entity instance ready to be saved
     */
    protected create(data: DeepPartial<T>): T {
        return this.repo.create(data);
    }

    /**
     * Create a new entity instance on another table (not yet saved to database).
     *
     * @param table The table on which to create the data on.
     * @param data Partial entity data. All fields are optional and nested objects are recursively optional.
     *   DeepPartial allows you to provide only the fields you need (e.g., just discordId for a User),
     *   while auto-generated fields (like id) and relations can be omitted.
     * @returns A new entity instance ready to be saved on the table given.
     */
    protected createOnOtherTable<J extends ValidEntity>(
        table: new () => J,
        data: DeepPartial<J>,
    ): J {
        return app.database.dataSource.getRepository(table).create(data);
    }

    /**
     * Save an entity to the database (insert or update).
     *
     * @param entity The entity you want to save to the repo.
     * @returns A promise resolving to your entity, once it successfully saved.
     */
    protected async save(entity: T): Promise<T> {
        return this.repo.save(entity);
    }

    /**
     * Bulk save multiple entities to the database (insert or update).
     *
     * @param entities Array of entities to save
     * @returns A promise resolving to the saved entities
     */
    protected async saveMany(entities: T[]): Promise<T[]> {
        return this.repo.save(entities);
    }

    /**
     * Save an entity to the database on another table (insert or update).
     *
     * @param table The table on which to save the data on.
     * @param entity The entity you want to save to the repo.
     * @returns A promise resolving to your entity, once it successfully saved on the table given.
     */
    protected async saveOnOtherTable<J extends ValidEntity>(entity: J): Promise<J> {
        const table = entity.constructor as new () => J;
        return app.database.dataSource.getRepository(table).save(entity);
    }

    /**
     * Bulk save multiple entities on another table (insert or update).
     *
     * @param entities Array of entities to save
     * @returns A promise resolving to the saved entities
     */
    protected async saveManyOnOtherTable<J extends ValidEntity>(entities: J[]): Promise<J[]> {
        if (entities.length === 0) return [];
        const table = entities[0].constructor as new () => J;
        return app.database.dataSource.getRepository(table).save(entities);
    }

    /**
     * Create and save entity in one operation.
     *
     * @param data Partial entity data. All fields are optional and nested objects are recursively optional.
     *   DeepPartial allows you to provide only the fields you need (e.g., just discordId for a User),
     *   while auto-generated fields (like id) and relations can be omitted.
     * @returns A new entity instance ready to be saved
     */
    protected async createAndSave(data: DeepPartial<T>): Promise<T> {
        const entity = this.create(data);
        return this.save(entity);
    }

    /**
     * Delete an entity from the database.
     *
     * @param entity The entity you want to delete from the Database.
     * @returns A promise resolving to a void on successful removal.
     */
    protected async delete(entity: T): Promise<void> {
        await this.repo.remove(entity);
    }

    /**
     * Delete by ID.
     *
     * @param id The id of the element you want to remove in the Database.
     * @returns A promise resolving to a void on successful removal.
     */
    protected async deleteById(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    /**
     * Count entities matching the criteria.
     * @param where Criteria to find results by.
     * @returns A promise resolving to the number of matches.
     */
    protected async count(where?: FindOptionsWhere<T>): Promise<number> {
        return where ? this.repo.countBy(where) : this.repo.count();
    }
}
