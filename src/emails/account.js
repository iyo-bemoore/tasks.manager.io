const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SND_GRD_API);
const msg = {
  to: "test",
  from: "test",
  subject: "test",
  text: "test"
};
sgMail.send(msg);
