import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'

import { MailhogContainer, StartedMailhogContainer } from '../src/testcontainers-mailhog'

describe('Mailing test', () => {
  let mailhog: StartedMailhogContainer

  beforeAll(async () => {
    mailhog = await new MailhogContainer().start()
  })

  afterAll(async () => {
    await mailhog.stop()
  })

  afterEach(async () => {
    await mailhog.deleteAllMessages()
  })

  test('get SMTP Url example', () => {
    const smtpUrl = `${mailhog.getHost()}:${mailhog.getMappedSmtpPort()}`
    expect(smtpUrl).toBeTruthy()
  })

  test('some case with mailing', async () => {
    const messages = await mailhog.getAllMessages()
    expect(messages).toHaveLength(0)
  })
})
