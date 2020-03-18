const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SND_GRD_API);

const sendWelcomeMessage = (email, name) => {
  const msg = {
    to: email,
    from: "info@bemoore.com",
    subject: `Hello ${name} `,
    text:
      "Thank you for joining our platform, please let us know in case you have any requests!"
  };
  sgMail.send(msg);
};

const sendSubscriptionCancelationMessage = (email, name) => {
  const msg = {
    to: email,
    from: "no-reply@accounts-bemoore.com",
    subject: `Goodby ${name}`,
    text:
      "It is sad to see you go, you are always welcome if you want to come back"
  };
  sgMail.send(msg);
};

module.exports = {
  sendWelcomeMessage,
  sendSubscriptionCancelationMessage
};
