type Message = {
  ID: string
  From: {
    Relays: unknown
    Mailbox: string
    Domain: string
    Params: string
  }
  To: [
    {
      Relays: unknown
      Mailbox: string
      Domain: string
      Params: string
    }
  ]
  Content: {
    Headers: {
      'Content-Transfer-Encoding': Array<string>
      'Content-Type': Array<string>
      Date: Array<string>
      From: Array<string>
      'MIME-Version': Array<string>
      'Message-ID': Array<string>
      Received: Array<string>
      'Return-Path': Array<string>
      Subject: Array<string>
      To: Array<string>
    }
    Body: string
    Size: number
    MIME: unknown
  }
  Created: string
  MIME: unknown
  Raw: {
    From: string
    To: Array<string>
    Data: string
    Helo: string
  }
}

type NodemailerResponse = {
  accepted: Array<string>
  rejected: Array<string>
  envelopeTime: number
  messageTime: number
  messageSize: number
  response: string
  envelope: { from: string; to: Array<string> }
  messageId: string
}
