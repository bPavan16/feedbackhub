'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  // Parse suggested messages
  const suggestedMessages = completion ? parseStringMessages(completion) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Card className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-800 to-slate-900 p-6 text-white text-center">
          <div className="mx-auto mb-2">
            <MessageSquare className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Send a Feedback message to @{username}
          </h1>
          <p className="text-blue-100 mt-2">
            Your Feedback will be completely anonymous
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-700 font-medium">
                      Send Feedback Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here..."
                        className="resize-none min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
          
              
              {/* Send button */}
              <div className="flex justify-center pt-2">
                {isLoading ? (
                  <Button disabled className="px-6 py-2 w-full sm:w-auto">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending message...
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !messageContent}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto"
                  >
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                )}
              </div>
            </form>
          </Form>

          {/* Create your own */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center gap-2">
                <p className="text-gray-800 font-medium">Want your own Feedback message board?</p>
                <p className="text-sm text-gray-600">Create your free account in seconds</p>
              </div>
              <Link href={'/sign-up'} className="inline-block">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Send and receive anonymous messages with Feedbacker</p>
      </div>
    </div>
  );
}