import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export interface Email {
  from: string
  subject: string
  date: string
  snippet: string
}

export async function fetchUnread(limit = 10): Promise<Email[]> {
  const Imap = require('imap')
  const { simpleParser } = require('mailparser')

  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_APP_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    })

    const emails: Email[] = []

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err: Error, box: any) => {
        if (err) return reject(err)

        imap.search(['UNSEEN'], (err: Error, uids: number[]) => {
          if (err) return reject(err)
          if (!uids.length) {
            imap.end()
            return resolve([])
          }

          const recent = uids.slice(-limit)
          const fetch = imap.fetch(recent, { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'], struct: true })

          const pending: Promise<void>[] = []

          fetch.on('message', (msg: any) => {
            let headerBuf = ''
            let bodyBuf = ''

            msg.on('body', (stream: any, info: any) => {
              let buf = ''
              stream.on('data', (chunk: Buffer) => buf += chunk.toString())
              stream.once('end', () => {
                if (info.which.includes('HEADER')) headerBuf = buf
                else bodyBuf = buf
              })
            })

            pending.push(new Promise<void>(res => {
              msg.once('end', async () => {
                try {
                  const parsed = await simpleParser(headerBuf + '\r\n' + bodyBuf)
                  emails.push({
                    from: parsed.from?.text ?? '',
                    subject: parsed.subject ?? '(no subject)',
                    date: parsed.date?.toISOString().slice(0, 10) ?? '',
                    snippet: (parsed.text ?? '').slice(0, 200).replace(/\s+/g, ' ').trim(),
                  })
                } catch { /* skip unparseable */ }
                res()
              })
            }))
          })

          fetch.once('end', async () => {
            await Promise.all(pending)
            imap.end()
            resolve(emails)
          })

          fetch.once('error', reject)
        })
      })
    })

    imap.once('error', reject)
    imap.connect()
  })
}
