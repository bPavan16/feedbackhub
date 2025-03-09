'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Clipboard, Loader2, RefreshCcw, MessageSquare, Bell } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm mb-6 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Your Dashboard</h1>
        <p className="text-gray-600">View and manage your feedback messages</p>
      </div>
      
      {/* Profile Link Section */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Clipboard className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Share Your Profile</h2>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Share this unique link to start receiving anonymous feedback:
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full px-4 py-2.5 rounded-md bg-gray-50 text-gray-700 border border-gray-200"
          />
          <Button 
            onClick={copyToClipboard} 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            Copy Link
          </Button>
        </div>
      </div>
      
      {/* Message Settings Section */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Message Settings</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Control whether people can send you new messages
        </p>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">Accept Messages</p>
            <p className="text-sm text-gray-600">
              {acceptMessages 
                ? "Currently accepting new messages" 
                : "New messages are turned off"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSwitchLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>
      
      {/* Messages Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Your Messages</h2>
          </div>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                <span>Refresh</span>
              </>
            )}
          </Button>
        </div>
        <Separator className="mb-4" />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="transition-all duration-200 hover:shadow-md">
                    <MessageCard
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="font-medium text-gray-700 mb-1">No messages yet</p>
                <p className="text-sm text-gray-500">
                  Share your profile link to start receiving feedback
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;