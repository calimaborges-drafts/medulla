import Docker, { Service } from "dockerode";
import { GeneralConfig } from "./config-file-reader";
import { logger } from "./logger";

function fullImageName(image: string) {
  let [imageName, tag] = image.split(":");
  return `${imageName}:${tag || "latest"}`;
}

async function sleep(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class DockerController {
  docker: Docker;
  constructor(config: GeneralConfig) {
    this.docker = new Docker(config);
  }

  // async imageExists(fin: string): Promise<boolean> {
  //   const image = this.docker.getImage(fin);
  //   try {
  //     await image.inspect();
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // async __pullPromise(fin: string): Promise<any> {
  //   if (await this.imageExists(fin)) return null;

  //   logger.info(`Pulling ${fin}...`);
  //   const stream = await this.docker.pull(fin, {});
  //   return new Promise((resolve, reject) => {
  //     stream.on("end", () => {
  //       logger.info(`Done pulling ${fin}...`);
  //       resolve(stream);
  //     });
  //     stream.on("data", () => {});
  //     stream.on("error", reject);
  //   });
  // }

  // async pull(imageName: string): Promise<any> {
  //   const fin = fullImageName(imageName);

  //   while (this.pulling.get(fin)) await sleep(1000);

  //   try {
  //     this.pulling.set(fin, true);
  //     await this.__pullPromise(fin);
  //   } finally {
  //     this.pulling.delete(fin);
  //   }
  // }

  async run(image: string): Promise<Service> {
    // await this.pull(image);
    let response = await this.fetch("/services/create", {
      method: "POST",
      body: JSON.stringify({
        TaskTemplate: {
          ContainerSpec: {
            Image: image
          },
          RestartPolicy: {
            MaxAttempts: 1,
            Condition: "none"
          }
        }
      })
    });

    const service = await response.json();
    logger.info(`Created service ${service.ID}`);

    response = await this.fetch(
      `services/${
        service.ID
      }/logs?details=true&stdin=true&stdout=true&follow=true`
    );
    response.body.pipe(process.stdout);
    return service;

    // return this.docker.run("ubuntu", [], process.stdout, {}, function(
    //   error: any,
    //   data: any,
    //   container: any
    // ) {
    //   console.log(data);
    //   // console.log(error);
    //   // console.log(container);
    // });
  }
}
