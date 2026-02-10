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
import { Calendar as CalendarIcon } from "lucide-react";
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
  const [specialty, setSpecialty] = useState<"DERMATOLOGIST" | "CONSULTANT">(
    "DERMATOLOGIST"
  );
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(
    null
  );
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

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
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Failed to book appointment", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
                  <SelectItem value="DERMATOLOGIST">Dermatologist</SelectItem>
                  <SelectItem value="CONSULTANT">Consultant</SelectItem>
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
                    initialFocus
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
  );
};

export default AppointmentPage;
