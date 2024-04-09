const headerTemplate = (title: string, name = "") => {
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: helvetica, Arial, sans-serif;
            line-height: 1.6;
            font-size: max(16px, 1rem);
            color: #333;
            margin: 0;
          }
          h2 {
            margin: 0;
            font-size: max(24px, 1.5rem);
          }
          p {
            margin-top: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px 0;
            background-color: #fff;
          }
          .content, .company-name {
            padding: 0 30px;
          }
          .company-name {
            color: #2980B9;
            padding-bottom: 20px;
            border-bottom: 2px solid #eeeeee;
            text-align: center;
          }
          .content {
            padding-top: 20px;
          }
          .verification-code {
            text-align: center;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: max(32px, 2rem);
            letter-spacing: 5px;
          }
          .instructions {
            margin-top: 30px;
          }
          .farewell {
            margin-top: 30px;
          }
          .parent-container {
            background-color: #eeeeee;
            align-items: center;
            padding: 32px 0;
          }
          .zero-margin-bottom p {
            margin-bottom: 0;
          }
          .hello {
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: max(0.75rem);
          }
          a {
            color: inherit;
          }
          .copy-left {
            display:inline-block;
            transform: rotate(180deg);
          }
        </style>
      </head>
      <body>
        <div class="parent-container">
          <div class="container">
            <div class="company-name">
                <h2>Dojologs</h2>
            </div>
            <div class="content">
              <p class="hello">Hello${name ? " " + name : ""},</p>
  `;
};

export default headerTemplate;
