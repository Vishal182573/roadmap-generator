"use client"
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { useSession } from '@/lib/auth/AuthContext';
import { nanoid } from 'nanoid';

interface BookSessionProps {
  mentorId: string;
  mentorName: string;
}

export default function BookSession({ mentorId, mentorName }: BookSessionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const checkMentorAvailability = async (date: Date, time: string) => {
    try {
      const response = await fetch('/api/meet/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId,
          scheduledTime: new Date(date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))),
        }),
      });

      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Error checking mentor availability:', error);
      return false;
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !topic) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check mentor availability
      const isAvailable = await checkMentorAvailability(selectedDate, selectedTime);
      
      if (!isAvailable) {
        toast({
          title: 'Error',
          description: 'Mentor is not available at selected time',
          variant: 'destructive',
        });
        return;
      }

      // Create meet
      const meetId = nanoid();
      const scheduledTime = new Date(selectedDate);
      scheduledTime.setHours(parseInt(selectedTime.split(':')[0]), parseInt(selectedTime.split(':')[1]));

      const response = await fetch('/api/meet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetId,
          mentorId,
          studentId: session?.user?.id,
          scheduledTime,
          duration: 60, // 1 hour sessions
          topic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Session booked successfully!',
        });
        setIsOpen(false);
      } else {
        throw new Error(data.message || 'Failed to book session');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to book session',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      slots.push(`${formattedHour}:00`);
      slots.push(`${formattedHour}:30`);
    }
    return slots;
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Book Session
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book a Session with {mentorName}</DialogTitle>
            <DialogDescription>
              Select a date and time for your mentorship session.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => 
                  date < new Date() || // Can't select past dates
                  date.getDay() === 0 || // No Sundays
                  date.getDay() === 6    // No Saturdays
                }
                className="rounded-md border"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <select
                id="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Select a time</option>
                {generateTimeSlots().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="What would you like to discuss?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleBooking}
              disabled={isLoading || !selectedDate || !selectedTime || !topic}
            >
              {isLoading ? 'Booking...' : 'Book Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 