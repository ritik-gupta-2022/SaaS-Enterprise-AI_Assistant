import { AppointmentScheduler } from "../components/shared/AppointmentScheduler"

export default function Appointment() {
  return (
    <main className="container mx-auto py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#c0bbe5]">Appointment Booking</h1>
      <AppointmentScheduler />
    </main>
  )
}

