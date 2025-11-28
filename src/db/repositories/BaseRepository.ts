import {
    Repository,
    FindOptionsWhere,
    DeepPartial,
    ObjectLiteral,
    JoinTable,
    FindOptionsSelect,
} from 'typeorm';
import { AppDataSource } from '../dataSource';
import { JoinTables } from '../../utils/db/JoinTables';
import { ValidEntity } from '../types/entities';
import { ErrorProne } from '../../utils/parentClasses/ErrorProne';

/**
 * Base repository providing common CRUD operations for all entities.
 * Extend this class to create entity-specific repositories.
 *
 * @template T - The entity type this repository manages
 */
export abstract class BaseRepository<T extends ValidEntity> extends ErrorProne {
    protected repo: Repository<T>;

    constructor(private entityClass: new () => T) {
        super();
        this.repo = AppDataSource.getRepository(this.entityClass);
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
     * @returns An array of Entities that match the criteria.
     */
    protected async findAll(where?: FindOptionsWhere<T>): Promise<T[]> {
        return where ? this.repo.findBy(where) : this.repo.find();
    }

    /**
     * Find a single entity matching the given criteria.
     *
     * @param where (optional) Criteria to restrict results by.
     * @returns An array of Entities that match the criteria, or null if none/multiple were found.
     */
    protected async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
        return this.repo.findOneBy(where);
    }

    /**
     * Find a junction table record by providing entity instances.
     * Automatically infers the junction table and builds the WHERE clause.
     *
     * @param joinTable - The junction table entity class
     * @param thisEntity - Instance of this entity (e.g., a User)
     * @param otherEntity - Instance of the other entity (e.g., a Host)
     * @returns The junction table record, or null if not found
     *
     * @example
     * // In UserRepository:
     * const userHost = await this.findByJoin(UserHostTable, user, host);
     */
    protected async findByJoin<J extends ValidEntity, O extends ValidEntity>(
        joinTable: new () => J,
        thisEntity: T,
        otherEntity: O,
    ): Promise<J | null> {
        const connectedTables = JoinTables.getConnectedTables(joinTable);
        if (this.isError(connectedTables)) {
            return this.propagateError(connectedTables, 'Find by join failed.') as any;
        }

        const otherTable = otherEntity.constructor as new () => O;

        // Figure out which field names to use based on connected tables
        const thisFieldName = this.getEntityIdField(this.entityClass.name);
        const otherFieldName = this.getEntityIdField(otherTable.name);

        const where = {
            [thisFieldName]: thisEntity.id,
            [otherFieldName]: otherEntity.id,
        } as FindOptionsWhere<J>;

        return AppDataSource.getRepository(joinTable).findOne({ where });
    }

    /**
     * Find all junction table records related to this entity.
     * Automatically adds the foreign key constraint for this entity.
     *
     * @param joinTable - The junction table entity class
     * @param thisEntity - Instance of this entity (e.g., a User)
     * @param where - Optional additional WHERE conditions
     * @returns Array of junction table records
     *
     * @example
     * // In UserRepository - find all UserHost records for a user:
     * const userHosts = await this.findAllJoins(UserHostTable, user);
     * // With filter:
     * const adminHosts = await this.findAllJoins(UserHostTable, user, { permLevel: PermLevel.ADMIN });
     */
    protected async findAllJoins<J extends ValidEntity>(
        joinTable: new () => J,
        thisEntity: T,
        where?: Partial<FindOptionsWhere<J>>,
    ): Promise<J[]> {
        const connectedTables = JoinTables.getConnectedTables(joinTable);
        if (this.isError(connectedTables)) {
            return this.propagateError(connectedTables, 'Find all joins failed.') as any;
        }

        const thisFieldName = this.getEntityIdField(this.entityClass.name);

        const fullWhere = {
            [thisFieldName]: thisEntity.id,
            ...where,
        } as FindOptionsWhere<J>;

        return AppDataSource.getRepository(joinTable).find({ where: fullWhere });
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
     * Save an entity to the database (insert or update).
     *
     * @param entity The entity you want to save to the repo.
     * @returns A promise resolving to your entity, once it successfully saved.
     */
    protected async save(entity: T): Promise<T> {
        return this.repo.save(entity);
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
