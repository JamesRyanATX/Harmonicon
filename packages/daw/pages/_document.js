import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta property="twitter:title" content="Harmonicon" />
          <meta property="twitter:description" content="Experimental DAW for composing music as code." />
          <meta property="twitter:image" content="https://harmonicon.studio/screenshot.png" />
          <meta property="twitter:card" content="summary_large_image" />

          <meta property="og:title" content="Harmonicon" />
          <meta property="og:description" content="Experimental DAW for composing music as code." />
          <meta property="og:image" content="https://harmonicon.studio/screenshot.png" />
          <meta property="og:url" content="https://harmonicon.studio" />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.DAW_GOOGLE_ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.DAW_GOOGLE_ANALYTICS_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}