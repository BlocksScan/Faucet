var nodemailer = require('nodemailer');

function sendMail(address, userAmount,twitter){

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'mitaliblocksscan08@gmail.com',
    pass: 'gbgrjvdbagyitptx'
    },
    tls: {
          rejectUnauthorized: false
      }
  });
  
  var mailOptions = {
    from: 'mitaliblocksscan08@gmail.com' ,
    to: "mitalilakhere@gmail.com",
    subject: 'user Requested for more than 1000 XDC',
    text: `hey see this \n address: ${address} \n amount requested for: ${userAmount} \n  twiter link: ${twitter} `
  };		  

transporter.sendMail(mailOptions, function(error , info){
     if (error) {
      console.log(error);
    } else {
      console.log('Email sent');
    }
});
}

module.exports= {sendMail}

