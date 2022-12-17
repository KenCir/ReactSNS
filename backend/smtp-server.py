from aiosmtpd.controller import Controller
import sys
import quopri


class SMTPHandler:
    async def handle_DATA(self, server, session, envelope):
        print('Message from %s' % envelope.mail_from)
        print('Message to %s' % envelope.rcpt_tos)
        print('Message data:\n')
        for ln in envelope.content.decode('utf8', errors='replace').splitlines():
            ln = quopri.decodestring(ln)
            print(f'> {ln}'.strip())
        print()
        print('End of message')
        return '250 Message accepted for delivery'


if __name__ == '__main__':
    controller = Controller(handler=SMTPHandler(),
                            hostname='127.0.0.1', port=8025)
    controller.start()
    try:
        input('Press enter to Exit\n')
    except SyntaxError:
        controller.stop()
        sys.exit(0)
