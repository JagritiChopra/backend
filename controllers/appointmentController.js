import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Service from "../models/Service.js";
import { sendAdminEmail } from "../utils/sendEmail.js";


export const createAppointment = async (req, res) => {
  try {
    const { patient, service, appointmentDate } = req.body;

    // Check patient
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check service
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    //  CHECK FOR TIME CLASH
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked. Please choose another time.",
      });
    }

    //  Create if no clash
    const appointment = await Appointment.create({
      patient,
      service,
      appointmentDate,
    });
    await sendAdminEmail(appointment);
    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// 📄 GET ALL APPOINTMENTS
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient")
      .populate("service")
      .sort({ appointmentDate: 1 });

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// 🔍 GET SINGLE APPOINTMENT
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient")
      .populate("service");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// ✏ UPDATE APPOINTMENT
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("patient")
      .populate("service");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// ❌ DELETE APPOINTMENT
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};