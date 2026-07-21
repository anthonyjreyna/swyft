import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "xp498a56ng");`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('load', function() { var widgetElement = document.createElement('charla-widget'); widgetElement.setAttribute("p", "751ceb39-f8f9-4074-9cfb-629914adb5bb"); document.body.appendChild(widgetElement); var widgetCode = document.createElement('script'); widgetCode.src = 'https://app.charla.com/widget/widget.js'; document.body.appendChild(widgetCode); })`,
          }}
        />
      </body>
    </Html>
  );
}
