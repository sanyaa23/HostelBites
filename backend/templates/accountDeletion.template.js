const accountDeletionTemplate = (email) => {
    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Account Deletion Confirmation</title>
  
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
      <div
        style="
          max-width: 680px;
          margin: 0 auto;
          padding: 45px 30px 60px;
          background: #f4f7ff;
          font-size: 14px;
          color: #434343;
        "
      >
        <main>
          <div
            style="
              margin: 0;
              margin-top: 70px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                Account Deletion Confirmation
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hey,
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                We're sorry to see you go! Your account associated with ${email} has been successfully deleted from HostelBites.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                If this was a mistake or you have any concerns, please contact us as soon as possible. We'd be happy to assist you in restoring your account.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                Thank you for being a part of the HostelBites community. We hope to see you again in the future!
              </p>
            </div>
          </div>
  
          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 90px;
              text-align: center;
              font-weight: 500;
              color: #8c8c8c;
            "
          >
            Need help? Contact us at
            <a
              href="mailto:hostelbites@gmail.com"
              style="color: #499fb6; text-decoration: none;"
              >hostelbites@gmail.com</a
            >
            or visit our
            <a
              href=""
              target="_blank"
              style="color: #499fb6; text-decoration: none;"
              >Help Center</a
            >.
          </p>
        </main>
  
        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
            "
          >
            HostelBites
          </p>
          <div style="margin: 0; margin-top: 16px;">
            <a href="" target="_blank" style="display: inline-block;">
              <img
                width="36px"
                alt="Facebook"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Instagram"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
            /></a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Twitter"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Youtube"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
            /></a>
          </div>
          <p style="margin: 0; margin-top: 16px; color: #434343;">
            Copyright © 2022 HostelBites. All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>`;
};

export { accountDeletionTemplate };
