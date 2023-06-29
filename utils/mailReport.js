import nodemailer from 'nodemailer';

const mailReport = async (url, receiver, projectName, mailReport) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'anubhavvs@outlook.com',
    to: receiver,
    subject: 'Your report is ready! 👀',
    html: `<h1>This is your PV Solar Output Report for <u>${projectName}</u>.</h1><img src=${url} />`,
    attachments: [
      {
        filename: 'data.json',
        content: new Buffer(JSON.stringify(mailReport)),
      },
    ],
  });

  console.log('Message sent: %s', info.messageId);
};

export default mailReport;
