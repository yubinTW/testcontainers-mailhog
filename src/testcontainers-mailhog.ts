import axios from 'axios'
import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { AbstractStartedContainer } from 'testcontainers/dist/modules/abstract-started-container'
import { LogWaitStrategy } from 'testcontainers/dist/wait-strategy'

import { Message } from './types'

export class MailhogContainer extends GenericContainer {
  private waitingLog = 'Creating API v2 with WebPath:'

  constructor(image = 'mailhog/mailhog:v1.0.1') {
    super(image)
  }

  public withWaitingLog(log: string) {
    this.waitingLog = log
  }

  public async start(): Promise<StartedMailhogContainer> {
    this.withWaitStrategy(new LogWaitStrategy(this.waitingLog))
    return new StartedMailhogContainer(await super.start())
  }
}

export class StartedMailhogContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer)
  }

  public async getAllMessages(): Promise<Array<Message>> {
    return (await axios.get(`http://${this.getHost()}:${this.getMappedPort(8025)}/api/v1/messages`)).data
  }

  public async getMessage(messageId: string) {
    return (await axios.get(`http://${this.getHost()}:${this.getMappedPort(8025)}/api/v1/messages/${messageId}`)).data
  }

  public deleteAllMessages() {
    return axios.delete(`http://${this.getHost()}:${this.getMappedPort(8025)}/api/v1/messages`)
  }
}
