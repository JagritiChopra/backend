import nodemailer from "nodemailer";

export const sendAdminEmail = async (appointment) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Pet Clinic" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Appointment Booked",
    html: `
      <h2>New Appointment</h2>
      <p><strong>Patient:</strong> ${appointment.patient}</p>
      <p><strong>Service:</strong> ${appointment.service}</p>
      <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
    `,
  });
};