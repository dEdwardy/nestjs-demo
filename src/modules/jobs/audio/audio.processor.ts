import { OnQueueActive, Processor,Process } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor('audio')
export class AudioProcessor {
    private readonly logger = new Logger(AudioProcessor.name);

    @OnQueueActive()
    onActive(job:Job){
        this.logger.debug(`Processing job ${job.id} of type ${ job.name} with data ${job.data} ...`)
    }

    @Process('transcode')
    handleTranscode(job:Job){
        this.logger.debug(`Transcoding Start`)
        this.logger.debug(job.data)
        this.logger.debug(`Transcoding Finish+`)
    }
}