var express = require('express');
var app = express();
var port = 5000;
const systemInformation = require('systeminformation');
var nodemailer = require('nodemailer');

// config the gmail account;
// enale IMAP in gamil settings;
// enable less secure apps : https://myaccount.google.com/lesssecureapps
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sasidharan@ndot.in',
    pass: 'balkeesh'
  }
});

app.use( (req,res,next) => {
	systemInformation.mem().then(data => {
		let totalMemoryInMegaByte = (data.total / 1024);
		let totalFreeMemoryInMegaByte = (data.free / 1024);
	
		if((totalMemoryInMegaByte - totalFreeMemoryInMegaByte) <= 500777777) {

			// mail send address like admin account;
			var mailOptions = {
			  from: 'sasidharan@ndot.in',
			  to: 'sasidharan@ndot.in',
			  subject: 'Emergency',
			  text: 'Emergency the server is over used please kindly check it and the free memory is : ' + (totalMemoryInMegaByte - totalFreeMemoryInMegaByte)+" MB"
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				}
			});

			res.json({ 
				status : 0, 
				message : "Server is busy please try again later...",
				data : []
			});

		} else {
			next();
		}
	}).catch(error => {
		console.error(error);
		next();
	});
})

app.get('/', (req,res) => {
	res.send("Hi... Sasi Your Request Successfully Received");
})

app.listen(port , () => {
	console.log("Server is listening...");
})