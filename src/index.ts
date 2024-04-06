import { ExpressServer as Server } from './infrastructure/webserver/server.js';
import bootstrap from "./infrastructure/config/bootstrap.js";
import environment from "./infrastructure/config/environment.js";

const start = async () => {

    try {
        await bootstrap.init();

        const port = environment.PORT || 3001;
        const server = new Server(port);
        // todo:
        //  setupStatus(server.app)
        //  setupDatabaseStatus(server.app, mongoose);
        server.run(() => {
            console.log("");
            console.log(" ██████╗ ███████╗ ██████╗ ██╗███████╗████████╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗");
            console.log(" ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║");
            console.log(" ██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   ██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║");
            console.log(" ██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║");
            console.log(" ██║  ██║███████╗╚██████╔╝██║███████║   ██║   ██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║");
            console.log(" ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝");

            console.log(`[ GIGGR :: REGISTRATION SERVICE ] Registration Service (Primary) is listening on http://localhost:${port}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();