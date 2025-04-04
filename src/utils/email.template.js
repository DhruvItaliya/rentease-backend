// Email template generator functions
const getWelcomeEmail = (name) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(to right, #059669, #0d9488);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h1 {
      color: #1f2937;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    p {
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(to right, #059669, #0d9488);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
    }

    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">RentEase</span>
    </div>
    <h1>Welcome to RentEase, ${name}! 👋</h1>
    <p>We're excited to have you join our community of people who believe in the sharing economy and sustainable living.</p>
    <p>With RentEase, you can:</p>
    <ul>
      <li>Rent items from trusted community members</li>
      <li>List your own items to earn extra income</li>
      <li>Save money while reducing environmental impact</li>
      <li>Connect with like-minded people in your area</li>
    </ul>
    <p>Ready to get started?</p>
    <a href="[YOUR_WEBSITE_URL]" class="button">Start Browsing</a>
    <p>If you have any questions, our support team is always here to help!</p>
    <div class="footer">
      <p>© 2024 RentEase. All rights reserved.</p>
      <p>You're receiving this email because you signed up for RentEase.</p>
    </div>
  </div>
</body>
</html>`;

const getRentalConfirmationEmail = (rental) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(to right, #059669, #0d9488);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h1 {
      color: #1f2937;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .rental-details {
      background-color: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .rental-details h2 {
      color: #1f2937;
      font-size: 1.25rem;
      margin-bottom: 15px;
    }

    .rental-details p {
      margin: 10px 0;
      color: #4b5563;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(to right, #059669, #0d9488);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
    }

    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">RentEase</span>
    </div>
    <h1>Your Rental is Confirmed! 🎉</h1>
    <p>Great news! Your rental request has been approved.</p>
    
    <div class="rental-details">
      <h2>Rental Details</h2>
      <p><strong>Item:</strong> ${rental.product.title}</p>
      <p><strong>Duration:</strong> ${rental.dateRange.startDate} to ${rental.dateRange.endDate}</p>
      <p><strong>Total Amount:</strong> ₹${rental.total}</p>
      <p><strong>Pickup Location:</strong> ${rental.product.address.street}, ${rental.product.address.city}</p>
    </div>

    <div class="rental-details">
      <h2>Owner Contact Information</h2>
      <p><strong>Name:</strong> ${rental.owner.name.fname} ${rental.owner.name.lname}</p>
      <p><strong>Phone:</strong> ${rental.owner.mobile}</p>
      <p><strong>Email:</strong> ${rental.owner.email}</p>
    </div>

    <p>Remember to:</p>
    <ul>
      <li>Check the item thoroughly at pickup</li>
      <li>Keep all rental documents safe</li>
      <li>Return the item in the same condition</li>
      <li>Contact the owner if you have any questions</li>
    </ul>

    <a href="[YOUR_WEBSITE_URL]/rentals" class="button">View Rental Details</a>

    <div class="footer">
      <p>© 2024 RentEase. All rights reserved.</p>
      <p>Need help? Contact our support team.</p>
    </div>
  </div>
</body>
</html>`;

const getReturnReminderEmail = (rental) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(to right, #059669, #0d9488);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h1 {
      color: #1f2937;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .reminder-box {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(to right, #059669, #0d9488);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
    }

    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">RentEase</span>
    </div>
    <h1>Return Reminder ⏰</h1>
    <p>Hi ${rental.renter.name},</p>
    
    <div class="reminder-box">
      <p>This is a friendly reminder that your rental period for <strong>${rental.product.title}</strong> is ending soon.</p>
      <p><strong>Return Due Date:</strong> ${rental.dateRange.endDate}</p>
    </div>

    <p>Please ensure to:</p>
    <ul>
      <li>Check the item's condition before return</li>
      <li>Clean the item if necessary</li>
      <li>Contact the owner to arrange the return</li>
      <li>Keep all return documentation</li>
    </ul>

    <a href="[YOUR_WEBSITE_URL]/rentals" class="button">View Rental Details</a>

    <p>Need to extend your rental period? Contact the owner directly or through our platform.</p>

    <div class="footer">
      <p>© 2024 RentEase. All rights reserved.</p>
      <p>Questions? Contact our support team.</p>
    </div>
  </div>
</body>
</html>`;

const getReviewRequestEmail = (rental) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(to right, #059669, #0d9488);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h1 {
      color: #1f2937;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .review-box {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }

    .stars {
      color: #fbbf24;
      font-size: 24px;
      margin: 10px 0;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(to right, #059669, #0d9488);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
    }

    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">RentEase</span>
    </div>
    <h1>How was your rental experience? ⭐</h1>
    <p>Hi ${rental.renter.name},</p>
    
    <p>We hope you enjoyed using ${rental.product.title}! Your feedback helps our community make better rental decisions.</p>

    <div class="review-box">
      <p>Share your experience with:</p>
      <div class="stars">★★★★★</div>
      <p>Your review helps others in the community make informed decisions!</p>
    </div>

    <p>Take a moment to:</p>
    <ul>
      <li>Rate your rental experience</li>
      <li>Share helpful details about the item</li>
      <li>Provide feedback about the owner</li>
      <li>Upload photos (optional)</li>
    </ul>

    <a href="[YOUR_WEBSITE_URL]/rentals/review/${rental._id}" class="button">Write a Review</a>

    <div class="footer">
      <p>© 2024 RentEase. All rights reserved.</p>
      <p>This email was sent because you recently completed a rental on RentEase.</p>
    </div>
  </div>
</body>
</html>`;

export {
  getWelcomeEmail,
  getRentalConfirmationEmail,
  getReturnReminderEmail,
  getReviewRequestEmail
};