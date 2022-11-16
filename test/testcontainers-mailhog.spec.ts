import { describe, test, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { MailhogContainer, StartedMailhogContainer } from '../src/testcontainers-mailhog'
import { NodemailerResponse, Message } from '../src/types'
import nodemailer from 'nodemailer'

describe('Testcontainers-Mailhog test', () => {
  let mailhog: StartedMailhogContainer
  let transporter: nodemailer.Transporter

  const SMTP_PORT = 1025
  const API_PORT = 8025

  beforeAll(async () => {
    mailhog = await new MailhogContainer().withExposedPorts(SMTP_PORT).withExposedPorts(API_PORT).start()
    transporter = nodemailer.createTransport({
      host: 'localhost',
      port: mailhog.getMappedPort(SMTP_PORT),
      secure: false
    })
  })

  afterAll(async () => {
    await mailhog.stop()
  })

  afterEach(async () => {
    await mailhog.deleteAllMessages()
  })

  it('should return empty array, when call .getAllMessages() at the beginning', async () => {
    const messages = await mailhog.getAllMessages()
    expect(messages).toHaveLength(0)
  })

  test('Given sending a mail, When call .getAllMessages(), Then it should return one message', async () => {
    await transporter.sendMail({
      from: 'sender001@example.com',
      to: 'receiver001@example.com',
      subject: 'subject001',
      html: '<h1>Hello World</h1>'
    })

    const messages = await mailhog.getAllMessages()

    expect(messages).toHaveLength(1)
  })

  test('Given a mail, When call .deleteAllMessages(), Then it will have no message', async () => {
    await transporter.sendMail({
      from: 'sender001@example.com',
      to: 'receiver001@example.com',
      subject: 'subject001',
      html: '<h1>Hello World</h1>'
    })

    await mailhog.deleteAllMessages()

    const messages = await mailhog.getAllMessages()
    expect(messages).toHaveLength(0)
  })

  test('.getMessage method', async () => {
    const sendResponse: NodemailerResponse = await transporter.sendMail({
      from: 'sender001@example.com',
      to: 'receiver001@example.com',
      subject: 'subject001',
      html: '<h1>Hello World</h1>'
    })
    const messageId = sendResponse.response.split('as ')[1]

    const message: Message = await mailhog.getMessage(messageId)

    expect(message.ID).toBe(messageId)
    expect(message.Content.Body).toBe('<h1>Hello World</h1>')
  })
})
