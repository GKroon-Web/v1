
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Handle form submissions
app.post('/submit-payment', (req, res) => {
    const { fullName, email, phone, service, notes } = req.body;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: 'New Payment Form Submission',
        html: `
            <h2>New Payment Form Submission</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Notes:</strong> ${notes}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: 'Error sending email' });
        } else {
            res.json({ message: 'Form submitted successfully' });
        }
    });
});

// Serve index.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
