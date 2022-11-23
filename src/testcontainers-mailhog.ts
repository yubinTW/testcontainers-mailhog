import axios from 'axios'
import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { AbstractStartedContainer } from 'testcontainers/dist/modules/abstract-started-container'
import { LogWaitStrategy } from 'testcontainers/dist/wait-strategy'

import { Message } from './types'

export class MailhogContainer extends GenericContainer {
  private waitingLog = 'Creating API v2 with WebPath:'
  private smtpPort = 1025
  private apiPort = 8025

  constructor(image = 'mailhog/mailhog:v1.0.1') {
    super(image)
  }

  public withWaitingLog(log: string) {
    this.waitingLog = log
  }

  public withSmtpPort(port: number) {
    this.smtpPort = port
    return this
  }

  public withApiPort(port: number) {
    this.apiPort = port
    return this
  }

  public getSmtpPort() {
    return this.smtpPort
  }

  public getApiPort() {
    return this.apiPort
  }

  public async start(): Promise<StartedMailhogContainer> {
    this.withWaitStrategy(new LogWaitStrategy(this.waitingLog))
      .withExposedPorts(this.smtpPort)
      .withExposedPorts(this.apiPort)
      .withEnvironment({
        MH_SMTP_BIND_ADDR: `0.0.0.0:${this.smtpPort}`,
        MH_API_BIND_ADDR: `0.0.0.0:${this.apiPort}`
      })
    return new StartedMailhogContainer(await super.start(), this.smtpPort, this.apiPort)
  }
}

export class StartedMailhogContainer extends AbstractStartedContainer {
  private mappedSmtpPort: number
  private mappedApiPort: number

  constructor(startedTestContainer: StartedTestContainer, smtpPort: number, apiPort: number) {
    super(startedTestContainer)
    this.mappedSmtpPort = this.getMappedPort(smtpPort)
    this.mappedApiPort = this.getMappedPort(apiPort)
  }

  public async getAllMessages(): Promise<Array<Message>> {
    return (await axios.get(`http://${this.getHost()}:${this.mappedApiPort}/api/v1/messages`)).data
  }

  public async getMessage(messageId: string) {
    return (await axios.get(`http://${this.getHost()}:${this.mappedApiPort}/api/v1/messages/${messageId}`)).data
  }

  public deleteAllMessages() {
    return axios.delete(`http://${this.getHost()}:${this.mappedApiPort}/api/v1/messages`)
  }

  public async deleteMessage(messageId: string) {
    return axios.delete(`http://${this.getHost()}:${this.mappedApiPort}/api/v1/messages/${messageId}`)
  }

  public getMappedSmtpPort() {
    return this.mappedSmtpPort
  }

  public getMappedApiPort() {
    return this.mappedApiPort
  }
}
