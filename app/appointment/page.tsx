"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  checkAppointmentEligibility,
  createAppointment,
  getUserSubscriptions
} from "@/lib/api-client";

interface EligibilityResponse {
  eligible: boolean;
  reason?: string;
  daysRemaining?: number;
  remainingSessions?: number;
}

const AppointmentPage = () => {
  const router = useRouter();
  const [specialty, setSpecialty] = useState<"DERMATOLOGIST" | "CONSULTANT">("CONSULTANT");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(
    null
  );
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkEligibilityAndGetSubscription = async () => {
      try {
        setLoading(true);
        // 1. Check eligibility
        const eligibilityData = await checkAppointmentEligibility();
        setEligibility(eligibilityData);

        if (eligibilityData.eligible) {
          // 2. Fetch subscriptions to get the active one
          const subscriptions = await getUserSubscriptions();
          // Find the active subscription (assuming the backend returns them in a way we can identify the active one)
          // Usually it's the latest one or one with status 'ACTIVE'
          const activeSub = subscriptions.find((sub: any) => sub.status === 'ACTIVE') || subscriptions[0];
          if (activeSub) {
            setSubscriptionId(activeSub.id);
          }
        }
      } catch (error: any) {
        toast.error("Failed to check eligibility", {
          description: error.response?.data?.message || error.message,
        });
        setEligibility({ eligible: false, reason: "Error checking eligibility" });
      } finally {
        setLoading(false);
      }
    };
    checkEligibilityAndGetSubscription();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) {
      toast.error("Please select a date and time for the appointment.");
      return;
    }

    setLoading(true);
    try {
      /**
       * 🚀 THE NEURAL HANDSHAKE
       * Constructing appointment with verified status & subscription link.
       */
      await createAppointment({
        subscriptionId: subscriptionId || undefined,
        specialty,
        scheduledAt: scheduledAt.toISOString(),
        notes,
      });
      toast.success("Appointment booked successfully!", {
        description: "Our specialists have been notified."
      });
      setIsSuccess(true);
    } catch (error: any) {
      toast.error("Failed to book appointment", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[450px] text-center p-6">
          <CardHeader>
            <div className="mx-auto bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Appointment Booked!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your appointment has been successfully scheduled. Our specialists have been notified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading && !eligibility) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking eligibility...</p>
      </div>
    );
  }

  if (eligibility && !eligibility.eligible) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
        <div className="pl-5">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-[#4DB6AC] text-sm font-bold hover:opacity-70 transition-opacity"
          >
            <ChevronLeft size={18} />
            <span className="uppercase tracking-widest text-xs">Dashboard</span>
          </button>
         </div>
          <CardHeader>
            <CardTitle>Appointment Booking</CardTitle>
            <CardDescription>
              You are not eligible to book an appointment at this time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{eligibility.reason}</p>
            {eligibility.daysRemaining !== undefined && (
              <p>Days remaining on subscription: {eligibility.daysRemaining}</p>
            )}
            {eligibility.remainingSessions !== undefined && (
              <p>Remaining sessions: {eligibility.remainingSessions}</p>
            )}
            <Button onClick={() => router.push("/plans")} className="mt-4">
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back to Dashboard Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[#4DB6AC] text-sm font-bold hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={18} />
          <span className="uppercase tracking-widest text-xs">Dashboard</span>
        </button>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Schedule a session with a specialist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select
                value={specialty}
                onValueChange={(value: "DERMATOLOGIST" | "CONSULTANT") =>
                  setSpecialty(value)
                }
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONSULTANT">Consultant</SelectItem>
                  <SelectItem value="DERMATOLOGIST">Dermatologist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledAt ? (
                      format(scheduledAt, "PPP HH:mm")
                    ) : (
                      <span>Pick a date and time</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledAt}
                    onSelect={setScheduledAt}
                    autoFocus
                  />
                  <div className="p-3 border-t border-border">
                    <Input
                      type="time"
                      value={scheduledAt ? format(scheduledAt, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":");
                        if (scheduledAt) {
                          const newDate = new Date(scheduledAt);
                          newDate.setHours(parseInt(hours));
                          newDate.setMinutes(parseInt(minutes));
                          setScheduledAt(newDate);
                        } else {
                          const newDate = new Date();
                          newDate.setHours(parseInt(hours));
                          newDate.setMinutes(parseInt(minutes));
                          setScheduledAt(newDate);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific concerns or questions for the specialist?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default AppointmentPage;



