import {Hono} from 'hono'
import {html} from 'hono/html'

import {genAu3Script} from './au3Script.ts';

const app = new Hono();
const { WS_URL } = Bun.env

app.get('/img/:num', c => {

    const {num} = c.req.param()
    if (!num) c.text('not a number', 400)
    if (isNaN(Number(num))) {
        console.log('not a number', num)
        c.text('not a number', 400)
    }

    const props = {
        num: Number(num)
    }
    return c.html(html`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
            <script src="https://cdn.jsdelivr.net/npm/w-websocket-client@1.0.29/dist/w-websocket-client.umd.js"></script>
        </head>
        <body>
            <div id="image" />
        </body>
        <script>
            let opt = {
                url: '${WS_URL}',
                token: '*',
                open: () => {
                    console.log('connected')
                },
                message: (msg) => {
                    const parsed = JSON.parse(msg)
                    // if (parsed.type === 'connected') return
                    console.log('received ws message: ', parsed)
                    if (parsed.data.modified === ${num}) {
                        console.log('time to refresh')
                        setTimeout(() => {
                            location.reload()
                        }, 5000)
                    }
                },
                close: () => {
                    console.log('disconnected reloading')
                    location.reload()
                }
            }
            
            const WSC = window['w-websocket-client'];
            let ws = new WSC(opt);
            setTimeout(() => {
                location.reload()
            }, 10 * 60 * 1000)
        </script>
        <style>
            * {
                overflow: hidden;
                padding: 0;
                margin: 0;
            }
            #image {
                background-image: url("https://bmw.2enter.art/api/img/${props.num}");
                background-size: cover;
                background-position: center;
                background-color: black;
                width: 100vw;
                height: 100vh;
            }
        </style>
    </html>
    `
    );
})

genAu3Script();

export default app;