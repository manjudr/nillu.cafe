import { StrictMode } from 'react'
import { renderToReadableStream } from 'react-dom/server.edge'
import App from './App'

/** Render the real page, including lazy sections, without a browser or WebGL. */
export async function render(): Promise<string> {
  let renderError: unknown
  const stream = await renderToReadableStream(<StrictMode><App /></StrictMode>, {
    onError(error) { renderError = error },
  })
  await stream.allReady
  if (renderError) throw renderError
  return new Response(stream).text()
}
