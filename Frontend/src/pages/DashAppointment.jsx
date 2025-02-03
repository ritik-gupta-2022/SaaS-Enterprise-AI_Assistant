import { useEffect, useState } from "react"
import { CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { FRONTEND_URL } from "../constant"

// Remove or comment out the hardcoded appointments array
// const appointments = [ ... ]

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${FRONTEND_URL}/api/appointment/appointments`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                // Process appointments to add status based on date
                const processedAppointments = data.map(apt => {
                    const aptDate = new Date(apt.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    let status;
                    if (aptDate.toDateString() === today.toDateString()) {
                        status = 'today';
                    } else if (aptDate < today) {
                        status = 'expired';
                    } else {
                        status = 'upcoming';
                    }

                    return {
                        ...apt,
                        id: apt._id,
                        title: `Appointment with ${apt.email}`,
                        date: aptDate.toLocaleDateString(),
                        time: apt.slot,
                        status
                    };
                });
                setAppointments(processedAppointments);
            }
        } catch (err) {
            console.log("Error fetching appointments:", err.message);
        }
    }
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    if (!appointment) return false;
    
    return appointment.status !== "today" &&
      (appointment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       appointment.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       appointment.time?.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const renderAppointment = (appointment) => (
    <Card key={appointment.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{appointment.title}</CardTitle>
        <Badge className={appointment.status === "expired" ? "bg-muted" : "bg-[#A5B4FC]"}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            {appointment.date}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {appointment.time}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-8 h-[calc(100vh-80px)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">View your scheduled appointments</p>
      </div>

      <div className="flex gap-8 h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-hidden">
          <div className="mb-4">
            <Input
              placeholder="Search upcoming and expired appointments..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="upcoming" className="space-y-4 h-full">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto pr-4">
              {filteredAppointments.filter((appointment) => appointment.status === "upcoming").map(renderAppointment)}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto pr-4">
              {filteredAppointments.filter((appointment) => appointment.status === "expired").map(renderAppointment)}
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/3 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
          <div className="h-[calc(100vh-250px)] overflow-y-auto pr-4">
            {appointments.filter((appointment) => appointment.status === "today").map(renderAppointment)}
          </div>
        </div>
      </div>
    </div>
  )
}

