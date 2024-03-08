import { FileSystemRouter, Transpiler } from "bun";
import {
    renderToReadableStream,
    renderToPipeableStream,
} from "react-dom/server";
import * as fs from "node:fs";

export default class Mule {
    port: number;
    router!: FileSystemRouter;
    transpiler!: Transpiler;

    constructor(path: string, port: number) {
        this.port = port;
        this.router = new Bun.FileSystemRouter({
            style: "nextjs",
            dir: path,
            origin: `http://127.0.0.1:${this.port}`,
            assetPrefix: "_mule/static/",
        });
        this.transpiler = new Bun.Transpiler({
            loader: "tsx",
        });
    }

    getPort(): number {
        return this.port;
    }

    run(): void {
        var r = this.router;
        var t = this.transpiler;
        Bun.serve({
            async fetch(req: Request) {
                let href = new URL(req.url);
                let match = r.match(href.href);
                let ch = href.pathname.split("/");
                ch.shift();

                console.log(req);

                if (match != null) {
                    let response = new Response();
                    let res = fs.createWriteStream("temp");
                    let module = await import(match.filePath);

                    // const code = Bun.file(match.filePath);
                    // t.transformSync(await code.text());
                    let defaultFunc = module.default;

                    const stream = await renderToReadableStream(defaultFunc(), {
                        bootstrapModules: [
                            "/_mule/static/react_dom_dev.js",
                            "/_mule/static/react_dev.js",
                            "/_mule/static/main.js",
                        ],
                    });

                    return new Response(stream, {
                        headers: {
                            "Content-Type": "text/html",
                            "content-type": "text/html",
                        },
                    });
                } else if (ch[0] == "_mule" && ch[1] == "static") {
                    let s = Bun.file(
                        `/home/amnesia/Work/Mule/scripts/${ch[2]}`
                    );
                    let file = await s.text();

                    return new Response(file, {
                        headers: {
                            "Content-Type": "application/javascript",
                        },
                    });
                } else {
                    return new Response("<h1>Not Found 404</h1>", {
                        headers: { "Content-Type": "text/html" },
                    });
                }
            },
            port: this.port,
            development: true,
        });
    }
}
