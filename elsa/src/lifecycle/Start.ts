import { ConfigRegistry } from "../config/Configs";
import { CacheContainer } from "../core/containers/Cache";
import { ConsoleContainer } from "../core/containers/Consoles";
import { DatabaseContainer } from "../core/containers/Database";
import { DiscordContainer } from "../core/containers/Discord";
import { FormatterContainer } from "../core/containers/Formatter";
import { RepositoryContainer } from "../core/containers/Repository";
import { ServicesContainer } from "../core/containers/Services";
import { Dependencies } from "../core/Dependencies";
import { Logger } from "../core/logs/Logger";
import { TimerRegistry } from "../core/TimerRegistry";
import { CronScheduler } from "../cronjobs/logs";
import { Seeder } from "../db/seeding/Seeder";
import type { ConfigsResolver } from "../types/config/config";
import type {
    CacheContainerResolver,
    ConsoleContainerResolver,
    DatabaseContainerResolver,
    DiscordContainerResolver,
    FormatterContainerResolver,
    RepositoryContainerResolver,
    ServicesContainerResolver,
} from "../types/core/containers";
import type { LoggerResolver } from "../types/core/logs";
import type { TimerRegistryResolver } from "../types/time/timer";
import { isProductionEnvironment } from "../utils/node/environment";

export class Start {
    private readonly status = {
        core: false,
        cache: false,
        db: false,
        bot: false,
        seeded: false,
    };

    private readonly timers: TimerRegistryResolver = new TimerRegistry();

    private _dependencies?: Dependencies;

    constructor() {}

    initCore(): void {
        this.timers.startTimer("main");

        this.status.core = true;
        this.dependencies.logger.info("Core Ready");
    }

    async initCache(): Promise<void> {
        await this.dependencies.cache.client.init();

        this.status.cache = true;
        this.dependencies.logger.info("Cache Layer initialized");
    }

    async initDb(): Promise<void> {
        await this.dependencies.database.dataSource.initialize();

        this.status.db = true;
        this.dependencies.logger.info("Database initialized");
    }

    async initBot(): Promise<void> {
        this.dependencies.discord.bot.setupRouter(this.dependencies);
        this.dependencies.discord.bot.registerEventHandlers();
        await this.dependencies.discord.bot.login(this.dependencies.configs.env.DISCORD_TOKEN);
        this.dependencies.services.messageLinkService.setBot(this.dependencies.discord.bot);

        this.status.bot = true;
        this.dependencies.logger.info("Bot initialized");
    }

    async seed(): Promise<void> {
        if (isProductionEnvironment()) return;
        const seeder = new Seeder(this.dependencies);
        await seeder.seed();

        this.status.seeded = true;
    }

    setupCron(): void {
        const cronScheduler = new CronScheduler(this.dependencies);
        cronScheduler.setupAllTasks();
    }

    get dependencies(): Dependencies {
        if (this._dependencies !== undefined) return this._dependencies;

        const CONFIGS: ConfigsResolver = new ConfigRegistry();
        const CONSOLES_CONTAINER: ConsoleContainerResolver = new ConsoleContainer(CONFIGS);
        const LOGGER: LoggerResolver = new Logger(CONSOLES_CONTAINER);
        const CACHE_CONTAINER: CacheContainerResolver = new CacheContainer(CONFIGS, LOGGER);
        const FORMATTER_CONTAINER: FormatterContainerResolver = new FormatterContainer(CONFIGS);
        const DATABASE_CONTAINER: DatabaseContainerResolver = new DatabaseContainer(CONFIGS);
        const REPOSITORY_CONTAINER: RepositoryContainerResolver = new RepositoryContainer(DATABASE_CONTAINER);

        const SERVICES_CONTAINER: ServicesContainerResolver = new ServicesContainer(
            CACHE_CONTAINER,
            REPOSITORY_CONTAINER,
            FORMATTER_CONTAINER,
            CONFIGS,
        );

        const DISCORD_CONTAINER: DiscordContainerResolver = new DiscordContainer(SERVICES_CONTAINER, LOGGER);

        this._dependencies = new Dependencies({
            cache: CACHE_CONTAINER,
            configs: CONFIGS,
            consoles: CONSOLES_CONTAINER,
            database: DATABASE_CONTAINER,
            discord: DISCORD_CONTAINER,
            formatter: FORMATTER_CONTAINER,
            logger: LOGGER,
            repositories: REPOSITORY_CONTAINER,
            services: SERVICES_CONTAINER,
            timers: this.timers,
        });

        return this._dependencies;
    }
}
