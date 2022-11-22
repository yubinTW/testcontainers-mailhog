import nodemailer from 'nodemailer'
import { afterAll, afterEach, beforeAll, describe, expect, it, test } from 'vitest'

import { MailhogContainer, StartedMailhogContainer } from '../src/testcontainers-mailhog'
import { Message, NodemailerResponse } from '../src/types'

describe('Testcontainers-Mailhog test', () => {
  let mailhogContainer: StartedMailhogContainer
  let transporter: nodemailer.Transporter

  beforeAll(async () => {
    mailhogContainer = await new MailhogContainer().start()
    transporter = nodemailer.createTransport({
      host: mailhogContainer.getHost(),
      port: mailhogContainer.getMappedSmtpPort(),
      secure: false
    })
  })

  afterAll(async () => {
    await mailhogContainer.stop()
  })

  afterEach(async () => {
    await mailhogContainer.deleteAllMessages()
  })

  it('should return empty array, when call .getAllMessages() at the beginning', async () => {
    const messages = await mailhogContainer.getAllMessages()
    expect(messages).toHaveLength(0)
  })

  test('Given sending a mail, When call .getAllMessages(), Then it should return one message', async () => {
    await transporter.sendMail({
      from: 'sender001@example.com',
      to: 'receiver001@example.com',
      subject: 'subject001',
      html: '<h1>Hello World</h1>'
    })

    const messages = await mailhogContainer.getAllMessages()

    expect(messages).toHaveLength(1)
  })

  test('Given a mail, When call .deleteAllMessages(), Then it will have no message', async () => {
    await transporter.sendMail({
      from: 'sender001@example.com',
      to: 'receiver001@example.com',
      subject: 'subject001',
      html: '<h1>Hello World</h1>'
    })

    await mailhogContainer.deleteAllMessages()

    const messages = await mailhogContainer.getAllMessages()
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

    const message: Message = await mailhogContainer.getMessage(messageId)

    expect(message.ID).toBe(messageId)
    expect(message.Content.Body).toBe('<h1>Hello World</h1>')
  })
})
